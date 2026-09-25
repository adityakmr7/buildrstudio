// SSRF-safe HTTP GET for fetching customer-supplied URLs (website crawling
// for the knowledge base). Server-only.
//
// Guards:
//   - http/https only, no embedded credentials, ports 80/443 only
//   - hostname must not be localhost / *.local / *.internal / an IP literal
//     in a private, loopback, link-local, CGNAT, multicast or reserved range
//   - the DNS answer is checked *at connect time* via a custom `lookup`, so a
//     hostname that resolves (or re-resolves, DNS rebinding) to a private
//     address is refused on the actual socket, not just on a pre-check
//   - redirects are followed manually (max 4) and every hop is re-checked
//   - per-request timeout and a response size cap
// Uses node:http/https rather than global fetch because fetch doesn't let us
// hook DNS resolution without adding undici as a dependency.

import http from "node:http";
import https from "node:https";
import dns from "node:dns";
import net from "node:net";
import zlib from "node:zlib";

const blockList = new net.BlockList();
for (const [addr, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.88.99.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
] as const) {
  blockList.addSubnet(addr, prefix, "ipv4");
}
for (const [addr, prefix] of [
  ["::", 128],
  ["::1", 128],
  ["64:ff9b::", 96], // NAT64 — can map to private v4
  ["100::", 64],
  ["2001:db8::", 32],
  ["fc00::", 7],
  ["fe80::", 10],
  ["ff00::", 8],
] as const) {
  blockList.addSubnet(addr, prefix, "ipv6");
}

/** IPv4-mapped IPv6 (::ffff:1.2.3.4 or ::ffff:0102:0304) → the IPv4 part. */
function mappedIpv4(ip: string): string | null {
  const m = ip.toLowerCase().match(/^(?:0*:)*:?ffff:(.+)$/);
  if (!m) return null;
  const rest = m[1];
  if (net.isIPv4(rest)) return rest;
  const hex = rest.match(/^([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (!hex) return null;
  const a = parseInt(hex[1], 16);
  const b = parseInt(hex[2], 16);
  return `${a >> 8}.${a & 255}.${b >> 8}.${b & 255}`;
}

export function isPrivateAddress(ip: string): boolean {
  if (net.isIPv4(ip)) return blockList.check(ip, "ipv4");
  if (net.isIPv6(ip)) {
    const v4 = mappedIpv4(ip);
    if (v4) return blockList.check(v4, "ipv4");
    return blockList.check(ip, "ipv6");
  }
  return true; // not an IP at all — refuse
}

export class UnsafeUrlError extends Error {}

/** Validates the URL's shape and hostname. DNS is checked at connect time. */
export function assertSafeUrl(raw: string | URL): URL {
  let url: URL;
  try {
    url = typeof raw === "string" ? new URL(raw) : new URL(raw.toString());
  } catch {
    throw new UnsafeUrlError("That doesn't look like a valid URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new UnsafeUrlError("Only http:// and https:// URLs are supported.");
  }
  if (url.username || url.password) {
    throw new UnsafeUrlError("URLs with a username or password aren't supported.");
  }
  if (url.port && url.port !== "80" && url.port !== "443") {
    throw new UnsafeUrlError("Only standard ports (80/443) are supported.");
  }
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "");
  if (
    !host ||
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host.endsWith(".home.arpa") ||
    (!host.includes(".") && !net.isIP(host))
  ) {
    throw new UnsafeUrlError("That address isn't publicly reachable.");
  }
  if (net.isIP(host) && isPrivateAddress(host)) {
    throw new UnsafeUrlError("That address isn't publicly reachable.");
  }
  return url;
}

// Connect-time DNS check. Refuses the connection if ANY resolved address is
// private (prevents "one public, one private A record" tricks).
const safeLookup: net.LookupFunction = (hostname, options, callback) => {
  dns.lookup(hostname, { all: true, family: options.family as number | undefined }, (err, addresses) => {
    if (err) return callback(err, "", 4);
    const list = addresses as dns.LookupAddress[];
    if (list.length === 0 || list.some((a) => isPrivateAddress(a.address))) {
      return callback(new UnsafeUrlError(`Refusing to connect: ${hostname} resolves to a non-public address.`), "", 4);
    }
    if ((options as { all?: boolean }).all) {
      return (callback as unknown as (e: null, a: dns.LookupAddress[]) => void)(null, list);
    }
    callback(null, list[0].address, list[0].family);
  });
};

export interface SafeResponse {
  status: number;
  url: string; // final URL after redirects
  contentType: string;
  body: string;
}

export interface SafeGetOptions {
  timeoutMs?: number;
  maxBytes?: number;
  userAgent?: string;
  accept?: string;
  maxRedirects?: number;
}

function requestOnce(
  url: URL,
  opts: Required<SafeGetOptions>,
  post?: { body: string; headers: Record<string, string> },
): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: Buffer }> {
  return new Promise((resolve, reject) => {
    const mod = url.protocol === "https:" ? https : http;
    const req = mod.request(
      url,
      {
        method: post ? "POST" : "GET",
        lookup: safeLookup,
        headers: {
          "User-Agent": opts.userAgent,
          Accept: opts.accept,
          "Accept-Encoding": "gzip, deflate, br",
          ...(post ? { ...post.headers, "Content-Length": String(Buffer.byteLength(post.body)) } : {}),
        },
        timeout: opts.timeoutMs,
      },
      (res) => {
        const status = res.statusCode ?? 0;
        if (status >= 300 && status < 400) {
          res.resume();
          return resolve({ status, headers: res.headers, body: Buffer.alloc(0) });
        }
        const encoding = String(res.headers["content-encoding"] ?? "").toLowerCase();
        let stream: NodeJS.ReadableStream = res;
        if (encoding === "gzip") stream = res.pipe(zlib.createGunzip());
        else if (encoding === "deflate") stream = res.pipe(zlib.createInflate());
        else if (encoding === "br") stream = res.pipe(zlib.createBrotliDecompress());

        const chunks: Buffer[] = [];
        let size = 0;
        stream.on("data", (c: Buffer) => {
          size += c.length;
          if (size > opts.maxBytes) {
            req.destroy(new Error("Response too large."));
            return;
          }
          chunks.push(c);
        });
        stream.on("end", () => resolve({ status, headers: res.headers, body: Buffer.concat(chunks) }));
        stream.on("error", reject);
      },
    );
    const hardTimer = setTimeout(() => req.destroy(new Error("Timed out.")), opts.timeoutMs);
    req.on("timeout", () => req.destroy(new Error("Timed out.")));
    req.on("error", (e) => {
      clearTimeout(hardTimer);
      reject(e);
    });
    req.on("close", () => clearTimeout(hardTimer));
    if (post) req.write(post.body);
    req.end();
  });
}

/**
 * SSRF-safe POST (used for customer-configured lead webhooks). Same address
 * rules as safeGet; redirects are NOT followed (a 3xx counts as a failure).
 */
export async function safePost(
  raw: string,
  body: string,
  headers: Record<string, string>,
  options: { timeoutMs?: number; userAgent?: string } = {},
): Promise<{ status: number; body: string }> {
  const url = assertSafeUrl(raw);
  const res = await requestOnce(
    url,
    {
      timeoutMs: options.timeoutMs ?? 5_000,
      maxBytes: 64_000,
      userAgent: options.userAgent ?? "BuildrStudio-Webhooks/1.0 (+https://buildrstudio.in)",
      accept: "*/*",
      maxRedirects: 0,
    },
    { body, headers },
  );
  return { status: res.status, body: res.body.toString("utf8").slice(0, 500) };
}

export async function safeGet(raw: string | URL, options: SafeGetOptions = {}): Promise<SafeResponse> {
  const opts: Required<SafeGetOptions> = {
    timeoutMs: options.timeoutMs ?? 10_000,
    maxBytes: options.maxBytes ?? 2_000_000,
    userAgent: options.userAgent ?? "BuildrStudioBot/1.0 (+https://buildrstudio.in)",
    accept: options.accept ?? "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5",
    maxRedirects: options.maxRedirects ?? 4,
  };
  let url = assertSafeUrl(raw);
  for (let hop = 0; hop <= opts.maxRedirects; hop++) {
    const res = await requestOnce(url, opts);
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.location;
      if (!location) throw new Error(`Redirect (${res.status}) without a Location header.`);
      url = assertSafeUrl(new URL(location, url));
      continue;
    }
    const contentType = String(res.headers["content-type"] ?? "").toLowerCase();
    const charset = contentType.match(/charset=([^;]+)/)?.[1]?.trim();
    let body: string;
    try {
      body = new TextDecoder(charset || "utf-8").decode(res.body);
    } catch {
      body = new TextDecoder("utf-8").decode(res.body);
    }
    return { status: res.status, url: url.toString(), contentType, body };
  }
  throw new Error("Too many redirects.");
}

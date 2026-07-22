// Allowlist for Paddle's live webhook IPs.
//
// Paddle publishes its current webhook-sending IPs at https://api.paddle.com/ips
// (shape: { data: { ipv4_cidrs: string[], ipv6_cidrs: string[] } }, all as /32 or /128
// single-address CIDRs). This list can change, so we fetch it at request time instead
// of hardcoding it, with a short in-memory cache to avoid hitting the endpoint on every
// webhook delivery.

interface PaddleIpsResponse {
  data: {
    ipv4_cidrs: string[];
    ipv6_cidrs: string[];
  };
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

let cachedIps: Set<string> | null = null;
let cachedAt = 0;
let inFlight: Promise<Set<string>> | null = null;

function stripCidrSuffix(cidr: string): string {
  return cidr.split("/")[0];
}

async function fetchPaddleIps(): Promise<Set<string>> {
  const res = await fetch("https://api.paddle.com/ips", {
    // Never cache this at the platform/CDN layer — we manage our own TTL below.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Paddle IP allowlist: ${res.status}`);
  }

  const json = (await res.json()) as PaddleIpsResponse;
  const all = [...(json.data?.ipv4_cidrs ?? []), ...(json.data?.ipv6_cidrs ?? [])];

  if (all.length === 0) {
    throw new Error("Paddle IP allowlist response was empty");
  }

  return new Set(all.map(stripCidrSuffix));
}

/**
 * Returns the current set of Paddle webhook source IPs, refreshing from
 * https://api.paddle.com/ips at most once per CACHE_TTL_MS.
 *
 * On fetch failure, falls back to the last known-good cached list (if any)
 * rather than failing open or hardcoding a static list.
 */
export async function getPaddleWebhookIps(): Promise<Set<string>> {
  const isFresh = cachedIps && Date.now() - cachedAt < CACHE_TTL_MS;
  if (isFresh) return cachedIps!;

  if (inFlight) return inFlight;

  inFlight = fetchPaddleIps()
    .then((ips) => {
      cachedIps = ips;
      cachedAt = Date.now();
      return ips;
    })
    .catch((err) => {
      console.error("paddleIps: refresh failed", err);
      if (cachedIps) return cachedIps; // serve stale rather than fail open with no list
      throw err;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

/** Extracts the originating client IP from a Next.js request's headers. */
export function getRequestIp(headers: Headers): string | null {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for is "client, proxy1, proxy2..." — the first entry is the
    // original client (Paddle's server), which is what we want to match.
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip");
}

export async function isPaddleWebhookIp(ip: string | null): Promise<boolean> {
  if (!ip) return false;
  const allowlist = await getPaddleWebhookIps();
  return allowlist.has(ip);
}

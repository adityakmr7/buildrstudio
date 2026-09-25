// Same-origin website crawler for "Train from a website URL" (dashboard →
// Knowledge base). Server-only. Runs synchronously inside one request —
// there's no job queue in this app — so everything is capped: page count,
// per-page timeout, a total time budget, bytes per page and text per page.
// Network access goes through safeGet() (app/lib/safeFetch.ts) for SSRF
// protection.

import { createHash } from "node:crypto";
import { parse, type HTMLElement } from "node-html-parser";
import { safeGet, assertSafeUrl, UnsafeUrlError } from "./safeFetch";

export const CRAWL_MAX_PAGES = 50;
export const CRAWL_PAGE_TIMEOUT_MS = 8_000;
export const CRAWL_TOTAL_BUDGET_MS = 35_000;
export const CRAWL_MAX_PAGE_BYTES = 2_000_000;
export const CRAWL_MAX_CHARS_PER_PAGE = 15_000;
export const CRAWL_CONCURRENCY = 4;
export const CRAWL_USER_AGENT = "BuildrStudioBot/1.0 (+https://buildrstudio.in)";
const ROBOTS_AGENT_TOKEN = "buildrstudiobot";
const MAX_ERRORS_REPORTED = 20;

const SKIP_EXTENSIONS =
  /\.(pdf|jpe?g|png|gif|webp|svg|ico|bmp|tiff?|mp4|mov|avi|webm|mp3|wav|ogg|zip|rar|7z|gz|tar|dmg|exe|msi|apk|css|js|mjs|json|xml|rss|atom|woff2?|ttf|eot|otf|docx?|xlsx?|pptx?|csv)$/i;

export interface CrawledPage {
  url: string;
  title: string;
  text: string;
}

export interface CrawlResult {
  pages: CrawledPage[];
  pagesFound: number; // unique same-origin URLs discovered (incl. ones past the cap)
  errors: { url: string; error: string }[];
  stoppedEarly: boolean; // hit the page cap or time budget
}

// ── robots.txt ────────────────────────────────────────────────────────────

interface RobotsRules {
  allow: string[];
  disallow: string[];
  sitemaps: string[];
}

export function parseRobots(text: string): RobotsRules {
  const groups: { agents: string[]; allow: string[]; disallow: string[] }[] = [];
  const sitemaps: string[] = [];
  let current: { agents: string[]; allow: string[]; disallow: string[] } | null = null;
  let lastWasAgent = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const field = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (field === "sitemap") {
      if (value) sitemaps.push(value);
      continue;
    }
    if (field === "user-agent") {
      if (!current || !lastWasAgent) {
        current = { agents: [], allow: [], disallow: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (!current) continue;
    if (field === "allow" && value) current.allow.push(value);
    if (field === "disallow" && value) current.disallow.push(value);
  }
  const specific = groups.filter((g) => g.agents.some((a) => a !== "*" && ROBOTS_AGENT_TOKEN.includes(a)));
  const chosen = specific.length ? specific : groups.filter((g) => g.agents.includes("*"));
  return {
    allow: chosen.flatMap((g) => g.allow),
    disallow: chosen.flatMap((g) => g.disallow),
    sitemaps,
  };
}

function robotsPatternToRegex(pattern: string): RegExp {
  const anchored = pattern.endsWith("$");
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split("*")
    .map((p) => p.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  return new RegExp(`^${body}${anchored ? "$" : ""}`);
}

/** Longest-match wins; Allow wins ties (Google's documented behaviour). */
export function isAllowedByRobots(rules: RobotsRules, pathWithQuery: string): boolean {
  let best: { len: number; allow: boolean } | null = null;
  for (const [list, allow] of [
    [rules.disallow, false],
    [rules.allow, true],
  ] as const) {
    for (const p of list) {
      if (robotsPatternToRegex(p).test(pathWithQuery)) {
        if (!best || p.length > best.len || (p.length === best.len && allow)) best = { len: p.length, allow };
      }
    }
  }
  return best ? best.allow : true;
}

// ── HTML → text ──────────────────────────────────────────────────────────

const STRIP_SELECTORS = [
  "script",
  "style",
  "noscript",
  "template",
  "svg",
  "canvas",
  "iframe",
  "nav",
  "header",
  "footer",
  "form",
  "button",
  "select",
  "[role=navigation]",
  "[role=banner]",
  "[role=contentinfo]",
  "[aria-hidden=true]",
  "[hidden]",
];

export function extractPage(html: string, pageUrl: string): { title: string; text: string; links: string[] } {
  const root = parse(html, { comment: false, blockTextElements: { script: false, style: false, noscript: false, pre: true } });
  const title = (root.querySelector("title")?.text ?? "").replace(/\s+/g, " ").trim();
  const description = root.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? "";

  const links: string[] = [];
  for (const a of root.querySelectorAll("a[href]")) {
    const href = a.getAttribute("href");
    if (!href) continue;
    try {
      links.push(new URL(href, pageUrl).toString());
    } catch {
      /* ignore malformed */
    }
  }
  for (const sel of STRIP_SELECTORS) {
    for (const el of root.querySelectorAll(sel)) el.remove();
  }
  const main: HTMLElement = root.querySelector("main") ?? root.querySelector("article") ?? root.querySelector("body") ?? root;
  const text = main.structuredText
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");

  const full = description && !text.includes(description) ? `${description}\n${text}` : text;
  return { title, text: full.slice(0, CRAWL_MAX_CHARS_PER_PAGE), links };
}

// ── sitemap.xml ──────────────────────────────────────────────────────────

export function parseSitemap(xml: string): { urls: string[]; sitemaps: string[] } {
  const locs = [...xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?\s*([^<\]]+?)\s*(?:\]\]>)?\s*<\/loc>/gi)].map((m) =>
    m[1].replace(/&amp;/g, "&").trim(),
  );
  const isIndex = /<sitemapindex[\s>]/i.test(xml);
  return isIndex ? { urls: [], sitemaps: locs } : { urls: locs, sitemaps: [] };
}

// ── URL normalisation ────────────────────────────────────────────────────

function siteHost(host: string) {
  return host.toLowerCase().replace(/^www\./, "");
}

/**
 * Same-site check + canonicalisation. "Same origin" is relaxed just enough
 * for real sites: apex ↔ www and http ↔ https count as the same site (most
 * sites redirect one to the other) and are rewritten to the canonical origin
 * so each page is only fetched once. Any other host — including other
 * subdomains — is off-site.
 */
export function normalizeUrl(raw: string, origin: string): string | null {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  const canonical = new URL(origin);
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  if (siteHost(u.hostname) !== siteHost(canonical.hostname)) return null;
  if (u.port && u.port !== canonical.port) return null;
  u.protocol = canonical.protocol;
  u.host = canonical.host;
  if (SKIP_EXTENSIONS.test(u.pathname)) return null;
  u.hash = "";
  // Drop common tracking params so the same page isn't crawled twice.
  for (const p of [...u.searchParams.keys()]) {
    if (/^(utm_|fbclid|gclid|ref$|mc_)/i.test(p)) u.searchParams.delete(p);
  }
  if (u.pathname !== "/" && u.pathname.endsWith("/")) u.pathname = u.pathname.slice(0, -1);
  return u.toString();
}

function isSitemapUrl(u: URL) {
  return /\.xml$/i.test(u.pathname) || /sitemap/i.test(u.pathname);
}

function errMessage(err: unknown): string {
  if (err instanceof UnsafeUrlError) return err.message;
  const msg = err instanceof Error ? err.message : String(err);
  if (/ENOTFOUND|EAI_AGAIN/.test(msg)) return "Domain not found.";
  if (/ECONNREFUSED/.test(msg)) return "Connection refused.";
  if (/timed out|ETIMEDOUT/i.test(msg)) return "Timed out.";
  return msg.slice(0, 200);
}

// ── Crawl ────────────────────────────────────────────────────────────────

export async function crawlSite(startUrl: string): Promise<CrawlResult> {
  const start = assertSafeUrl(startUrl.trim());
  let origin = start.origin;
  const deadline = Date.now() + CRAWL_TOTAL_BUDGET_MS;
  const errors: CrawlResult["errors"] = [];
  const addError = (url: string, error: string) => {
    if (errors.length < MAX_ERRORS_REPORTED) errors.push({ url, error });
  };
  const fetchOpts = { timeoutMs: CRAWL_PAGE_TIMEOUT_MS, maxBytes: CRAWL_MAX_PAGE_BYTES, userAgent: CRAWL_USER_AGENT };

  // robots.txt — missing/unreachable means "no restrictions". Its final
  // URL also tells us the site's canonical origin (apex → www, http → https).
  let robots: RobotsRules = { allow: [], disallow: [], sitemaps: [] };
  try {
    const r = await safeGet(`${origin}/robots.txt`, { ...fetchOpts, accept: "text/plain" });
    const finalOrigin = new URL(r.url).origin;
    if (normalizeUrl(r.url, origin)) origin = finalOrigin;
    if (r.status >= 200 && r.status < 300 && !r.contentType.includes("html")) robots = parseRobots(r.body);
  } catch {
    /* treat as no robots.txt */
  }
  const allowed = (u: string) => {
    const parsed = new URL(u);
    return isAllowedByRobots(robots, parsed.pathname + parsed.search);
  };

  const discovered = new Set<string>();
  const queue: string[] = [];
  const enqueue = (raw: string) => {
    const n = normalizeUrl(raw, origin);
    if (!n || discovered.has(n)) return;
    discovered.add(n);
    queue.push(n);
  };

  const sitemapMode = isSitemapUrl(start);
  if (sitemapMode) {
    // Sitemap (or sitemap index, one level deep, max 5 child sitemaps).
    const toFetch = [start.toString()];
    let fetched = 0;
    while (toFetch.length && fetched < 6 && Date.now() < deadline) {
      const sm = toFetch.shift()!;
      fetched++;
      try {
        const r = await safeGet(sm, { ...fetchOpts, accept: "application/xml,text/xml;q=0.9,*/*;q=0.5" });
        if (r.status < 200 || r.status >= 300) {
          addError(sm, `HTTP ${r.status}`);
          continue;
        }
        const parsed = parseSitemap(r.body);
        parsed.urls.forEach(enqueue);
        for (const child of parsed.sitemaps.slice(0, 5)) {
          try {
            if (normalizeUrl(child, origin) || new URL(child).origin === new URL(sm).origin) toFetch.push(child);
          } catch {
            /* ignore */
          }
        }
      } catch (err) {
        addError(sm, errMessage(err));
      }
    }
    if (discovered.size === 0 && errors.length === 0) addError(start.toString(), "No page URLs found in this sitemap.");
  } else {
    enqueue(start.toString());
  }

  const pages: CrawledPage[] = [];
  const seenContent = new Set<string>();
  const visited = new Set<string>();
  let stoppedEarly = false;

  const worker = async () => {
    while (true) {
      if (pages.length + inFlight >= CRAWL_MAX_PAGES) {
        if (queue.length) stoppedEarly = true;
        return;
      }
      if (Date.now() > deadline) {
        if (queue.length) stoppedEarly = true;
        return;
      }
      const next = queue.shift();
      if (!next) {
        // Other workers may still discover links — wait for them.
        if (inFlight === 0) return;
        await new Promise((r) => setTimeout(r, 50));
        continue;
      }
      if (visited.has(next)) continue;
      visited.add(next);
      if (!allowed(next)) {
        addError(next, "Blocked by robots.txt");
        continue;
      }
      inFlight++;
      try {
        const r = await safeGet(next, fetchOpts);
        if (r.status < 200 || r.status >= 300) {
          addError(next, `HTTP ${r.status}`);
          continue;
        }
        const finalUrl = normalizeUrl(r.url, origin);
        if (!finalUrl) {
          addError(next, "Redirected off-site — skipped.");
          continue;
        }
        if (!r.contentType.includes("html") && !r.contentType.includes("text/plain")) {
          addError(next, `Skipped non-HTML content (${r.contentType.split(";")[0] || "unknown"})`);
          continue;
        }
        const { title, text, links } = r.contentType.includes("html")
          ? extractPage(r.body, finalUrl)
          : { title: "", text: r.body.slice(0, CRAWL_MAX_CHARS_PER_PAGE), links: [] };
        if (!sitemapMode) links.forEach(enqueue);
        if (text.length < 40) {
          addError(next, "No readable text on this page.");
          continue;
        }
        const hash = createHash("sha1").update(text).digest("hex");
        if (seenContent.has(hash)) continue; // duplicate content (e.g. /index vs /)
        seenContent.add(hash);
        if (pages.length < CRAWL_MAX_PAGES) pages.push({ url: finalUrl, title, text });
      } catch (err) {
        addError(next, errMessage(err));
      } finally {
        inFlight--;
      }
    }
  };
  let inFlight = 0;
  // Small fixed concurrency: polite to the target site, fast enough to fit
  // the time budget.
  await Promise.all(Array.from({ length: CRAWL_CONCURRENCY }, worker));

  return { pages, pagesFound: discovered.size, errors, stoppedEarly };
}

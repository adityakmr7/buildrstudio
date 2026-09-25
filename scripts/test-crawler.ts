// Unit-style checks for the website crawler's safety + parsing helpers.
// No network needed except two DNS lookups for the connect-time SSRF check.
// Run: bun run test:crawler   (or: npx tsx scripts/test-crawler.ts)
import { isPrivateAddress, assertSafeUrl, safeGet } from "../app/lib/safeFetch";
import { parseRobots, isAllowedByRobots, extractPage, parseSitemap, normalizeUrl } from "../app/lib/crawler";

let failed = 0;
const check = (cond: boolean, msg: string) => {
  console.log(`${cond ? "PASS" : "FAIL"} ${msg}`);
  if (!cond) failed++;
};

async function main() {
  for (const ip of ["127.0.0.1", "10.1.2.3", "172.16.5.4", "192.168.1.1", "169.254.169.254", "100.64.0.1", "0.0.0.0", "::1", "fd00::1", "fe80::1", "::ffff:127.0.0.1", "::ffff:7f00:1", "224.0.0.1"]) {
    check(isPrivateAddress(ip), `private: ${ip}`);
  }
  for (const ip of ["8.8.8.8", "1.1.1.1", "2606:4700:4700::1111", "172.32.0.1"]) check(!isPrivateAddress(ip), `public: ${ip}`);

  for (const u of ["ftp://x.com", "file:///etc/passwd", "http://localhost/", "http://127.0.0.1/", "http://[::1]/", "http://169.254.169.254/latest/meta-data", "http://user:pw@example.com", "http://example.com:8080/", "http://intranet/", "http://foo.internal/", "http://2130706433/"]) {
    let threw = false;
    try {
      assertSafeUrl(u);
    } catch {
      threw = true;
    }
    check(threw, `rejected: ${u}`);
  }
  check(assertSafeUrl("https://example.com/a?b=1").hostname === "example.com", "accepted: https://example.com");

  // Hostnames that resolve to loopback must be refused on the socket itself.
  for (const u of ["http://localtest.me/", "http://127.0.0.1.nip.io/"]) {
    let msg = "";
    try {
      await safeGet(u, { timeoutMs: 5000 });
    } catch (e) {
      msg = e instanceof Error ? e.message : String(e);
    }
    check(/non-public|not found|ENOTFOUND/i.test(msg), `connect-time DNS block: ${u} (${msg})`);
  }

  const r = parseRobots("User-agent: *\nDisallow: /private\nAllow: /private/ok\nDisallow: /*.php$\n\nUser-agent: Googlebot\nDisallow: /\nSitemap: https://x.com/sitemap.xml");
  check(!isAllowedByRobots(r, "/private/x"), "robots: disallow prefix");
  check(isAllowedByRobots(r, "/private/ok/1"), "robots: longer allow wins");
  check(!isAllowedByRobots(r, "/a.php") && isAllowedByRobots(r, "/a.php?x"), "robots: $ anchor");
  check(r.sitemaps[0] === "https://x.com/sitemap.xml", "robots: sitemap line");
  check(!isAllowedByRobots(parseRobots("User-agent: BuildrStudioBot\nDisallow: /\n\nUser-agent: *\nAllow: /"), "/x"), "robots: our UA group wins over *");

  const p = extractPage(
    `<html><head><title>T</title><script>evil()</script><style>.a{}</style></head><body><nav>Menu</nav><main><h1>Hello</h1><p>Real content about pricing.</p></main><footer>foot</footer><a href="/x#y">x</a></body></html>`,
    "https://a.com/",
  );
  check(p.title === "T" && p.text.includes("Real content") && !/evil|Menu|foot/.test(p.text), "extract: strips script/nav/footer");
  check(p.links[0] === "https://a.com/x#y", "extract: resolves links");

  const sm = parseSitemap(`<urlset><url><loc>https://a.com/1</loc></url><url><loc><![CDATA[https://a.com/2?x=1&amp;y=2]]></loc></url></urlset>`);
  check(sm.urls.length === 2 && sm.urls[1] === "https://a.com/2?x=1&y=2", "sitemap: urls + CDATA + entities");
  check(parseSitemap(`<sitemapindex><sitemap><loc>https://a.com/s1.xml</loc></sitemap></sitemapindex>`).sitemaps.length === 1, "sitemap: index");

  check(normalizeUrl("http://www.a.com/x/#h", "https://a.com") === "https://a.com/x", "normalize: www/http folded into canonical origin");
  check(normalizeUrl("https://blog.a.com/x", "https://a.com") === null, "normalize: other subdomain is off-site");
  check(normalizeUrl("https://a.com/file.pdf", "https://a.com") === null, "normalize: skips binaries");
  check(normalizeUrl("https://a.com/p?utm_source=x&id=2", "https://a.com") === "https://a.com/p?id=2", "normalize: drops tracking params");

  console.log(failed ? `\n${failed} check(s) failed` : "\nAll checks passed");
  process.exit(failed ? 1 : 0);
}

main();

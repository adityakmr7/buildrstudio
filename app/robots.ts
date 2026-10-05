import type { MetadataRoute } from "next";
import { siteConfig } from "./lib/siteConfig";
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard/", "/api/", "/brand/index.html", "/brand/README.md"] }], sitemap: `${siteConfig.url}/sitemap.xml` };
}

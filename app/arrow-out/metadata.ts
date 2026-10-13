import type { Metadata } from "next";
import { siteConfig } from "../lib/siteConfig";
export function arrowMetadata(path: string, title: string, description: string, draft = false): Metadata {
  const url = `${siteConfig.url}${path ? `/arrow-out${path}` : "/products/arrow-out"}`;
  return { title: { absolute: title }, description, alternates: { canonical: url }, ...(draft ? { robots: { index: false, follow: true } } : {}), openGraph: { title, description, url, type: "website", images: [{ url: "/arrow-out/icon.png", width: 1024, height: 1024, alt: "ArrowOut app icon" }] }, twitter: { card: "summary", title, description, images: ["/arrow-out/icon.png"] } };
}
export function arrowJsonLd(path: string, title: string, description: string) {
  return JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: title, description, url: `${siteConfig.url}${path ? `/arrow-out${path}` : "/products/arrow-out"}`, isPartOf: { "@type": "WebSite", name: "BuildrStudio", url: siteConfig.url } });
}

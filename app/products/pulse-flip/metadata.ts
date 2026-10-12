import type { Metadata } from "next";
import { siteConfig } from "../../lib/siteConfig";
export const base = "/products/pulse-flip";
export function pulseMetadata(path: string, title: string, description: string): Metadata {
 const url = `${siteConfig.url}${base}${path}`;
 return { title: { absolute: title }, description, alternates: { canonical: url }, icons: { icon: "/pulse-flip/icon.png", apple: "/pulse-flip/icon.png" }, openGraph: { title, description, url, type: "website", images: [{ url: "/pulse-flip/icon.png", width: 1024, height: 1024, alt: "Pulseflip app icon" }] }, twitter: { card: "summary", title, description, images: ["/pulse-flip/icon.png"] } };
}
export function pulseJsonLd(path: string, title: string, description: string) {
 return JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: title, description, url: `${siteConfig.url}${base}${path}`, isPartOf: { "@type": "WebSite", name: "BuildrStudio", url: siteConfig.url } });
}

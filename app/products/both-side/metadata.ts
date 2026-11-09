import type { Metadata } from "next";
import { siteConfig } from "../../lib/siteConfig";
export function bothSideMetadata(path: string, title: string, description: string): Metadata {
 const url = `${siteConfig.url}/products/both-side${path}`;
 return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: "website", images: [{ url: "/both-side/social.jpg", width: 1200, height: 630, alt: "BothSide dual camera and teleprompter for iPhone" }] }, twitter: { card: "summary_large_image", title, description, images: ["/both-side/social.jpg"] } };
}

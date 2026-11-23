import type { Metadata } from "next";
import { siteConfig } from "../../lib/siteConfig";

export function astrellMetadata(path: string, title: string, description: string): Metadata {
  const url = `${siteConfig.url}/products/astrell${path}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title, description, url, type: "website",
      images: [{ url: "/astrell/icon.png", width: 1024, height: 1024, alt: "Astrell First Spark app icon" }],
    },
    twitter: { card: "summary", title, description, images: ["/astrell/icon.png"] },
  };
}

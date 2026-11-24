import type { Metadata } from "next";
import Script from "next/script";
import SkillsClient from "./SkillsClient";
import { siteConfig } from "../lib/siteConfig";

export const metadata: Metadata = {
  title: "iOS AI Skills Suite (21 Skills) — BuildrStudio",
  description:
    "A modular, open-source suite of 21 AI Agent Skills for Swift 6, SwiftUI, SwiftData, StoreKit 2, and Apple HIG. Installable in Claude Code, Cursor, and Antigravity.",
  alternates: {
    canonical: `${siteConfig.url}/skills`,
  },
  openGraph: {
    title: "Buildr iOS AI Skills Suite (21 Skills)",
    description:
      "A modular suite of 21 AI Agent Skills for modern iOS development (Swift 6, SwiftUI, StoreKit 2, SwiftData, and Apple HIG).",
    url: `${siteConfig.url}/skills`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buildr iOS AI Skills Suite (21 Skills)",
    description:
      "21 AI Agent Skills for Swift 6, SwiftUI, StoreKit 2, and Apple HIG. Install in Claude Code, Cursor, and Antigravity.",
  },
};

export default function SkillsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BuildrStudio iOS AI Skills Suite",
    operatingSystem: "iOS, macOS, iPadOS, watchOS, visionOS",
    applicationCategory: "DeveloperApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "A modular suite of 21 AI Agent Skills for modern iOS development (Swift 6, SwiftUI, StoreKit 2, SwiftData, and Apple HIG).",
    url: `${siteConfig.url}/skills`,
    author: {
      "@type": "Organization",
      name: "BuildrStudio",
      url: siteConfig.url,
    },
  };

  return (
    <>
      <Script
        id="skills-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SkillsClient />
    </>
  );
}

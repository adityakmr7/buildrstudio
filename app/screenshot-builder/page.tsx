import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import ScreenshotBuilderHub from "./ScreenshotBuilderHub";

export const metadata: Metadata = {
  title: "App Store Screenshot Builder — iOS & Play Store Mockups",
  description:
    "Create App Store & Play Store screenshots in seconds. Paste your app URL, get polished mockups with AI headlines and device frames. Free.",
  alternates: {
    canonical: "https://buildrstudio.in/screenshot-builder",
  },
  openGraph: {
    title: "App Store Screenshot Builder — BuildrStudio",
    description:
      "Generate beautiful, store-compliant app screenshots for iOS and Google Play Store instantly in correct aspect ratios with marketing text and realistic frames.",
    type: "website",
    url: "https://buildrstudio.in/screenshot-builder",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "App Store Screenshot Builder — BuildrStudio",
    description:
      "Generate beautiful, store-compliant app screenshots for iOS and Play Store in seconds.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "BuildrStudio",
          "item": "https://buildrstudio.in",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Screenshot Builder",
          "item": "https://buildrstudio.in/screenshot-builder",
        },
      ],
    },
    {
      "@type": "WebApplication",
      "@id": "https://buildrstudio.in/screenshot-builder#webapp",
      "url": "https://buildrstudio.in/screenshot-builder",
      "name": "App Store & Google Play Screenshot Builder",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires CSS3/HTML5",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "description":
        "Create professional, submission-ready app store screenshot mockups for iOS and Google Play Store with custom text, backgrounds, and 3D device tilts.",
    },
  ],
};

export default function ScreenshotBuilderPage() {
  return (
    <>
      <Script
        id="json-ld-screenshot-builder"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">Free App Store Screenshot Builder — Create iOS &amp; Play Store Mockups</h1>
      <Suspense>
        <ScreenshotBuilderHub />
      </Suspense>
    </>
  );
}

import type { Metadata } from "next";
import Script from "next/script";
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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuildrStudio App Store Screenshot Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "App Store Screenshot Builder — BuildrStudio",
    description:
      "Generate beautiful, store-compliant app screenshots for iOS and Play Store in seconds.",
    images: ["/og-image.png"],
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
      <h1 style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 }}>
        App Store &amp; Play Store Screenshot Mockup Builder — BuildrStudio
      </h1>
      <ScreenshotBuilderHub />
    </>
  );
}

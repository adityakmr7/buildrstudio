import type { Metadata } from "next";
import Script from "next/script";
import WorkspaceHub from "./components/WorkspaceHub";

export const metadata: Metadata = {
  title: "Screenshot to Social Media Graphic Optimizer",
  description:
    "Free tool to instantly turn raw developer screenshots, terminal outputs, and code captures into beautiful social media images for X/Twitter, LinkedIn, and Instagram. Add gradients, frames, captions and more.",
  alternates: {
    canonical: "https://buildrstudio.in",
  },
  openGraph: {
    title: "Screenshot to Social Media Graphic Optimizer — BuildrStudio",
    description:
      "Free tool to instantly turn raw developer screenshots into beautiful social media images. Add gradients, frames, captions, and export in one click.",
    type: "website",
    url: "https://buildrstudio.in",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuildrStudio Screenshot Optimizer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Screenshot to Social Media Graphic Optimizer — BuildrStudio",
    description:
      "Free tool to turn raw developer screenshots into beautiful social media images. Add gradients, frames, captions — export in one click.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BuildrStudio Screenshot Optimizer",
  url: "https://buildrstudio.in",
  description:
    "Free web tool to convert developer screenshots into beautiful social media graphics with gradient backgrounds, device frames, captions, and one-click PNG export.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Aditya Kumar",
    url: "https://buildrstudio.in",
  },
  featureList: [
    "Gradient backgrounds",
    "Device frames (macOS, browser, iPhone, Android, terminal)",
    "Caption overlays",
    "Aspect ratio options (16:9, 1:1, 4:5, 9:16)",
    "One-click PNG export",
    "Annotation badges and labels",
    "Preset styles",
  ],
};

export default function Home() {
  return (
    <>
      <Script
        id="json-ld-webapp"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorkspaceHub />
    </>
  );
}


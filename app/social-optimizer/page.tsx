import type { Metadata } from "next";
import Script from "next/script";
import WorkspaceHub from "../components/WorkspaceHub";

export const metadata: Metadata = {
  title: "Social Media Graphic Optimizer — BuildrStudio",
  description:
    "Turn screenshots into stunning social media graphics for Twitter/X and LinkedIn. Add gradients, frames, and captions in seconds. Free, no signup.",
  alternates: {
    canonical: "https://buildrstudio.in/social-optimizer",
  },
  openGraph: {
    title: "Social Media Graphic Optimizer — BuildrStudio",
    description:
      "Convert developer screenshots into beautiful social media images. Add gradients, frames, captions, and export in one click.",
    type: "website",
    url: "https://buildrstudio.in/social-optimizer",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuildrStudio Social Graphic Optimizer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Media Graphic Optimizer — BuildrStudio",
    description:
      "Turn raw developer screenshots into beautiful social media images with gradients, frames, and captions.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BuildrStudio Screenshot Social Optimizer",
  url: "https://buildrstudio.in/social-optimizer",
  description:
    "Convert screenshots into social media graphics with custom background gradients, terminal frames, glass overlay text, and annotations.",
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

export default function SocialOptimizerPage() {
  return (
    <>
      <Script
        id="json-ld-social-optimizer"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 }}>
        Social Media Graphic Optimizer for Developer Screenshots — BuildrStudio
      </h1>
      <WorkspaceHub />
    </>
  );
}

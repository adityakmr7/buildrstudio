import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import SaaSLandingPage from "./components/SaaSLandingPage";

export const metadata: Metadata = {
  title: "BuildrStudio — Free App Store Screenshot Generator",
  description:
    "Create App Store & Play Store screenshots in seconds. Paste your app URL, get polished mockups with AI headlines and device frames. Free.",
  alternates: {
    canonical: "https://buildrstudio.in",
  },
  openGraph: {
    title: "BuildrStudio — App Store Screenshots That Convert",
    description:
      "Paste your App Store URL and get polished, submission-ready screenshots in seconds. Free, no design skills needed.",
    type: "website",
    url: "https://buildrstudio.in",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildrStudio — App Store Screenshots That Convert",
    description:
      "Paste your App Store URL and get polished, submission-ready screenshots in seconds.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://buildrstudio.in/#website",
      "url": "https://buildrstudio.in",
      "name": "BuildrStudio",
      "description":
        "Free App Store & Google Play screenshot generator. Paste your app URL or upload a screenshot, get submission-ready mockups in seconds.",
      "publisher": {
        "@type": "Person",
        "name": "Aditya Kumar",
      },
    },
    {
      "@type": "WebApplication",
      "@id": "https://buildrstudio.in/#webapp",
      "url": "https://buildrstudio.in/screenshot-builder",
      "name": "BuildrStudio App Store Screenshot Builder",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires CSS3/HTML5",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "description":
        "Create submission-ready App Store and Google Play screenshots in seconds. Auto-import from your App Store URL, AI headlines, smart device-size resize.",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do I need a credit card to get started?",
          "acceptedAnswer": { "@type": "Answer", "text": "No! You can use all core features of BuildrStudio completely free without entering any billing details." },
        },
        {
          "@type": "Question",
          "name": "How does the Batch Store Exporter work?",
          "acceptedAnswer": { "@type": "Answer", "text": "Under the Pro plan, you can upload a single screenshot, and our system automatically renders and packs it in all canonical resolutions required by Apple and Google. You get a clean ZIP file instantly." },
        },
        {
          "@type": "Question",
          "name": "Can I save my custom brand colors and gradients?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes! The Pro tier includes a Brand Presets kit where you can lock in your exact hex codes, brand fonts, and custom watermark text for automatic use on any tool." },
        },
        {
          "@type": "Question",
          "name": "Does BuildrStudio have AI features?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes! BuildrStudio includes an AI-powered copywriter that generates marketing headlines in 15+ languages, and AI auto-layout that suggests gradients and text positioning when you upload a screenshot." },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <Script
        id="json-ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense>
        <SaaSLandingPage />
      </Suspense>
    </>
  );
}

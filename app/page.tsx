import type { Metadata } from "next";
import Script from "next/script";
import SaaSLandingPage from "./components/SaaSLandingPage";

export const metadata: Metadata = {
  title: "BuildrStudio — Beautiful Launch Assets for Developers & Indie Hackers",
  description:
    "Design high-converting App Store screenshot mockups, social graphics, and release changelog cards in seconds. Built for speed and visual excellence.",
  alternates: {
    canonical: "https://buildrstudio.in",
  },
  openGraph: {
    title: "BuildrStudio — Beautiful Launch Visuals",
    description:
      "Design high-converting App Store mockups, social graphics, and release changelog cards in seconds.",
    type: "website",
    url: "https://buildrstudio.in",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuildrStudio Creative Suite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildrStudio — Beautiful Launch Visuals",
    description:
      "Design high-converting App Store mockups, social graphics, and release changelog cards in seconds.",
    images: ["/og-image.png"],
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
        "Creative asset generation suite for developer screenshots, social graphic optimization, and App Store mockups.",
      "publisher": {
        "@type": "Person",
        "name": "Aditya Kumar",
      },
    },
    {
      "@type": "WebApplication",
      "@id": "https://buildrstudio.in/#webapp",
      "url": "https://buildrstudio.in",
      "name": "BuildrStudio Creative Suite",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires CSS3/HTML5",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "description":
        "Instant design asset generator for product builders. Create App Store mockups, social media optimized screenshots, and release changelog graphics.",
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
      <SaaSLandingPage />
    </>
  );
}

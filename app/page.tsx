import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import MarketplaceLandingPage from "./components/MarketplaceLandingPage";
import { siteConfig } from "./lib/siteConfig";

export const metadata: Metadata = {
  title: `Buildr Studio — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: `Buildr Studio — ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
    url: siteConfig.url,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `Buildr Studio — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  keywords: [
    "AI employees for small business",
    "AI customer support agent",
    "embeddable AI chat widget",
    "RAG knowledge assistant",
    "AI chatbot for website",
    "no-code AI agent",
    "Buildr Studio",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://buildrstudio.in/#website",
      url: siteConfig.url,
      name: "Buildr Studio",
      description: siteConfig.description,
      publisher: {
        "@type": "Organization",
        name: "Buildr Studio",
        url: siteConfig.url,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Do I need a developer to install an agent?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. After subscribing, your dashboard gives you a single script tag to paste into any website — no code required.",
          },
        },
        {
          "@type": "Question",
          name: "Can I try an agent before paying?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — every agent works on a small trial message quota as soon as you generate an API key.",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <Script
        id="json-ld-marketplace"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense>
        <MarketplaceLandingPage />
      </Suspense>
    </>
  );
}

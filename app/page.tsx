import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import MarketplaceLandingPage from "./components/MarketplaceLandingPage";

export const metadata: Metadata = {
  title: "Buildr Studio — The AI Agent Marketplace",
  description:
    "Browse, buy, and embed AI agents on any website — support agents, knowledge assistants, workflow automation, and multi-agent systems. Install in minutes, no code required.",
  alternates: {
    canonical: "https://buildrstudio.in",
  },
  openGraph: {
    title: "Buildr Studio — The AI Agent Marketplace",
    description: "Browse, buy, and embed AI agents on any website. Install in minutes, no code required.",
    type: "website",
    url: "https://buildrstudio.in",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buildr Studio — The AI Agent Marketplace",
    description: "Browse, buy, and embed AI agents on any website. Install in minutes, no code required.",
  },
  keywords: [
    "AI agent marketplace",
    "embeddable AI chat widget",
    "AI support agent",
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
      url: "https://buildrstudio.in",
      name: "Buildr Studio",
      description: "The AI Agent Marketplace — browse, buy, and embed AI agents on any website.",
      publisher: {
        "@type": "Organization",
        name: "Buildr Studio",
        url: "https://buildrstudio.in",
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

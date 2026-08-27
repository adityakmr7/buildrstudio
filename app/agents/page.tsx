import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import AgentsCatalogHub from "./AgentsCatalogHub";
import { AGENT_CATALOG } from "../lib/agentCatalog";

export const metadata: Metadata = {
  title: "AI Agents — Buildr Studio",
  description:
    "Find an AI employee for your business — customer support, knowledge, and automation agents you can try live and install with one script tag. No code required.",
  alternates: {
    canonical: "https://buildrstudio.in/agents",
  },
  openGraph: {
    title: "AI Agents — Buildr Studio",
    description: "Find an AI employee for your business — try one live, then install it in minutes.",
    type: "website",
    url: "https://buildrstudio.in/agents",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agents — Buildr Studio",
    description: "Find an AI employee for your business — try one live, then install it in minutes.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: AGENT_CATALOG.map((product, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: product.name,
      description: product.description,
      url: `https://buildrstudio.in/agents/${product.slug}`,
    },
  })),
};

export default function AgentsPage() {
  return (
    <>
      <Script
        id="json-ld-agents-catalog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense>
        <AgentsCatalogHub />
      </Suspense>
    </>
  );
}

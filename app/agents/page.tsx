import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import AgentsCatalogHub from "./AgentsCatalogHub";
import { AGENT_CATALOG } from "../lib/agentCatalog";

export const metadata: Metadata = {
  title: "Agent Catalog — Buildr Studio",
  description:
    "Browse Buildr Studio's marketplace of embeddable AI agents — support agents, RAG knowledge assistants, workflow automation, and multi-agent systems. Install with one script tag, no code required.",
  alternates: {
    canonical: "https://buildrstudio.in/agents",
  },
  openGraph: {
    title: "Agent Catalog — Buildr Studio",
    description: "Embeddable AI agents — subscribe and install with one script tag.",
    type: "website",
    url: "https://buildrstudio.in/agents",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agent Catalog — Buildr Studio",
    description: "Embeddable AI agents — subscribe and install with one script tag.",
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

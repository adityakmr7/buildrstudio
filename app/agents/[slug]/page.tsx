import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import AgentDetailHub from "./AgentDetailHub";
import { AGENT_CATALOG, getAgentProduct } from "../../lib/agentCatalog";
import { db } from "../../lib/db";

export function generateStaticParams() {
  return AGENT_CATALOG.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getAgentProduct(slug);
  if (!product) return {};

  const title = `${product.name} — Buildr Studio`;
  return {
    title,
    description: product.description,
    alternates: {
      canonical: `https://buildrstudio.in/agents/${product.slug}`,
    },
    openGraph: {
      title,
      description: product.description,
      type: "website",
      url: `https://buildrstudio.in/agents/${product.slug}`,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.description,
    },
  };
}

// Operational IDs (agent.id, tier.id, tier.paddlePriceId) needed to open a
// real checkout. Fetched separately from the static marketing data in
// agentCatalog.ts so this page still renders (with checkout disabled) if the
// database isn't migrated/seeded yet — see prisma/schema.prisma.
export interface OperationalAgent {
  id: string;
  tiers: { id: string; name: string; monthlyLimit: number; paddlePriceId: string | null }[];
}

async function getOperationalData(slug: string): Promise<OperationalAgent | null> {
  try {
    return await db.agent.findUnique({
      where: { slug },
      select: { id: true, tiers: { select: { id: true, name: true, monthlyLimit: true, paddlePriceId: true } } },
    });
  } catch (err) {
    console.error(`[agents/${slug}] could not load operational data:`, err);
    return null;
  }
}

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getAgentProduct(slug);
  if (!product) notFound();

  const dbAgent = await getOperationalData(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: `https://buildrstudio.in/agents/${product.slug}`,
    brand: { "@type": "Organization", name: "Buildr Studio" },
    offers: product.tiers.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      availability: product.status === "live" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
    })),
  };

  return (
    <>
      <Script
        id={`json-ld-agent-${product.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentDetailHub product={product} dbAgent={dbAgent} />
    </>
  );
}

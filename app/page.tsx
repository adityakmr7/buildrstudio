import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import AgencyLandingPage from "./components/AgencyLandingPage";

export const metadata: Metadata = {
  title: "Buildr Studio — AI Automation & Custom Software Agency",
  description:
    "We design, build, and deploy custom AI agents, n8n workflow automation, multi-agent systems, and RAG knowledge base pipelines that save businesses hundreds of manual hours.",
  alternates: {
    canonical: "https://buildrstudio.in",
  },
  openGraph: {
    title: "Buildr Studio — AI Automation & Custom Software Agency",
    description:
      "Custom AI agents, automated workflows, and context-aware RAG pipelines. Deployed in weeks, not months.",
    type: "website",
    url: "https://buildrstudio.in",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buildr Studio — AI Automation & Custom Software Agency",
    description:
      "Custom AI agents, n8n automation, and RAG pipelines that eliminate manual ops — deployed in 6 weeks.",
  },
  keywords: [
    "AI automation agency",
    "custom AI agents",
    "n8n automation",
    "Make workflow automation",
    "RAG pipeline",
    "multi-agent systems",
    "AI consulting",
    "workflow automation",
    "LLM integration",
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
      description:
        "AI Automation & Custom Software Agency — building custom AI agents, workflow automation, and RAG pipelines.",
      publisher: {
        "@type": "Organization",
        name: "Buildr Studio",
        url: "https://buildrstudio.in",
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://buildrstudio.in/#agency",
      name: "Buildr Studio",
      url: "https://buildrstudio.in",
      description:
        "We design, build, and deploy custom AI agents, automated n8n/Make workflows, context-aware RAG pipelines, and full-stack software integrations.",
      serviceType: [
        "AI Automation",
        "Custom Software Development",
        "Workflow Automation",
        "AI Agent Development",
      ],
      areaServed: "Worldwide",
      contactPoint: {
        "@type": "ContactPoint",
        email: "hello@buildrstudio.in",
        contactType: "customer service",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What does Buildr Studio build?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Buildr Studio builds custom AI agents, n8n and Make workflow automations, multi-agent systems, and RAG knowledge base integrations tailored to your business operations.",
          },
        },
        {
          "@type": "Question",
          name: "How long does a typical engagement take?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most projects go from initial AI Audit to production deployment in 6 weeks. The audit takes one week, build and integration takes 4 weeks, and deployment/handoff is week 6.",
          },
        },
        {
          "@type": "Question",
          name: "What industries does Buildr Studio serve?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We primarily serve mid-market B2B SaaS companies, E-commerce brands, Real Estate firms, and high-growth agencies looking to automate operational workflows with AI.",
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
        id="json-ld-agency"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense>
        <AgencyLandingPage />
      </Suspense>
    </>
  );
}

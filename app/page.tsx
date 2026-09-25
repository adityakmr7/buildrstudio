import type { Metadata } from "next";
import Script from "next/script";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";
import Hero from "./components/home/Hero";
import JobsMarquee from "./components/home/JobsMarquee";
import JobsSection from "./components/home/JobsSection";
import EmbedSection from "./components/home/EmbedSection";
import BuyVsBuild from "./components/home/BuyVsBuild";
import PricingStrip from "./components/home/PricingStrip";
import FaqSection, { FAQS } from "./components/home/FaqSection";
import CloseSection from "./components/home/CloseSection";
import { siteConfig } from "./lib/siteConfig";

const TITLE = "BuildrStudio — AI employees for your business";
const DESCRIPTION =
  "Skip the build. Keep the control. Deploy a pre-built AI agent for customer support or internal knowledge in minutes. One script tag, no AI team required.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: siteConfig.url,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
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
      name: "BuildrStudio",
      description: DESCRIPTION,
      publisher: {
        "@type": "Organization",
        name: "BuildrStudio",
        url: siteConfig.url,
        email: siteConfig.contact.email,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
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
      <SiteNav />
      <main>
        <Hero />
        <JobsMarquee />
        <JobsSection />
        <EmbedSection />
        <BuyVsBuild />
        <PricingStrip />
        <FaqSection />
        <CloseSection />
      </main>
      <SiteFooter />
    </>
  );
}

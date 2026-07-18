import type { Metadata } from "next";
import Script from "next/script";
import AppHeader from "@/app/components/AppHeader";
import AboutClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Aditya Kumar | Senior Software Engineer & Indie Maker",
  description:
    "Senior Software Engineer with 5+ years in Fintech & SaaS. Creator of BuildrStudio, Anchor, and Flowzy. Open to full-time and freelance opportunities.",
  robots: { index: false, follow: false },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aditya Kumar",
  jobTitle: "Senior Software Engineer",
  url: "https://buildrstudio.in/adityakmr7",
  image: "https://buildrstudio.in/aditya-avatar.png",
  sameAs: [
    "https://github.com/adityakmr7",
    "https://x.com/dev_adityakmr",
    "https://linkedin.com/in/adityakmr7",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Groww",
  },
  knowsAbout: ["React Native", "TypeScript", "Next.js", "AI/LLM", "Fintech"],
};

export default function AdityaPage() {
  return (
    <>
      <Script
        id="json-ld-person"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <AppHeader activeRoute="home" />
      <AboutClient />
    </>
  );
}

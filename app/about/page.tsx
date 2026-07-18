import type { Metadata } from "next";
import Script from "next/script";
import AppHeader from "@/app/components/AppHeader";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About — Aditya Kumar",
  description:
    "Senior Software Engineer & Indie Maker. 5+ years in Fintech & SaaS. Creator of BuildrStudio, Anchor, and Flowzy. Open to full-time and freelance.",
  alternates: { canonical: "https://buildrstudio.in/about" },
  openGraph: {
    title: "Aditya Kumar — Senior Software Engineer & Indie Maker",
    description:
      "5+ years building fintech and SaaS products. Creator of BuildrStudio, Anchor, and Flowzy. Open to work.",
    url: "https://buildrstudio.in/about",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Kumar — Senior Software Engineer & Indie Maker",
    description: "5+ years in Fintech & SaaS. Building developer tools. Open to work.",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aditya Kumar",
  jobTitle: "Senior Software Engineer",
  url: "https://buildrstudio.in/about",
  image: "https://buildrstudio.in/aditya-avatar.png",
  sameAs: [
    "https://github.com/adityakmr7",
    "https://x.com/@dev_adityakmr",
    "https://linkedin.com/in/adityakmr7",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Groww",
  },
  knowsAbout: ["React Native", "TypeScript", "Next.js", "AI/LLM", "Fintech"],
};

export default function AboutPage() {
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

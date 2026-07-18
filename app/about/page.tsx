import type { Metadata } from "next";
import Script from "next/script";
import AppHeader from "@/app/components/AppHeader";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About — BuildrStudio",
  description:
    "BuildrStudio is a free browser-based toolkit for indie developers — polished App Store screenshots and social graphics, no Figma required.",
  alternates: { canonical: "https://buildrstudio.in/about" },
  openGraph: {
    title: "About — BuildrStudio",
    description:
      "Why BuildrStudio exists, what we believe, and who's behind it.",
    url: "https://buildrstudio.in/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — BuildrStudio",
    description: "Free browser-based tools for launch-ready app visuals. Built by a developer, for developers.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "BuildrStudio", item: "https://buildrstudio.in" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://buildrstudio.in/about" },
  ],
};

export default function AboutPage() {
  return (
    <>
      <Script
        id="json-ld-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppHeader activeRoute="home" />
      <AboutClient />
    </>
  );
}

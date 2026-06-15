import type { Metadata } from "next";
import Script from "next/script";
import ChangelogGenerator from "./ChangelogGenerator";

export const metadata: Metadata = {
  title: "Changelog Card Generator",
  description:
    "Turn your changelog entries into beautiful, shareable social media cards. Perfect for announcing product updates on X/Twitter and LinkedIn.",
  alternates: {
    canonical: "https://buildrstudio.in/change-log",
  },
  openGraph: {
    title: "Changelog Card Generator — BuildrStudio",
    description:
      "Turn changelog entries into beautiful social cards. Announce product updates on X/Twitter and LinkedIn in seconds.",
    type: "website",
    url: "https://buildrstudio.in/change-log",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuildrStudio Changelog Card Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Changelog Card Generator — BuildrStudio",
    description:
      "Turn changelog entries into beautiful social cards. Announce product updates on X/Twitter and LinkedIn in seconds.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "BuildrStudio", item: "https://buildrstudio.in" },
    { "@type": "ListItem", position: 2, name: "Changelog", item: "https://buildrstudio.in/change-log" },
  ],
};

export default function ChangelogPage() {
  return (
    <>
      <Script
        id="json-ld-changelog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChangelogGenerator />
    </>
  );
}


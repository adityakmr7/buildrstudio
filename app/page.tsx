import type { Metadata } from "next";
import Script from "next/script";
import SaaSLandingPage from "./components/SaaSLandingPage";

export const metadata: Metadata = {
  title: "BuildrStudio — Beautiful Launch Assets for Developers & Indie Hackers",
  description:
    "Design high-converting App Store screenshot mockups, social graphics, and release changelog cards in seconds. Built for speed and visual excellence.",
  alternates: {
    canonical: "https://buildrstudio.in",
  },
  openGraph: {
    title: "BuildrStudio — Beautiful Launch Visuals",
    description:
      "Design high-converting App Store mockups, social graphics, and release changelog cards in seconds.",
    type: "website",
    url: "https://buildrstudio.in",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuildrStudio Creative Suite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BuildrStudio — Beautiful Launch Visuals",
    description:
      "Design high-converting App Store mockups, social graphics, and release changelog cards in seconds.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://buildrstudio.in/#website",
      "url": "https://buildrstudio.in",
      "name": "BuildrStudio",
      "description":
        "Creative asset generation suite for developer screenshots, social graphic optimization, and App Store mockups.",
      "publisher": {
        "@type": "Person",
        "name": "Aditya Kumar",
      },
    },
    {
      "@type": "WebApplication",
      "@id": "https://buildrstudio.in/#webapp",
      "url": "https://buildrstudio.in",
      "name": "BuildrStudio Creative Suite",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires CSS3/HTML5",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "description":
        "Instant design asset generator for product builders. Create App Store mockups, social media optimized screenshots, and release changelog graphics.",
    },
  ],
};

export default function Home() {
  return (
    <>
      <Script
        id="json-ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SaaSLandingPage />
    </>
  );
}

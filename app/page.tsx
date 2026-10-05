import type { Metadata } from "next";
import Script from "next/script";
import CompanySite from "./components/CompanySite";
import { siteConfig } from "./lib/siteConfig";

export const metadata: Metadata = {
  title: { absolute: "BuildrStudio | Thoughtfully built. Human at heart." },
  description: siteConfig.description,
  alternates: { canonical: siteConfig.url },
  openGraph: { title: "BuildrStudio | Independent product company", description: siteConfig.description, url: siteConfig.url, type: "website" },
  twitter: { card: "summary", title: "BuildrStudio", description: siteConfig.description },
};
export default function Home() {
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": `${siteConfig.url}/#organization`, name: "BuildrStudio", url: siteConfig.url, description: siteConfig.description, logo: `${siteConfig.url}/brand/assets/buildrstudio-mark.svg`, email: siteConfig.contact.email, founder: { "@type": "Person", name: siteConfig.author.name } },
    { "@type": "WebSite", name: "BuildrStudio", url: siteConfig.url, publisher: { "@id": `${siteConfig.url}/#organization` } },
  ] };
  return <><Script id="company-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><CompanySite /></>;
}

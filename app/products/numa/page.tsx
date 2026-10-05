import type { Metadata } from "next";
import Script from "next/script";
import CompanySite from "../../components/CompanySite";
import { siteConfig } from "../../lib/siteConfig";
const title = "Numa | Pregnancy & baby companion";
const description = "Meet Numa, a pregnancy and baby companion by BuildrStudio. Explore the product and join Android internal testing through Google Play.";
const url = `${siteConfig.url}/products/numa`;
export const metadata: Metadata = {
  title: { absolute: title }, description, alternates: { canonical: url },
  openGraph: { title, description, url, type: "website", images: [{ url: "/brand/assets/numa-companion.png", width: 1536, height: 1024, alt: "Numa companion concept" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/brand/assets/numa-companion.png"] },
};
export default function NumaPage() {
  return <><Script id="numa-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: title, description, url, isPartOf: { "@type": "WebSite", name: "BuildrStudio", url: siteConfig.url } }) }} /><CompanySite product /></>;
}

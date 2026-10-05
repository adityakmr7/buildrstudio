import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Wordmark from "../../../components/Wordmark";
import { policyHtml } from "./policy";

const url = "https://www.buildrstudio.in/products/numa/privacy";
const title = "Numa Privacy Policy | Draft for review";
const description = "Draft privacy policy for Numa’s Android beta: device records, optional accounts, encrypted backups, sharing, retention and deletion.";
export const metadata: Metadata = {
  title: { absolute: title }, description,
  robots: { index: false, follow: true },
  alternates: { canonical: url },
  openGraph: { title, description, url, type: "website" },
  twitter: { card: "summary", title, description },
};

export default function NumaPrivacyPage() {
  return <div className="numa-privacy">
    <Script id="numa-privacy-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: title, description, url }) }} />
    <header><Wordmark /><Link href="/products/numa">About Numa</Link></header>
    <main dangerouslySetInnerHTML={{ __html: policyHtml }} />
    <footer>Draft for owner review · Numa privacy policy<br /><Link href="/products/numa">Back to Numa</Link></footer>
    <style>{`
      .numa-privacy{color:var(--text);background:var(--bg);min-height:100dvh;font-family:var(--font-sans)}
      .numa-privacy *{box-sizing:border-box}.numa-privacy header,.numa-privacy main,.numa-privacy footer{max-width:800px;margin:auto;padding:28px 24px}
      .numa-privacy header{border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:20px;font-size:14px}
      .numa-privacy a{color:var(--accent);text-decoration:underline;text-underline-offset:4px}.numa-privacy header a:first-child{text-decoration:none}
      .numa-privacy main{padding-top:48px}.numa-privacy h1,.numa-privacy h2{line-height:1.2;letter-spacing:-.03em}
      .numa-privacy h1{font-family:Georgia,serif;font-weight:400;font-size:clamp(38px,7vw,56px);margin:0 0 14px}.numa-privacy h2{font-size:23px;margin:40px 0 16px;font-weight:600}
      .numa-privacy p,.numa-privacy li{font-size:16px;line-height:1.75;color:var(--muted)}.numa-privacy p{margin:16px 0}.numa-privacy li{margin:8px 0}.numa-privacy strong{color:var(--text)}
      .numa-privacy .label{font-size:12px;text-transform:uppercase;letter-spacing:.12em}
      .numa-privacy .review{border:1px solid #D8C99E;background:#FFF8E8;border-radius:12px;padding:18px 22px;margin:28px 0}.numa-privacy .review p{margin:0;font-size:14px}
      .numa-privacy .summary{background:var(--accent-soft);padding:20px 24px;border-radius:12px}.numa-privacy ul{list-style:disc;padding-left:20px}.numa-privacy .summary ul{margin:0}
      .numa-privacy table{border-collapse:collapse;width:100%;font-size:14px}.numa-privacy th,.numa-privacy td{text-align:left;vertical-align:top;padding:14px 12px;border-bottom:1px solid var(--border);line-height:1.7;color:var(--muted)}.numa-privacy th{background:var(--surface-alt);color:var(--text)}
      .numa-privacy footer{margin-top:40px;border-top:1px solid var(--border);font-size:13px;color:var(--muted)}.numa-privacy a:focus-visible{outline:3px solid var(--accent);outline-offset:5px}
      @media(max-width:500px){.numa-privacy header,.numa-privacy main,.numa-privacy footer{padding-left:20px;padding-right:20px}.numa-privacy header{flex-wrap:wrap}.numa-privacy table,.numa-privacy tbody,.numa-privacy tr,.numa-privacy th,.numa-privacy td{display:block}.numa-privacy th{display:none}.numa-privacy td:first-child{font-weight:600;border-bottom:0;padding-bottom:0;color:var(--text)}.numa-privacy td:last-child{padding-top:6px}.numa-privacy a{overflow-wrap:anywhere}}
    `}</style>
  </div>;
}

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "../lib/siteConfig";

export const metadata: Metadata = {
  title: "Terms and Conditions | BuildrStudio",
  description: "Terms and conditions for using the BuildrStudio website and overview of our independent product terms.",
  alternates: { canonical: `${siteConfig.url}/terms` },
  openGraph: {
    title: "Terms and Conditions — BuildrStudio",
    description: "Terms and conditions for BuildrStudio and our products.",
    type: "website",
    url: `${siteConfig.url}/terms`,
  },
};

const wrap = { maxWidth: 1240, margin: "0 auto", padding: "0 32px" };

export default function TermsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Terms and Conditions", item: `${siteConfig.url}/terms` },
    ],
  };

  return (
    <div className="company-site" style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100dvh" }}>
      <Script
        id="terms-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="company-nav" style={wrap}>
          <Link href="/" className="company-wordmark" aria-label="BuildrStudio home">
            <Image src="/brand/assets/buildrstudio-mark.svg" alt="" width={34} height={34} />
            buildrstudio
          </Link>
          <nav aria-label="Primary" style={{ display: "flex", gap: 28 }}>
            <Link href="/#products">Products</Link>
            <Link href="/#about">About</Link>
            <a href={`mailto:${siteConfig.contact.email}`}>Say hello <span aria-hidden="true">↗</span></a>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 80px" }}>
        <Link className="company-back" href="/" style={{ display: "inline-block", fontSize: 13, marginBottom: 32 }}>
          ← Back to BuildrStudio
        </Link>

        <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: "clamp(40px, 6vw, 56px)", letterSpacing: "-2px", margin: "0 0 12px" }}>
          Terms & Conditions
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 40px" }}>
          Last updated: October 2026
        </p>

        <section style={{ lineHeight: 1.8, color: "var(--muted)", fontSize: 16 }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 24, letterSpacing: "-0.5px", color: "var(--text)", margin: "40px 0 12px" }}>
            1. Overview
          </h2>
          <p>
            Welcome to BuildrStudio (buildrstudio.in). BuildrStudio is an independent product studio founded by Aditya Kumar. By accessing or using this website, you agree to comply with and be bound by these Terms and Conditions.
          </p>

          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 24, letterSpacing: "-0.5px", color: "var(--text)", margin: "40px 0 12px" }}>
            2. Intellectual Property
          </h2>
          <p>
            All original content, visual design, brand marks, and software on this website and within our products are the intellectual property of BuildrStudio and Aditya Kumar, protected by applicable copyright, trademark, and other intellectual property laws.
          </p>

          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 24, letterSpacing: "-0.5px", color: "var(--text)", margin: "40px 0 12px" }}>
            3. Product Terms & Disclaimers
          </h2>
          <p>
            Individual products published by BuildrStudio (such as Numa, ArrowOut, and Pulseflip) have their own terms of use and platform end user license agreements (EULAs):
          </p>
          <ul style={{ paddingLeft: 24, margin: "16px 0" }}>
            <li style={{ marginBottom: 8 }}>
              <strong>ArrowOut:</strong> Governed by Apple&apos;s Standard EULA and the{" "}
              <Link href="/products/arrow-out/terms" style={{ textDecoration: "underline", color: "var(--text)" }}>
                ArrowOut Terms of Use
              </Link>.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Pulseflip:</strong> Governed by Apple&apos;s Standard EULA and the{" "}
              <Link href="/products/pulse-flip/terms" style={{ textDecoration: "underline", color: "var(--text)" }}>
                Pulseflip Terms of Use
              </Link>.
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Numa:</strong> Distributed as an Android internal beta via Google Play under Google Play terms.
            </li>
          </ul>

          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 24, letterSpacing: "-0.5px", color: "var(--text)", margin: "40px 0 12px" }}>
            4. Limitation of Liability
          </h2>
          <p>
            This website and information are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. BuildrStudio shall not be liable for any indirect, incidental, or consequential damages arising from your access to or use of this website.
          </p>

          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 24, letterSpacing: "-0.5px", color: "var(--text)", margin: "40px 0 12px" }}>
            5. Contact Information
          </h2>
          <p>
            For questions or concerns regarding these terms, please contact us at{" "}
            <a href={`mailto:${siteConfig.contact.email}`} style={{ textDecoration: "underline", color: "var(--text)" }}>
              {siteConfig.contact.email}
            </a>.
          </p>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid var(--border)" }}>
        <div className="company-footer" style={wrap}>
          <Link className="company-wordmark" href="/">
            <Image src="/brand/assets/buildrstudio-mark.svg" alt="" width={28} height={28} />
            buildrstudio
          </Link>
          <span>Independent products. Thoughtfully built.</span>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>

      <style>{`
        .company-site { font-family: var(--font-sans); }
        .company-site a { color: inherit; text-decoration: none; }
        .company-site a:focus-visible { outline: 3px solid var(--accent); outline-offset: 6px; }
        .company-nav { height: 80px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
        .company-wordmark { display: flex; align-items: center; gap: 10px; font-size: 24px; font-weight: 650; letter-spacing: -1px; }
        .company-nav nav { font-size: 13px; }
        .company-footer { display: flex; align-items: center; justify-content: space-between; gap: 25px; min-height: 100px; font-size: 12px; color: var(--muted); }
        .company-footer > div { display: flex; gap: 24px; }
        .company-footer .company-wordmark { font-size: 20px; color: var(--text); }
        @media(max-width: 760px) {
          .company-nav { height: 72px; }
          .company-wordmark { font-size: 20px; }
          .company-nav nav { gap: 16px !important; font-size: 12px; }
          .company-footer { flex-wrap: wrap; padding-top: 24px !important; padding-bottom: 24px !important; }
        }
      `}</style>
    </div>
  );
}

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "../lib/siteConfig";

export const metadata: Metadata = {
  title: "Privacy Policy | BuildrStudio",
  description: "Privacy policy for BuildrStudio. How we handle information across our company website and independent products.",
  alternates: { canonical: `${siteConfig.url}/privacy` },
  openGraph: {
    title: "Privacy Policy — BuildrStudio",
    description: "Privacy policy for BuildrStudio and our independent products.",
    type: "website",
    url: `${siteConfig.url}/privacy`,
  },
};

const wrap = { maxWidth: 1240, margin: "0 auto", padding: "0 32px" };

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${siteConfig.url}/privacy` },
    ],
  };

  return (
    <div className="company-site" style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100dvh" }}>
      <Script
        id="privacy-jsonld"
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
          Privacy Policy
        </h1>
        <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 40px" }}>
          Last updated: October 2026
        </p>

        <section style={{ lineHeight: 1.8, color: "var(--muted)", fontSize: 16 }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 24, letterSpacing: "-0.5px", color: "var(--text)", margin: "40px 0 12px" }}>
            1. Who We Are
          </h2>
          <p>
            BuildrStudio is an independent digital product company founded by Aditya Kumar, based in India. We design and build independent applications and digital experiences, including Numa, ArrowOut, and Pulseflip.
          </p>

          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 24, letterSpacing: "-0.5px", color: "var(--text)", margin: "40px 0 12px" }}>
            2. Website Usage & Analytics
          </h2>
          <p>
            This marketing website (buildrstudio.in) uses privacy-respecting analytics tools (Vercel Analytics and Umami) to collect anonymous usage and performance metrics (such as aggregate page views and browser device categories). These tools do not use tracking cookies and do not collect personally identifiable information.
          </p>

          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 24, letterSpacing: "-0.5px", color: "var(--text)", margin: "40px 0 12px" }}>
            3. Product-Specific Privacy Policies
          </h2>
          <p>
            Each of our independent products has its own privacy practices tailored to its functionality, device permissions, and platform requirements. Please consult the dedicated privacy policies for specific products:
          </p>
          <ul style={{ paddingLeft: 24, margin: "16px 0" }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Numa:</strong>{" "}
              <Link href="/products/numa/privacy" style={{ textDecoration: "underline", color: "var(--text)" }}>
                Numa Privacy Policy
              </Link>
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>ArrowOut:</strong>{" "}
              <Link href="/products/arrow-out/privacy" style={{ textDecoration: "underline", color: "var(--text)" }}>
                ArrowOut Privacy Policy
              </Link>
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Pulseflip:</strong>{" "}
              <Link href="/products/pulse-flip/privacy" style={{ textDecoration: "underline", color: "var(--text)" }}>
                Pulseflip Privacy Policy
              </Link>
            </li>
          </ul>

          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 24, letterSpacing: "-0.5px", color: "var(--text)", margin: "40px 0 12px" }}>
            4. Communications & Support
          </h2>
          <p>
            If you contact us via email, we use the information you provide (such as your email address and message content) solely to respond to your inquiry and provide assistance. We do not sell or share your contact information with third parties for marketing purposes.
          </p>

          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 24, letterSpacing: "-0.5px", color: "var(--text)", margin: "40px 0 12px" }}>
            5. Your Rights & Inquiries
          </h2>
          <p>
            You have the right to request access to or deletion of any personal communications you have sent to us. If you have questions regarding this privacy policy or wish to exercise your rights, please reach out to us at{" "}
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

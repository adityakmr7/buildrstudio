import { siteConfig } from "@/app/lib/siteConfig";
import type { Metadata } from "next";
import Script from "next/script";
import AppHeader from "../components/AppHeader";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and conditions for BuildrStudio, the free App Store screenshot generator and social media mockup tool. Usage rules, subscriptions, and IP.",
  alternates: { canonical: "https://buildrstudio.in/terms" },
  openGraph: {
    title: "Terms and Conditions — BuildrStudio",
    description: "Terms and conditions for using BuildrStudio.",
    type: "website",
    url: "https://buildrstudio.in/terms",
  },
  twitter: { card: "summary", title: "Terms — BuildrStudio" },
};

export default function TermsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://buildrstudio.in" },
      { "@type": "ListItem", position: 2, name: "Terms and Conditions", item: "https://buildrstudio.in/terms" },
    ],
  };

  return (
    <>
      <Script
        id="terms-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`
        .legal-page {
          max-width: 720px;
          margin: 0 auto;
          padding: 48px 24px 80px;
          font-family: var(--font);
          color: var(--text-1);
        }
        .legal-page h1 {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 8px;
        }
        .legal-date {
          font-size: 13px;
          color: var(--text-3);
          margin-bottom: 40px;
        }
        .legal-page h2 {
          font-size: 20px;
          font-weight: 700;
          margin-top: 36px;
          margin-bottom: 12px;
          letter-spacing: -0.3px;
        }
        .legal-page p, .legal-page li {
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-2);
        }
        .legal-page ul {
          padding-left: 20px;
          margin: 12px 0;
        }
        .legal-page li {
          margin-bottom: 6px;
        }
        .legal-page a {
          color: var(--fill);
          text-decoration: underline;
        }
        .legal-footer {
          margin-top: 60px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
          display: flex;
          gap: 24px;
          font-size: 13px;
        }
        .legal-footer a {
          color: var(--text-3);
          text-decoration: none;
        }
        .legal-footer a:hover {
          color: var(--text-1);
        }
      `}</style>

      <AppHeader activeRoute="home" />

      <div className="legal-page">
        <h1>Terms and Conditions</h1>
        <p className="legal-date">Last updated: June 23, 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using BuildrStudio (&quot;the Service&quot;), operated by Aditya Kumar
          (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), you agree to be bound by these Terms and
          Conditions. If you do not agree, do not use the Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          BuildrStudio is a suite of browser-based developer tools for creating App Store screenshot
          mockups, social media graphics, and changelog cards. The Service offers both free and paid
          (Pro) tiers.
        </p>

        <h2>3. Account Registration</h2>
        <p>
          To access Pro features, you must create an account using Google OAuth. You are responsible
          for maintaining the security of your account. You must provide accurate information during
          registration.
        </p>

        <h2>4. Pro Subscription</h2>
        <ul>
          <li>Pro subscriptions are billed monthly at the price displayed at checkout.</li>
          <li>Payment is processed securely through Paddle, our payment processor (Paddle acts as merchant of record).</li>
          <li>Your subscription renews automatically each month until cancelled.</li>
          <li>You may cancel your subscription at any time from your Paddle customer portal.</li>
        </ul>

        <h2>5. Free Tier</h2>
        <p>
          The free tier includes access to all tools with certain limitations (watermarked exports,
          limited device frames). Free users are not required to create an account.
        </p>

        <h2>6. Intellectual Property</h2>
        <ul>
          <li>You retain full ownership of all screenshots and images you upload to the Service.</li>
          <li>Graphics and exports you create using BuildrStudio are yours to use commercially.</li>
          <li>The BuildrStudio brand, logo, and source code remain our intellectual property.</li>
        </ul>

        <h2>7. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any unlawful purpose.</li>
          <li>Attempt to reverse-engineer, decompile, or hack the Service.</li>
          <li>Upload content that infringes on third-party intellectual property rights.</li>
          <li>Resell or redistribute the Service without written permission.</li>
        </ul>

        <h2>8. Limitation of Liability</h2>
        <p>
          The Service is provided &quot;as is&quot; without warranties of any kind. We are not liable
          for any indirect, incidental, or consequential damages arising from your use of the Service.
          Our total liability shall not exceed the amount you paid us in the 12 months preceding the
          claim.
        </p>

        <h2>9. Termination</h2>
        <p>
          We may suspend or terminate your account if you violate these terms. You may delete your
          account at any time by contacting us. Upon termination, your right to use Pro features
          ceases immediately.
        </p>

        <h2>10. Changes to Terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the Service after changes
          constitutes acceptance of the new terms. We will notify registered users of material changes
          via email.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These terms are governed by the laws of India. Any disputes shall be subject to the
          exclusive jurisdiction of the courts in India.
        </p>

        <h2>12. Contact</h2>
        <p>
          For questions about these terms, contact us at{" "}
          <a href={`mailto:${siteConfig.author.email}`}>{siteConfig.author.email}</a>.
        </p>

        <div className="legal-footer">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/refund">Refund Policy</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/">Home</Link>
        </div>
      </div>
    </>
  );
}

import { siteConfig } from "@/app/lib/siteConfig";
import type { Metadata } from "next";
import Script from "next/script";
import AppHeader from "../components/AppHeader";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Refund policy for BuildrStudio Pro and Launch Pack subscriptions. Fair cancellation terms, pro-rated refunds, and transparent billing practices.",
  alternates: { canonical: "https://buildrstudio.in/refund" },
  openGraph: {
    title: "Refund Policy — BuildrStudio",
    description: "Refund policy for BuildrStudio Pro subscriptions.",
    type: "website",
    url: "https://buildrstudio.in/refund",
  },
  twitter: { card: "summary", title: "Refund Policy — BuildrStudio" },
};

export default function RefundPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://buildrstudio.in" },
      { "@type": "ListItem", position: 2, name: "Refund Policy", item: "https://buildrstudio.in/refund" },
    ],
  };

  return (
    <>
      <Script
        id="refund-jsonld"
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
        .refund-highlight {
          background: var(--fill-subtle);
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          padding: 20px 24px;
          margin: 20px 0;
        }
        .refund-highlight p {
          margin: 0;
          font-weight: 600;
          color: var(--text-1);
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
        <h1>Refund Policy</h1>
        <p className="legal-date">Last updated: June 23, 2026</p>

        <div className="refund-highlight">
          <p>
            We want you to be happy with BuildrStudio Pro. If it&apos;s not working out, we offer a
            full refund within 7 days of your first payment — no questions asked.
          </p>
        </div>

        <h2>1. 7-Day Money-Back Guarantee</h2>
        <p>
          If you subscribe to BuildrStudio Pro and are not satisfied for any reason, you can request
          a full refund within <strong>7 days</strong> of your first payment. This applies to your
          initial subscription payment only.
        </p>

        <h2>2. How to Request a Refund</h2>
        <p>To request a refund:</p>
        <ul>
          <li>
            Email us at <a href={`mailto:${siteConfig.author.email}`}>{siteConfig.author.email}</a> with
            your account email and the reason for your refund (optional but helps us improve).
          </li>
          <li>We will process your refund within 5–7 business days.</li>
          <li>The refund will be credited back to your original payment method.</li>
        </ul>

        <h2>3. After the 7-Day Window</h2>
        <p>
          After the 7-day refund window, refunds are not available for the current billing period.
          However, you can:
        </p>
        <ul>
          <li>
            <strong>Cancel anytime</strong> — your Pro access continues until the end of your current
            billing period.
          </li>
          <li>
            <strong>No further charges</strong> — once cancelled, you will not be billed again.
          </li>
          <li>
            <strong>Downgrade gracefully</strong> — you keep Pro features until your paid period ends,
            then return to the free tier.
          </li>
        </ul>

        <h2>4. How to Cancel Your Subscription</h2>
        <p>You can cancel your Pro subscription at any time:</p>
        <ul>
          <li>Through the Paddle customer portal (link in your subscription email).</li>
          <li>By emailing us at <a href={`mailto:${siteConfig.author.email}`}>{siteConfig.author.email}</a>.</li>
        </ul>

        <h2>5. Exceptions</h2>
        <ul>
          <li>
            Refunds are not available if we detect abuse of the refund policy (e.g., repeated
            subscribe-and-refund cycles).
          </li>
          <li>
            Chargebacks filed without first contacting us may result in account suspension.
          </li>
        </ul>

        <h2>6. Contact</h2>
        <p>
          For refund requests or billing questions, email{" "}
          <a href={`mailto:${siteConfig.author.email}`}>{siteConfig.author.email}</a>. We typically respond
          within 24 hours.
        </p>

        <div className="legal-footer">
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/">Home</Link>
        </div>
      </div>
    </>
  );
}

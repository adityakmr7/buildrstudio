import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import AppHeader from "../components/AppHeader";
import ToolCrossLinks from "../components/ToolCrossLinks";
import FaqAccordion from "./FaqAccordion";

export const metadata: Metadata = {
  title: "Support — BuildrStudio",
  description:
    "Get help with BuildrStudio. Find answers to common questions, report a bug, or book a call with the founder.",
  alternates: { canonical: "https://buildrstudio.in/support" },
  openGraph: {
    title: "Support — BuildrStudio",
    description:
      "Get help with BuildrStudio. Find answers to common questions or reach out directly.",
    type: "website",
    url: "https://buildrstudio.in/support",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "BuildrStudio", item: "https://buildrstudio.in" },
    { "@type": "ListItem", position: 2, name: "Support", item: "https://buildrstudio.in/support" },
  ],
};

export default function SupportPage() {
  return (
    <>
      <Script
        id="json-ld-support"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="ink-app">
        <AppHeader activeRoute="home" />

        <style>{`
          .support-wrap {
            max-width: 720px;
            margin: 0 auto;
            padding: 64px 24px 96px;
          }
          .support-eyebrow {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--fill);
            margin-bottom: 10px;
          }
          .support-title {
            font-size: clamp(28px, 5vw, 40px);
            font-weight: 800;
            color: var(--text-1);
            letter-spacing: -0.04em;
            line-height: 1.1;
            margin: 0 0 12px;
          }
          .support-subtitle {
            font-size: 15px;
            color: var(--text-3);
            line-height: 1.6;
            margin: 0 0 52px;
          }

          /* Contact cards */
          .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 14px;
            margin-bottom: 60px;
          }
          .contact-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 22px 20px;
            text-decoration: none;
            display: flex;
            flex-direction: column;
            gap: 10px;
            transition: all 0.15s ease;
          }
          .contact-card:hover {
            border-color: var(--fill);
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          }
          .contact-card-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--fill);
            background: var(--fill-subtle);
          }
          .contact-card-title {
            font-size: 14px;
            font-weight: 700;
            color: var(--text-1);
            margin: 0;
          }
          .contact-card-desc {
            font-size: 12px;
            color: var(--text-3);
            margin: 0;
            line-height: 1.5;
          }

          /* FAQ */
          .faq-section-title {
            font-size: 20px;
            font-weight: 800;
            color: var(--text-1);
            letter-spacing: -0.03em;
            margin: 0 0 24px;
          }
          .faq-list {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .faq-item {
            border: 1px solid var(--border);
            border-radius: 12px;
            overflow: hidden;
            background: var(--surface);
          }
          .faq-q {
            width: 100%;
            background: none;
            border: none;
            padding: 18px 20px;
            font-size: 14px;
            font-weight: 600;
            color: var(--text-1);
            text-align: left;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            font-family: var(--font);
            transition: background 0.1s;
          }
          .faq-q:hover {
            background: var(--surface-2);
          }
          .faq-q[aria-expanded="true"] {
            color: var(--fill);
          }
          .faq-chevron {
            flex-shrink: 0;
            transition: transform 0.2s ease;
            color: var(--text-3);
          }
          .faq-q[aria-expanded="true"] .faq-chevron {
            transform: rotate(180deg);
            color: var(--fill);
          }
          .faq-a {
            font-size: 14px;
            color: var(--text-2);
            line-height: 1.65;
            padding: 0 20px 18px;
            display: none;
          }
          .faq-a.open {
            display: block;
          }

          /* Still stuck */
          .stuck-banner {
            margin-top: 52px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 32px;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .stuck-title {
            font-size: 17px;
            font-weight: 700;
            color: var(--text-1);
            margin: 0;
          }
          .stuck-desc {
            font-size: 14px;
            color: var(--text-3);
            line-height: 1.6;
            margin: 0 0 12px;
          }
          .stuck-email {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            font-size: 14px;
            font-weight: 600;
            color: var(--fill);
            text-decoration: none;
          }
          .stuck-email:hover { text-decoration: underline; }
        `}</style>

        <div className="support-wrap">
          <p className="support-eyebrow">Help Center</p>
          <h1 className="support-title">How can we help?</h1>
          <p className="support-subtitle">
            Find answers to common questions below, or reach out directly. Most issues are resolved
            same-day.
          </p>

          {/* Contact options */}
          <div className="contact-grid">
            <a href="mailto:support@buildrstudio.in" className="contact-card">
              <div className="contact-card-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <p className="contact-card-title">Email Support</p>
              <p className="contact-card-desc">
                support@buildrstudio.in — replies within a few hours
              </p>
            </a>

            <a
              href="https://cal.com/adityakmr7"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
            >
              <div className="contact-card-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <p className="contact-card-title">Book a Call</p>
              <p className="contact-card-desc">
                30-min call with the founder — for Pro users and feedback
              </p>
            </a>

            <a
              href="https://twitter.com/adityakmr7"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
            >
              <div className="contact-card-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.843L1.255 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <p className="contact-card-title">DM on X</p>
              <p className="contact-card-desc">
                @buildrstudio — quick questions and feedback welcome
              </p>
            </a>

            <Link href="/roadmap" className="contact-card">
              <div className="contact-card-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </div>
              <p className="contact-card-title">Feature Requests</p>
              <p className="contact-card-desc">
                Vote on what gets built next on the public roadmap
              </p>
            </Link>
          </div>

          {/* FAQ */}
          <h2 className="faq-section-title">Frequently asked questions</h2>
          <FaqAccordion />

          {/* Still stuck */}
          <div className="stuck-banner">
            <p className="stuck-title">Still stuck?</p>
            <p className="stuck-desc">
              If you didn&apos;t find what you needed above, just email — every message is read and
              replied to by the founder directly.
            </p>
            <a href="mailto:support@buildrstudio.in" className="stuck-email">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              support@buildrstudio.in
            </a>
          </div>
        </div>

        <ToolCrossLinks current="/support" />
      </div>
    </>
  );
}

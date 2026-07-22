import { siteConfig } from "@/app/lib/siteConfig";
import type { Metadata } from "next";
import Script from "next/script";
import AppHeader from "../components/AppHeader";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for BuildrStudio, the free App Store screenshot generator. Learn how we collect, use, and protect your data. GDPR compliant.",
  alternates: { canonical: "https://buildrstudio.in/privacy" },
  openGraph: {
    title: "Privacy Policy — BuildrStudio",
    description: "How BuildrStudio collects, uses, and protects your data.",
    type: "website",
    url: "https://buildrstudio.in/privacy",
  },
};

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://buildrstudio.in" },
      { "@type": "ListItem", position: 2, name: "Privacy Policy", item: "https://buildrstudio.in/privacy" },
    ],
  };

  return (
    <>
      <Script
        id="privacy-jsonld"
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
        .legal-page h3 {
          font-size: 16px;
          font-weight: 600;
          margin-top: 20px;
          margin-bottom: 8px;
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
        .legal-table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          font-size: 14px;
        }
        .legal-table th, .legal-table td {
          text-align: left;
          padding: 10px 14px;
          border: 1px solid var(--border);
        }
        .legal-table th {
          background: var(--fill-subtle);
          font-weight: 600;
          color: var(--text-1);
        }
        .legal-table td {
          color: var(--text-2);
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
        <h1>Privacy Policy</h1>
        <p className="legal-date">Last updated: June 23, 2026</p>

        <h2>1. Introduction</h2>
        <p>
          BuildrStudio (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. This
          policy explains what data we collect, why, and how we protect it. BuildrStudio is operated
          by Aditya Kumar from India.
        </p>

        <h2>2. Data We Collect</h2>

        <table className="legal-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>When</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Name, email, profile picture</td>
              <td>Google Sign-In</td>
              <td>Account creation, subscription management</td>
            </tr>
            <tr>
              <td>Email address</td>
              <td>Waitlist / interest forms</td>
              <td>Product updates, launch notifications</td>
            </tr>
            <tr>
              <td>Payment info</td>
              <td>Pro subscription</td>
              <td>Processed by Paddle — we never see your card details</td>
            </tr>
            <tr>
              <td>Usage analytics</td>
              <td>Page visits</td>
              <td>Improving the product (via Vercel Analytics &amp; Umami)</td>
            </tr>
          </tbody>
        </table>

        <h2>3. Data We Do NOT Collect</h2>
        <ul>
          <li>
            <strong>Your screenshots and images</strong> — all image processing happens entirely in
            your browser. We never upload, store, or access your screenshots on our servers.
          </li>
          <li>
            <strong>Your designs and exports</strong> — everything you create stays on your device.
          </li>
        </ul>

        <h2>4. How We Use Your Data</h2>
        <ul>
          <li>To create and maintain your account.</li>
          <li>To process Pro subscription payments via Paddle.</li>
          <li>To send product updates if you opted in via waitlist forms.</li>
          <li>To improve the Service through anonymous usage analytics.</li>
        </ul>

        <h2>5. Third-Party Services</h2>
        <p>We share limited data with these trusted services:</p>
        <ul>
          <li><strong>Google OAuth</strong> — authentication (name, email, profile picture)</li>
          <li><strong>Paddle</strong> — payment processing and merchant of record (email, subscription data)</li>
          <li><strong>Neon (PostgreSQL)</strong> — database hosting (account and subscription records)</li>
          <li><strong>Vercel</strong> — hosting and analytics (anonymous usage data)</li>
          <li><strong>Umami</strong> — privacy-focused analytics (no personal data, no cookies)</li>
        </ul>

        <h2>6. Cookies</h2>
        <p>
          We use minimal cookies for authentication (session token) and theme preference. We do not
          use advertising cookies or third-party tracking cookies. Umami analytics is cookie-free.
        </p>

        <h2>7. Data Retention</h2>
        <ul>
          <li>Account data is retained as long as your account is active.</li>
          <li>Waitlist emails are retained until the feature launches or you request removal.</li>
          <li>You can request deletion of all your data by emailing us.</li>
        </ul>

        <h2>8. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion of your data.</li>
          <li>Withdraw consent for marketing emails at any time.</li>
        </ul>

        <h2>9. Data Security</h2>
        <p>
          We use industry-standard security measures including encrypted connections (HTTPS), secure
          authentication (OAuth 2.0 + JWT), and HMAC-verified webhooks. Your payment data is handled
          entirely by Paddle and never touches our servers.
        </p>

        <h2>10. Children&apos;s Privacy</h2>
        <p>
          BuildrStudio is not intended for users under 13 years of age. We do not knowingly collect
          data from children.
        </p>

        <h2>11. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify registered users of
          material changes via email.
        </p>

        <h2>12. Contact</h2>
        <p>
          For privacy-related questions or data requests, contact us at{" "}
          <a href={`mailto:${siteConfig.author.email}`}>{siteConfig.author.email}</a>.
        </p>

        <div className="legal-footer">
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/refund">Refund Policy</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/">Home</Link>
        </div>
      </div>
    </>
  );
}

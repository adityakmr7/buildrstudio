import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Buildr Studio, the AI automation & custom software agency. Learn how we collect, use, and protect your data.",
  alternates: { canonical: "https://buildrstudio.in/privacy" },
  openGraph: {
    title: "Privacy Policy — Buildr Studio",
    description: "How Buildr Studio collects, uses, and protects your data.",
    type: "website",
    url: "https://buildrstudio.in/privacy",
  },
};

const CONTACT_EMAIL = "hello@buildrstudio.in";

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
        .legal-wrap {
          max-width: 720px;
          margin: 0 auto;
          padding: 80px 24px 80px;
          font-family: var(--font-dm-sans, sans-serif);
          color: rgba(245,245,245,0.85);
        }
        .legal-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: rgba(245,245,245,0.40);
          text-decoration: none;
          margin-bottom: 40px;
          transition: color .2s;
        }
        .legal-back:hover { color: #F5F5F5; }
        .legal-wrap h1 {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #F5F5F5;
          margin-bottom: 8px;
        }
        .legal-date {
          font-size: 13px;
          color: rgba(245,245,245,0.35);
          margin-bottom: 44px;
        }
        .legal-wrap h2 {
          font-size: 18px;
          font-weight: 600;
          color: #F5F5F5;
          margin-top: 36px;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .legal-wrap p, .legal-wrap li {
          font-size: 15px;
          line-height: 1.75;
          color: rgba(245,245,245,0.55);
        }
        .legal-wrap ul {
          padding-left: 20px;
          margin: 10px 0;
        }
        .legal-wrap li { margin-bottom: 5px; }
        .legal-wrap a {
          color: #3B82F6;
          text-decoration: underline;
          text-underline-offset: 3px;
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
          border: 1px solid rgba(255,255,255,0.09);
        }
        .legal-table th {
          background: rgba(255,255,255,0.04);
          font-weight: 600;
          color: rgba(245,245,245,0.75);
        }
        .legal-table td { color: rgba(245,245,245,0.50); }
        .legal-footer {
          margin-top: 60px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          font-size: 13px;
        }
        .legal-footer a {
          color: rgba(245,245,245,0.35);
          text-decoration: none;
          transition: color .2s;
        }
        .legal-footer a:hover { color: #F5F5F5; }
      `}</style>

      <div className="legal-wrap">
        <Link href="/" className="legal-back">← Back to Buildr Studio</Link>

        <h1>Privacy Policy</h1>
        <p className="legal-date">Last updated: August 1, 2026</p>

        <h2>1. Introduction</h2>
        <p>
          Buildr Studio (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. This
          policy explains what data we collect when you interact with our website at buildrstudio.in,
          why we collect it, and how we protect it. Buildr Studio is operated by Aditya Kumar from India.
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
              <td>Name &amp; email address</td>
              <td>Contact / audit booking form</td>
              <td>To respond to enquiries and schedule AI Audits</td>
            </tr>
            <tr>
              <td>Usage analytics</td>
              <td>Page visits</td>
              <td>Improving the site (via Vercel Analytics &amp; Umami — no personal data)</td>
            </tr>
          </tbody>
        </table>

        <h2>3. Data We Do NOT Collect</h2>
        <ul>
          <li>Payment card details — we have no payment system on this site.</li>
          <li>Tracking cookies or advertising pixels.</li>
          <li>Any data from third-party account logins.</li>
        </ul>

        <h2>4. How We Use Your Data</h2>
        <ul>
          <li>To respond to enquiries and book AI Audit sessions.</li>
          <li>To improve the website through anonymous usage analytics.</li>
        </ul>

        <h2>5. Third-Party Services</h2>
        <ul>
          <li><strong>Vercel</strong> — hosting and analytics (anonymous usage data)</li>
          <li><strong>Umami</strong> — privacy-focused analytics (no personal data, no cookies)</li>
        </ul>

        <h2>6. Cookies</h2>
        <p>
          We do not use advertising cookies or third-party tracking cookies. Umami analytics is
          fully cookie-free.
        </p>

        <h2>7. Data Retention</h2>
        <p>
          Enquiry emails are retained as long as necessary to complete the engagement or until you
          request removal.
        </p>

        <h2>8. Your Rights</h2>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion of your data at any time.</li>
        </ul>

        <h2>9. Contact</h2>
        <p>
          For privacy-related questions or data requests, contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <div className="legal-footer">
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/">Home</Link>
        </div>
      </div>
    </>
  );
}

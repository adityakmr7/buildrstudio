import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Buildr Studio, the AI agent marketplace. Learn how we collect, use, and protect your data.",
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
          color: var(--text);
        }
        .legal-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--muted-2);
          text-decoration: none;
          margin-bottom: 40px;
          transition: color .2s;
        }
        .legal-back:hover { color: var(--text); }
        .legal-wrap h1 {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text);
          margin-bottom: 8px;
        }
        .legal-date {
          font-size: 13px;
          color: var(--muted-2);
          margin-bottom: 44px;
        }
        .legal-wrap h2 {
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
          margin-top: 36px;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .legal-wrap p, .legal-wrap li {
          font-size: 15px;
          line-height: 1.75;
          color: var(--muted);
        }
        .legal-wrap ul {
          padding-left: 20px;
          margin: 10px 0;
        }
        .legal-wrap li { margin-bottom: 5px; }
        .legal-wrap a {
          color: var(--accent);
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
          border: 1px solid var(--border);
        }
        .legal-table th {
          background: var(--surface-alt);
          font-weight: 600;
          color: var(--text);
        }
        .legal-table td { color: var(--muted); }
        .legal-footer {
          margin-top: 60px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          font-size: 13px;
        }
        .legal-footer a {
          color: var(--muted-2);
          text-decoration: none;
          transition: color .2s;
        }
        .legal-footer a:hover { color: var(--text); }
      `}</style>

      <div className="legal-wrap">
        <Link href="/" className="legal-back">← Back to Buildr Studio</Link>

        <h1>Privacy Policy</h1>
        <p className="legal-date">Last updated: August 20, 2026</p>

        <h2>1. Introduction</h2>
        <p>
          Buildr Studio (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates an AI agent
          marketplace at buildrstudio.in, where you can subscribe to and embed AI agents on your
          own website. This policy explains what data we collect — both from you as a subscriber
          and, where applicable, from visitors to sites where you&apos;ve embedded an agent — and
          how we protect it. Buildr Studio is operated by Aditya Kumar from India.
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
              <td>Name, email, profile image</td>
              <td>Signing in with Google</td>
              <td>To create your account and associate your agents/subscriptions with it</td>
            </tr>
            <tr>
              <td>Billing details</td>
              <td>Subscribing to an agent</td>
              <td>Processed by Paddle (our merchant of record) — we don&apos;t store card details ourselves</td>
            </tr>
            <tr>
              <td>Chat messages</td>
              <td>A visitor uses an embedded agent</td>
              <td>Sent to OpenAI to generate a reply, and stored so the agent has conversation context</td>
            </tr>
            <tr>
              <td>Usage analytics</td>
              <td>Page visits</td>
              <td>Improving the site (via Vercel Analytics &amp; Umami — no personal data)</td>
            </tr>
          </tbody>
        </table>

        <h2>3. Chat Data From Embedded Agents</h2>
        <p>
          When a visitor uses an agent embedded on your website, their messages are sent to our
          API, forwarded to OpenAI to generate a response, and stored so the agent can maintain
          conversation context. If you embed an agent, you&apos;re responsible for disclosing this
          to your own visitors (e.g. in your own privacy policy) where required by law.
        </p>

        <h2>4. Data We Do NOT Collect</h2>
        <ul>
          <li>Payment card details — these are handled entirely by Paddle, our merchant of record.</li>
          <li>Advertising cookies or tracking pixels.</li>
          <li>Any data from third-party account logins beyond what Google provides for sign-in.</li>
        </ul>

        <h2>5. Third-Party Services</h2>
        <ul>
          <li><strong>OpenAI</strong> — processes chat messages to generate agent replies</li>
          <li><strong>Paddle</strong> — payment processing and billing (acts as merchant of record)</li>
          <li><strong>Google</strong> — authentication (sign-in)</li>
          <li><strong>Neon</strong> — database hosting for account, subscription, and chat data</li>
          <li><strong>Vercel</strong> — hosting and anonymous analytics</li>
          <li><strong>Umami</strong> — privacy-focused analytics (no personal data, no cookies)</li>
        </ul>

        <h2>6. Cookies</h2>
        <p>
          We use a session cookie to keep you signed in. We do not use advertising or third-party
          tracking cookies. Umami analytics is fully cookie-free.
        </p>

        <h2>7. Data Retention</h2>
        <p>
          Account and subscription data is retained as long as your account is active. Chat message
          history is retained to provide conversation context for the agent and can be deleted on
          request.
        </p>

        <h2>8. Your Rights</h2>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion of your account and associated data at any time.</li>
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

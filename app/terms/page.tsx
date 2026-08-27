import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and conditions for Buildr Studio's AI agents. Subscription terms, acceptable use, and liability.",
  alternates: { canonical: "https://buildrstudio.in/terms" },
  openGraph: {
    title: "Terms and Conditions — Buildr Studio",
    description: "Terms and conditions for using Buildr Studio.",
    type: "website",
    url: "https://buildrstudio.in/terms",
  },
};

const CONTACT_EMAIL = "hello@buildrstudio.in";

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

        <h1>Terms and Conditions</h1>
        <p className="legal-date">Last updated: August 20, 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Buildr Studio website and marketplace at buildrstudio.in
          (&quot;the Service&quot;), operated by Aditya Kumar (&quot;we&quot;, &quot;us&quot;,
          &quot;our&quot;), you agree to be bound by these Terms and Conditions. If you do not
          agree, do not use the Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Buildr Studio is a marketplace of pre-built AI agents that you can subscribe to and embed
          on your own website via a JavaScript snippet. Each agent has a monthly message quota tied
          to your subscription tier, described on that agent&apos;s product page.
        </p>

        <h2>3. Subscriptions and Billing</h2>
        <ul>
          <li>Subscriptions are billed monthly through Paddle, our merchant of record.</li>
          <li>Paddle handles applicable tax/VAT as part of the checkout process.</li>
          <li>You can cancel a subscription at any time from your dashboard; access continues until the end of the current billing period.</li>
          <li>Exceeding your monthly message quota may pause the agent until the next billing cycle or until you upgrade your tier.</li>
        </ul>

        <h2>4. Your Responsibilities When Embedding an Agent</h2>
        <ul>
          <li>You are responsible for how you present an embedded agent to your own visitors, including any disclosures required by applicable law.</li>
          <li>You must not use an agent to generate unlawful, deceptive, or harmful content.</li>
          <li>API keys are tied to your account — do not share them publicly or embed them in a way that exposes them to unrelated parties.</li>
        </ul>

        <h2>5. Intellectual Property</h2>
        <ul>
          <li>Buildr Studio retains ownership of the agent templates, orchestration logic, and platform code.</li>
          <li>You retain ownership of any content, documents, or data you upload to configure an agent (e.g. a knowledge base).</li>
          <li>The Buildr Studio brand, logo, and website content remain our intellectual property.</li>
        </ul>

        <h2>6. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any unlawful purpose.</li>
          <li>Attempt to reverse-engineer, scrape, or abuse rate limits on the Service.</li>
          <li>Resell or sublicense access to an agent beyond your own website(s) without our consent.</li>
        </ul>

        <h2>7. Limitation of Liability</h2>
        <p>
          The Service is provided &quot;as is&quot; without warranties of any kind. AI-generated
          responses may be inaccurate — you are responsible for reviewing agent behavior before
          relying on it for anything business-critical. We are not liable for any indirect,
          incidental, or consequential damages arising from your use of the Service.
        </p>

        <h2>8. Custom Engagements</h2>
        <p>
          For requirements outside the catalog, we also take on custom-built agent engagements under
          a separate agreement — these terms apply to marketplace subscriptions only.
        </p>

        <h2>9. Changes to Terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the Service after changes
          constitutes acceptance of the updated terms.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These terms are governed by the laws of India. Any disputes shall be subject to the
          exclusive jurisdiction of the courts in India.
        </p>

        <h2>11. Contact</h2>
        <p>
          For questions about these terms, contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>

        <div className="legal-footer">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/">Home</Link>
        </div>
      </div>
    </>
  );
}

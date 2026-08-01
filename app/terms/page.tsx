import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and conditions for Buildr Studio, the AI automation and custom software agency. Engagement rules, IP ownership, and service terms.",
  alternates: { canonical: "https://buildrstudio.in/terms" },
  openGraph: {
    title: "Terms and Conditions — Buildr Studio",
    description: "Terms and conditions for engaging Buildr Studio.",
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

        <h1>Terms and Conditions</h1>
        <p className="legal-date">Last updated: August 1, 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Buildr Studio website at buildrstudio.in (&quot;the Site&quot;),
          operated by Aditya Kumar (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), you agree to
          be bound by these Terms and Conditions. If you do not agree, do not use the Site.
        </p>

        <h2>2. Description of Services</h2>
        <p>
          Buildr Studio is an AI automation and custom software agency. We design, build, and deploy
          custom AI agents, workflow automations (n8n / Make), multi-agent systems, and RAG knowledge
          base integrations. All engagement terms are governed by separate project agreements entered
          into between Buildr Studio and the client.
        </p>

        <h2>3. Enquiries and AI Audit Sessions</h2>
        <ul>
          <li>Submitting an enquiry or booking an AI Audit does not create a binding contract.</li>
          <li>All project engagements are formalised via a written Statement of Work (SOW).</li>
          <li>Free AI Audit sessions are provided at our discretion with no obligation on either party.</li>
        </ul>

        <h2>4. Intellectual Property</h2>
        <ul>
          <li>Upon full payment, clients receive ownership of all custom deliverables built for them.</li>
          <li>We retain ownership of any reusable proprietary frameworks, libraries, or tooling used during delivery.</li>
          <li>The Buildr Studio brand, logo, and website content remain our intellectual property.</li>
        </ul>

        <h2>5. Acceptable Use of This Site</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Site for any unlawful purpose.</li>
          <li>Attempt to reverse-engineer or scrape the Site.</li>
          <li>Misrepresent your identity or affiliation when making enquiries.</li>
        </ul>

        <h2>6. Limitation of Liability</h2>
        <p>
          The Site and its information are provided &quot;as is&quot; without warranties of any kind.
          We are not liable for any indirect, incidental, or consequential damages arising from your
          use of or reliance on information presented on this Site.
        </p>

        <h2>7. Changes to Terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the Site after changes
          constitutes acceptance of the updated terms.
        </p>

        <h2>8. Governing Law</h2>
        <p>
          These terms are governed by the laws of India. Any disputes shall be subject to the
          exclusive jurisdiction of the courts in India.
        </p>

        <h2>9. Contact</h2>
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

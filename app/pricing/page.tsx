import type { Metadata } from "next";
import Script from "next/script";
import AppHeader from "../components/AppHeader";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "BuildrStudio pricing — free tools for everyone. Launch Pack at $29 one-time or Pro at $9/mo for watermark-free exports, batch sizing, and unlimited AI headlines.",
  alternates: { canonical: "https://buildrstudio.in/pricing" },
  openGraph: {
    title: "Pricing — BuildrStudio",
    description: "Free, Launch Pack ($29 one-time), and Pro ($9/mo). No watermarks, batch export, AI headlines in 15+ languages.",
    type: "website",
    url: "https://buildrstudio.in/pricing",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — BuildrStudio",
    description: "Free, Launch Pack ($29 one-time), and Pro ($9/mo) plans for App Store screenshot generation.",
  },
};

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://buildrstudio.in" },
          { "@type": "ListItem", position: 2, name: "Pricing", item: "https://buildrstudio.in/pricing" },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: "BuildrStudio",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "All",
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "0",
          highPrice: "29",
          priceCurrency: "USD",
          offerCount: 4,
          offers: [
            { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
            { "@type": "Offer", name: "Launch Pack", price: "29", priceCurrency: "USD" },
            { "@type": "Offer", name: "Pro Monthly", price: "9", priceCurrency: "USD", billingIncrement: "P1M" },
            { "@type": "Offer", name: "Pro Annual", price: "90", priceCurrency: "USD", billingIncrement: "P1Y" },
          ],
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="pricing-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`
        .pricing-page {
          max-width: 960px;
          margin: 0 auto;
          padding: 60px 24px 80px;
          font-family: var(--font);
          color: var(--text-1);
        }
        .pricing-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .pricing-header h1 {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -1.5px;
          margin-bottom: 12px;
        }
        .pricing-header p {
          font-size: 16px;
          color: var(--text-2);
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 960px;
          margin: 0 auto;
        }
        @media (max-width: 860px) {
          .pricing-grid {
            grid-template-columns: 1fr;
            max-width: 440px;
          }
        }
        .pricing-card {
          border: 1.5px solid var(--border);
          border-radius: var(--r-lg, 16px);
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: var(--surface);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .pricing-card:hover {
          border-color: var(--border-strong);
        }
        .pricing-card.pro {
          border-color: #a855f7;
          box-shadow: 0 0 0 1px rgba(168, 85, 247, 0.15), 0 12px 40px rgba(168, 85, 247, 0.1);
          position: relative;
        }
        .pricing-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 16px;
          border-radius: var(--r-full, 999px);
          letter-spacing: 0.5px;
        }
        .pricing-plan-name {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-3);
        }
        .pricing-price {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        .pricing-amount {
          font-size: 40px;
          font-weight: 800;
          letter-spacing: -2px;
          color: var(--text-1);
        }
        .pricing-period {
          font-size: 16px;
          color: var(--text-3);
          font-weight: 500;
        }
        .pricing-original {
          font-size: 18px;
          color: var(--text-3);
          text-decoration: line-through;
          margin-left: 8px;
        }
        .pricing-features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }
        .pricing-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--text-2);
        }
        .pricing-check {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          flex-shrink: 0;
        }
        .pricing-check.yes {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }
        .pricing-check.no {
          background: var(--fill-subtle);
          color: var(--text-3);
        }
        .pricing-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 24px;
          border-radius: var(--r-md, 12px);
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: var(--font);
          border: none;
        }
        .pricing-cta.free {
          background: var(--fill-subtle);
          color: var(--text-1);
          border: 1px solid var(--border);
        }
        .pricing-cta.free:hover {
          background: var(--surface-2, var(--fill-subtle));
          border-color: var(--border-strong);
        }
        .pricing-cta.upgrade {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
          color: #fff;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
        }
        .pricing-cta.upgrade:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(124, 58, 237, 0.4);
        }
        .pricing-faq {
          max-width: 720px;
          margin: 64px auto 0;
        }
        .pricing-faq h2 {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.5px;
          text-align: center;
          margin-bottom: 32px;
        }
        .pricing-faq-item {
          border-bottom: 1px solid var(--border);
          padding: 20px 0;
        }
        .pricing-faq-item:first-of-type {
          border-top: 1px solid var(--border);
        }
        .pricing-faq-q {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-1);
          margin-bottom: 8px;
        }
        .pricing-faq-a {
          font-size: 14px;
          color: var(--text-2);
          line-height: 1.7;
        }
        .pricing-faq-a a {
          color: var(--fill);
          text-decoration: underline;
        }
        .pricing-footer {
          margin-top: 60px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: center;
          gap: 24px;
          font-size: 13px;
        }
        .pricing-footer a {
          color: var(--text-3);
          text-decoration: none;
        }
        .pricing-footer a:hover {
          color: var(--text-1);
        }
      `}</style>

      <AppHeader activeRoute="home" />

      <div className="pricing-page">
        <div className="pricing-header">
          <h1>Simple, Fair Pricing</h1>
          <p>
            All tools are free forever. Pay once for your launch, or subscribe if you ship often.
          </p>
        </div>

        <div className="pricing-grid">
          {/* Free Plan */}
          <div className="pricing-card">
            <span className="pricing-plan-name">Free</span>
            <div className="pricing-price">
              <span className="pricing-amount">$0</span>
              <span className="pricing-period">/forever</span>
            </div>
            <div className="pricing-features">
              <div className="pricing-feature">
                <span className="pricing-check yes">✓</span>
                <span>All 3 tools (Screenshot Builder, Social Optimizer, Changelog)</span>
              </div>
              <div className="pricing-feature">
                <span className="pricing-check yes">✓</span>
                <span>Unlimited exports</span>
              </div>
              <div className="pricing-feature">
                <span className="pricing-check yes">✓</span>
                <span>Basic device frames</span>
              </div>
              <div className="pricing-feature">
                <span className="pricing-check yes">✓</span>
                <span>Gradient &amp; solid backgrounds</span>
              </div>
              <div className="pricing-feature">
                <span className="pricing-check no">—</span>
                <span style={{ color: "var(--text-3)" }}>Watermark on exports</span>
              </div>
              <div className="pricing-feature">
                <span className="pricing-check no">—</span>
                <span style={{ color: "var(--text-3)" }}>Limited device selection</span>
              </div>
            </div>
            <Link href="/screenshot-builder" className="pricing-cta free">
              Start Building — Free
            </Link>
          </div>

          {/* Launch Pack — one-time */}
          <div className="pricing-card pro">
            <div className="pricing-badge">BEST VALUE</div>
            <span className="pricing-plan-name">Launch Pack</span>
            <div className="pricing-price">
              <span className="pricing-amount">$29</span>
              <span className="pricing-period">one-time</span>
            </div>
            <div className="pricing-features">
              <div className="pricing-feature">
                <span className="pricing-check yes">✓</span>
                <span><strong>Pay once, keep Pro forever</strong> — no subscription</span>
              </div>
              <div className="pricing-feature">
                <span className="pricing-check yes">✓</span>
                <span><strong>No watermark</strong> — clean exports</span>
              </div>
              <div className="pricing-feature">
                <span className="pricing-check yes">✓</span>
                <span><strong>Batch export</strong> — all Apple &amp; Google sizes, canonical filenames</span>
              </div>
              <div className="pricing-feature">
                <span className="pricing-check yes">✓</span>
                <span><strong>3D tilt mode</strong> &amp; 4K PNG export</span>
              </div>
              <div className="pricing-feature">
                <span className="pricing-check yes">✓</span>
                <span><strong>Unlimited AI headlines</strong> — translated into 15+ languages</span>
              </div>
              <div className="pricing-feature">
                <span className="pricing-check yes">✓</span>
                <span><strong>Brand presets</strong> — custom colors &amp; swatches</span>
              </div>
            </div>
            <Link href="/pricing-preview" className="pricing-cta upgrade">
              Get Launch Pack — $29
            </Link>
          </div>

          {/* Pro Monthly */}
          <div className="pricing-card">
            <span className="pricing-plan-name">Pro</span>
            <div className="pricing-price">
              <span className="pricing-amount">$9</span>
              <span className="pricing-period">/month</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-3)", margin: "-8px 0 0" }}>
              or $90/yr — 2 months free · includes a 7-day free trial
            </p>
            <div className="pricing-features">
              <div className="pricing-feature">
                <span className="pricing-check yes">✓</span>
                <span>Everything in Launch Pack</span>
              </div>
              <div className="pricing-feature">
                <span className="pricing-check yes">✓</span>
                <span>Ideal for agencies &amp; frequent shippers</span>
              </div>
              <div className="pricing-feature">
                <span className="pricing-check yes">✓</span>
                <span><strong>Priority support</strong> — direct email access</span>
              </div>
              <div className="pricing-feature">
                <span className="pricing-check yes">✓</span>
                <span>Cancel anytime</span>
              </div>
            </div>
            <Link href="/pricing-preview?interval=month" className="pricing-cta free">
              Get Pro Monthly — $9/mo
            </Link>
            <Link href="/pricing-preview?interval=year" className="pricing-cta free">
              Get Pro Annual — $90/yr
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="pricing-faq">
          <h2>Frequently Asked Questions</h2>

          <div className="pricing-faq-item">
            <div className="pricing-faq-q">Can I cancel anytime?</div>
            <div className="pricing-faq-a">
              Yes. Cancel anytime from your Paddle customer portal (link in your subscription email)
              or by emailing us. Your Pro access continues until the end of your current billing period.
            </div>
          </div>

          <div className="pricing-faq-item">
            <div className="pricing-faq-q">Is there a refund policy?</div>
            <div className="pricing-faq-a">
              Yes — we offer a <strong>7-day money-back guarantee</strong> on your first payment.
              No questions asked. See our <Link href="/refund">refund policy</Link> for details.
            </div>
          </div>

          <div className="pricing-faq-item">
            <div className="pricing-faq-q">What payment methods do you accept?</div>
            <div className="pricing-faq-a">
              We accept all major credit/debit cards via Paddle, our payment processor. PayPal and UPI
              support coming soon.
            </div>
          </div>

          <div className="pricing-faq-item">
            <div className="pricing-faq-q">Do my images get uploaded to your servers?</div>
            <div className="pricing-faq-a">
              No. All image processing happens entirely in your browser. We never upload, store, or
              access your screenshots.
            </div>
          </div>

          <div className="pricing-faq-item">
            <div className="pricing-faq-q">What&apos;s the difference between the Launch Pack and Pro?</div>
            <div className="pricing-faq-a">
              Same features, different billing. The Launch Pack is a one-time $29 payment that keeps
              Pro unlocked forever — most indie developers ship a release every few months, so
              paying once usually makes more sense. Pro at $9/mo (or $90/yr, with a 7-day free trial)
              suits agencies and teams shipping constantly.
            </div>
          </div>
        </div>

        <div className="pricing-footer">
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/refund">Refund Policy</Link>
          <Link href="/">Home</Link>
        </div>
      </div>
    </>
  );
}

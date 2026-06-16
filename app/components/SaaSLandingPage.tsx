"use client";

// ─── SaaSLandingPage.tsx ─────────────────────────────────────────────────────
// The client-side marketing components, toggles, and FAQs.

import React, { useState } from "react";
import Link from "next/link";
import PremiumModal from "./PremiumModal";
import AppHeader from "./AppHeader";

const FAQS = [
  {
    q: "Do I need a credit card to get started?",
    a: "No! You can use all core features of BuildrStudio completely free without entering any billing details.",
  },
  {
    q: "How does the Batch Store Exporter work?",
    a: "Under the Pro plan, you can upload a single screenshot, and our system automatically renders and packs it in all canonical resolutions required by Apple and Google. You get a clean ZIP file instantly.",
  },
  {
    q: "Can I save my custom brand colors and gradients?",
    a: "Yes! The Pro tier includes a Brand Presets kit where you can lock in your exact hex codes, brand fonts, and custom watermark text for automatic use on any tool.",
  },
  {
    q: "Are you planning to add AI features in the future?",
    a: "Yes! We are currently researching AI capabilities to auto-detect your app's brand colors, suggest optimized title copywriting, and automatically build visual layouts from a single raw screenshot. These features are in the research phase and will roll out as beta trials in the future.",
  },
];

export default function SaaSLandingPage() {
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="saas-homepage">
      {/* Dynamic Landing Page Styling */}
      <style>{`
        .saas-homepage {
          min-height: 100vh;
          background-color: var(--bg);
          color: var(--text-1);
          font-family: var(--font);
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          transition: background-color .3s;
        }

        /* ─── HEADER ─── */
        .site-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
          height: 64px;
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(8px);
          transition: background-color .3s, border .3s;
        }
        .site-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .site-logo-mark {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: var(--fill);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          color: var(--fill-text);
          font-weight: 800;
        }
        .site-logo-text {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-1);
          letter-spacing: -0.4px;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .header-link {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-2);
          text-decoration: none;
          transition: color 0.15s;
        }
        .header-link:hover {
          color: var(--text-1);
        }

        /* ─── HERO SECTION ─── */
        .hero {
          position: relative;
          padding: 100px 24px 80px;
          text-align: center;
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: var(--fill-subtle);
          border: 1px solid var(--border-strong);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-1);
          margin-bottom: 24px;
        }
        .hero-title {
          font-size: clamp(38px, 6vw, 68px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -2px;
          margin: 0 0 20px;
          background: linear-gradient(135deg, var(--text-1) 30%, #8b5cf6 70%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-desc {
          font-size: clamp(16px, 2.5vw, 20px);
          color: var(--text-2);
          max-width: 650px;
          line-height: 1.5;
          margin: 0 auto 36px;
        }
        .hero-ctas {
          display: flex;
          gap: 16px;
          margin-bottom: 50px;
        }

        /* ─── TOOLS SECTOR ─── */
        .section-title {
          text-align: center;
          margin-bottom: 48px;
          padding: 0 24px;
        }
        .section-title h2 {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.8px;
          margin: 0 0 10px;
        }
        .section-title p {
          color: var(--text-3);
          font-size: 15px;
          margin: 0;
        }
        .tools-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
          max-width: 1200px;
          margin: 0 auto 100px;
          padding: 0 40px;
        }
        .tool-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
          text-decoration: none;
          color: inherit;
        }
        .tool-card:hover {
          transform: translateY(-6px);
          border-color: var(--text-1);
          box-shadow: 0 16px 36px rgba(0,0,0,0.08);
        }
        .tool-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--fill-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          border: 1px solid var(--border);
        }
        .tool-name {
          font-size: 20px;
          font-weight: 750;
          letter-spacing: -0.4px;
          margin: 0;
        }
        .tool-desc {
          font-size: 14px;
          color: var(--text-2);
          line-height: 1.5;
          margin: 0;
          flex: 1;
        }
        .tool-arrow {
          font-size: 13px;
          font-weight: 700;
          color: var(--fill);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* ─── FIGMA VS BUILDRSTUDIO ─── */
        .vs-section {
          background: var(--surface-2);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 80px 40px;
          margin-bottom: 100px;
          transition: background-color .3s, border .3s;
        }
        .vs-container {
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        .vs-column {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 18px;
          padding: 28px;
        }
        .vs-column.better {
          border-color: var(--fill);
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.08);
        }
        .vs-header {
          font-size: 18px;
          font-weight: 800;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .vs-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .vs-item {
          font-size: 14px;
          color: var(--text-2);
          display: flex;
          gap: 8px;
          align-items: flex-start;
          line-height: 1.4;
        }

        /* ─── PRICING ─── */
        .pricing {
          max-width: 900px;
          margin: 0 auto 100px;
          padding: 0 40px;
          text-align: center;
        }
        .toggle-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
          background: var(--surface-2);
          padding: 4px 8px;
          border-radius: 30px;
          border: 1px solid var(--border);
        }
        .toggle-btn {
          border: none;
          background: none;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 20px;
          cursor: pointer;
          font-family: var(--font);
          transition: all 0.2s;
        }
        .toggle-btn.active {
          background: var(--surface);
          box-shadow: var(--shadow-sm);
          color: var(--text-1);
        }
        .pricing-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }
        .price-card {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 24px;
          padding: 40px 32px;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: relative;
        }
        .price-card.pro {
          border-color: var(--fill);
          box-shadow: 0 12px 40px rgba(99, 102, 241, 0.08);
        }
        .badge-pro {
          position: absolute;
          top: 20px;
          right: 20px;
          background: var(--fill);
          color: var(--fill-text);
          font-size: 10px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
        }
        .price-name {
          font-size: 18px;
          font-weight: 800;
          margin: 0;
        }
        .price-val {
          font-size: 40px;
          font-weight: 800;
          letter-spacing: -1px;
          color: var(--text-1);
        }
        .price-period {
          font-size: 13px;
          color: var(--text-3);
          font-weight: 500;
        }
        .price-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }
        .price-feature {
          font-size: 14px;
          color: var(--text-2);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* ─── FAQS ─── */
        .faqs {
          max-width: 700px;
          margin: 0 auto 120px;
          padding: 0 24px;
        }
        .faq-item {
          border-bottom: 1px solid var(--border);
          padding: 16px 0;
        }
        .faq-q {
          width: 100%;
          background: none;
          border: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
          font-weight: 700;
          color: var(--text-1);
          cursor: pointer;
          text-align: left;
          padding: 8px 0;
          font-family: var(--font);
        }
        .faq-a {
          font-size: 14px;
          color: var(--text-2);
          line-height: 1.5;
          padding: 10px 0;
        }

        /* ─── FOOTER ─── */
        .footer {
          margin-top: auto;
          background: var(--surface-2);
          border-top: 1px solid var(--border);
          padding: 48px 40px;
          text-align: center;
          transition: background-color .3s, border .3s;
        }
        .footer-logo {
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 12px;
          color: var(--text-1);
        }
        .footer-desc {
          font-size: 13px;
          color: var(--text-3);
          max-width: 400px;
          margin: 0 auto 24px;
          line-height: 1.4;
        }
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 24px;
        }
        .footer-link {
          font-size: 13px;
          color: var(--text-3);
          text-decoration: none;
          transition: color 0.15s;
        }
        .footer-link:hover {
          color: var(--text-1);
        }

        @media (max-width: 900px) {
          .tools-grid { grid-template-columns: 1fr; gap: 20px; }
          .vs-container { grid-template-columns: 1fr; }
          .pricing-cards { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <AppHeader activeRoute="home" onOpenPremium={() => setIsPremiumOpen(true)} />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-badge">
          <span>🚀 BuildrStudio Suite v2.5</span>
        </div>
        <h1 className="hero-title">Design Assets That Sell Your Software</h1>
        <p className="hero-desc">
          Generate gorgeous App Store mockups, high-converting social graphics, and changelog cards in seconds. Built for speed and visual excellence.
        </p>
        <div className="hero-ctas">
          <Link href="/social-optimizer" className="btn-fill btn-lg" style={{ textDecoration: "none" }}>
            Get Started Free
          </Link>
          <a href="#tools" className="btn-outline btn-lg" style={{ textDecoration: "none" }}>
            Explore Tools
          </a>
        </div>
      </section>

      {/* ── TOOLS SECTOR ── */}
      <section id="tools">
        <div className="section-title">
          <h2>Creative Tool Suite</h2>
          <p>Click below to launch your editor workspace of choice.</p>
        </div>
        <div className="tools-grid">
          <Link href="/social-optimizer" className="tool-card">
            <div className="tool-icon">🎨</div>
            <h3 className="tool-name">Social Optimizer</h3>
            <p className="tool-desc">
              Transform developer screenshots, terminal logs, or clean code captures into beautiful graphics optimized for Twitter/X and LinkedIn.
            </p>
            <span className="tool-arrow">Launch Optimizer →</span>
          </Link>

          <Link href="/screenshot-builder" className="tool-card">
            <div className="tool-icon">📱</div>
            <h3 className="tool-name">Screenshot Builder</h3>
            <p className="tool-desc">
              Generate submission-ready app screenshots for iOS App Store and Google Play. Custom gradient presets, 3D tilts, and flat frames.
            </p>
            <span className="tool-arrow">Launch Builder →</span>
          </Link>

          <Link href="/change-log" className="tool-card">
            <div className="tool-icon">⚡</div>
            <h3 className="tool-name">Changelog Generator</h3>
            <p className="tool-desc">
              Announce new features with design flair. Generate release social cards instantly using brackets, minimalist layouts, or warm gradients.
            </p>
            <span className="tool-arrow">Launch Generator →</span>
          </Link>
        </div>

        {/* AI research spotlight */}
        <div className="ai-spotlight" style={{ maxWidth: "1200px", margin: "40px auto 0", padding: "0 40px" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)",
            border: "1.5px dashed var(--border-strong)",
            borderRadius: "20px",
            padding: "28px 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <span className="badge-pill" style={{ background: "var(--fill-subtle)", color: "var(--fill)", fontSize: "10px", fontWeight: 700, marginBottom: "10px", display: "inline-block" }}>
                ✨ Future Research Lab
              </span>
              <h3 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.3px" }}>AI-Powered Mockup Engine</h3>
              <p style={{ fontSize: "13px", color: "var(--text-2)", margin: 0, lineHeight: 1.5 }}>
                We are actively exploring AI capabilities to automatically extract color palettes, write high-converting copy headlines, and lay out compliant app submissions from raw developer screenshots.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPremiumOpen(true)}
              className="btn-outline btn-sm"
              style={{ display: "flex", gap: "8px", alignItems: "center", fontWeight: 700, cursor: "pointer" }}
            >
              <span>🔔</span> Get AI Updates
            </button>
          </div>
        </div>
      </section>

      {/* ── FIGMA VS BUILDRSTUDIO ── */}
      <section className="vs-section">
        <div className="section-title">
          <h2>Built For Builders</h2>
          <p>Why indie makers choose BuildrStudio over general design platforms.</p>
        </div>
        <div className="vs-container">
          <div className="vs-column">
            <div className="vs-header" style={{ color: "#ef4444" }}>
              <span>❌</span> Figma / Photoshop
            </div>
            <ul className="vs-list">
              <li className="vs-item">
                <span>·</span> Infinite canvas leads to layout paralysis
              </li>
              <li className="vs-item">
                <span>·</span> Manual sizing and aspect ratios are error-prone
              </li>
              <li className="vs-item">
                <span>·</span> Creating mockups requires complex device templates
              </li>
              <li className="vs-item">
                <span>·</span> Drag-and-drop handles are slow and finicky
              </li>
            </ul>
          </div>

          <div className="vs-column better">
            <div className="vs-header" style={{ color: "#10b981" }}>
              <span>🚀</span> BuildrStudio
            </div>
            <ul className="vs-list">
              <li className="vs-item">
                <span>·</span> Purpose-built templates ensure gorgeous alignment
              </li>
              <li className="vs-item">
                <span>·</span> Pre-loaded resolutions match store requirements automatically
              </li>
              <li className="vs-item">
                <span>·</span> Toggleable 3D device perspective frames instantly
              </li>
              <li className="vs-item">
                <span>·</span> Copy directly to clipboard or export high-res 4K PNGs
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="pricing">
        <div className="section-title">
          <h2>Flexible Pricing Plans</h2>
          <p>Choose the tier that fits your launch requirements.</p>
        </div>
        <div className="pricing-cards" style={{ marginTop: "20px" }}>
          {/* Free Tier */}
          <div className="price-card">
            <h3 className="price-name">Free Plan</h3>
            <div>
              <span className="price-val">$0</span>
              <span className="price-period"> / forever</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-3)", margin: 0 }}>
              Essential design templates for quick product launches.
            </p>
            <ul className="price-features">
              <li className="price-feature"><span>✓</span> Standard flat device frames</li>
              <li className="price-feature"><span>✓</span> Base gradients & solid colors</li>
              <li className="price-feature"><span>✓</span> 1080p PNG exports</li>
              <li className="price-feature"><span>✓</span> Interactive caption overlays</li>
            </ul>
            <Link
              href="/social-optimizer"
              className="btn-outline btn-md"
              style={{ textAlign: "center", textDecoration: "none" }}
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="price-card pro">
            <span className="badge-pro">Early Access</span>
            <h3 className="price-name" style={{ color: "var(--fill)" }}>Pro Plan</h3>
            <div>
              <span className="price-val" style={{ fontSize: "28px" }}>Pricing TBD</span>
              <span className="price-period"> · 50% Waitlist Discount</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-3)", margin: 0 }}>
              Batch exporters and custom brand presets for marketing builders.
            </p>
            <ul className="price-features">
              <li className="price-feature" style={{ fontWeight: 600 }}><span>✦</span> Watermark-free downloads</li>
              <li className="price-feature"><span>✓</span> 3D perspective device tilts</li>
              <li className="price-feature"><span>✓</span> Batch multi-device store exports</li>
              <li className="price-feature"><span>✓</span> Custom brand presets & swatches</li>
              <li className="price-feature"><span>✓</span> 4K high-resolution PNG & WebP</li>
            </ul>
            <button
              type="button"
              onClick={() => setIsPremiumOpen(true)}
              className="btn-fill btn-md"
              style={{ width: "100%", justifyContent: "center", fontWeight: 700, cursor: "pointer", border: "none" }}
            >
              Join Waitlist & Save 50%
            </button>
          </div>
        </div>
      </section>

      {/* ── FAQS ── */}
      <section className="faqs">
        <div className="section-title">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about BuildrStudio.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {FAQS.map((faq, idx) => (
            <div key={idx} className="faq-item">
              <button onClick={() => toggleFaq(idx)} className="faq-q">
                <span>{faq.q}</span>
                <span>{faqOpen === idx ? "−" : "+"}</span>
              </button>
              {faqOpen === idx && <div className="faq-a">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-logo">BuildrStudio</div>
        <p className="footer-desc">
          Craft beautiful launch visual assets for your apps, Twitter accounts, and store consoles in minutes.
        </p>
        <div className="footer-links">
          <Link href="/social-optimizer" className="footer-link">Optimizer</Link>
          <Link href="/screenshot-builder" className="footer-link">Screenshot Builder</Link>
          <Link href="/change-log" className="footer-link">Changelog</Link>
          <Link href="/showcase" className="footer-link">Showcase</Link>
          <Link href="/roadmap" className="footer-link">Roadmap</Link>
          <Link href="/blog" className="footer-link">Blog</Link>
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-3)" }}>
          © {new Date().getFullYear()} BuildrStudio. All rights reserved.
        </div>
      </footer>

      {/* Premium interest waitlist popup */}
      <PremiumModal isOpen={isPremiumOpen} onClose={() => setIsPremiumOpen(false)} />
    </div>
  );
}

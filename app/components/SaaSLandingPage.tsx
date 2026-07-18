"use client";

// ─── SaaSLandingPage.tsx ─────────────────────────────────────────────────────
// The client-side marketing components, toggles, and FAQs.

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const [heroUrl, setHeroUrl] = useState("");
  const [heroLoading, setHeroLoading] = useState(false);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleHeroImport = () => {
    const trimmed = heroUrl.trim();
    if (!trimmed) { heroInputRef.current?.focus(); return; }
    setHeroLoading(true);
    router.push(`/screenshot-builder?url=${encodeURIComponent(trimmed)}`);
  };

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
          border-radius: var(--r-sm);
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
          border-radius: var(--r-xl);
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
          max-width: 580px;
          line-height: 1.5;
          margin: 0 auto 32px;
        }
        .hero-import-row {
          width: 100%;
          max-width: 600px;
          margin: 0 auto 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .hero-import-wrap {
          display: flex;
          width: 100%;
          border-radius: var(--r-md);
          overflow: hidden;
          border: 1.5px solid var(--border-strong);
          background: var(--surface);
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          transition: border-color 0.15s;
        }
        .hero-import-wrap:focus-within {
          border-color: var(--fill);
        }
        .hero-import-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-family: var(--font);
          font-size: 14px;
          color: var(--text-1);
          padding: 14px 16px;
          min-width: 0;
        }
        .hero-import-input::placeholder { color: var(--text-3); }
        .hero-import-btn {
          flex-shrink: 0;
          background: var(--fill);
          color: var(--fill-text);
          border: none;
          padding: 12px 20px;
          font-family: var(--font);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: opacity 0.15s;
        }
        .hero-import-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .hero-import-btn:hover:not(:disabled) { opacity: 0.88; }
        .hero-import-hint {
          font-size: 12px;
          color: var(--text-3);
          margin: 0;
        }
        .hero-visual {
          width: 100%;
          max-width: 800px;
          margin: 0 auto 20px;
          perspective: 1200px;
        }
        .hero-mockup-row {
          display: flex;
          gap: 20px;
          justify-content: center;
          padding: 0 20px;
        }
        .hero-mockup {
          width: 220px;
          height: 320px;
          border-radius: var(--r-xl);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 24px 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          animation: heroFloat 3s ease-in-out infinite;
          flex-shrink: 0;
        }
        .hero-mockup:nth-child(2) {
          transform: translateY(-12px);
        }
        .hero-mockup-text {
          font-size: 16px;
          font-weight: 800;
          color: #fff;
          text-align: center;
          line-height: 1.2;
          letter-spacing: -0.3px;
        }
        .hero-mockup-phone {
          width: 100px;
          height: 180px;
          background: var(--fill);
          border-radius: var(--r-lg);
          border: 2px solid var(--border-strong);
          position: relative;
          overflow: hidden;
        }
        .hero-phone-notch {
          width: 40px;
          height: 10px;
          background: var(--fill);
          border-radius: 0 0 var(--r-sm) var(--r-sm);
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }
        .hero-phone-screen {
          position: absolute;
          inset: 4px;
          border-radius: var(--r-md);
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .hero-mockup:nth-child(2) {
          animation-delay: 0.5s;
        }
        .hero-mockup:nth-child(3) {
          animation-delay: 1s;
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
          border-radius: var(--r-xl);
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
          border-radius: var(--r-md);
          background: var(--fill-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          border: 1px solid var(--border);
        }
        .tool-name {
          font-size: 20px;
          font-weight: 800;
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

        /* ─── LAUNCH FLOW ─── */
        .launch-flow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          max-width: 1200px;
          margin: 0 auto 48px;
          padding: 0 40px;
          flex-wrap: nowrap;
          overflow-x: auto;
        }
        .launch-flow-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;
          border-radius: var(--r-md);
          border: 1px solid var(--border);
          background: var(--surface);
          min-width: 110px;
          text-align: center;
          flex-shrink: 0;
        }
        .launch-flow-step.highlight {
          border-color: var(--fill);
          background: var(--fill-subtle);
        }
        .launch-flow-num {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--text-3);
          font-family: monospace;
        }
        .launch-flow-step.highlight .launch-flow-num {
          color: var(--fill);
        }
        .launch-flow-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-1);
        }
        .launch-flow-arrow {
          color: var(--text-3);
          flex-shrink: 0;
        }

        /* ─── TWO TOOL CARDS ─── */
        .tool-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto 100px;
          padding: 0 40px;
        }
        .tool-card-full {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 36px;
          background: var(--surface);
          border: 1.5px solid var(--border-strong);
          border-radius: var(--r-2xl);
          text-decoration: none;
          color: inherit;
          transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
        }
        .tool-card-full:hover {
          transform: translateY(-5px);
          border-color: var(--fill);
          box-shadow: 0 20px 48px rgba(99,102,241,0.1);
        }
        .tool-card-full-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--r-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .tool-card-full-badge {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-3);
          margin-bottom: 4px;
        }
        .tool-card-full-title {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin: 0 0 10px;
          color: var(--text-1);
        }
        .tool-card-full-desc {
          font-size: 14px;
          color: var(--text-2);
          line-height: 1.65;
          margin: 0 0 16px;
        }
        .tool-card-full-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 7px;
          font-size: 13px;
          color: var(--text-2);
          flex: 1;
        }
        .tool-card-full-features li::before {
          content: "✓ ";
          color: var(--fill);
          font-weight: 700;
        }
        .tool-card-full-cta {
          font-size: 13px;
          font-weight: 700;
          color: var(--fill);
          margin-top: auto;
        }
        .tool-card-full-body {
          flex: 1;
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
          border-radius: var(--r-xl);
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
          border-radius: var(--r-full);
          border: 1px solid var(--border);
        }
        .toggle-btn {
          border: none;
          background: none;
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 700;
          border-radius: var(--r-xl);
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
          gap: 24px;
          align-items: start;
          max-width: 700px;
          margin: 0 auto;
        }
        .price-card {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: var(--r-2xl);
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
          border-radius: var(--r-xl);
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
          .pricing-cards { grid-template-columns: 1fr !important; max-width: 400px !important; }
          .hero-mockup-row { gap: 12px; }
          .hero-mockup { width: 160px; height: 240px; border-radius: var(--r-lg); padding: 16px 12px; gap: 10px; }
          .hero-mockup-text { font-size: 13px; }
          .hero-mockup-phone { width: 75px; height: 130px; border-radius: var(--r-md); }
          .tool-cards-grid { grid-template-columns: 1fr; }
          .launch-flow { gap: 8px; }
          .launch-flow-step { min-width: 100px; padding: 10px 12px; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <AppHeader activeRoute="home" onOpenPremium={() => setIsPremiumOpen(true)} />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-badge">
          <span>📱 Free App Store Screenshot Generator</span>
        </div>
        <h1 className="hero-title">App Store Screenshots That Actually Convert</h1>
        <p className="hero-desc">
          Paste your App Store URL — get device-framed mockups with AI headlines ready to submit in seconds.
        </p>

        {/* Hero URL import */}
        <div className="hero-import-row">
          <div className="hero-import-wrap">
            <input
              ref={heroInputRef}
              type="url"
              className="hero-import-input"
              placeholder="https://apps.apple.com/app/your-app/id…"
              value={heroUrl}
              onChange={(e) => setHeroUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleHeroImport()}
            />
            <button
              type="button"
              className="hero-import-btn"
              onClick={handleHeroImport}
              disabled={heroLoading}
            >
              {heroLoading ? "Loading…" : "Generate Screenshots"}
            </button>
          </div>
          <p className="hero-import-hint">
            Supports apps.apple.com and play.google.com ·{" "}
            <Link href="/screenshot-builder" style={{ color: "var(--text-3)", textDecoration: "underline" }}>
              or start from scratch
            </Link>
          </p>
        </div>

        {/* Hero visual — animated product showcase */}
        <div className="hero-visual">
          <div className="hero-mockup-row">
            <div className="hero-mockup" style={{ background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)", animationDelay: "0s" }}>
              <div className="hero-mockup-text">Your App.<br/>Your Story.</div>
              <div className="hero-mockup-phone">
                <div className="hero-phone-notch" />
                <div className="hero-phone-screen" style={{ background: "linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)" }} />
              </div>
            </div>
            <div className="hero-mockup" style={{ background: "linear-gradient(135deg, #0ea5e9, #38bdf8, #7dd3fc)", animationDelay: "0.15s" }}>
              <div className="hero-mockup-text">Advanced<br/>Features</div>
              <div className="hero-mockup-phone">
                <div className="hero-phone-notch" />
                <div className="hero-phone-screen" style={{ background: "linear-gradient(180deg, #0c4a6e 0%, #075985 100%)" }} />
              </div>
            </div>
            <div className="hero-mockup" style={{ background: "linear-gradient(135deg, #f97316, #fb923c, #fbbf24)", animationDelay: "0.3s" }}>
              <div className="hero-mockup-text">Beautiful<br/>Mockups</div>
              <div className="hero-mockup-phone">
                <div className="hero-phone-notch" />
                <div className="hero-phone-screen" style={{ background: "linear-gradient(180deg, #431407 0%, #7c2d12 100%)" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOOLS SUITE ── */}
      <section id="tools">
        <div className="section-title">
          <h2>Every visual your launch needs</h2>
          <p>Two focused tools that take you from build to ship to announce — without Figma.</p>
        </div>

        {/* Launch workflow connector */}
        <div className="launch-flow">
          <div className="launch-flow-step">
            <span className="launch-flow-num">01</span>
            <span className="launch-flow-label">Build your app</span>
          </div>
          <svg className="launch-flow-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          <div className="launch-flow-step highlight">
            <span className="launch-flow-num">02</span>
            <span className="launch-flow-label">Screenshot Builder</span>
          </div>
          <svg className="launch-flow-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          <div className="launch-flow-step highlight">
            <span className="launch-flow-num">03</span>
            <span className="launch-flow-label">Launch Cards</span>
          </div>
          <svg className="launch-flow-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          <div className="launch-flow-step">
            <span className="launch-flow-num">04</span>
            <span className="launch-flow-label">Post on X / LinkedIn</span>
          </div>
        </div>

        {/* Two equal tool cards */}
        <div className="tool-cards-grid">
          <Link href="/screenshot-builder" className="tool-card-full">
            <div className="tool-card-full-icon" style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            </div>
            <div className="tool-card-full-body">
              <div className="tool-card-full-badge">App Store · Play Store</div>
              <h3 className="tool-card-full-title">Screenshot Builder</h3>
              <p className="tool-card-full-desc">
                Paste your store URL to auto-import screenshots, or upload your own. Add device frames, headlines, and gradients — export at every required size in one click.
              </p>
              <ul className="tool-card-full-features">
                <li>Auto-import from App Store / Play Store</li>
                <li>AI headlines in 15+ languages</li>
                <li>Smart resize across all device sizes</li>
                <li>iPhone, iPad, Android frames</li>
              </ul>
            </div>
            <span className="tool-card-full-cta">Start Building →</span>
          </Link>

          <Link href="/social-optimizer" className="tool-card-full">
            <div className="tool-card-full-icon" style={{ background: "linear-gradient(135deg, #f97316, #ec4899)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>
            </div>
            <div className="tool-card-full-body">
              <div className="tool-card-full-badge">X · LinkedIn · Instagram</div>
              <h3 className="tool-card-full-title">Launch Cards</h3>
              <p className="tool-card-full-desc">
                You shipped. Now tell the world. Drop a screenshot, pick a dev frame — browser, terminal, or device — add a headline and export a share-ready card in 30 seconds.
              </p>
              <ul className="tool-card-full-features">
                <li>X/Twitter, LinkedIn & square formats</li>
                <li>Dev frames: browser, terminal, macOS</li>
                <li>Mesh gradients + 10+ presets</li>
                <li>One-click copy to clipboard</li>
              </ul>
            </div>
            <span className="tool-card-full-cta">Make a Launch Card →</span>
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
                ✨ Now Live
              </span>
              <h3 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.3px" }}>AI-Powered Copywriter</h3>
              <p style={{ fontSize: "13px", color: "var(--text-2)", margin: 0, lineHeight: 1.5 }}>
                Generate high-converting App Store headlines in 15+ languages. Describe your app, pick a tone, and get 5 ready-to-use copy suggestions powered by AI — built into every tool.
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

      {/* ── SOCIAL PROOF / BEFORE → AFTER ── */}
      <section style={{ maxWidth: "1200px", margin: "80px auto 0", padding: "0 40px" }}>
        <div className="section-title">
          <h2>Raw Screenshot → Store-Ready in Seconds</h2>
          <p>See what BuildrStudio does to plain app screenshots.</p>
        </div>
        <div className="examples-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          marginBottom: "100px",
        }}>
          {[
            {
              before: { bg: "#1a1a2e", label: "Raw screenshot" },
              after: { bg: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)", title: "Track Every Rep.", subtitle: "Your personal fitness companion." },
              tool: "App Store Screenshot",
              time: "12 sec",
            },
            {
              before: { bg: "#0f172a", label: "Terminal output" },
              after: { bg: "linear-gradient(135deg, #0ea5e9, #38bdf8, #7dd3fc)", title: "Ship faster with AI", subtitle: "Deploy with confidence." },
              tool: "Social Media Post",
              time: "8 sec",
            },
          ].map((item, idx) => (
            <div key={idx} style={{
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              transition: "transform 0.25s, box-shadow 0.25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
            >
              {/* Before → After visual */}
              <div style={{ display: "flex", height: "200px" }}>
                {/* Before side */}
                <div style={{
                  flex: 1,
                  background: item.before.bg,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  position: "relative",
                }}>
                  <div style={{ width: "40px", height: "70px", borderRadius: "8px", border: "1.5px dashed rgba(255,255,255,0.2)" }} />
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{item.before.label}</span>
                  <span style={{
                    position: "absolute", top: "8px", left: "8px",
                    fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase", letterSpacing: "0.5px",
                  }}>Before</span>
                </div>
                {/* Arrow divider */}
                <div style={{
                  width: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--surface)",
                  fontSize: "16px",
                  color: "var(--text-3)",
                  flexShrink: 0,
                }}>→</div>
                {/* After side */}
                <div style={{
                  flex: 1,
                  background: item.after.bg,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "16px 12px",
                  textAlign: "center",
                  position: "relative",
                }}>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>{item.after.title}</div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.8)" }}>{item.after.subtitle}</div>
                  <div style={{
                    width: "32px", height: "56px", borderRadius: "6px",
                    border: "1.5px solid rgba(255,255,255,0.3)", background: "rgba(0,0,0,0.2)", marginTop: "4px",
                  }} />
                  <span style={{
                    position: "absolute", top: "8px", right: "8px",
                    fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.5)",
                    textTransform: "uppercase", letterSpacing: "0.5px",
                  }}>After</span>
                </div>
              </div>
              <div style={{
                padding: "14px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px solid var(--border)",
              }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-2)" }}>{item.tool}</span>
                <span style={{ fontSize: "11px", color: "var(--fill)", fontWeight: 600 }}>⚡ {item.time}</span>
              </div>
            </div>
          ))}
        </div>

        <style>{`
          @media (max-width: 900px) {
            .examples-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ── FIGMA VS BUILDRSTUDIO ── */}
      <section className="vs-section">
        <div className="section-title">
          <h2>Built For Builders</h2>
          <p>Why indie makers choose BuildrStudio over general design platforms.</p>
        </div>
        <div className="vs-container">
          <div className="vs-column">
            <div className="vs-header" style={{ color: "var(--destructive)" }}>
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
            <div className="vs-header" style={{ color: "var(--success)" }}>
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
          <h2>Simple, honest pricing</h2>
          <p>One plan. Everything included. No tiers to decode.</p>
        </div>
        <div className="pricing-cards" style={{ marginTop: "20px" }}>
          {/* Free */}
          <div className="price-card">
            <h3 className="price-name">Free</h3>
            <div>
              <span className="price-val">$0</span>
              <span className="price-period"> / forever</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-3)", margin: 0 }}>
              Build and export screenshots with no account required.
            </p>
            <ul className="price-features">
              <li className="price-feature"><span>✓</span> All device frames & templates</li>
              <li className="price-feature"><span>✓</span> Gradients, solid colors & mesh</li>
              <li className="price-feature"><span>✓</span> PNG export (with watermark)</li>
              <li className="price-feature"><span>✓</span> 5 AI headline generations</li>
            </ul>
            <Link
              href="/screenshot-builder"
              className="btn-outline btn-md"
              style={{ textAlign: "center", textDecoration: "none" }}
            >
              Start for free
            </Link>
          </div>

          {/* Pro */}
          <div className="price-card pro">
            <span className="badge-pro">Everything included</span>
            <h3 className="price-name" style={{ color: "var(--fill)" }}>Pro</h3>
            <div>
              <span className="price-val">$9</span>
              <span className="price-period"> /month</span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-3)", margin: 0 }}>
              Clean exports, batch sizing, and unlimited AI — all in one plan.
            </p>
            <ul className="price-features">
              <li className="price-feature" style={{ fontWeight: 600 }}><span>✦</span> Watermark-free exports</li>
              <li className="price-feature"><span>✓</span> Batch export — all Apple & Google sizes</li>
              <li className="price-feature"><span>✓</span> Canonical store filenames (ready to upload)</li>
              <li className="price-feature"><span>✓</span> 3D device tilts & 4K PNG</li>
              <li className="price-feature"><span>✓</span> Unlimited AI headline generation</li>
              <li className="price-feature"><span>✓</span> AI translation — 15+ languages</li>
              <li className="price-feature"><span>✓</span> Custom brand presets & swatches</li>
            </ul>
            <button
              type="button"
              onClick={() => setIsPremiumOpen(true)}
              className="btn-fill btn-md"
              style={{ width: "100%", justifyContent: "center", fontWeight: 700, cursor: "pointer", border: "none" }}
            >
              Get Pro — $9/mo
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
          <Link href="/screenshot-builder" className="footer-link">Screenshot Builder</Link>
          <Link href="/social-optimizer" className="footer-link">Launch Cards</Link>
          <Link href="/pricing" className="footer-link">Pricing</Link>
        </div>
        <div className="footer-links" style={{ marginTop: 0 }}>
          <Link href="/updates" className="footer-link">What&apos;s New</Link>
          <Link href="/support" className="footer-link">Support</Link>
          <Link href="/terms" className="footer-link">Terms</Link>
          <Link href="/privacy" className="footer-link">Privacy</Link>
          <Link href="/refund" className="footer-link">Refund Policy</Link>
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

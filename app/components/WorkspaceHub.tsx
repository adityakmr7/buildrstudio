"use client";

import { useState } from "react";
import Link from "next/link";
import ControlSidebar from "./ControlSidebar";
import LivePreviewCanvas from "./LivePreviewCanvas";
import QuickPresets from "./QuickPresets";
import PremiumModal from "./PremiumModal";
import ThemeToggle from "./ThemeToggle";

export interface OptimizationConfig {
  padding: number;         // 16 to 128
  gradientClass: string;   // active CSS class mapping
  borderRadius: string;    // rounded-none | rounded-md | rounded-xl | rounded-3xl
  dropShadow: string;      // shadow-none | shadow-md | shadow-xl | shadow-2xl
  aspectRatio: string;     // aspect-video | aspect-square
}

export default function WorkspaceHub() {
  const [config, setConfig] = useState<OptimizationConfig>({
    padding: 48,
    gradientClass: "bg-gradient-to-tr from-orange-400 via-pink-500 to-indigo-600",
    borderRadius: "rounded-xl",
    dropShadow: "shadow-xl",
    aspectRatio: "aspect-video",
  });

  const [imageSource, setImageSource] = useState<string | null>(null);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  const handleOpenPremium = () => {
    setIsPremiumOpen(true);
  };

  return (
    <>
      <style>{`
        /* ─── HEADER ─── */
        .site-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
          position: sticky;
          top: 0;
          z-index: 100;
          transition: background .3s, border .3s;
        }
        .site-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .site-logo-mark {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--fill);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: var(--fill-text);
          font-weight: 800;
        }
        .site-logo-text {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-1);
          letter-spacing: -0.5px;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-link {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-2);
          padding: 8px 14px;
          border-radius: var(--r-sm);
          transition: all .15s;
          cursor: pointer;
        }
        .nav-link:hover {
          background: var(--fill-subtle);
          color: var(--text-1);
        }

        /* ─── SPACING ─── */
        .spacing-xl { height: 64px; }
        .spacing-lg { height: 48px; }
        .spacing-md { height: 32px; }

        /* ─── WORKSPACE LAYOUT OVERRIDES ─── */
        .page {
          max-width: 1360px !important;
        }
        .site-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
        }
        .workspace-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 32px;
          align-items: flex-start;
        }

        @media (max-width: 992px) {
          .workspace-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .site-header-inner {
            max-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .site-header { padding: 16px 20px; }
        }
      `}</style>

      {/* ─── HEADER ─── */}
      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/" className="site-logo" id="site-logo-link">
            <div className="site-logo-mark">B</div>
            <span className="site-logo-text">BuildrStudio</span>
          </Link>
          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link href="/showcase" className="nav-link" id="showcase-nav-link">Showcase</Link>
            <Link href="/blog" className="nav-link" id="blog-nav-link">Blog</Link>
            <button
              id="header-go-pro-btn"
              onClick={handleOpenPremium}
              className="btn-fill btn-sm"
              style={{
                background: "var(--fill)",
                color: "var(--fill-text)",
                fontWeight: 700,
                fontSize: "12px",
                padding: "8px 12px",
                cursor: "pointer",
                borderRadius: "var(--r-sm)",
                border: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              👑 Go Pro
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="page">
        <div className="section-header">
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <h1 className="section-title">Screenshot-to-Social Media Graphic Optimizer</h1>
            <p style={{ fontSize: "13px", color: "var(--text-3)" }}>
              Instantly turn raw screenshots into professional social graphics.
            </p>
          </div>
          <span className="badge-pill">v1.0</span>
        </div>

        <div className="workspace-grid" style={{ width: "100%", margin: "0 auto" }}>
          {/* Left Column: Presets & Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
            <QuickPresets setConfig={setConfig} />
            <ControlSidebar
              config={config}
              setConfig={setConfig}
              onOpenPremium={handleOpenPremium}
            />
          </div>

          {/* Right Column: Main Preview stage */}
          <div style={{ minWidth: 0, width: "100%" }}>
            <LivePreviewCanvas
              config={config}
              imageSource={imageSource}
              setImageSource={setImageSource}
              onOpenPremium={handleOpenPremium}
            />
          </div>
        </div>
      </main>

      <PremiumModal isOpen={isPremiumOpen} onClose={() => setIsPremiumOpen(false)} />
    </>
  );
}

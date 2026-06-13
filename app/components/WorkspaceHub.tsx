"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import ControlSidebar from "./ControlSidebar";
import LivePreviewCanvas from "./LivePreviewCanvas";
import QuickPresets from "./QuickPresets";
import PremiumModal from "./PremiumModal";
import ThemeToggle from "./ThemeToggle";

// ─── Annotation & Preset Types ───────────────────────────────────────────────

export interface Annotation {
  id: string;
  type: "badge" | "label" | "arrow-right" | "arrow-left" | "arrow-up" | "arrow-down";
  text: string;
  x: number; // 0–100 % of canvas width
  y: number; // 0–100 % of canvas height
  color: string;      // text/icon color
  bgColor: string;    // background (badge only)
  fontSize: number;   // px
}

export interface SavedPreset {
  id: string;
  name: string;
  config: Omit<OptimizationConfig, "annotations" | "savedPresets">;
  createdAt: number;
}

// ─── Gradient / Mesh Presets ─────────────────────────────────────────────────

export interface GradientPreset {
  name: string;
  from: string;
  via?: string;
  to: string;
}

export const GRADIENT_PRESETS: Record<string, GradientPreset> = {
  sunset:          { name: "Sunset",          from: "#fb923c", via: "#ec4899", to: "#6366f1" },
  "midnight-cyber":{ name: "Midnight Cyber",  from: "#4c1d95", via: "#1e1b4b", to: "#0f172a" },
  ocean:           { name: "Ocean",           from: "#38bdf8",                 to: "#059669" },
  "emerald-mist":  { name: "Emerald Mist",   from: "#2dd4bf",                 to: "#15803d" },
  "neon-synth":    { name: "Neon Synth",      from: "#ec4899", via: "#ef4444", to: "#eab308" },
  "minimal-light": { name: "Minimal Light",   from: "#f1f5f9",                 to: "#e2e8f0" },
  "minimal-dark":  { name: "Minimal Dark",    from: "#262626",                 to: "#0a0a0a" },
  cyberpunk:       { name: "Cyberpunk",       from: "#fde047", via: "#ec4899", to: "#ef4444" },
  aurora:          { name: "Aurora",          from: "#6ee7b7", via: "#3b82f6", to: "#9333ea" },
  "rose-gold":     { name: "Rose Gold",       from: "#fda4af",                 to: "#fb7185" },
};

export interface MeshPreset {
  name: string;
  colors: [string, string, string, string];
  base: string;
}

export const MESH_PRESETS: Record<string, MeshPreset> = {
  cosmic:     { name: "Cosmic",      colors: ["#7c3aed", "#2563eb", "#06b6d4", "#8b5cf6"], base: "#0f0f23" },
  forest:     { name: "Forest",      colors: ["#065f46", "#047857", "#0d9488", "#15803d"], base: "#052e16" },
  "sunset-m": { name: "Sunset Mesh", colors: ["#ef4444", "#f97316", "#eab308", "#ec4899"], base: "#1a0a00" },
  nordic:     { name: "Nordic",      colors: ["#1d4ed8", "#0891b2", "#6d28d9", "#1e40af"], base: "#0c0f1a" },
};

// ─── Core Config Type ─────────────────────────────────────────────────────────

export interface OptimizationConfig {
  // Layout
  padding: number;           // 0–128
  borderRadius: string;      // rounded-none | rounded-md | rounded-xl | rounded-3xl
  dropShadow: string;        // shadow-none | shadow-md | shadow-xl | shadow-2xl
  aspectRatio: string;       // aspect-video | aspect-square | aspect-[4/5] | aspect-[9/16]

  // Background
  backgroundType: "gradient" | "solid" | "mesh" | "pattern" | "image";
  gradientPreset: string;        // key into GRADIENT_PRESETS
  gradientDirection: number;     // degrees: 45 | 90 | 135 | 180 | 225 | 270 | 315 | 360
  solidColor: string;            // hex
  meshPreset: string;            // key into MESH_PRESETS
  patternType: "dots" | "grid" | "diagonal" | "crosshatch" | "circles";
  patternColor: string;          // hex, pattern ink color
  patternBgColor: string;        // hex, pattern background
  noiseIntensity: number;        // 0–100

  // Background image upload
  backgroundImageUrl: string | null;

  // Frame
  frameStyle: "macos" | "browser" | "terminal" | "iphone" | "android" | "none";
  frameDarkMode: boolean;
  browserUrl: string;

  // Caption / Text Overlay
  captionTitle: string;
  captionSubtitle: string;
  captionAlign: "left" | "center" | "right";
  captionPosition: "top" | "bottom";
  captionTitleColor: string;
  captionSubtitleColor: string;
  captionTitleSize: number;     // 12–48
  captionGlass: boolean;

  // Image adjustments
  imageBrightness: number;      // 50–150 (100 = normal)
  imageContrast: number;        // 50–150 (100 = normal)
  imageSaturation: number;      // 0–200  (100 = normal)
  imageScale: number;           // 70–110 (100 = normal)

  // Annotations
  annotations: Annotation[];

  // User-saved presets
  savedPresets: SavedPreset[];
}

const DEFAULT_CONFIG: OptimizationConfig = {
  padding: 48,
  borderRadius: "rounded-xl",
  dropShadow: "shadow-xl",
  aspectRatio: "aspect-video",

  backgroundType: "gradient",
  gradientPreset: "sunset",
  gradientDirection: 135,
  solidColor: "#6366f1",
  meshPreset: "cosmic",
  patternType: "dots",
  patternColor: "#ffffff",
  patternBgColor: "#1e1b4b",
  noiseIntensity: 0,
  backgroundImageUrl: null,

  frameStyle: "macos",
  frameDarkMode: false,
  browserUrl: "buildrstudio.in",

  captionTitle: "",
  captionSubtitle: "",
  captionAlign: "center",
  captionPosition: "bottom",
  captionTitleColor: "#ffffff",
  captionSubtitleColor: "rgba(255,255,255,0.75)",
  captionTitleSize: 18,
  captionGlass: true,

  imageBrightness: 100,
  imageContrast: 100,
  imageSaturation: 100,
  imageScale: 100,

  annotations: [],
  savedPresets: [],
};

// ─── WorkspaceHub ─────────────────────────────────────────────────────────────

export default function WorkspaceHub() {
  const [config, setConfig] = useState<OptimizationConfig>(DEFAULT_CONFIG);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  const handleOpenPremium = () => setIsPremiumOpen(true);

  // Annotation position update (called from LivePreviewCanvas during drag)
  const handleUpdateAnnotation = useCallback((id: string, x: number, y: number) => {
    setConfig((prev) => ({
      ...prev,
      annotations: prev.annotations.map((a) =>
        a.id === id ? { ...a, x, y } : a
      ),
    }));
  }, []);

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

        /* ─── WORKSPACE LAYOUT ─── */
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
          grid-template-columns: 360px 1fr;
          gap: 32px;
          align-items: flex-start;
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 992px) {
          .workspace-grid {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          .workspace-sidebar { order: 2; width: 100%; }
          .workspace-canvas  { order: 1; width: 100%; margin-bottom: 12px; }
          .site-header-inner { max-width: 100%; }
        }
        @media (max-width: 640px) {
          .site-header { padding: 16px 20px; }
          .site-header-inner { flex-direction: column; gap: 12px; align-items: center; }
          .nav-links { width: 100%; justify-content: center; flex-wrap: wrap; }
        }

        /* ─── PRESETS & BUTTONS ─── */
        .presets-list { display: grid; grid-template-columns: 1fr; gap: 8px; }
        @media (min-width: 600px) and (max-width: 992px) {
          .presets-list { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .canvas-action-buttons { flex-direction: column !important; width: 100%; }
          .canvas-action-buttons button { width: 100% !important; min-width: 0 !important; justify-content: center; }
          .share-buttons-container { flex-direction: column !important; width: 100%; }
          .share-buttons-container button { width: 100% !important; justify-content: center; }
        }
      `}</style>

      {/* ─── HEADER ─── */}
      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/" className="site-logo" id="site-logo-link">
            <div className="site-logo-mark">B</div>
            <span className="site-logo-text">BuildrStudio</span>
          </Link>
          <div className="nav-links">
            <Link href="/showcase" className="nav-link" id="showcase-nav-link">Showcase</Link>
            <Link href="/blog"     className="nav-link" id="blog-nav-link">Blog</Link>
            <Link href="/roadmap"  className="nav-link" id="roadmap-nav-link">Roadmap</Link>
            <Link href="/change-log" className="nav-link" id="changelog-nav-link">Changelog</Link>
            <button
              id="header-go-pro-btn"
              onClick={handleOpenPremium}
              className="btn-fill btn-sm"
              style={{ background: "var(--fill)", color: "var(--fill-text)", fontWeight: 700, fontSize: "12px", cursor: "pointer", border: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              👑 Go Pro
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ─── MAIN ─── */}
      <main className="page">
        <div className="section-header">
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <h1 className="section-title">Screenshot-to-Social Media Graphic Optimizer</h1>
            <p style={{ fontSize: "13px", color: "var(--text-3)" }}>
              Instantly turn raw screenshots into professional social graphics.
            </p>
          </div>
          <span className="badge-pill">v2.0</span>
        </div>

        <div className="workspace-grid" style={{ width: "100%", margin: "0 auto" }}>
          {/* Left — Presets & Controls */}
          <div className="workspace-sidebar" style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
            <QuickPresets config={config} setConfig={setConfig} />
            <ControlSidebar
              config={config}
              setConfig={setConfig}
              onOpenPremium={handleOpenPremium}
            />
          </div>

          {/* Right — Canvas */}
          <div className="workspace-canvas" style={{ minWidth: 0, width: "100%" }}>
            <LivePreviewCanvas
              config={config}
              imageSource={imageSource}
              setImageSource={setImageSource}
              onOpenPremium={handleOpenPremium}
              onUpdateAnnotation={handleUpdateAnnotation}
            />
          </div>
        </div>
      </main>

      <PremiumModal isOpen={isPremiumOpen} onClose={() => setIsPremiumOpen(false)} />
    </>
  );
}

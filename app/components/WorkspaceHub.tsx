"use client";

import { useState, useCallback, useRef } from "react";
import TabbedSidebar from "./TabbedSidebar";
import LivePreviewCanvas, { LivePreviewCanvasHandle } from "./LivePreviewCanvas";
import PremiumModal from "./PremiumModal";
import AppHeader from "./AppHeader";

// ─── Annotation & Preset Types ────────────────────────────────────────────────

export interface Annotation {
  id: string;
  type: "badge" | "label" | "arrow-right" | "arrow-left" | "arrow-up" | "arrow-down";
  text: string;
  x: number;
  y: number;
  color: string;
  bgColor: string;
  fontSize: number;
}

export interface SavedPreset {
  id: string;
  name: string;
  config: Omit<OptimizationConfig, "annotations" | "savedPresets">;
  createdAt: number;
}

// ─── Gradient / Mesh Presets ──────────────────────────────────────────────────

export interface GradientPreset { name: string; from: string; via?: string; to: string; }
export interface MeshPreset     { name: string; colors: [string, string, string, string]; base: string; }

export const GRADIENT_PRESETS: Record<string, GradientPreset> = {
  sunset:             { name: "Sunset",         from: "#fb923c", via: "#ec4899", to: "#6366f1" },
  "midnight-cyber":   { name: "Midnight Cyber", from: "#4c1d95", via: "#1e1b4b", to: "#0f172a" },
  ocean:              { name: "Ocean",          from: "#38bdf8",                  to: "#059669" },
  "emerald-mist":     { name: "Emerald Mist",  from: "#2dd4bf",                  to: "#15803d" },
  "neon-synth":       { name: "Neon Synth",    from: "#ec4899", via: "#ef4444",  to: "#eab308" },
  "minimal-light":    { name: "Minimal Light", from: "#f1f5f9",                  to: "#e2e8f0" },
  "minimal-dark":     { name: "Minimal Dark",  from: "#262626",                  to: "#0a0a0a" },
  cyberpunk:          { name: "Cyberpunk",      from: "#fde047", via: "#ec4899", to: "#ef4444" },
  aurora:             { name: "Aurora",         from: "#6ee7b7", via: "#3b82f6", to: "#9333ea" },
  "rose-gold":        { name: "Rose Gold",      from: "#fda4af",                 to: "#fb7185" },
};

export const MESH_PRESETS: Record<string, MeshPreset> = {
  cosmic:     { name: "Cosmic",      colors: ["#7c3aed","#2563eb","#06b6d4","#8b5cf6"], base: "#0f0f23" },
  forest:     { name: "Forest",      colors: ["#065f46","#047857","#0d9488","#15803d"], base: "#052e16" },
  "sunset-m": { name: "Sunset Mesh", colors: ["#ef4444","#f97316","#eab308","#ec4899"], base: "#1a0a00" },
  nordic:     { name: "Nordic",      colors: ["#1d4ed8","#0891b2","#6d28d9","#1e40af"], base: "#0c0f1a" },
};

// ─── Core Config Type ─────────────────────────────────────────────────────────

export interface OptimizationConfig {
  padding: number;
  borderRadius: string;
  dropShadow: string;
  aspectRatio: string;

  backgroundType: "gradient" | "solid" | "mesh" | "pattern" | "image";
  gradientPreset: string;
  gradientDirection: number;
  solidColor: string;
  meshPreset: string;
  patternType: "dots" | "grid" | "diagonal" | "crosshatch" | "circles";
  patternColor: string;
  patternBgColor: string;
  noiseIntensity: number;
  backgroundImageUrl: string | null;

  frameStyle: "macos" | "browser" | "terminal" | "iphone" | "android" | "none";
  frameDarkMode: boolean;
  browserUrl: string;

  captionTitle: string;
  captionSubtitle: string;
  captionAlign: "left" | "center" | "right";
  captionPosition: "top" | "bottom";
  captionTitleColor: string;
  captionSubtitleColor: string;
  captionTitleSize: number;
  captionGlass: boolean;

  imageBrightness: number;
  imageContrast: number;
  imageSaturation: number;
  imageScale: number;

  annotations: Annotation[];
  savedPresets: SavedPreset[];
}

const DEFAULT_CONFIG: OptimizationConfig = {
  padding: 48, borderRadius: "rounded-xl", dropShadow: "shadow-xl", aspectRatio: "aspect-video",
  backgroundType: "gradient", gradientPreset: "sunset", gradientDirection: 135,
  solidColor: "#6366f1", meshPreset: "cosmic", patternType: "dots",
  patternColor: "#ffffff", patternBgColor: "#1e1b4b", noiseIntensity: 0, backgroundImageUrl: null,
  frameStyle: "macos", frameDarkMode: false, browserUrl: "buildrstudio.in",
  captionTitle: "", captionSubtitle: "", captionAlign: "center", captionPosition: "bottom",
  captionTitleColor: "#ffffff", captionSubtitleColor: "rgba(255,255,255,0.75)", captionTitleSize: 18, captionGlass: true,
  imageBrightness: 100, imageContrast: 100, imageSaturation: 100, imageScale: 100,
  annotations: [], savedPresets: [],
};

// ─── Aspect Ratio Options ─────────────────────────────────────────────────────

const RATIO_OPTIONS = [
  { label: "16:9", value: "aspect-video"  },
  { label: "1:1",  value: "aspect-square" },
  { label: "4:5",  value: "aspect-[4/5]"  },
  { label: "9:16", value: "aspect-[9/16]" },
];

// ─── CanvasToolbar ────────────────────────────────────────────────────────────

interface CanvasToolbarProps {
  config: OptimizationConfig;
  setConfig: React.Dispatch<React.SetStateAction<OptimizationConfig>>;
  imageSource: string | null;
  setImageSource: React.Dispatch<React.SetStateAction<string | null>>;
  liveRef: React.RefObject<LivePreviewCanvasHandle | null>;
}

function CanvasToolbar({ config, setConfig, imageSource, setImageSource, liveRef }: CanvasToolbarProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying,   setIsCopying]   = useState(false);
  const [copyStatus,  setCopyStatus]  = useState<"idle" | "ok" | "err">("idle");

  const disabled = !imageSource;

  const getRenderFn = () => liveRef.current?.renderToPng;

  const handleExport = async () => {
    const renderFn = getRenderFn();
    if (!renderFn || disabled) return;
    setIsExporting(true);
    try {
      const dataUrl = await renderFn();
      const a = document.createElement("a");
      a.download = `buildrstudio-${Date.now()}.png`;
      a.href = dataUrl;
      a.click();
      a.remove();
    } catch (e) {
      console.error("Export error:", e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    const renderFn = getRenderFn();
    if (!renderFn || disabled) return;
    setIsCopying(true);
    setCopyStatus("idle");
    try {
      const blobP = renderFn().then(async (dataUrl) => {
        const res = await fetch(dataUrl);
        return res.blob();
      });
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blobP as unknown as Blob }),
      ]);
      setCopyStatus("ok");
      setTimeout(() => setCopyStatus("idle"), 2200);
    } catch {
      setCopyStatus("err");
      setTimeout(() => setCopyStatus("idle"), 2200);
    } finally {
      setIsCopying(false);
    }
  };

  const shareToTwitter = async () => {
    if (disabled) return;
    const renderFn = getRenderFn();
    if (!renderFn) return;
    // Copy first, then open Twitter
    try {
      const blobP = renderFn().then(async (dataUrl) => { const res = await fetch(dataUrl); return res.blob(); });
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blobP as unknown as Blob })]);
    } catch {}
    liveRef.current?.showShareToast("X (Twitter)");
    const text = encodeURIComponent("Just optimized a screenshot with BuildrStudio! ✨\n");
    const url  = encodeURIComponent("https://buildrstudio.in");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const shareToLinkedIn = async () => {
    if (disabled) return;
    const renderFn = getRenderFn();
    if (!renderFn) return;
    try {
      const blobP = renderFn().then(async (dataUrl) => { const res = await fetch(dataUrl); return res.blob(); });
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blobP as unknown as Blob })]);
    } catch {}
    liveRef.current?.showShareToast("LinkedIn");
    window.open("https://www.linkedin.com/feed/", "_blank");
  };

  const btnBase: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: "5px", border: "1.5px solid var(--border)",
    borderRadius: "var(--r-sm)", background: "transparent", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "var(--font)", fontSize: "12px", fontWeight: 600, padding: "6px 10px",
    color: disabled ? "var(--text-3)" : "var(--text-1)", opacity: disabled ? 0.45 : 1,
    transition: "all .12s", whiteSpace: "nowrap",
  };

  return (
    <div className="canvas-toolbar">
      {/* Left: aspect ratio pills */}
      <div style={{ display: "flex", gap: "4px" }}>
        {RATIO_OPTIONS.map((r) => (
          <button key={r.value} type="button"
            className={`ratio-pill${config.aspectRatio === r.value ? " active" : ""}`}
            onClick={() => setConfig((p) => ({ ...p, aspectRatio: r.value }))}>
            {r.label}
          </button>
        ))}
      </div>

      <div className="canvas-toolbar-divider" />

      {/* Change screenshot */}
      {imageSource && (
        <button type="button" style={{ ...btnBase, color: "var(--text-2)", fontSize: "11px" }}
          onClick={() => setImageSource(null)}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--text-1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-2)"; }}>
          <span style={{ fontSize: "13px" }}>🔄</span> Change
        </button>
      )}

      <div className="canvas-toolbar-spacer" />

      {/* Share buttons */}
      <button type="button" style={btnBase} disabled={disabled} onClick={shareToTwitter}
        onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.background = "var(--fill-subtle)"; }}}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}>
        <span>🐦</span> X
      </button>
      <button type="button" style={btnBase} disabled={disabled} onClick={shareToLinkedIn}
        onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.background = "var(--fill-subtle)"; }}}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}>
        <span>💼</span> LinkedIn
      </button>

      <div className="canvas-toolbar-divider" />

      {/* Copy */}
      <button type="button" disabled={disabled || isCopying} onClick={handleCopy}
        style={{ ...btnBase, cursor: (disabled || isCopying) ? "not-allowed" : "pointer", minWidth: "110px", justifyContent: "center",
          background: copyStatus === "ok"  ? "var(--success-subtle, #dcfce7)" : "transparent",
          borderColor: copyStatus === "ok" ? "var(--success, #22c55e)"        : "var(--border)",
          color: copyStatus === "ok" ? "#15803d" : copyStatus === "err" ? "#dc2626" : disabled ? "var(--text-3)" : "var(--text-1)",
        }}
        onMouseEnter={(e) => { if (!disabled && !isCopying) { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.background = "var(--fill-subtle)"; }}}
        onMouseLeave={(e) => { if (copyStatus !== "ok") { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}}>
        {isCopying    ? <><Spinner /> Copying…</>
         : copyStatus === "ok"  ? <>✓ Copied!</>
         : copyStatus === "err" ? <>❌ Error</>
         : <><span>📋</span> Copy</>}
      </button>

      {/* Export */}
      <button type="button" disabled={disabled || isExporting} onClick={handleExport}
        style={{ ...btnBase, background: disabled ? "transparent" : "var(--fill)", borderColor: disabled ? "var(--border)" : "var(--fill)",
          color: disabled ? "var(--text-3)" : "var(--fill-text)", cursor: (disabled || isExporting) ? "not-allowed" : "pointer",
          minWidth: "130px", justifyContent: "center",
        }}
        onMouseEnter={(e) => { if (!disabled && !isExporting) e.currentTarget.style.opacity = "0.85"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
        {isExporting ? <><Spinner light /> Exporting…</> : <><span>📥</span> Export PNG</>}
      </button>
    </div>
  );
}

function Spinner({ light }: { light?: boolean }) {
  return (
    <span style={{ width: "12px", height: "12px", border: `2px solid ${light ? "rgba(255,255,255,0.3)" : "var(--border-strong)"}`, borderTop: `2px solid ${light ? "white" : "var(--text-1)"}`, borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
  );
}

// ─── WorkspaceHub ─────────────────────────────────────────────────────────────

export default function WorkspaceHub() {
  const [config,      setConfig]      = useState<OptimizationConfig>(DEFAULT_CONFIG);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const liveRef = useRef<LivePreviewCanvasHandle>(null);

  const handleUpdateAnnotation = useCallback((id: string, x: number, y: number) => {
    setConfig((prev) => ({
      ...prev,
      annotations: prev.annotations.map((a) => (a.id === id ? { ...a, x, y } : a)),
    }));
  }, []);

  return (
    <div className="workspace-root">

      <AppHeader activeRoute="social-optimizer" onOpenPremium={() => setIsPremiumOpen(true)} />

      {/* ── WORKSPACE BODY ── */}
      <div className="workspace-body">

        {/* Left: Tabbed Sidebar */}
        <TabbedSidebar
          config={config}
          setConfig={setConfig}
          onOpenPremium={() => setIsPremiumOpen(true)}
        />

        {/* Right: Canvas Column */}
        <div className="canvas-column">
          {/* Toolbar always visible above canvas */}
          <CanvasToolbar
            config={config}
            setConfig={setConfig}
            imageSource={imageSource}
            setImageSource={setImageSource}
            liveRef={liveRef}
          />

          {/* Canvas scrollable area */}
          <div className="canvas-preview-area">
            <LivePreviewCanvas
              ref={liveRef}
              config={config}
              imageSource={imageSource}
              setImageSource={setImageSource}
              onOpenPremium={() => setIsPremiumOpen(true)}
              onUpdateAnnotation={handleUpdateAnnotation}
            />
          </div>
        </div>
      </div>

      <PremiumModal isOpen={isPremiumOpen} onClose={() => setIsPremiumOpen(false)} />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to   { transform: translate(-50%, 0);    opacity: 1; }
        }
        /* Ensure no scrollbars on the root page since workspace-root handles it */
        body { overflow: hidden; }
        @media (max-width: 900px) {
          body { overflow: auto; }
        }
      `}</style>
    </div>
  );
}

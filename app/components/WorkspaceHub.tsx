"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import TabbedSidebar from "./TabbedSidebar";
import LivePreviewCanvas, { LivePreviewCanvasHandle } from "./LivePreviewCanvas";
import PremiumModal from "./PremiumModal";
import AppHeader from "./AppHeader";
import UnlockWatermarkModal from "./UnlockWatermarkModal";
import ToolCrossLinks from "./ToolCrossLinks";
import { useToast } from "./Toast";

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
  isFeedPreview: boolean;
  setIsFeedPreview: React.Dispatch<React.SetStateAction<boolean>>;
}

function CanvasToolbar({
  config,
  setConfig,
  imageSource,
  setImageSource,
  liveRef,
  isFeedPreview,
  setIsFeedPreview,
}: CanvasToolbarProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying,   setIsCopying]   = useState(false);
  const [copyStatus,  setCopyStatus]  = useState<"idle" | "ok" | "err">("idle");
  const { toast } = useToast();

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
      toast("PNG exported! Share it on social media", "success", {
        label: "Share on X",
        onClick: () => {
          const text = encodeURIComponent("Just designed this with @BuildrStudio — turn screenshots into social-ready graphics in seconds!\n");
          const url = encodeURIComponent("https://buildrstudio.in");
          window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
        },
      });
    } catch (e) {
      console.error("Export error:", e);
      toast("Export failed — please try again", "error");
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
      toast("Copied to clipboard!", "success");
      setTimeout(() => setCopyStatus("idle"), 2200);
    } catch {
      setCopyStatus("err");
      toast("Failed to copy — try exporting instead", "error");
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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg> Change
        </button>
      )}

      <div className="canvas-toolbar-spacer" />

      {/* Feed Simulator Toggle */}
      <button type="button" style={{
        ...btnBase,
        background: isFeedPreview ? "var(--fill-subtle)" : "transparent",
        borderColor: isFeedPreview ? "var(--text-1)" : "var(--border)",
        color: isFeedPreview ? "var(--text-1)" : "var(--text-2)",
      }} disabled={disabled} onClick={() => setIsFeedPreview(!isFeedPreview)}
        onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.borderColor = "var(--text-1)"; }}
        onMouseLeave={(e) => { if (!isFeedPreview) e.currentTarget.style.borderColor = "var(--border)"; }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> {isFeedPreview ? "Show Image Only" : "Simulate Feed"}
      </button>

      <div className="canvas-toolbar-divider" />

      {/* Share buttons */}
      <button type="button" style={btnBase} disabled={disabled} onClick={shareToTwitter}
        onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.background = "var(--fill-subtle)"; }}}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.635 5.902-5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> X
      </button>
      <button type="button" style={btnBase} disabled={disabled} onClick={shareToLinkedIn}
        onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.background = "var(--fill-subtle)"; }}}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> LinkedIn
      </button>

      <div className="canvas-toolbar-divider" />

      {/* Copy */}
      <button type="button" disabled={disabled || isCopying} onClick={handleCopy}
        style={{ ...btnBase, cursor: (disabled || isCopying) ? "not-allowed" : "pointer", minWidth: "110px", justifyContent: "center",
          background: copyStatus === "ok"  ? "var(--success-subtle)" : "transparent",
          borderColor: copyStatus === "ok" ? "var(--success)"        : "var(--border)",
          color: copyStatus === "ok" ? "var(--success-text)" : copyStatus === "err" ? "var(--destructive)" : disabled ? "var(--text-3)" : "var(--text-1)",
        }}
        onMouseEnter={(e) => { if (!disabled && !isCopying) { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.background = "var(--fill-subtle)"; }}}
        onMouseLeave={(e) => { if (copyStatus !== "ok") { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "transparent"; }}}>
        {isCopying    ? <><Spinner /> Copying…</>
         : copyStatus === "ok"  ? <>✓ Copied!</>
         : copyStatus === "err" ? <>✕ Error</>
         : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</>}
      </button>

      {/* Export */}
      <button type="button" disabled={disabled || isExporting} onClick={handleExport}
        style={{ ...btnBase, background: disabled ? "transparent" : "var(--fill)", borderColor: disabled ? "var(--border)" : "var(--fill)",
          color: disabled ? "var(--text-3)" : "var(--fill-text)", cursor: (disabled || isExporting) ? "not-allowed" : "pointer",
          minWidth: "130px", justifyContent: "center",
        }}
        onMouseEnter={(e) => { if (!disabled && !isExporting) e.currentTarget.style.opacity = "0.85"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
        {isExporting ? <><Spinner light /> Exporting…</> : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export PNG</>}
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
  const { data: session } = useSession();
  const [config,      setConfig]      = useState<OptimizationConfig>(DEFAULT_CONFIG);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isFeedPreview, setIsFeedPreview] = useState(false);
  const [isWatermarkUnlocked, setIsWatermarkUnlocked] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const liveRef = useRef<LivePreviewCanvasHandle>(null);
  const { toast } = useToast();

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === "s") {
        e.preventDefault();
        if (!imageSource || !liveRef.current) return;
        liveRef.current.renderToPng().then((dataUrl) => {
          const a = document.createElement("a");
          a.download = `buildrstudio-${Date.now()}.png`;
          a.href = dataUrl;
          a.click();
          a.remove();
          toast("PNG exported! (⌘S)", "success", {
            label: "Share on X",
            onClick: () => {
              const text = encodeURIComponent("Just designed this with @BuildrStudio — turn screenshots into social-ready graphics in seconds!\n");
              const url = encodeURIComponent("https://buildrstudio.in");
              window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
            },
          });
        }).catch(() => toast("Export failed", "error"));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [imageSource, toast]);

  useEffect(() => {
    if (session?.user?.isPro) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsWatermarkUnlocked(true);
      return;
    }
    const checkUnlock = () => {
      const untilStr = localStorage.getItem("watermark_unlocked_until");
      if (untilStr) {
        const until = parseInt(untilStr, 10);
        if (until > Date.now()) {
          setIsWatermarkUnlocked(true);
        } else {
          localStorage.removeItem("watermark_unlocked_until");
          setIsWatermarkUnlocked(false);
        }
      } else {
        setIsWatermarkUnlocked(false);
      }
    };
    checkUnlock();
    window.addEventListener("focus", checkUnlock);
    return () => window.removeEventListener("focus", checkUnlock);
  }, [session?.user?.isPro]);

  const handleUnlockWatermark = () => {
    const unlockedUntil = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem("watermark_unlocked_until", unlockedUntil.toString());
    setIsWatermarkUnlocked(true);
  };

  const handleUpdateAnnotation = useCallback((id: string, x: number, y: number) => {
    setConfig((prev) => ({
      ...prev,
      annotations: prev.annotations.map((a) => (a.id === id ? { ...a, x, y } : a)),
    }));
  }, []);

  // Extract colors and automatically set solid color
  useEffect(() => {
    if (!imageSource) return;

    const extractColors = async () => {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          canvas.width = 30;
          canvas.height = 30;
          ctx.drawImage(img, 0, 0, 30, 30);

          const data = ctx.getImageData(0, 0, 30, 30).data;
          const colorCount: Record<string, number> = {};

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i+1];
            const b = data[i+2];
            const a = data[i+3];
            if (a < 200) continue;

            const qr = Math.round(r / 20) * 20;
            const qg = Math.round(g / 20) * 20;
            const qb = Math.round(b / 20) * 20;
            const hex = "#" + ((1 << 24) + (qr << 16) + (qg << 8) + qb).toString(16).slice(1);
            colorCount[hex] = (colorCount[hex] || 0) + 1;
          }

          const sorted = Object.entries(colorCount)
            .sort((a, b) => b[1] - a[1])
            .map(x => x[0]);

          if (sorted.length > 0) {
            const dominantColor = sorted.find(c => {
              const r = parseInt(c.slice(1, 3), 16);
              const g = parseInt(c.slice(3, 5), 16);
              const b = parseInt(c.slice(5, 7), 16);
              const brightness = (r * 299 + g * 587 + b * 114) / 1000;
              return brightness > 30 && brightness < 225;
            }) || sorted[0];

            if (dominantColor) {
              setConfig((prev) => {
                if (prev.backgroundType === "solid" && (prev.solidColor === "#6366f1" || prev.solidColor === "#0f172a")) {
                  return { ...prev, solidColor: dominantColor };
                }
                return prev;
              });
            }
          }
        };
        img.src = imageSource;
      } catch (err) {
        console.warn("Color extraction failed:", err);
      }
    };

    extractColors();
  }, [imageSource]);

  return (
    <div className="workspace-root">

      <AppHeader activeRoute="social-optimizer" onOpenPremium={() => setIsPremiumOpen(true)} />

      {/* ── WORKSPACE BODY ── */}
      <div className="workspace-body">

        {/* Left: Canvas Column */}
        <div className="canvas-column">
          {/* Toolbar always visible above canvas */}
          <CanvasToolbar
            config={config}
            setConfig={setConfig}
            imageSource={imageSource}
            setImageSource={setImageSource}
            liveRef={liveRef}
            isFeedPreview={isFeedPreview}
            setIsFeedPreview={setIsFeedPreview}
          />

          {/* Canvas scrollable area */}
          <div className="canvas-preview-area">
            <LivePreviewCanvas
              ref={liveRef}
              config={config}
              onUpdateConfig={(key, val) => setConfig((prev) => ({ ...prev, [key]: val }))}
              imageSource={imageSource}
              setImageSource={setImageSource}
              onOpenPremium={() => setIsPremiumOpen(true)}
              onUpdateAnnotation={handleUpdateAnnotation}
              isFeedPreview={isFeedPreview}
              isWatermarkUnlocked={isWatermarkUnlocked}
              onOpenUnlockWatermark={() => setIsUnlockModalOpen(true)}
            />
          </div>
        </div>

        {/* Right: Tabbed Sidebar */}
        <TabbedSidebar
          config={config}
          setConfig={setConfig}
          onOpenPremium={() => setIsPremiumOpen(true)}
          isWatermarkUnlocked={isWatermarkUnlocked}
          onOpenUnlockWatermark={() => setIsUnlockModalOpen(true)}
        />
      </div>

      <ToolCrossLinks current="/social-optimizer" />

      <PremiumModal isOpen={isPremiumOpen} onClose={() => setIsPremiumOpen(false)} />

      <UnlockWatermarkModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        onUnlock={handleUnlockWatermark}
        onOpenPremium={() => {
          setIsUnlockModalOpen(false);
          setIsPremiumOpen(true);
        }}
      />

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

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { domToPng } from "modern-screenshot";
import { OptimizationConfig, GRADIENT_PRESETS, MESH_PRESETS, Annotation } from "./WorkspaceHub";

interface LivePreviewCanvasProps {
  config: OptimizationConfig;
  imageSource: string | null;
  setImageSource: React.Dispatch<React.SetStateAction<string | null>>;
  onOpenPremium: () => void;
  onUpdateAnnotation: (id: string, x: number, y: number) => void;
}

interface UmamiWindow extends Window {
  umami?: {
    track: (name: string, data?: Record<string, string | number | boolean>) => void;
  };
}

// ─── Background Helpers ───────────────────────────────────────────────────────

function buildPatternBg(type: string, inkColor: string, bgColor: string): string {
  const c = encodeURIComponent(inkColor);
  let svg = "";
  switch (type) {
    case "dots":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="4" cy="4" r="2" fill="${inkColor}" opacity="0.45"/></svg>`;
      break;
    case "grid":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="${inkColor}" stroke-width="0.6" opacity="0.35"/></svg>`;
      break;
    case "diagonal":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><line x1="0" y1="12" x2="12" y2="0" stroke="${inkColor}" stroke-width="0.7" opacity="0.35"/></svg>`;
      break;
    case "crosshatch":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><line x1="0" y1="6" x2="12" y2="6" stroke="${inkColor}" stroke-width="0.5" opacity="0.3"/><line x1="6" y1="0" x2="6" y2="12" stroke="${inkColor}" stroke-width="0.5" opacity="0.3"/></svg>`;
      break;
    case "circles":
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="13" fill="none" stroke="${inkColor}" stroke-width="0.6" opacity="0.3"/></svg>`;
      break;
    default:
      return bgColor;
  }
  return `${bgColor} url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function computeBackground(config: OptimizationConfig): React.CSSProperties {
  switch (config.backgroundType) {
    case "gradient": {
      const preset = GRADIENT_PRESETS[config.gradientPreset] ?? GRADIENT_PRESETS.sunset;
      const stops = preset.via
        ? `${preset.from}, ${preset.via}, ${preset.to}`
        : `${preset.from}, ${preset.to}`;
      return { background: `linear-gradient(${config.gradientDirection}deg, ${stops})` };
    }
    case "solid":
      return { background: config.solidColor };
    case "mesh": {
      const mesh = MESH_PRESETS[config.meshPreset] ?? MESH_PRESETS.cosmic;
      const [c1, c2, c3, c4] = mesh.colors;
      return {
        background: [
          `radial-gradient(ellipse at 15% 15%, ${c1}cc 0%, transparent 55%)`,
          `radial-gradient(ellipse at 85% 10%, ${c2}99 0%, transparent 55%)`,
          `radial-gradient(ellipse at 10% 80%, ${c3}99 0%, transparent 55%)`,
          `radial-gradient(ellipse at 85% 85%, ${c4}cc 0%, transparent 50%)`,
          mesh.base,
        ].join(", "),
      };
    }
    case "pattern":
      return {
        background: buildPatternBg(config.patternType, config.patternColor, config.patternBgColor),
        backgroundRepeat: "repeat",
      };
    case "image":
      return config.backgroundImageUrl
        ? {
            backgroundImage: `url(${config.backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }
        : { background: "#1a1a2e" };
    default:
      return {};
  }
}

// ─── FrameBar ─────────────────────────────────────────────────────────────────

function FrameBar({
  frameStyle,
  frameDarkMode,
  browserUrl,
}: {
  frameStyle: OptimizationConfig["frameStyle"];
  frameDarkMode: boolean;
  browserUrl: string;
}) {
  if (frameStyle === "none") return null;

  const darkBg  = frameDarkMode ? "#1a1a1a" : "var(--surface-2)";
  const darkBdr = frameDarkMode ? "#333"    : "var(--border)";
  const txtClr  = frameDarkMode ? "#e0e0e0" : "var(--text-2)";

  const base: React.CSSProperties = {
    borderBottom: `1px solid ${darkBdr}`,
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  };

  const DOT = (color: string) => (
    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
  );

  switch (frameStyle) {
    case "macos":
      return (
        <div style={{ ...base, background: darkBg, height: "30px", padding: "0 12px", gap: "6px" }}>
          {DOT("#FF5F56")} {DOT("#FFBD2E")} {DOT("#27C93F")}
        </div>
      );

    case "browser":
      return (
        <div style={{ ...base, background: darkBg, height: "34px", padding: "0 10px", gap: "6px" }}>
          {DOT("#FF5F56")} {DOT("#FFBD2E")} {DOT("#27C93F")}
          <div style={{
            flex: 1,
            height: "20px",
            background: frameDarkMode ? "#2d2d2d" : "#f0f0f0",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            padding: "0 8px",
            gap: "5px",
            marginLeft: "8px",
            marginRight: "4px",
          }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={frameDarkMode ? "#6ee7b7" : "#22c55e"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span style={{ fontSize: "9px", color: txtClr, fontFamily: "monospace", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1 }}>
              {browserUrl || "buildrstudio.in"}
            </span>
          </div>
        </div>
      );

    case "terminal":
      return (
        <div style={{ ...base, background: "#2d2d2d", height: "30px", padding: "0 12px", gap: "6px", borderBottom: "1px solid #1a1a1a" }}>
          {DOT("#FF5F56")} {DOT("#FFBD2E")} {DOT("#27C93F")}
          <span style={{ flex: 1, textAlign: "center", fontSize: "11px", color: "#808080", fontFamily: "monospace", letterSpacing: "-0.3px" }}>
            bash — ~/workspace
          </span>
        </div>
      );

    case "iphone":
      return (
        <div style={{ ...base, background: frameDarkMode ? "#000" : "#f5f5f5", height: "44px", padding: "0 18px", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: frameDarkMode ? "#fff" : "#000", fontFamily: "system-ui" }}>9:41</span>
          {/* Dynamic island */}
          <div style={{ background: "#000", borderRadius: "20px", width: "88px", height: "22px" }} />
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            {/* Signal bars */}
            <svg width="14" height="10" viewBox="0 0 14 10" fill={frameDarkMode ? "#fff" : "#000"} opacity="0.85">
              <rect x="0"  y="6" width="2" height="4" rx="0.5"/>
              <rect x="3"  y="4" width="2" height="6" rx="0.5"/>
              <rect x="6"  y="2" width="2" height="8" rx="0.5"/>
              <rect x="9"  y="0" width="2" height="10" rx="0.5"/>
            </svg>
            {/* Wifi */}
            <svg width="14" height="10" viewBox="0 0 24 24" fill="none" stroke={frameDarkMode ? "#fff" : "#000"} strokeWidth="2" strokeLinecap="round" opacity="0.85">
              <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
            </svg>
            {/* Battery */}
            <svg width="18" height="10" viewBox="0 0 24 13" fill="none" stroke={frameDarkMode ? "#fff" : "#000"} strokeWidth="1.5" strokeLinecap="round" opacity="0.85">
              <rect x="1" y="2" width="18" height="9" rx="2"/>
              <path d="M20 5v3" strokeWidth="2.5"/>
              <rect x="2.5" y="3.5" width="13" height="6" rx="1" fill={frameDarkMode ? "#fff" : "#000"} stroke="none"/>
            </svg>
          </div>
        </div>
      );

    case "android":
      return (
        <div style={{ ...base, background: frameDarkMode ? "#121212" : "#f5f5f5", height: "36px", padding: "0 16px", justifyContent: "space-between", borderBottom: `1px solid ${darkBdr}` }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: frameDarkMode ? "#e0e0e0" : "#111", fontFamily: "system-ui" }}>9:41</span>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {/* Android status icons (minimal) */}
            <svg width="12" height="10" viewBox="0 0 12 10" fill={frameDarkMode ? "#e0e0e0" : "#111"} opacity="0.7">
              <rect x="0" y="4" width="2" height="6" rx="0.5"/>
              <rect x="3" y="2.5" width="2" height="7.5" rx="0.5"/>
              <rect x="6" y="1" width="2" height="9" rx="0.5"/>
              <rect x="9" y="0" width="2" height="10" rx="0.5"/>
            </svg>
            <svg width="14" height="10" viewBox="0 0 24 13" fill="none" stroke={frameDarkMode ? "#e0e0e0" : "#111"} strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
              <rect x="1" y="2" width="18" height="9" rx="2"/>
              <path d="M20 5v3" strokeWidth="2.5"/>
              <rect x="2.5" y="3.5" width="12" height="6" rx="1" fill={frameDarkMode ? "#e0e0e0" : "#111"} stroke="none"/>
            </svg>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// ─── CaptionOverlay ───────────────────────────────────────────────────────────

function CaptionOverlay({ config }: { config: OptimizationConfig }) {
  if (!config.captionTitle && !config.captionSubtitle) return null;

  const style: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    [config.captionPosition]: 0,
    padding: "12px 18px",
    textAlign: config.captionAlign,
    zIndex: 5,
    ...(config.captionGlass
      ? {
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          background: "rgba(0,0,0,0.22)",
        }
      : {}),
  };

  return (
    <div style={style}>
      {config.captionTitle && (
        <div
          style={{
            fontSize: `${config.captionTitleSize}px`,
            fontWeight: 800,
            color: config.captionTitleColor,
            lineHeight: 1.15,
            letterSpacing: "-0.3px",
          }}
        >
          {config.captionTitle}
        </div>
      )}
      {config.captionSubtitle && (
        <div
          style={{
            fontSize: `${Math.max(config.captionTitleSize - 5, 10)}px`,
            color: config.captionSubtitleColor,
            marginTop: "3px",
            lineHeight: 1.4,
            fontWeight: 500,
          }}
        >
          {config.captionSubtitle}
        </div>
      )}
    </div>
  );
}

// ─── AnnotationNode ───────────────────────────────────────────────────────────

function AnnotationNode({
  ann,
  onMouseDown,
}: {
  ann: Annotation;
  onMouseDown: (e: React.MouseEvent, id: string) => void;
}) {
  const arrowMap: Record<string, string> = {
    "arrow-right": "→",
    "arrow-left":  "←",
    "arrow-up":    "↑",
    "arrow-down":  "↓",
  };

  const inner =
    ann.type === "badge" ? (
      <div
        style={{
          background: ann.bgColor,
          color: ann.color,
          borderRadius: "9999px",
          padding: "4px 12px",
          fontSize: `${ann.fontSize}px`,
          fontWeight: 700,
          whiteSpace: "nowrap",
          boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
          fontFamily: "var(--font)",
        }}
      >
        {ann.text}
      </div>
    ) : ann.type === "label" ? (
      <div
        style={{
          color: ann.color,
          fontSize: `${ann.fontSize}px`,
          fontWeight: 700,
          textShadow: "0 1px 4px rgba(0,0,0,0.6)",
          whiteSpace: "nowrap",
          fontFamily: "var(--font)",
        }}
      >
        {ann.text}
      </div>
    ) : (
      <div style={{ display: "flex", alignItems: "center", gap: "5px", color: ann.color }}>
        <span style={{ fontSize: `${ann.fontSize + 6}px`, textShadow: "0 1px 4px rgba(0,0,0,0.5)", fontWeight: 700, lineHeight: 1 }}>
          {arrowMap[ann.type] ?? "→"}
        </span>
        {ann.text && (
          <span
            style={{
              fontSize: `${ann.fontSize}px`,
              fontWeight: 700,
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              whiteSpace: "nowrap",
              fontFamily: "var(--font)",
            }}
          >
            {ann.text}
          </span>
        )}
      </div>
    );

  return (
    <div
      style={{
        position: "absolute",
        left: `${ann.x}%`,
        top: `${ann.y}%`,
        transform: "translate(-50%, -50%)",
        cursor: "grab",
        userSelect: "none",
        zIndex: 20,
      }}
      onMouseDown={(e) => onMouseDown(e, ann.id)}
    >
      {inner}
    </div>
  );
}

// ─── LivePreviewCanvas ────────────────────────────────────────────────────────

export default function LivePreviewCanvas({
  config,
  imageSource,
  setImageSource,
  onOpenPremium,
  onUpdateAnnotation,
}: LivePreviewCanvasProps) {
  const canvasRef   = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging,    setIsDragging]   = useState(false);
  const [isExporting,   setIsExporting]  = useState(false);
  const [isCopying,     setIsCopying]    = useState(false);
  const [copyStatus,    setCopyStatus]   = useState<"idle" | "success" | "error">("idle");
  const [shareToast,    setShareToast]   = useState<{ show: boolean; platform: string } | null>(null);
  const [draggingId,    setDraggingId]   = useState<string | null>(null);

  // ── Annotation dragging ──
  useEffect(() => {
    if (!draggingId) return;

    const handleMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.max(2, Math.min(98, ((e.clientX - rect.left)  / rect.width)  * 100));
      const y = Math.max(2, Math.min(98, ((e.clientY - rect.top)   / rect.height) * 100));
      onUpdateAnnotation(draggingId, x, y);
    };
    const handleUp = () => setDraggingId(null);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup",   handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup",   handleUp);
    };
  }, [draggingId, onUpdateAnnotation]);

  const handleAnnotationMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setDraggingId(id);
  }, []);

  // ── Image input ──
  const handleFileCapture = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImageSource(URL.createObjectURL(file));
  }, [setImageSource]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) handleFileCapture(file);
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handleFileCapture]);

  // ── Export ──
  const captureCanvas = async () => {
    if (!canvasRef.current) throw new Error("No canvas");
    await new Promise((r) => setTimeout(r, 80));
    return domToPng(canvasRef.current, { quality: 1, scale: 2 });
  };

  const trackUmami = (event: string) => {
    const w = typeof window !== "undefined" ? (window as unknown as UmamiWindow) : null;
    if (w?.umami) {
      w.umami.track(event, {
        ratio: config.aspectRatio,
        bg: config.backgroundType,
        frame: config.frameStyle,
      });
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await captureCanvas();
      const a = document.createElement("a");
      a.download = `buildrstudio-${Date.now()}.png`;
      a.href = dataUrl;
      a.click();
      a.remove();
      trackUmami("image_exported");
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    setIsCopying(true);
    setCopyStatus("idle");
    try {
      const blobPromise = (async () => {
        const dataUrl = await captureCanvas();
        const res = await fetch(dataUrl);
        return res.blob();
      })();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blobPromise as unknown as Blob })]);
      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 2200);
      trackUmami("image_copied");
    } catch {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2200);
    } finally {
      setIsCopying(false);
    }
  };

  const shareToTwitter = () => {
    setShareToast({ show: true, platform: "X (Twitter)" });
    handleCopyToClipboard();
    const text = encodeURIComponent("Just optimized a screenshot for social using BuildrStudio! ✨ (Press Cmd+V to paste)\n\n");
    const url  = encodeURIComponent("https://buildrstudio.in");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    setTimeout(() => setShareToast(null), 3500);
  };

  const shareToLinkedIn = () => {
    setShareToast({ show: true, platform: "LinkedIn" });
    handleCopyToClipboard();
    window.open("https://www.linkedin.com/feed/", "_blank");
    setTimeout(() => setShareToast(null), 3500);
  };

  const shareNative = async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await captureCanvas();
      const res  = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "buildrstudio-social-post.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "BuildrStudio Social Graphic" });
      }
    } catch {}
  };

  // ── Canvas dimension helpers ──
  const canvasMaxWidth = {
    "aspect-video":  "640px",
    "aspect-square": "480px",
    "aspect-[4/5]":  "400px",
    "aspect-[9/16]": "340px",
  }[config.aspectRatio] ?? "640px";

  const imgMaxHeight = {
    "aspect-video":  "310px",
    "aspect-square": "380px",
    "aspect-[4/5]":  "370px",
    "aspect-[9/16]": "540px",
  }[config.aspectRatio] ?? "310px";

  // ── Image filter ──
  const imgFilter = [
    `brightness(${config.imageBrightness / 100})`,
    `contrast(${config.imageContrast / 100})`,
    `saturate(${config.imageSaturation / 100})`,
  ].join(" ");

  const bgStyle = computeBackground(config);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Drop Zone (no image) ── */}
      {!imageSource ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFileCapture(f); }}
          onClick={() => fileInputRef.current?.click()}
          className="card-default"
          style={{
            height: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: isDragging ? "2px dashed var(--text-1)" : "2px dashed var(--border-strong)",
            background: isDragging ? "var(--fill-subtle)" : "var(--surface)",
            transition: "all 0.2s ease",
            gap: "16px",
            textAlign: "center",
            padding: "24px",
          }}
        >
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileCapture(f); }} />
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--fill-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
            📸
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-1)" }}>Ingest your screenshot</span>
            <p style={{ fontSize: "13px", color: "var(--text-3)", maxWidth: "280px" }}>
              Drag &amp; drop, click to browse, or paste from clipboard (Cmd+V).
            </p>
          </div>
          <button type="button" className="btn-outline btn-sm" style={{ pointerEvents: "none", marginTop: "8px" }}>
            Select Image
          </button>
        </div>
      ) : (
        <>
          {/* ── Active Canvas ── */}
          <div
            style={{
              background: "var(--surface-3)",
              borderRadius: "var(--r-2xl)",
              border: "1px solid var(--border)",
              padding: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {/* Serializable canvas (this div gets exported) */}
            <div
              ref={canvasRef}
              className={`canvas-capture-wrapper relative overflow-hidden ${config.aspectRatio}`}
              style={{
                ...bgStyle,
                width: "100%",
                maxWidth: canvasMaxWidth,
                padding: `${config.padding}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {/* Noise / grain overlay */}
              {config.noiseIntensity > 0 && (
                <div
                  className="canvas-noise-layer"
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: config.noiseIntensity / 100,
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                >
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <filter id="bs-noise">
                      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                      <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#bs-noise)" opacity="1" />
                  </svg>
                </div>
              )}

              {/* Caption (top) */}
              {config.captionPosition === "top" && <CaptionOverlay config={config} />}

              {/* Frame + Screenshot */}
              <div
                className={`${config.borderRadius} ${config.dropShadow} overflow-hidden`}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  width: "100%",
                  maxHeight: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {/* Frame bar */}
                <FrameBar
                  frameStyle={config.frameStyle}
                  frameDarkMode={config.frameDarkMode}
                  browserUrl={config.browserUrl}
                />

                {/* Screenshot */}
                <div
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--surface)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSource}
                    alt="Screenshot source"
                    style={{
                      width: "100%",
                      height: "100%",
                      maxHeight: imgMaxHeight,
                      objectFit: "contain",
                      display: "block",
                      filter: imgFilter,
                      transform: `scale(${config.imageScale / 100})`,
                      transformOrigin: "center center",
                    }}
                  />
                </div>
              </div>

              {/* Caption (bottom) */}
              {config.captionPosition === "bottom" && <CaptionOverlay config={config} />}

              {/* Annotations */}
              {config.annotations.map((ann) => (
                <AnnotationNode
                  key={ann.id}
                  ann={ann}
                  onMouseDown={handleAnnotationMouseDown}
                />
              ))}

              {/* Watermark */}
              <div
                className="badge-dark"
                style={{
                  position: "absolute",
                  bottom: "12px",
                  right: "14px",
                  fontSize: "10px",
                  fontWeight: 600,
                  opacity: 0.9,
                  zIndex: 30,
                  padding: "3px 9px",
                  userSelect: "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onClick={onOpenPremium}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                title="Upgrade to Pro to remove watermark"
              >
                via buildrStudio.in 👑
              </div>
            </div>
          </div>

          {/* ── Action Buttons ── */}
          <div className="canvas-action-buttons" style={{ display: "flex", gap: "12px", justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button type="button" className="btn-ghost" onClick={() => setImageSource(null)}>
              Change Screenshot
            </button>
            <button
              type="button"
              className="btn-outline btn-lg"
              onClick={handleCopyToClipboard}
              disabled={isCopying}
              style={{ minWidth: "160px", opacity: isCopying ? 0.75 : 1, cursor: isCopying ? "not-allowed" : "pointer" }}
            >
              {isCopying
                ? "Copying..."
                : copyStatus === "success"
                ? "✓ Copied!"
                : copyStatus === "error"
                ? "❌ Error"
                : "📋 Copy to Clipboard"}
            </button>
            <button
              type="button"
              className="btn-fill btn-lg"
              onClick={handleExport}
              disabled={isExporting}
              style={{ minWidth: "160px", opacity: isExporting ? 0.75 : 1, cursor: isExporting ? "not-allowed" : "pointer" }}
            >
              {isExporting ? (
                <>
                  <span style={{ width: "14px", height: "14px", border: "2px solid var(--fill-text)", borderTop: "2px solid transparent", borderRadius: "50%", display: "inline-block", animation: "spin 1s linear infinite" }} />
                  <span>Exporting...</span>
                </>
              ) : (
                <><span>📥</span><span>Export PNG</span></>
              )}
            </button>
          </div>

          {/* ── Share & Engagement ── */}
          <div
            className="comp-block"
            style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div className="comp-label" style={{ marginBottom: "0" }}>Share &amp; Engagement</div>
            <div className="share-buttons-container" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <button type="button" className="btn-outline btn-sm" onClick={shareToTwitter} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>🐦</span> Post on X (Twitter)
              </button>
              <button type="button" className="btn-outline btn-sm" onClick={shareToLinkedIn} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>💼</span> Share on LinkedIn
              </button>
              {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                <button type="button" className="btn-outline btn-sm" onClick={shareNative} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>📤</span> System Share
                </button>
              )}
            </div>
            <p style={{ fontSize: "11px", color: "var(--text-3)", margin: 0, lineHeight: 1.5 }}>
              💡 <strong>Pro Tip:</strong> Clicking <em>Post on X</em> or <em>Share on LinkedIn</em> copies the graphic to your clipboard. Just press <strong>Cmd+V</strong> in the composer!
            </p>
          </div>
        </>
      )}

      {/* ── Share toast ── */}
      {shareToast?.show && (
        <div
          style={{
            position: "fixed",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--fill)",
            color: "var(--fill-text)",
            padding: "16px 24px",
            borderRadius: "var(--r-xl)",
            boxShadow: "var(--shadow-lg)",
            zIndex: 2000,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "380px",
            width: "calc(100% - 40px)",
            animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>📋</span>
            <strong style={{ fontSize: "14px" }}>Image Copied to Clipboard!</strong>
          </div>
          <span style={{ fontSize: "12px", opacity: 0.9, lineHeight: 1.4 }}>
            Opening {shareToast.platform}…{" "}
            {shareToast.platform === "LinkedIn" ? "Click 'Start a post' and press " : "Just press "}
            <strong>Cmd+V</strong> (or <strong>Ctrl+V</strong>) to paste!
          </span>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to   { transform: translate(-50%, 0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

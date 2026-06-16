"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { domToPng } from "modern-screenshot";
import { OptimizationConfig, GRADIENT_PRESETS, MESH_PRESETS, Annotation } from "./WorkspaceHub";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LivePreviewCanvasHandle {
  /** Returns a PNG data URL at 2× resolution */
  renderToPng: () => Promise<string>;
  /** Trigger the share toast from the toolbar */
  showShareToast: (platform: string) => void;
}

interface LivePreviewCanvasProps {
  config: OptimizationConfig;
  onUpdateConfig?: (key: keyof OptimizationConfig, val: any) => void;
  imageSource: string | null;
  setImageSource: React.Dispatch<React.SetStateAction<string | null>>;
  onOpenPremium: () => void;
  onUpdateAnnotation: (id: string, x: number, y: number) => void;
  isFeedPreview?: boolean;
  isWatermarkUnlocked?: boolean;
  onOpenUnlockWatermark?: () => void;
}

interface UmamiWindow extends Window {
  umami?: { track: (n: string, d?: Record<string, string | number | boolean>) => void };
}

// ─── Background helpers ───────────────────────────────────────────────────────

function buildPatternBg(type: string, inkColor: string, bgColor: string): string {
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
      const p = GRADIENT_PRESETS[config.gradientPreset] ?? GRADIENT_PRESETS.sunset;
      const stops = p.via ? `${p.from}, ${p.via}, ${p.to}` : `${p.from}, ${p.to}`;
      return { background: `linear-gradient(${config.gradientDirection}deg, ${stops})` };
    }
    case "solid":
      return { background: config.solidColor };
    case "mesh": {
      const m = MESH_PRESETS[config.meshPreset] ?? MESH_PRESETS.cosmic;
      const [c1, c2, c3, c4] = m.colors;
      return {
        background: [
          `radial-gradient(ellipse at 15% 15%, ${c1}cc 0%, transparent 55%)`,
          `radial-gradient(ellipse at 85% 10%, ${c2}99 0%, transparent 55%)`,
          `radial-gradient(ellipse at 10% 80%, ${c3}99 0%, transparent 55%)`,
          `radial-gradient(ellipse at 85% 85%, ${c4}cc 0%, transparent 50%)`,
          m.base,
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
        ? { backgroundImage: `url(${config.backgroundImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
        : { background: "#1a1a2e" };
    default:
      return {};
  }
}

// ─── FrameBar ─────────────────────────────────────────────────────────────────

function FrameBar({ frameStyle, frameDarkMode, browserUrl }: Pick<OptimizationConfig, "frameStyle" | "frameDarkMode" | "browserUrl">) {
  if (frameStyle === "none") return null;

  const darkBg  = frameDarkMode ? "#1a1a1a" : "var(--surface-2)";
  const darkBdr = frameDarkMode ? "#333"    : "var(--border)";
  const txtClr  = frameDarkMode ? "#e0e0e0" : "var(--text-2)";
  const base: React.CSSProperties = { borderBottom: `1px solid ${darkBdr}`, display: "flex", alignItems: "center", flexShrink: 0 };

  const Dot = ({ color }: { color: string }) => (
    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
  );

  switch (frameStyle) {
    case "macos":
      return (
        <div style={{ ...base, background: darkBg, height: "30px", padding: "0 12px", gap: "6px" }}>
          <Dot color="#FF5F56" /> <Dot color="#FFBD2E" /> <Dot color="#27C93F" />
        </div>
      );
    case "browser":
      return (
        <div style={{ ...base, background: darkBg, height: "34px", padding: "0 10px", gap: "6px" }}>
          <Dot color="#FF5F56" /> <Dot color="#FFBD2E" /> <Dot color="#27C93F" />
          <div style={{ flex: 1, height: "20px", background: frameDarkMode ? "#2d2d2d" : "#f0f0f0", borderRadius: "5px", display: "flex", alignItems: "center", padding: "0 8px", gap: "5px", margin: "0 4px 0 8px" }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={frameDarkMode ? "#6ee7b7" : "#22c55e"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
          <Dot color="#FF5F56" /> <Dot color="#FFBD2E" /> <Dot color="#27C93F" />
          <span style={{ flex: 1, textAlign: "center", fontSize: "11px", color: "#808080", fontFamily: "monospace" }}>bash — ~/workspace</span>
        </div>
      );
    case "iphone":
      return (
        <div style={{ ...base, background: frameDarkMode ? "#000" : "#f5f5f5", height: "44px", padding: "0 18px", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: frameDarkMode ? "#fff" : "#000", fontFamily: "system-ui" }}>9:41</span>
          <div style={{ background: "#000", borderRadius: "20px", width: "88px", height: "22px" }} />
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <svg width="14" height="10" viewBox="0 0 14 10" fill={frameDarkMode ? "#fff" : "#000"} opacity="0.85">
              <rect x="0" y="6" width="2" height="4" rx="0.5"/><rect x="3" y="4" width="2" height="6" rx="0.5"/>
              <rect x="6" y="2" width="2" height="8" rx="0.5"/><rect x="9" y="0" width="2" height="10" rx="0.5"/>
            </svg>
            <svg width="18" height="10" viewBox="0 0 24 13" fill="none" stroke={frameDarkMode ? "#fff" : "#000"} strokeWidth="1.5" strokeLinecap="round" opacity="0.85">
              <rect x="1" y="2" width="18" height="9" rx="2"/><path d="M20 5v3" strokeWidth="2.5"/>
              <rect x="2.5" y="3.5" width="13" height="6" rx="1" fill={frameDarkMode ? "#fff" : "#000"} stroke="none"/>
            </svg>
          </div>
        </div>
      );
    case "android":
      return (
        <div style={{ ...base, background: frameDarkMode ? "#121212" : "#f5f5f5", height: "36px", padding: "0 16px", justifyContent: "space-between" }}>
          <span style={{ fontSize: "10px", fontWeight: 700, color: frameDarkMode ? "#e0e0e0" : "#111", fontFamily: "system-ui" }}>9:41</span>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <svg width="12" height="10" viewBox="0 0 12 10" fill={frameDarkMode ? "#e0e0e0" : "#111"} opacity="0.7">
              <rect x="0" y="4" width="2" height="6" rx="0.5"/><rect x="3" y="2.5" width="2" height="7.5" rx="0.5"/>
              <rect x="6" y="1" width="2" height="9" rx="0.5"/><rect x="9" y="0" width="2" height="10" rx="0.5"/>
            </svg>
            <svg width="14" height="10" viewBox="0 0 24 13" fill="none" stroke={frameDarkMode ? "#e0e0e0" : "#111"} strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
              <rect x="1" y="2" width="18" height="9" rx="2"/><path d="M20 5v3" strokeWidth="2.5"/>
              <rect x="2.5" y="3.5" width="12" height="6" rx="1" fill={frameDarkMode ? "#e0e0e0" : "#111"} stroke="none"/>
            </svg>
          </div>
        </div>
      );
    default: return null;
  }
}

// ─── CaptionOverlay ───────────────────────────────────────────────────────────

function CaptionOverlay({
  config,
  onUpdateConfig,
}: {
  config: OptimizationConfig;
  onUpdateConfig?: (key: keyof OptimizationConfig, val: any) => void;
}) {
  const displayTitle = config.captionTitle;
  const displaySubtitle = config.captionSubtitle;

  if (!displayTitle && !displaySubtitle) return null;

  return (
    <div style={{
      position: "absolute", left: 0, right: 0, [config.captionPosition]: 0,
      padding: "12px 18px", textAlign: config.captionAlign, zIndex: 5,
      ...(config.captionGlass ? { backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", background: "rgba(0,0,0,0.22)" } : {}),
    }}>
      {displayTitle && (
        <div
          contentEditable={!!onUpdateConfig}
          suppressContentEditableWarning
          onBlur={(e) => {
            const text = e.currentTarget.textContent || "";
            if (onUpdateConfig) {
              onUpdateConfig("captionTitle", text);
            }
          }}
          style={{
            fontSize: `${config.captionTitleSize}px`,
            fontWeight: 800,
            color: config.captionTitleColor,
            lineHeight: 1.15,
            letterSpacing: "-0.3px",
            outline: "none",
            cursor: onUpdateConfig ? "text" : "default",
            padding: "2px 4px",
            borderRadius: "4px",
            border: onUpdateConfig ? "1px dashed transparent" : "none",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            if (onUpdateConfig) e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
          }}
          onMouseLeave={(e) => {
            if (onUpdateConfig) e.currentTarget.style.borderColor = "transparent";
          }}
        >
          {config.captionTitle}
        </div>
      )}
      {displaySubtitle && (
        <div
          contentEditable={!!onUpdateConfig}
          suppressContentEditableWarning
          onBlur={(e) => {
            const text = e.currentTarget.textContent || "";
            if (onUpdateConfig) {
              onUpdateConfig("captionSubtitle", text);
            }
          }}
          style={{
            fontSize: `${Math.max(config.captionTitleSize - 5, 10)}px`,
            color: config.captionSubtitleColor,
            marginTop: "3px",
            lineHeight: 1.4,
            fontWeight: 500,
            outline: "none",
            cursor: onUpdateConfig ? "text" : "default",
            padding: "2px 4px",
            borderRadius: "4px",
            border: onUpdateConfig ? "1px dashed transparent" : "none",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            if (onUpdateConfig) e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
          }}
          onMouseLeave={(e) => {
            if (onUpdateConfig) e.currentTarget.style.borderColor = "transparent";
          }}
        >
          {config.captionSubtitle}
        </div>
      )}
    </div>
  );
}

// ─── AnnotationNode ───────────────────────────────────────────────────────────

function AnnotationNode({ ann, onMouseDown }: { ann: Annotation; onMouseDown: (e: React.MouseEvent, id: string) => void }) {
  const arrowMap: Record<string, string> = { "arrow-right": "→", "arrow-left": "←", "arrow-up": "↑", "arrow-down": "↓" };

  const inner = ann.type === "badge" ? (
    <div style={{ background: ann.bgColor, color: ann.color, borderRadius: "9999px", padding: "4px 12px", fontSize: `${ann.fontSize}px`, fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 2px 10px rgba(0,0,0,0.25)", fontFamily: "var(--font)" }}>
      {ann.text}
    </div>
  ) : ann.type === "label" ? (
    <div style={{ color: ann.color, fontSize: `${ann.fontSize}px`, fontWeight: 700, textShadow: "0 1px 4px rgba(0,0,0,0.6)", whiteSpace: "nowrap", fontFamily: "var(--font)" }}>
      {ann.text}
    </div>
  ) : (
    <div style={{ display: "flex", alignItems: "center", gap: "5px", color: ann.color }}>
      <span style={{ fontSize: `${ann.fontSize + 6}px`, textShadow: "0 1px 4px rgba(0,0,0,0.5)", fontWeight: 700, lineHeight: 1 }}>{arrowMap[ann.type] ?? "→"}</span>
      {ann.text && <span style={{ fontSize: `${ann.fontSize}px`, fontWeight: 700, textShadow: "0 1px 4px rgba(0,0,0,0.5)", whiteSpace: "nowrap", fontFamily: "var(--font)" }}>{ann.text}</span>}
    </div>
  );

  return (
    <div style={{ position: "absolute", left: `${ann.x}%`, top: `${ann.y}%`, transform: "translate(-50%, -50%)", cursor: "grab", userSelect: "none", zIndex: 20 }}
      onMouseDown={(e) => onMouseDown(e, ann.id)}>
      {inner}
    </div>
  );
}

// ─── LivePreviewCanvas ────────────────────────────────────────────────────────

const LivePreviewCanvas = forwardRef<LivePreviewCanvasHandle, LivePreviewCanvasProps>(
  function LivePreviewCanvas({
    config,
    onUpdateConfig,
    imageSource,
    setImageSource,
    onOpenPremium,
    onUpdateAnnotation,
    isFeedPreview = false,
    isWatermarkUnlocked = false,
    onOpenUnlockWatermark = () => {},
  }, ref) {
    const canvasRef    = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging,  setIsDragging]  = useState(false);
    const [draggingId,  setDraggingId]  = useState<string | null>(null);
    const [shareToast,  setShareToast]  = useState<{ show: boolean; platform: string } | null>(null);

    // ── Expose renderToPng + showShareToast via ref ──
    useImperativeHandle(ref, () => ({
      renderToPng: async () => {
        if (!canvasRef.current) throw new Error("Canvas not mounted");
        await new Promise((r) => setTimeout(r, 80));
        return domToPng(canvasRef.current, { quality: 1, scale: 2 });
      },
      showShareToast: (platform: string) => {
        setShareToast({ show: true, platform });
        setTimeout(() => setShareToast(null), 3500);
      },
    }));

    // ── Annotation dragging ──
    useEffect(() => {
      if (!draggingId) return;
      const onMove = (e: MouseEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.max(2, Math.min(98, ((e.clientX - rect.left)  / rect.width)  * 100));
        const y = Math.max(2, Math.min(98, ((e.clientY - rect.top)   / rect.height) * 100));
        onUpdateAnnotation(draggingId, x, y);
      };
      const onUp = () => setDraggingId(null);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup",   onUp);
      return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    }, [draggingId, onUpdateAnnotation]);

    const handleAnnotMouseDown = useCallback((e: React.MouseEvent, id: string) => {
      e.preventDefault();
      setDraggingId(id);
    }, []);

    // ── Paste / file ──
    const handleFile = useCallback((file: File) => {
      if (!file.type.startsWith("image/")) return;
      setImageSource(URL.createObjectURL(file));
    }, [setImageSource]);

    useEffect(() => {
      const onPaste = (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) { const f = items[i].getAsFile(); if (f) handleFile(f); }
        }
      };

      const onDragOver = (e: DragEvent) => {
        e.preventDefault();
      };

      const onDrop = (e: DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
          const f = files[0];
          if (f.type.startsWith("image/")) {
            handleFile(f);
          }
        }
      };

      window.addEventListener("paste", onPaste);
      window.addEventListener("dragover", onDragOver);
      window.addEventListener("drop", onDrop);

      return () => {
        window.removeEventListener("paste", onPaste);
        window.removeEventListener("dragover", onDragOver);
        window.removeEventListener("drop", onDrop);
      };
    }, [handleFile]);

    const bgStyle   = computeBackground(config);
    const imgFilter = `brightness(${config.imageBrightness / 100}) contrast(${config.imageContrast / 100}) saturate(${config.imageSaturation / 100})`;
    const canvasMaxWidth = { "aspect-video": "640px", "aspect-square": "480px", "aspect-[4/5]": "400px", "aspect-[9/16]": "320px" }[config.aspectRatio] ?? "640px";
    const imgMaxHeight   = { "aspect-video": "310px", "aspect-square": "380px", "aspect-[4/5]": "370px", "aspect-[9/16]": "530px" }[config.aspectRatio] ?? "310px";

    if (!imageSource) {
      return (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0" }}>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            onClick={() => fileInputRef.current?.click()}
            style={{
              height: "380px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              cursor: "pointer", borderRadius: "var(--r-2xl)", border: `2px dashed ${isDragging ? "var(--text-1)" : "var(--border-strong)"}`,
              background: isDragging ? "var(--fill-subtle)" : "var(--surface)", transition: "all 0.2s ease",
              gap: "16px", textAlign: "center", padding: "24px",
            }}>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "var(--fill-subtle)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>📸</div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-1)", marginBottom: "6px" }}>Drop your screenshot here</div>
              <p style={{ fontSize: "13px", color: "var(--text-3)", margin: 0 }}>Or click to browse · Cmd+V to paste from clipboard</p>
            </div>
          </div>
        </div>
      );
    }

    const canvasElement = (
      <div
        ref={canvasRef}
        className={`canvas-capture-wrapper relative overflow-hidden ${config.aspectRatio}`}
        style={{ ...bgStyle, width: "100%", maxWidth: isFeedPreview ? "100%" : canvasMaxWidth, padding: `${config.padding}px`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
      >
        {/* Noise layer */}
        {config.noiseIntensity > 0 && (
          <div className="canvas-noise-layer" style={{ opacity: config.noiseIntensity / 100, zIndex: 1 }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <filter id="bs-noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#bs-noise)" />
            </svg>
          </div>
        )}

        {/* Caption (top) */}
        {config.captionPosition === "top" && <CaptionOverlay config={config} onUpdateConfig={onUpdateConfig} />}

        {/* Frame + Screenshot */}
        <div className={`${config.borderRadius} ${config.dropShadow} overflow-hidden`}
          style={{ background: "var(--surface)", border: "1px solid var(--border)", width: "100%", display: "flex", flexDirection: "column", position: "relative", zIndex: 2 }}>
          <FrameBar frameStyle={config.frameStyle} frameDarkMode={config.frameDarkMode} browserUrl={config.browserUrl} />
          <div style={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSource} alt="Screenshot" style={{ width: "100%", height: "100%", maxHeight: imgMaxHeight, objectFit: "contain", display: "block", filter: imgFilter, transform: `scale(${config.imageScale / 100})`, transformOrigin: "center center" }} />
          </div>
        </div>

        {/* Caption (bottom) */}
        {config.captionPosition === "bottom" && <CaptionOverlay config={config} onUpdateConfig={onUpdateConfig} />}

        {/* Annotations */}
        {config.annotations.map((ann) => (
          <AnnotationNode key={ann.id} ann={ann} onMouseDown={handleAnnotMouseDown} />
        ))}

        {/* Watermark */}
        {!isWatermarkUnlocked && (
          <div className="badge-dark" onClick={(e) => { e.stopPropagation(); onOpenUnlockWatermark(); }} title="Unlock to remove"
            style={{ position: "absolute", bottom: "12px", right: "14px", fontSize: "10px", fontWeight: 600, opacity: 0.9, zIndex: 30, padding: "3px 9px", userSelect: "none", cursor: "pointer", transition: "transform 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
            via buildrStudio.in 👑
          </div>
        )}
      </div>
    );

    return (
      <>
        {isFeedPreview ? (
          <div style={{
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--r-xl)",
            boxShadow: "var(--shadow-sm)",
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            color: "var(--text-1)",
            textAlign: "left",
          }}>
            {/* User Info Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--fill), var(--fill-subtle))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--fill-text)",
                userSelect: "none",
              }}>
                🚀
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-1)", outline: "none", cursor: "text" }}
                  >
                    You
                  </span>
                  <span style={{ fontSize: "14px", color: "var(--text-3)" }}>· 2m</span>
                </div>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  style={{ fontSize: "14px", color: "var(--text-3)", outline: "none", cursor: "text" }}
                >
                  @yourhandle
                </span>
              </div>
            </div>

            {/* Tweet text */}
            <div
              contentEditable
              suppressContentEditableWarning
              style={{
                fontSize: "15px",
                lineHeight: "1.5",
                color: "var(--text-1)",
                marginBottom: "14px",
                outline: "none",
                cursor: "text",
                whiteSpace: "pre-wrap",
              }}
            >
              Just designed this screenshot using @BuildrStudio. The gradients and direct caption editing are so smooth! 🚀✨ #buildinpublic
            </div>

            {/* Media box */}
            <div style={{
              borderRadius: "16px",
              overflow: "hidden",
              border: "1.5px solid var(--border)",
              background: "var(--surface-2)",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
              {canvasElement}
            </div>

            {/* Action Footer */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              maxWidth: "425px",
              marginTop: "12px",
              paddingLeft: "4px",
              color: "var(--text-3)",
              fontSize: "13px",
              userSelect: "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <span>💬</span> <span>12</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <span>🔁</span> <span>5</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <span>❤️</span> <span>48</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <span>🔖</span> <span>10</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <span>📤</span>
              </div>
            </div>
          </div>
        ) : (
          canvasElement
        )}

        {/* Share toast */}
        {shareToast?.show && (
          <div style={{ position: "fixed", bottom: "32px", left: "50%", transform: "translateX(-50%)", background: "var(--fill)", color: "var(--fill-text)", padding: "16px 24px", borderRadius: "var(--r-xl)", boxShadow: "var(--shadow-lg)", zIndex: 2000, display: "flex", flexDirection: "column", gap: "6px", alignItems: "center", textAlign: "center", maxWidth: "380px", width: "calc(100% - 40px)", animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px" }}>📋</span>
              <strong style={{ fontSize: "14px" }}>Copied to Clipboard!</strong>
            </div>
            <span style={{ fontSize: "12px", opacity: 0.9, lineHeight: 1.4 }}>
              Opening {shareToast.platform}… press <strong>Cmd+V</strong> to paste!
            </span>
          </div>
        )}
      </>
    );
  }
);

export default LivePreviewCanvas;

"use client";

// ─── BuilderCanvas.tsx ───────────────────────────────────────────────────────
// Live preview canvas for the App Store Screenshot Builder.
// Supports zoom (ctrl+scroll / buttons), pan (drag on empty space),
// and image drag-to-reposition within the device frame.

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import { domToPng } from "modern-screenshot";
import type { BuilderConfig, DeviceSpec, GradDir } from "../lib/deviceSpecs";
import { getDevice, GRADIENT_PRESETS } from "../lib/deviceSpecs";
import DeviceFrame from "./DeviceFrame";

export interface BuilderCanvasHandle {
  exportPng: (filename?: string) => Promise<void>;
  copyToClipboard: () => Promise<void>;
  getCapture: () => Promise<string>;
}

interface BuilderCanvasProps {
  config: BuilderConfig;
  onUpdateConfig?: (key: keyof BuilderConfig, val: any) => void;
  isWatermarkUnlocked?: boolean;
  onOpenUnlockWatermark?: () => void;
}

// ── Background helpers ────────────────────────────────────────────────────────

function gradientCss(preset: string, dir: GradDir): string {
  const p = GRADIENT_PRESETS.find((g) => g.name === preset) ?? GRADIENT_PRESETS[0];
  if (p.via) return `linear-gradient(${dir}, ${p.from}, ${p.via}, ${p.to})`;
  return `linear-gradient(${dir}, ${p.from}, ${p.to})`;
}

function meshCss(c1: string, c2: string, c3: string, c4: string): string {
  return `
    radial-gradient(ellipse at 0% 0%, ${c1} 0%, transparent 60%),
    radial-gradient(ellipse at 100% 0%, ${c2} 0%, transparent 60%),
    radial-gradient(ellipse at 100% 100%, ${c3} 0%, transparent 60%),
    radial-gradient(ellipse at 0% 100%, ${c4} 0%, transparent 60%)
  `.trim();
}

function computeBg(config: BuilderConfig): React.CSSProperties {
  switch (config.bgType) {
    case "gradient": return { background: gradientCss(config.gradientPreset, config.gradientDir) };
    case "solid":    return { background: config.solidColor };
    case "mesh":     return { background: meshCss(config.meshColor1, config.meshColor2, config.meshColor3, config.meshColor4) };
    default:         return { background: "#0f172a" };
  }
}

// ── Caption block ─────────────────────────────────────────────────────────────

function CaptionBlock({ config, maxWidth, onUpdateConfig }: { config: BuilderConfig; maxWidth: number; onUpdateConfig?: (key: keyof BuilderConfig, val: any) => void }) {
  if (!config.headline && !config.subtext) return null;
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35em", padding: "0.8em 1.2em", textAlign: "center" }}>
      {config.headline && (
        <p
          contentEditable={!!onUpdateConfig}
          suppressContentEditableWarning
          onBlur={(e) => { if (onUpdateConfig) onUpdateConfig("headline", e.currentTarget.textContent || ""); }}
          style={{
            margin: 0, fontSize: `${config.headlineSize}em`, fontWeight: 800,
            color: config.headlineColor, lineHeight: 1.1, letterSpacing: "-0.03em",
            fontFamily: config.fontFamily || "var(--font)", maxWidth,
            outline: "none", cursor: onUpdateConfig ? "text" : "default",
            padding: "2px 6px", borderRadius: "6px",
            border: onUpdateConfig ? "2px dashed transparent" : "none", transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => { if (onUpdateConfig) e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
          onMouseLeave={(e) => { if (onUpdateConfig) e.currentTarget.style.borderColor = "transparent"; }}
        >
          {config.headline}
        </p>
      )}
      {config.subtext && (
        <p
          contentEditable={!!onUpdateConfig}
          suppressContentEditableWarning
          onBlur={(e) => { if (onUpdateConfig) onUpdateConfig("subtext", e.currentTarget.textContent || ""); }}
          style={{
            margin: 0, fontSize: `${config.subtextSize}em`, fontWeight: 500,
            color: config.subtextColor, lineHeight: 1.4,
            fontFamily: config.fontFamily || "var(--font)", maxWidth,
            outline: "none", cursor: onUpdateConfig ? "text" : "default",
            padding: "2px 6px", borderRadius: "6px",
            border: onUpdateConfig ? "2px dashed transparent" : "none", transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => { if (onUpdateConfig) e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
          onMouseLeave={(e) => { if (onUpdateConfig) e.currentTarget.style.borderColor = "transparent"; }}
        >
          {config.subtext}
        </p>
      )}
    </div>
  );
}

// ── Inner canvas (the captured element) ──────────────────────────────────────

interface InnerCanvasProps {
  config: BuilderConfig;
  spec: DeviceSpec;
  scale: number;
  innerRef: React.RefObject<HTMLDivElement | null>;
  onUpdateConfig?: (key: keyof BuilderConfig, val: any) => void;
  isWatermarkUnlocked: boolean;
  onOpenUnlockWatermark: () => void;
  onImageDragStart?: (e: React.MouseEvent) => void;
}

function InnerCanvas({ config, spec, scale, innerRef, onUpdateConfig, isWatermarkUnlocked, onOpenUnlockWatermark, onImageDragStart }: InnerCanvasProps) {
  const bgStyle = computeBg(config);
  const hasTop = config.textPosition === "top";

  let frameW = 300, frameH = 620;
  if (spec.frameType === "ipad") { frameW = 300; frameH = 420; }
  else if (spec.frameType === "android") { frameW = 290; frameH = 600; }
  else if (spec.frameType === "android-tab") {
    if (spec.isLandscape) { frameW = 500; frameH = 320; } else { frameW = 320; frameH = 440; }
  }

  const targetFrameH = spec.canvasH * 0.65;
  const frameScale = targetFrameH / frameH;
  const scaledFrameW = frameW * frameScale;
  const scaledFrameH = frameH * frameScale;

  let panoramicTransform = "";
  if (config.panoramic === "left") panoramicTransform = "translateX(35%)";
  else if (config.panoramic === "right") panoramicTransform = "translateX(-35%)";

  const hasDrag = !!config.screenshotUrl && !!onUpdateConfig;

  return (
    <div
      ref={innerRef}
      className="builder-canvas-capture"
      style={{
        width: spec.canvasW, height: spec.canvasH,
        transform: `scale(${scale})`, transformOrigin: "top left",
        flexShrink: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        ...bgStyle, position: "relative", overflow: "hidden",
      }}
    >
      {hasTop && (
        <div style={{ width: "100%", paddingBottom: "2em", zIndex: 1 }}>
          <CaptionBlock config={config} maxWidth={spec.canvasW * 0.85} onUpdateConfig={onUpdateConfig} />
        </div>
      )}

      {config.frameVisible ? (
        <div
          onMouseDown={hasDrag ? onImageDragStart : undefined}
          style={{
            width: scaledFrameW, height: scaledFrameH, position: "relative",
            zIndex: 1, flexShrink: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            transform: panoramicTransform || undefined,
            cursor: hasDrag ? "grab" : "default",
          }}
        >
          <div style={{
            position: "absolute", top: 0, left: 0,
            width: frameW, height: frameH,
            transform: `scale(${frameScale})`, transformOrigin: "top left",
          }}>
            <DeviceFrame
              spec={spec} shadow={config.frameShadow}
              tilt3d={config.frameMode === "tilt3d"}
              tiltX={config.tiltX} tiltY={config.tiltY}
              imageScale={config.imageScale}
              imageOffsetX={config.imageOffsetX}
              imageOffsetY={config.imageOffsetY}
            >
              {config.screenshotUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={config.screenshotUrl} alt="App screenshot" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              ) : null}
            </DeviceFrame>
          </div>
        </div>
      ) : (
        config.screenshotUrl && (
          <div style={{
            width: spec.canvasW * 0.85, height: spec.canvasH * 0.75,
            borderRadius: 40, overflow: "hidden", zIndex: 1,
            transform: `scale(${config.imageScale})` + (config.panoramic === "left" ? " translateX(35%)" : config.panoramic === "right" ? " translateX(-35%)" : ""),
            boxShadow: config.frameShadow ? "0 40px 120px rgba(0,0,0,0.5)" : undefined,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={config.screenshotUrl} alt="App screenshot" style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              objectPosition: `${config.imageOffsetX}% ${config.imageOffsetY}%`,
            }} />
          </div>
        )
      )}

      {!hasTop && (
        <div style={{ width: "100%", paddingTop: "2em", zIndex: 1 }}>
          <CaptionBlock config={config} maxWidth={spec.canvasW * 0.85} onUpdateConfig={onUpdateConfig} />
        </div>
      )}

      {!isWatermarkUnlocked && (
        <div
          onClick={(e) => { e.stopPropagation(); onOpenUnlockWatermark(); }}
          title="Click to remove watermark"
          style={{
            position: "absolute", bottom: "16px", right: "18px",
            fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.7)",
            background: "rgba(0,0,0,0.55)", padding: "5px 12px", borderRadius: "6px",
            backdropFilter: "blur(4px)", userSelect: "none", cursor: "pointer",
            zIndex: 100, fontFamily: "var(--font)", transition: "all 0.15s ease",
            border: "1px solid rgba(255,255,255,0.1)", letterSpacing: "0.2px",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(0,0,0,0.7)"; e.currentTarget.style.transform = "scale(1.05)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.background = "rgba(0,0,0,0.55)"; e.currentTarget.style.transform = "scale(1)"; }}
        >
          Made with buildrstudio.in
        </div>
      )}
    </div>
  );
}

// ── Exported component ────────────────────────────────────────────────────────

const BuilderCanvas = forwardRef<BuilderCanvasHandle, BuilderCanvasProps>(
  function BuilderCanvas({ config, onUpdateConfig, isWatermarkUnlocked = false, onOpenUnlockWatermark = () => {} }, ref) {
    const spec = getDevice(config.deviceId);
    const captureRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(600);

    // Viewport zoom + pan
    const [userZoom, setUserZoom] = useState(1.0);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const viewportPanRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
    const isViewportPanning = viewportPanRef.current !== null;

    // Image drag-to-reposition within frame
    const imageDragRef = useRef<{ startX: number; startY: number; startOffX: number; startOffY: number } | null>(null);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      setContainerWidth(el.getBoundingClientRect().width || 600);
      const ro = new ResizeObserver((entries) => {
        for (const e of entries) setContainerWidth(e.contentRect.width || 600);
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    // Ctrl+wheel = zoom, plain wheel = pan the viewport
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const onWheel = (e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const factor = e.deltaY > 0 ? 0.92 : 1.09;
          setUserZoom(prev => Math.min(3, Math.max(0.25, prev * factor)));
        } else {
          e.preventDefault();
          setPanOffset(prev => ({ x: prev.x - e.deltaX * 0.6, y: prev.y - e.deltaY * 0.6 }));
        }
      };
      el.addEventListener("wheel", onWheel, { passive: false });
      return () => el.removeEventListener("wheel", onWheel);
    }, []);

    const targetH = spec.isLandscape ? 400 : 640;
    let scale = targetH / spec.canvasH;
    const padding = 64;
    const maxW = Math.max(200, containerWidth - padding);
    if (spec.canvasW * scale > maxW) scale = maxW / spec.canvasW;

    const displayW = spec.canvasW * scale;
    const displayH = spec.canvasH * scale;

    const getCapture = useCallback(async (): Promise<string> => {
      if (!captureRef.current) throw new Error("Canvas ref not ready");
      const el = captureRef.current;
      const original = el.style.transform;
      el.style.transform = "scale(1)";
      try {
        return await domToPng(el, { scale: 1, quality: 1 });
      } finally {
        el.style.transform = original;
      }
    }, []);

    useImperativeHandle(ref, () => ({
      getCapture,
      async exportPng(filename?: string) {
        const dataUrl = await getCapture();
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = filename ?? `buildrstudio-${spec.id}-screenshot.png`;
        a.click();
      },
      async copyToClipboard() {
        try {
          const dataUrl = await getCapture();
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        } catch { console.warn("Clipboard write failed"); }
      },
    }), [getCapture, spec.id]);

    const handleImageDragStart = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      imageDragRef.current = {
        startX: e.clientX, startY: e.clientY,
        startOffX: config.imageOffsetX ?? 50,
        startOffY: config.imageOffsetY ?? 50,
      };
    }, [config.imageOffsetX, config.imageOffsetY]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if (imageDragRef.current) {
        const dx = e.clientX - imageDragRef.current.startX;
        const dy = e.clientY - imageDragRef.current.startY;
        const sens = 0.12 / userZoom;
        const newX = Math.min(100, Math.max(0, imageDragRef.current.startOffX + dx * sens));
        const newY = Math.min(100, Math.max(0, imageDragRef.current.startOffY + dy * sens));
        if (onUpdateConfig) {
          onUpdateConfig("imageOffsetX", Math.round(newX * 10) / 10);
          onUpdateConfig("imageOffsetY", Math.round(newY * 10) / 10);
        }
        return;
      }
      if (viewportPanRef.current) {
        const dx = e.clientX - viewportPanRef.current.startX;
        const dy = e.clientY - viewportPanRef.current.startY;
        setPanOffset({ x: viewportPanRef.current.panX + dx, y: viewportPanRef.current.panY + dy });
      }
    }, [onUpdateConfig, userZoom]);

    const handleMouseUp = useCallback(() => {
      imageDragRef.current = null;
      viewportPanRef.current = null;
    }, []);

    const handleViewportMouseDown = useCallback((e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".builder-canvas-capture")) return;
      viewportPanRef.current = { startX: e.clientX, startY: e.clientY, panX: panOffset.x, panY: panOffset.y };
    }, [panOffset]);

    const resetZoom = () => { setUserZoom(1.0); setPanOffset({ x: 0, y: 0 }); };

    return (
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseDown={handleViewportMouseDown}
        style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          flex: 1, minHeight: 0, position: "relative",
          overflow: "hidden", background: "var(--surface-2)",
          cursor: isViewportPanning ? "grabbing" : "default",
          userSelect: "none",
        }}
      >
        {/* Zoomed + panned canvas */}
        <div style={{
          transform: `scale(${userZoom}) translate(${panOffset.x / userZoom}px, ${panOffset.y / userZoom}px)`,
          transformOrigin: "center center",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "20px 24px",
        }}>
          <div style={{
            width: displayW, height: displayH,
            position: "relative", overflow: "hidden",
            borderRadius: 14,
            boxShadow: "0 12px 48px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.08)",
          }}>
            <InnerCanvas
              config={config} spec={spec} scale={scale}
              innerRef={captureRef} onUpdateConfig={onUpdateConfig}
              isWatermarkUnlocked={isWatermarkUnlocked}
              onOpenUnlockWatermark={onOpenUnlockWatermark}
              onImageDragStart={handleImageDragStart}
            />
          </div>

          {/* Dimension label */}
          <div style={{
            fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font)",
            letterSpacing: "0.4px", display: "flex", alignItems: "center", gap: 8,
          }}>
            <span>{spec.label}</span>
            <span style={{ color: "var(--border-strong)" }}>·</span>
            <span>{spec.canvasW} × {spec.canvasH}</span>
            <span style={{ color: "var(--border-strong)" }}>·</span>
            <span style={{ color: spec.platform === "appstore" ? "#007AFF" : "#34A853" }}>
              {spec.platform === "appstore" ? "App Store" : "Play Store"}
            </span>
          </div>
        </div>

        {/* Floating zoom controls — bottom right */}
        <div style={{
          position: "absolute", bottom: "16px", right: "16px",
          display: "flex", alignItems: "center", gap: "2px",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "8px", padding: "3px 5px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)", zIndex: 10,
        }}>
          {[
            { label: "−", title: "Zoom out", action: () => setUserZoom(p => Math.max(0.25, p * 0.85)) },
          ].map(btn => (
            <button key={btn.label} type="button" onClick={btn.action} title={btn.title}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-2)", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", fontSize: "17px", lineHeight: 1 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--fill-subtle)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
            >{btn.label}</button>
          ))}
          <button type="button" onClick={resetZoom} title="Reset zoom"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-2)", minWidth: "44px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", fontSize: "11px", fontFamily: "var(--font)", fontWeight: 600, letterSpacing: "0.3px" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--fill-subtle)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
          >{Math.round(userZoom * 100)}%</button>
          <button type="button" onClick={() => setUserZoom(p => Math.min(3, p * 1.18))} title="Zoom in"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-2)", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", fontSize: "17px", lineHeight: 1 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--fill-subtle)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
          >+</button>
        </div>

        {/* Drag hint */}
        {config.screenshotUrl && onUpdateConfig && (
          <div style={{
            position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)",
            fontSize: "10px", color: "var(--text-3)", fontFamily: "var(--font)",
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "6px", padding: "3px 10px", pointerEvents: "none",
            whiteSpace: "nowrap",
          }}>
            Drag frame to reposition · Ctrl+scroll to zoom
          </div>
        )}
      </div>
    );
  }
);

export default BuilderCanvas;

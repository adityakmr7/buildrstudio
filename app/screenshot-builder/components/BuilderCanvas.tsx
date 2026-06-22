"use client";

// ─── BuilderCanvas.tsx ───────────────────────────────────────────────────────
// Live preview canvas for the App Store Screenshot Builder.
// Uses forwardRef + useImperativeHandle so the parent can trigger PNG export.

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
  useState,
  useEffect,
} from "react";
import { domToPng } from "modern-screenshot";
import type {
  BuilderConfig,
  DeviceSpec,
  GradDir,
} from "../lib/deviceSpecs";
import {
  getDevice,
  GRADIENT_PRESETS,
} from "../lib/deviceSpecs";
import DeviceFrame from "./DeviceFrame";

// ── Public handle ─────────────────────────────────────────────────────────────

export interface BuilderCanvasHandle {
  exportPng: () => Promise<void>;
  copyToClipboard: () => Promise<void>;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface BuilderCanvasProps {
  config: BuilderConfig;
  onUpdateConfig?: (key: keyof BuilderConfig, val: any) => void;
  isWatermarkUnlocked?: boolean;
  onOpenUnlockWatermark?: () => void;
}

// ── Background helpers ────────────────────────────────────────────────────────

function gradientCss(preset: string, dir: GradDir): string {
  const p = GRADIENT_PRESETS.find((g) => g.name === preset) ?? GRADIENT_PRESETS[0];
  if (p.via) {
    return `linear-gradient(${dir}, ${p.from}, ${p.via}, ${p.to})`;
  }
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
    case "gradient":
      return { background: gradientCss(config.gradientPreset, config.gradientDir) };
    case "solid":
      return { background: config.solidColor };
    case "mesh":
      return { background: meshCss(config.meshColor1, config.meshColor2, config.meshColor3, config.meshColor4) };
    default:
      return { background: "#0f172a" };
  }
}

// ── Caption block ─────────────────────────────────────────────────────────────

function CaptionBlock({
  config,
  maxWidth,
  onUpdateConfig,
}: {
  config: BuilderConfig;
  maxWidth: number;
  onUpdateConfig?: (key: keyof BuilderConfig, val: any) => void;
}) {
  const displayHeadline = config.headline;
  const displaySubtext = config.subtext;

  if (!displayHeadline && !displaySubtext) return null;

  return (
    <div style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.35em",
      padding: "0.8em 1.2em",
      textAlign: "center",
    }}>
      {displayHeadline && (
        <p
          contentEditable={!!onUpdateConfig}
          suppressContentEditableWarning
          onBlur={(e) => {
            const text = e.currentTarget.textContent || "";
            if (onUpdateConfig) {
              onUpdateConfig("headline", text);
            }
          }}
          style={{
            margin: 0,
            fontSize: `${config.headlineSize}em`,
            fontWeight: 800,
            color: config.headlineColor,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            fontFamily: "var(--font)",
            maxWidth,
            outline: "none",
            cursor: onUpdateConfig ? "text" : "default",
            padding: "2px 6px",
            borderRadius: "6px",
            border: onUpdateConfig ? "2px dashed transparent" : "none",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            if (onUpdateConfig) e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
          }}
          onMouseLeave={(e) => {
            if (onUpdateConfig) e.currentTarget.style.borderColor = "transparent";
          }}
        >
          {config.headline}
        </p>
      )}
      {displaySubtext && (
        <p
          contentEditable={!!onUpdateConfig}
          suppressContentEditableWarning
          onBlur={(e) => {
            const text = e.currentTarget.textContent || "";
            if (onUpdateConfig) {
              onUpdateConfig("subtext", text);
            }
          }}
          style={{
            margin: 0,
            fontSize: `${config.subtextSize}em`,
            fontWeight: 500,
            color: config.subtextColor,
            lineHeight: 1.4,
            fontFamily: "var(--font)",
            maxWidth,
            outline: "none",
            cursor: onUpdateConfig ? "text" : "default",
            padding: "2px 6px",
            borderRadius: "6px",
            border: onUpdateConfig ? "2px dashed transparent" : "none",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            if (onUpdateConfig) e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
          }}
          onMouseLeave={(e) => {
            if (onUpdateConfig) e.currentTarget.style.borderColor = "transparent";
          }}
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
  /** Scale factor: preview is scaled down from actual canvas size */
  scale: number;
  innerRef: React.RefObject<HTMLDivElement | null>;
  onUpdateConfig?: (key: keyof BuilderConfig, val: any) => void;
  isWatermarkUnlocked: boolean;
  onOpenUnlockWatermark: () => void;
}

function InnerCanvas({
  config,
  spec,
  scale,
  innerRef,
  onUpdateConfig,
  isWatermarkUnlocked,
  onOpenUnlockWatermark,
}: InnerCanvasProps) {
  const bgStyle = computeBg(config);
  const hasTop = config.textPosition === "top";

  // Determine normalized frame dimensions
  let frameW = 300;
  let frameH = 620;
  if (spec.frameType === "iphone-dynamic" || spec.frameType === "iphone-notch") {
    frameW = 300;
    frameH = 620;
  } else if (spec.frameType === "ipad") {
    frameW = 300;
    frameH = 420;
  } else if (spec.frameType === "android") {
    frameW = 290;
    frameH = 600;
  } else if (spec.frameType === "android-tab") {
    if (spec.isLandscape) {
      frameW = 500;
      frameH = 320;
    } else {
      frameW = 320;
      frameH = 440;
    }
  }

  // Scale the frame to occupy a reasonable percentage of the canvas height (e.g. 65%)
  const targetFrameH = spec.canvasH * 0.65;
  const frameScale = targetFrameH / frameH;

  const scaledFrameW = frameW * frameScale;
  const scaledFrameH = frameH * frameScale;

  let panoramicTransform = "";
  if (config.panoramic === "left") {
    panoramicTransform = "translateX(35%)";
  } else if (config.panoramic === "right") {
    panoramicTransform = "translateX(-35%)";
  }

  return (
    <div
      ref={innerRef}
      className="builder-canvas-capture"
      style={{
        width: spec.canvasW,
        height: spec.canvasH,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...bgStyle,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Caption top */}
      {hasTop && (
        <div style={{ width: "100%", paddingBottom: "2em", zIndex: 1 }}>
          <CaptionBlock config={config} maxWidth={spec.canvasW * 0.85} onUpdateConfig={onUpdateConfig} />
        </div>
      )}

      {/* Device frame */}
      {config.frameVisible ? (
        <div style={{
          width: scaledFrameW,
          height: scaledFrameH,
          position: "relative",
          zIndex: 1,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: panoramicTransform || undefined,
        }}>
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: frameW,
            height: frameH,
            transform: `scale(${frameScale})`,
            transformOrigin: "top left",
          }}>
            <DeviceFrame
              spec={spec}
              shadow={config.frameShadow}
              tilt3d={config.frameMode === "tilt3d"}
              imageScale={config.imageScale}
              imageOffsetX={config.imageOffsetX}
              imageOffsetY={config.imageOffsetY}
            >
              {config.screenshotUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={config.screenshotUrl}
                  alt="App screenshot"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : null}
            </DeviceFrame>
          </div>
        </div>
      ) : (
        /* No frame — just the screenshot */
        config.screenshotUrl && (
          <div style={{
            width: spec.canvasW * 0.85,
            height: spec.canvasH * 0.75,
            borderRadius: 40,
            overflow: "hidden",
            zIndex: 1,
            transform: `scale(${config.imageScale})` + (config.panoramic === "left" ? " translateX(35%)" : config.panoramic === "right" ? " translateX(-35%)" : ""),
            boxShadow: config.frameShadow ? "0 40px 120px rgba(0,0,0,0.5)" : undefined,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.screenshotUrl}
              alt="App screenshot"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                objectPosition: `${config.imageOffsetX}% ${config.imageOffsetY}%`
              }}
            />
          </div>
        )
      )}

      {/* Caption bottom */}
      {!hasTop && (
        <div style={{ width: "100%", paddingTop: "2em", zIndex: 1 }}>
          <CaptionBlock config={config} maxWidth={spec.canvasW * 0.85} onUpdateConfig={onUpdateConfig} />
        </div>
      )}

      {/* Watermark */}
      {!isWatermarkUnlocked && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onOpenUnlockWatermark();
          }}
          title="Click to remove watermark"
          style={{
            position: "absolute",
            bottom: "16px",
            right: "18px",
            fontSize: "12px",
            fontWeight: 700,
            color: "rgba(255, 255, 255, 0.7)",
            background: "rgba(0, 0, 0, 0.55)",
            padding: "5px 12px",
            borderRadius: "6px",
            backdropFilter: "blur(4px)",
            userSelect: "none",
            cursor: "pointer",
            zIndex: 100,
            fontFamily: "var(--font)",
            transition: "all 0.15s ease",
            border: "1px solid rgba(255,255,255,0.1)",
            letterSpacing: "0.2px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.background = "rgba(0,0,0,0.7)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.55)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Made with buildrstudio.in
        </div>
      )}
    </div>
  );
}

// ── Exported component ────────────────────────────────────────────────────────

const BuilderCanvas = forwardRef<BuilderCanvasHandle, BuilderCanvasProps>(
  function BuilderCanvas({
    config,
    onUpdateConfig,
    isWatermarkUnlocked = false,
    onOpenUnlockWatermark = () => {},
  }, ref) {
    const spec = getDevice(config.deviceId);
    const captureRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(600);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      setContainerWidth(el.getBoundingClientRect().width || 600);

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width || 600);
        }
      });
      resizeObserver.observe(el);
      return () => resizeObserver.disconnect();
    }, []);

    // Scale the large canvas to fit the preview column.
    // We target a display height of ~580px for portrait, ~340px for landscape.
    const targetH = spec.isLandscape ? 340 : 560;
    let scale = targetH / spec.canvasH;

    // Prevent horizontal overflow on smaller viewports
    const padding = 64; // 32px padding on each side
    const maxW = Math.max(200, containerWidth - padding);
    if (spec.canvasW * scale > maxW) {
      scale = maxW / spec.canvasW;
    }

    // The scaled-down display dimensions
    const displayW = spec.canvasW * scale;
    const displayH = spec.canvasH * scale;

    const getCapture = useCallback(async (): Promise<string> => {
      if (!captureRef.current) throw new Error("Canvas ref not ready");
      // Temporarily scale to 1 for full-res capture
      const el = captureRef.current;
      const original = el.style.transform;
      el.style.transform = "scale(1)";
      try {
        const dataUrl = await domToPng(el, { scale: 1, quality: 1 });
        return dataUrl;
      } finally {
        el.style.transform = original;
      }
    }, []);

    useImperativeHandle(ref, () => ({
      async exportPng() {
        const dataUrl = await getCapture();
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `buildrstudio-${spec.id}-screenshot.png`;
        a.click();
      },
      async copyToClipboard() {
        try {
          const dataUrl = await getCapture();
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        } catch {
          console.warn("Clipboard write failed");
        }
      },
    }), [getCapture, spec.id]);

    return (
      <div ref={containerRef} style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        minHeight: 0,
        padding: "24px 32px",
        gap: 20,
        overflowY: "auto",
      }}>
        {/* Canvas wrapper — shows exact scaled display */}
        <div style={{
          width: displayW,
          height: displayH,
          position: "relative",
          overflow: "hidden",
          borderRadius: 12,
          boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
        }}>
          <InnerCanvas
            config={config}
            spec={spec}
            scale={scale}
            innerRef={captureRef}
            onUpdateConfig={onUpdateConfig}
            isWatermarkUnlocked={isWatermarkUnlocked}
            onOpenUnlockWatermark={onOpenUnlockWatermark}
          />
        </div>

        {/* Dimension label */}
        <div style={{
          fontSize: 11,
          color: "var(--text-3)",
          fontFamily: "var(--font)",
          letterSpacing: "0.4px",
          display: "flex",
          alignItems: "center",
          gap: 8,
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
    );
  }
);

export default BuilderCanvas;

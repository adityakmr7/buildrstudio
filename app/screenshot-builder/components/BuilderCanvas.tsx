"use client";

// ─── BuilderCanvas.tsx ───────────────────────────────────────────────────────
// Live preview canvas for the App Store Screenshot Builder.
// Uses forwardRef + useImperativeHandle so the parent can trigger PNG export.

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
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

function CaptionBlock({ config, maxWidth }: { config: BuilderConfig; maxWidth: number }) {
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
      {config.headline && (
        <p style={{
          margin: 0,
          fontSize: `${config.headlineSize}em`,
          fontWeight: 800,
          color: config.headlineColor,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          fontFamily: "var(--font)",
          maxWidth,
        }}>
          {config.headline}
        </p>
      )}
      {config.subtext && (
        <p style={{
          margin: 0,
          fontSize: `${config.subtextSize}em`,
          fontWeight: 500,
          color: config.subtextColor,
          lineHeight: 1.4,
          fontFamily: "var(--font)",
          maxWidth,
        }}>
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
}

function InnerCanvas({ config, spec, scale, innerRef }: InnerCanvasProps) {
  const bgStyle = computeBg(config);
  const hasTop = config.textPosition === "top";

  return (
    <div
      ref={innerRef}
      className="builder-canvas-capture"
      style={{
        width: spec.canvasW,
        height: spec.canvasH,
        transform: `scale(${scale})`,
        transformOrigin: "top center",
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
          <CaptionBlock config={config} maxWidth={spec.canvasW * 0.85} />
        </div>
      )}

      {/* Device frame */}
      {config.frameVisible ? (
        <div style={{ zIndex: 1, flexShrink: 0 }}>
          <DeviceFrame
            spec={spec}
            shadow={config.frameShadow}
            tilt3d={config.frameMode === "tilt3d"}
            imageScale={config.imageScale}
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
      ) : (
        /* No frame — just the screenshot */
        config.screenshotUrl && (
          <div style={{
            width: spec.canvasW * 0.85,
            height: spec.canvasH * 0.75,
            borderRadius: 40,
            overflow: "hidden",
            zIndex: 1,
            transform: `scale(${config.imageScale})`,
            boxShadow: config.frameShadow ? "0 40px 120px rgba(0,0,0,0.5)" : undefined,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.screenshotUrl}
              alt="App screenshot"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        )
      )}

      {/* Caption bottom */}
      {!hasTop && (
        <div style={{ width: "100%", paddingTop: "2em", zIndex: 1 }}>
          <CaptionBlock config={config} maxWidth={spec.canvasW * 0.85} />
        </div>
      )}
    </div>
  );
}

// ── Exported component ────────────────────────────────────────────────────────

const BuilderCanvas = forwardRef<BuilderCanvasHandle, BuilderCanvasProps>(
  function BuilderCanvas({ config }, ref) {
    const spec = getDevice(config.deviceId);
    const captureRef = useRef<HTMLDivElement>(null);

    // Scale the large canvas to fit the preview column.
    // We target a display height of ~580px for portrait, ~340px for landscape.
    const targetH = spec.isLandscape ? 340 : 560;
    const scale = targetH / spec.canvasH;

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
      <div style={{
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

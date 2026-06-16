"use client";

// ─── DeviceFrame.tsx ─────────────────────────────────────────────────────────
// SVG device frames for all supported device types.
// Each frame is rendered at a normalised 300×600 viewport and scaled by the parent.

import React from "react";
import type { DeviceSpec } from "../lib/deviceSpecs";

interface DeviceFrameProps {
  spec: DeviceSpec;
  /** Screenshot/image rendered inside the frame */
  children: React.ReactNode;
  /** Whether to apply a drop shadow under the frame */
  shadow?: boolean;
  /** 3D tilt mode — adds CSS perspective transform */
  tilt3d?: boolean;
  /** Scale of the screenshot inside the frame: 0.5–1.5 */
  imageScale?: number;
  /** Vertical offset of the screenshot inside the frame (0–100) */
  imageOffsetY?: number;
}

// ── SVG Primitives ────────────────────────────────────────────────────────────

function IPhoneDynamic({ children, shadow }: { children: React.ReactNode; shadow?: boolean }) {
  const W = 300, H = 620;
  const cornerR = 46;
  const pill = { w: 96, h: 30, x: (W - 96) / 2, y: 18 };

  return (
    <div style={{ position: "relative", width: W, height: H, filter: shadow ? "drop-shadow(0 24px 48px rgba(0,0,0,0.35))" : undefined }}>
      {/* Body */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}>
        {/* Outer body */}
        <rect x="2" y="2" width={W - 4} height={H - 4} rx={cornerR} ry={cornerR}
          fill="none" stroke="#1a1a1a" strokeWidth="3" />
        {/* Inner bezel */}
        <rect x="10" y="10" width={W - 20} height={H - 20} rx={cornerR - 7} ry={cornerR - 7}
          fill="none" stroke="#2a2a2a" strokeWidth="1.5" />
        {/* Side buttons */}
        <rect x={-2} y="140" width="4" height="40" rx="2" fill="#1a1a1a" />
        <rect x={-2} y="195" width="4" height="64" rx="2" fill="#1a1a1a" />
        <rect x={-2} y="270" width="4" height="64" rx="2" fill="#1a1a1a" />
        <rect x={W - 2} y="170" width="4" height="100" rx="2" fill="#1a1a1a" />
        {/* Dynamic Island pill */}
        <rect x={pill.x} y={pill.y} width={pill.w} height={pill.h} rx={pill.h / 2}
          fill="#0a0a0a" />
      </svg>
      {/* Screenshot content */}
      <div style={{
        position: "absolute", top: 12, left: 12, right: 12, bottom: 12,
        borderRadius: cornerR - 8, overflow: "hidden", zIndex: 1,
      }}>
        {children}
      </div>
    </div>
  );
}

function IPhoneNotch({ children, shadow }: { children: React.ReactNode; shadow?: boolean }) {
  const W = 300, H = 620;
  const cornerR = 42;
  const notch = { w: 130, h: 30 };

  return (
    <div style={{ position: "relative", width: W, height: H, filter: shadow ? "drop-shadow(0 24px 48px rgba(0,0,0,0.35))" : undefined }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}>
        <rect x="2" y="2" width={W - 4} height={H - 4} rx={cornerR} ry={cornerR}
          fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <rect x="10" y="10" width={W - 20} height={H - 20} rx={cornerR - 7} ry={cornerR - 7}
          fill="none" stroke="#2a2a2a" strokeWidth="1.5" />
        <rect x={-2} y="140" width="4" height="40" rx="2" fill="#1a1a1a" />
        <rect x={-2} y="195" width="4" height="64" rx="2" fill="#1a1a1a" />
        <rect x={-2} y="270" width="4" height="64" rx="2" fill="#1a1a1a" />
        <rect x={W - 2} y="170" width="4" height="100" rx="2" fill="#1a1a1a" />
        {/* Notch */}
        <rect x={(W - notch.w) / 2} y="0" width={notch.w} height={notch.h} rx="0" fill="#0a0a0a" />
        {/* Camera + speaker */}
        <circle cx={W / 2 + 30} cy="16" r="7" fill="#111" />
        <ellipse cx={W / 2 - 20} cy="16" rx="20" ry="5" fill="#111" />
      </svg>
      <div style={{
        position: "absolute", top: 12, left: 12, right: 12, bottom: 12,
        borderRadius: cornerR - 8, overflow: "hidden", zIndex: 1,
      }}>
        {children}
      </div>
    </div>
  );
}

function IPadFrame({ children, shadow }: { children: React.ReactNode; shadow?: boolean }) {
  const W = 300, H = 420;
  const cornerR = 22;

  return (
    <div style={{ position: "relative", width: W, height: H, filter: shadow ? "drop-shadow(0 24px 48px rgba(0,0,0,0.35))" : undefined }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}>
        <rect x="2" y="2" width={W - 4} height={H - 4} rx={cornerR} ry={cornerR}
          fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <rect x="10" y="10" width={W - 20} height={H - 20} rx={cornerR - 5} ry={cornerR - 5}
          fill="none" stroke="#2a2a2a" strokeWidth="1.5" />
        {/* Camera top center */}
        <circle cx={W / 2} cy="8" r="4.5" fill="#111" />
        {/* Home button / face id strip */}
        <rect x={W - 8} y={(H - 40) / 2} width="4" height="40" rx="2" fill="#1a1a1a" />
        {/* Volume buttons */}
        <rect x="2" y="80" width="4" height="30" rx="2" fill="#1a1a1a" />
        <rect x="2" y="120" width="4" height="30" rx="2" fill="#1a1a1a" />
      </svg>
      <div style={{
        position: "absolute", top: 14, left: 14, right: 14, bottom: 14,
        borderRadius: cornerR - 5, overflow: "hidden", zIndex: 1,
      }}>
        {children}
      </div>
    </div>
  );
}

function AndroidPhoneFrame({ children, shadow }: { children: React.ReactNode; shadow?: boolean }) {
  const W = 290, H = 600;
  const cornerR = 36;

  return (
    <div style={{ position: "relative", width: W, height: H, filter: shadow ? "drop-shadow(0 24px 48px rgba(0,0,0,0.35))" : undefined }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}>
        <rect x="2" y="2" width={W - 4} height={H - 4} rx={cornerR} ry={cornerR}
          fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <rect x="10" y="10" width={W - 20} height={H - 20} rx={cornerR - 7} ry={cornerR - 7}
          fill="none" stroke="#2a2a2a" strokeWidth="1.5" />
        {/* Punch-hole camera */}
        <circle cx={W / 2} cy="24" r="7" fill="#0a0a0a" />
        {/* Side buttons */}
        <rect x={W - 2} y="140" width="4" height="30" rx="2" fill="#1a1a1a" />
        <rect x={W - 2} y="185" width="4" height="60" rx="2" fill="#1a1a1a" />
        <rect x={-2} y="160" width="4" height="70" rx="2" fill="#1a1a1a" />
      </svg>
      <div style={{
        position: "absolute", top: 12, left: 12, right: 12, bottom: 12,
        borderRadius: cornerR - 8, overflow: "hidden", zIndex: 1,
      }}>
        {children}
      </div>
    </div>
  );
}

function AndroidTabFrame({ children, shadow, landscape }: { children: React.ReactNode; shadow?: boolean; landscape?: boolean }) {
  const W = landscape ? 500 : 320;
  const H = landscape ? 320 : 440;
  const cornerR = 18;

  return (
    <div style={{ position: "relative", width: W, height: H, filter: shadow ? "drop-shadow(0 24px 48px rgba(0,0,0,0.35))" : undefined }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}>
        <rect x="2" y="2" width={W - 4} height={H - 4} rx={cornerR} ry={cornerR}
          fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <rect x="10" y="10" width={W - 20} height={H - 20} rx={cornerR - 5} ry={cornerR - 5}
          fill="none" stroke="#2a2a2a" strokeWidth="1.5" />
        {landscape ? (
          <circle cx={W - 8} cy={H / 2} r="4.5" fill="#111" />
        ) : (
          <circle cx={W / 2} cy="8" r="4.5" fill="#111" />
        )}
      </svg>
      <div style={{
        position: "absolute", top: 14, left: 14, right: 14, bottom: 14,
        borderRadius: cornerR - 5, overflow: "hidden", zIndex: 1,
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Tilt 3D wrapper ────────────────────────────────────────────────────────────

function Tilt3DWrapper({ children, enable }: { children: React.ReactNode; enable: boolean }) {
  if (!enable) return <>{children}</>;
  return (
    <div style={{
      perspective: "1200px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        transform: "rotateY(-14deg) rotateX(4deg)",
        transformStyle: "preserve-3d",
        transition: "transform 0.4s ease",
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────

export default function DeviceFrame({ spec, children, shadow, tilt3d, imageScale = 1, imageOffsetY = 50 }: DeviceFrameProps) {
  const screenshotContent = (
    <div style={{
      width: "100%",
      height: "100%",
      position: "relative",
      overflow: "hidden",
      backgroundColor: "#0a0a0a",
    }}>
      {children ? (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${imageScale * 100}%`,
            height: `${imageScale * 100}%`,
            transform: `translateY(${imageOffsetY - 50}%)`,
            flexShrink: 0,
          }}>
            {children}
          </div>
        </div>
      ) : (
        // Empty state placeholder
        <div style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          gap: 8,
        }}>
          <span style={{ fontSize: 32 }}>📱</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "var(--font)", textAlign: "center", padding: "0 12px" }}>
            Upload a screenshot
          </span>
        </div>
      )}
    </div>
  );

  const frame = (() => {
    switch (spec.frameType) {
      case "iphone-dynamic":
        return <IPhoneDynamic shadow={shadow}>{screenshotContent}</IPhoneDynamic>;
      case "iphone-notch":
        return <IPhoneNotch shadow={shadow}>{screenshotContent}</IPhoneNotch>;
      case "ipad":
        return <IPadFrame shadow={shadow}>{screenshotContent}</IPadFrame>;
      case "android":
        return <AndroidPhoneFrame shadow={shadow}>{screenshotContent}</AndroidPhoneFrame>;
      case "android-tab":
        return <AndroidTabFrame shadow={shadow} landscape={spec.isLandscape}>{screenshotContent}</AndroidTabFrame>;
    }
  })();

  return <Tilt3DWrapper enable={!!tilt3d}>{frame}</Tilt3DWrapper>;
}

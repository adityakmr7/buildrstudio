"use client";

// ─── DeviceFrame.tsx ─────────────────────────────────────────────────────────
// Premium SVG device frames for all supported device types.
// Titanium/glass material look using multi-layer SVG gradients.

import React from "react";
import type { DeviceSpec } from "../lib/deviceSpecs";

interface DeviceFrameProps {
  spec: DeviceSpec;
  children: React.ReactNode;
  shadow?: boolean;
  tilt3d?: boolean;
  tiltX?: number;
  tiltY?: number;
  imageScale?: number;
  imageOffsetX?: number;
  imageOffsetY?: number;
}

// ── iPhone Dynamic Island ─────────────────────────────────────────────────────

function IPhoneDynamic({ children, shadow }: { children: React.ReactNode; shadow?: boolean }) {
  const W = 300, H = 620;
  const cornerR = 46;
  const si = 11; // screen inset
  const scR = cornerR - 7; // screen corner radius
  const pill = { w: 96, h: 30, x: (W - 96) / 2, y: 19 };

  return (
    <div style={{
      position: "relative", width: W, height: H,
      filter: shadow
        ? "drop-shadow(0 2px 4px rgba(0,0,0,0.25)) drop-shadow(0 20px 48px rgba(0,0,0,0.55)) drop-shadow(0 4px 12px rgba(0,0,0,0.3))"
        : undefined,
    }}>
      {/* ── Layer 0: Device body fill ── */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
        <defs>
          <linearGradient id="df-body-h" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3c3c3e" />
            <stop offset="18%" stopColor="#2c2c2e" />
            <stop offset="50%" stopColor="#1c1c1e" />
            <stop offset="82%" stopColor="#2a2a2c" />
            <stop offset="100%" stopColor="#3a3a3c" />
          </linearGradient>
          <linearGradient id="df-body-v" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
          </linearGradient>
          <linearGradient id="df-btn-l" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#484848" />
            <stop offset="100%" stopColor="#2e2e30" />
          </linearGradient>
          <linearGradient id="df-btn-r" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2e2e30" />
            <stop offset="100%" stopColor="#484848" />
          </linearGradient>
        </defs>
        {/* Body fill */}
        <rect x="0" y="0" width={W} height={H} rx={cornerR} ry={cornerR} fill="url(#df-body-h)" />
        <rect x="0" y="0" width={W} height={H} rx={cornerR} ry={cornerR} fill="url(#df-body-v)" />
        {/* Screen recess */}
        <rect x={si} y={si} width={W - si * 2} height={H - si * 2} rx={scR} ry={scR} fill="#090909" />
        {/* Side buttons */}
        <rect x={-3} y="138" width="5" height="38" rx="2.5" fill="url(#df-btn-l)" />
        <rect x={-3} y="192" width="5" height="62" rx="2.5" fill="url(#df-btn-l)" />
        <rect x={-3} y="268" width="5" height="62" rx="2.5" fill="url(#df-btn-l)" />
        <rect x={W - 2} y="168" width="5" height="100" rx="2.5" fill="url(#df-btn-r)" />
        {/* Body outer edge highlight */}
        <rect x="0" y="0" width={W} height={H} rx={cornerR} ry={cornerR} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.75" />
        {/* Body inner shadow edge */}
        <rect x="1" y="1" width={W - 2} height={H - 2} rx={cornerR - 1} ry={cornerR - 1} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" />
        {/* Screen ring subtle glow */}
        <rect x={si} y={si} width={W - si * 2} height={H - si * 2} rx={scR} ry={scR} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      </svg>

      {/* ── Layer 1: Screenshot content ── */}
      <div style={{
        position: "absolute", top: si, left: si, right: si, bottom: si,
        borderRadius: scR, overflow: "hidden", zIndex: 1,
      }}>
        {children}
      </div>

      {/* ── Layer 2: Glass + Dynamic Island (on top of screenshot) ── */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}>
        <defs>
          <linearGradient id="df-gloss" x1="0%" y1="0%" x2="5%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.11)" />
            <stop offset="38%" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <clipPath id="df-screen-clip">
            <rect x={si} y={si} width={W - si * 2} height={H - si * 2} rx={scR} ry={scR} />
          </clipPath>
        </defs>
        {/* Glass gloss over screen */}
        <rect x={si} y={si} width={W - si * 2} height={(H - si * 2) * 0.5}
          rx={scR} ry={scR} fill="url(#df-gloss)" clipPath="url(#df-screen-clip)" />
        {/* Dynamic Island */}
        <rect x={pill.x} y={pill.y} width={pill.w} height={pill.h} rx={pill.h / 2} fill="#020202" />
        {/* Camera module inside Dynamic Island */}
        <circle cx={pill.x + pill.w - 18} cy={pill.y + pill.h / 2} r="7.5" fill="#0a0a0a" />
        <circle cx={pill.x + pill.w - 18} cy={pill.y + pill.h / 2} r="5" fill="#040404" />
        <circle cx={pill.x + pill.w - 19.5} cy={pill.y + pill.h / 2 - 1.5} r="1.8" fill="rgba(255,255,255,0.07)" />
        {/* Microphone dot */}
        <circle cx={pill.x + 16} cy={pill.y + pill.h / 2} r="3" fill="#0a0a0a" />
      </svg>
    </div>
  );
}

// ── iPhone Notch ──────────────────────────────────────────────────────────────

function IPhoneNotch({ children, shadow }: { children: React.ReactNode; shadow?: boolean }) {
  const W = 300, H = 620;
  const cornerR = 42;
  const si = 11;
  const scR = cornerR - 7;
  const notch = { w: 130, h: 28 };

  return (
    <div style={{
      position: "relative", width: W, height: H,
      filter: shadow
        ? "drop-shadow(0 2px 4px rgba(0,0,0,0.25)) drop-shadow(0 20px 48px rgba(0,0,0,0.55))"
        : undefined,
    }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
        <defs>
          <linearGradient id="df2-body" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3c3c3e" />
            <stop offset="18%" stopColor="#2c2c2e" />
            <stop offset="50%" stopColor="#1c1c1e" />
            <stop offset="82%" stopColor="#2a2a2c" />
            <stop offset="100%" stopColor="#3a3a3c" />
          </linearGradient>
          <linearGradient id="df2-btn-l" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#484848" />
            <stop offset="100%" stopColor="#2e2e30" />
          </linearGradient>
          <linearGradient id="df2-btn-r" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2e2e30" />
            <stop offset="100%" stopColor="#484848" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={W} height={H} rx={cornerR} ry={cornerR} fill="url(#df2-body)" />
        <rect x={si} y={si} width={W - si * 2} height={H - si * 2} rx={scR} ry={scR} fill="#090909" />
        <rect x={-3} y="138" width="5" height="38" rx="2.5" fill="url(#df2-btn-l)" />
        <rect x={-3} y="192" width="5" height="62" rx="2.5" fill="url(#df2-btn-l)" />
        <rect x={-3} y="268" width="5" height="62" rx="2.5" fill="url(#df2-btn-l)" />
        <rect x={W - 2} y="168" width="5" height="100" rx="2.5" fill="url(#df2-btn-r)" />
        <rect x="0" y="0" width={W} height={H} rx={cornerR} ry={cornerR} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.75" />
        <rect x="1" y="1" width={W - 2} height={H - 2} rx={cornerR - 1} ry={cornerR - 1} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" />
      </svg>

      <div style={{
        position: "absolute", top: si, left: si, right: si, bottom: si,
        borderRadius: scR, overflow: "hidden", zIndex: 1,
      }}>
        {children}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}>
        <defs>
          <linearGradient id="df2-gloss" x1="0%" y1="0%" x2="5%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.11)" />
            <stop offset="38%" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <clipPath id="df2-screen-clip">
            <rect x={si} y={si} width={W - si * 2} height={H - si * 2} rx={scR} ry={scR} />
          </clipPath>
        </defs>
        <rect x={si} y={si} width={W - si * 2} height={(H - si * 2) * 0.5}
          rx={scR} ry={scR} fill="url(#df2-gloss)" clipPath="url(#df2-screen-clip)" />
        {/* Notch */}
        <rect x={(W - notch.w) / 2} y="0" width={notch.w} height={notch.h} rx="0" fill="#020202" />
        {/* Camera + speaker in notch */}
        <circle cx={W / 2 + 28} cy="15" r="6.5" fill="#080808" />
        <circle cx={W / 2 + 28} cy="15" r="4" fill="#040404" />
        <circle cx={W / 2 + 26.5} cy="13.5" r="1.5" fill="rgba(255,255,255,0.06)" />
        <rect x={W / 2 - 40} y="11" width="38" height="8" rx="4" fill="#080808" />
      </svg>
    </div>
  );
}

// ── iPad ──────────────────────────────────────────────────────────────────────

function IPadFrame({ children, shadow }: { children: React.ReactNode; shadow?: boolean }) {
  const W = 300, H = 420;
  const cornerR = 22;
  const si = 14;
  const scR = cornerR - 5;

  return (
    <div style={{
      position: "relative", width: W, height: H,
      filter: shadow ? "drop-shadow(0 16px 40px rgba(0,0,0,0.5)) drop-shadow(0 4px 10px rgba(0,0,0,0.25))" : undefined,
    }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
        <defs>
          <linearGradient id="df3-body" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3c3c3e" />
            <stop offset="50%" stopColor="#1c1c1e" />
            <stop offset="100%" stopColor="#3a3a3c" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={W} height={H} rx={cornerR} ry={cornerR} fill="url(#df3-body)" />
        <rect x={si} y={si} width={W - si * 2} height={H - si * 2} rx={scR} ry={scR} fill="#090909" />
        <circle cx={W / 2} cy="8" r="4" fill="#0a0a0a" />
        <rect x={W - 8} y={(H - 38) / 2} width="5" height="38" rx="2.5" fill="#3a3a3c" />
        <rect x="2" y="78" width="5" height="28" rx="2.5" fill="#3a3a3c" />
        <rect x="2" y="116" width="5" height="28" rx="2.5" fill="#3a3a3c" />
        <rect x="0" y="0" width={W} height={H} rx={cornerR} ry={cornerR} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.75" />
        <rect x="1" y="1" width={W - 2} height={H - 2} rx={cornerR - 1} ry={cornerR - 1} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />
      </svg>
      <div style={{
        position: "absolute", top: si, left: si, right: si, bottom: si,
        borderRadius: scR, overflow: "hidden", zIndex: 1,
      }}>
        {children}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}>
        <defs>
          <linearGradient id="df3-gloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.09)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0.02)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <clipPath id="df3-clip">
            <rect x={si} y={si} width={W - si * 2} height={H - si * 2} rx={scR} ry={scR} />
          </clipPath>
        </defs>
        <rect x={si} y={si} width={W - si * 2} height={(H - si * 2) * 0.5}
          rx={scR} ry={scR} fill="url(#df3-gloss)" clipPath="url(#df3-clip)" />
      </svg>
    </div>
  );
}

// ── Android Phone ─────────────────────────────────────────────────────────────

function AndroidPhoneFrame({ children, shadow }: { children: React.ReactNode; shadow?: boolean }) {
  const W = 290, H = 600;
  const cornerR = 36;
  const si = 12;
  const scR = cornerR - 8;

  return (
    <div style={{
      position: "relative", width: W, height: H,
      filter: shadow ? "drop-shadow(0 20px 48px rgba(0,0,0,0.55)) drop-shadow(0 4px 12px rgba(0,0,0,0.3))" : undefined,
    }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
        <defs>
          <linearGradient id="df4-body" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2c2c2c" />
            <stop offset="50%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#2c2c2c" />
          </linearGradient>
          <linearGradient id="df4-btn" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2e2e30" />
            <stop offset="100%" stopColor="#484848" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={W} height={H} rx={cornerR} ry={cornerR} fill="url(#df4-body)" />
        <rect x={si} y={si} width={W - si * 2} height={H - si * 2} rx={scR} ry={scR} fill="#090909" />
        {/* Punch hole camera */}
        <circle cx={W / 2} cy="26" r="7" fill="#020202" />
        <circle cx={W / 2} cy="26" r="4.5" fill="#050505" />
        <circle cx={W / 2 - 1.5} cy="24.5" r="1.5" fill="rgba(255,255,255,0.07)" />
        {/* Side buttons */}
        <rect x={W - 2} y="138" width="5" height="28" rx="2.5" fill="url(#df4-btn)" />
        <rect x={W - 2} y="182" width="5" height="58" rx="2.5" fill="url(#df4-btn)" />
        <rect x={-3} y="158" width="5" height="68" rx="2.5" fill="#3a3a3c" />
        <rect x="0" y="0" width={W} height={H} rx={cornerR} ry={cornerR} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.75" />
        <rect x="1" y="1" width={W - 2} height={H - 2} rx={cornerR - 1} ry={cornerR - 1} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" />
      </svg>
      <div style={{
        position: "absolute", top: si, left: si, right: si, bottom: si,
        borderRadius: scR, overflow: "hidden", zIndex: 1,
      }}>
        {children}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}>
        <defs>
          <linearGradient id="df4-gloss" x1="0%" y1="0%" x2="5%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.03)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <clipPath id="df4-clip">
            <rect x={si} y={si} width={W - si * 2} height={H - si * 2} rx={scR} ry={scR} />
          </clipPath>
        </defs>
        <rect x={si} y={si} width={W - si * 2} height={(H - si * 2) * 0.5}
          rx={scR} ry={scR} fill="url(#df4-gloss)" clipPath="url(#df4-clip)" />
      </svg>
    </div>
  );
}

// ── Android Tablet ────────────────────────────────────────────────────────────

function AndroidTabFrame({ children, shadow, landscape }: { children: React.ReactNode; shadow?: boolean; landscape?: boolean }) {
  const W = landscape ? 500 : 320;
  const H = landscape ? 320 : 440;
  const cornerR = 18;
  const si = 14;
  const scR = cornerR - 5;

  return (
    <div style={{
      position: "relative", width: W, height: H,
      filter: shadow ? "drop-shadow(0 16px 40px rgba(0,0,0,0.5))" : undefined,
    }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
        <defs>
          <linearGradient id="df5-body" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2c2c2c" />
            <stop offset="50%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#2c2c2c" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={W} height={H} rx={cornerR} ry={cornerR} fill="url(#df5-body)" />
        <rect x={si} y={si} width={W - si * 2} height={H - si * 2} rx={scR} ry={scR} fill="#090909" />
        {landscape
          ? <circle cx={W - 8} cy={H / 2} r="4" fill="#0a0a0a" />
          : <circle cx={W / 2} cy="8" r="4" fill="#0a0a0a" />
        }
        <rect x="0" y="0" width={W} height={H} rx={cornerR} ry={cornerR} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.75" />
        <rect x="1" y="1" width={W - 2} height={H - 2} rx={cornerR - 1} ry={cornerR - 1} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />
      </svg>
      <div style={{
        position: "absolute", top: si, left: si, right: si, bottom: si,
        borderRadius: scR, overflow: "hidden", zIndex: 1,
      }}>
        {children}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}>
        <defs>
          <linearGradient id="df5-gloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.09)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0.02)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <clipPath id="df5-clip">
            <rect x={si} y={si} width={W - si * 2} height={H - si * 2} rx={scR} ry={scR} />
          </clipPath>
        </defs>
        <rect x={si} y={si} width={W - si * 2} height={(H - si * 2) * 0.45}
          rx={scR} ry={scR} fill="url(#df5-gloss)" clipPath="url(#df5-clip)" />
      </svg>
    </div>
  );
}

// ── Tilt 3D wrapper ────────────────────────────────────────────────────────────

function Tilt3DWrapper({ children, enable, tiltX = 4, tiltY = -14 }: { children: React.ReactNode; enable: boolean; tiltX?: number; tiltY?: number }) {
  if (!enable) return <>{children}</>;
  return (
    <div style={{ perspective: "1200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `rotateY(${tiltY}deg) rotateX(${tiltX}deg)`, transformStyle: "preserve-3d", transition: "transform 0.4s ease" }}>
        {children}
      </div>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────

export default function DeviceFrame({ spec, children, shadow, tilt3d, tiltX, tiltY, imageScale = 1, imageOffsetX = 50, imageOffsetY = 50 }: DeviceFrameProps) {
  const screenshotContent = (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", backgroundColor: "#0a0a0a" }}>
      {children ? (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <div style={{
            width: `${imageScale * 100}%`,
            height: `${imageScale * 100}%`,
            transform: `translate(${imageOffsetX - 50}%, ${imageOffsetY - 50}%)`,
            flexShrink: 0,
          }}>
            {children}
          </div>
        </div>
      ) : (
        <div style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          gap: 8,
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "var(--font)", textAlign: "center", padding: "0 12px" }}>
            Upload a screenshot
          </span>
        </div>
      )}
    </div>
  );

  const frame = (() => {
    switch (spec.frameType) {
      case "iphone-dynamic": return <IPhoneDynamic shadow={shadow}>{screenshotContent}</IPhoneDynamic>;
      case "iphone-notch":   return <IPhoneNotch shadow={shadow}>{screenshotContent}</IPhoneNotch>;
      case "ipad":           return <IPadFrame shadow={shadow}>{screenshotContent}</IPadFrame>;
      case "android":        return <AndroidPhoneFrame shadow={shadow}>{screenshotContent}</AndroidPhoneFrame>;
      case "android-tab":    return <AndroidTabFrame shadow={shadow} landscape={spec.isLandscape}>{screenshotContent}</AndroidTabFrame>;
    }
  })();

  return <Tilt3DWrapper enable={!!tilt3d} tiltX={tiltX} tiltY={tiltY}>{frame}</Tilt3DWrapper>;
}

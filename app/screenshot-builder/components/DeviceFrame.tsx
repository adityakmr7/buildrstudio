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
  const scR = cornerR - 4; // screen corner radius — close to body radius like real iPhone
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
            <stop offset="0%" stopColor="#3a3a3c" />
            <stop offset="15%" stopColor="#2a2a2c" />
            <stop offset="50%" stopColor="#1c1c1e" />
            <stop offset="85%" stopColor="#2a2a2c" />
            <stop offset="100%" stopColor="#3a3a3c" />
          </linearGradient>
          <linearGradient id="df-body-v" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.07)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.10)" />
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
        <rect x="0" y="0" width={W} height={H} rx={cornerR} ry={cornerR} fill="url(#df-body-h)" />
        <rect x="0" y="0" width={W} height={H} rx={cornerR} ry={cornerR} fill="url(#df-body-v)" />
        <rect x={si} y={si} width={W - si * 2} height={H - si * 2} rx={scR} ry={scR} fill="#090909" />
        <rect x={-3} y="138" width="5" height="38" rx="2.5" fill="url(#df-btn-l)" />
        <rect x={-3} y="192" width="5" height="62" rx="2.5" fill="url(#df-btn-l)" />
        <rect x={-3} y="268" width="5" height="62" rx="2.5" fill="url(#df-btn-l)" />
        <rect x={W - 2} y="168" width="5" height="100" rx="2.5" fill="url(#df-btn-r)" />
        <rect x="0" y="0" width={W} height={H} rx={cornerR} ry={cornerR} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75" />
        <rect x="1" y="1" width={W - 2} height={H - 2} rx={cornerR - 1} ry={cornerR - 1} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" />
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
        {/* Dynamic Island — outer glow ring (OLED bloom simulation, makes pill visible on dark content) */}
        <rect x={pill.x - 1.5} y={pill.y - 1.5} width={pill.w + 3} height={pill.h + 3}
          rx={(pill.h + 3) / 2} ry={(pill.h + 3) / 2}
          fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
        {/* Dynamic Island pill body */}
        <rect x={pill.x} y={pill.y} width={pill.w} height={pill.h} rx={pill.h / 2} fill="#000000" />
        {/* Camera ring — visible detail */}
        <circle cx={pill.x + pill.w - 17} cy={pill.y + pill.h / 2} r="8" fill="#111" />
        <circle cx={pill.x + pill.w - 17} cy={pill.y + pill.h / 2} r="5.5" fill="#0a0a0a" />
        <circle cx={pill.x + pill.w - 17} cy={pill.y + pill.h / 2} r="3" fill="#050505" />
        {/* Camera lens highlight */}
        <circle cx={pill.x + pill.w - 18.5} cy={pill.y + pill.h / 2 - 1.5} r="1.4" fill="rgba(255,255,255,0.12)" />
        {/* Microphone pill (left side of DI) */}
        <rect x={pill.x + 10} y={pill.y + pill.h / 2 - 4} width="8" height="8" rx="4" fill="#0a0a0a" />
      </svg>
    </div>
  );
}

// ── iPhone Notch ──────────────────────────────────────────────────────────────

function IPhoneNotch({ children, shadow }: { children: React.ReactNode; shadow?: boolean }) {
  const W = 300, H = 620;
  const cornerR = 42;
  const si = 11;
  const scR = cornerR - 4;
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
            <stop offset="0%" stopColor="#3a3a3c" />
            <stop offset="15%" stopColor="#2a2a2c" />
            <stop offset="50%" stopColor="#1c1c1e" />
            <stop offset="85%" stopColor="#2a2a2c" />
            <stop offset="100%" stopColor="#3a3a3c" />
          </linearGradient>
          <linearGradient id="df2-body-v" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.07)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.10)" />
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
        <rect x="0" y="0" width={W} height={H} rx={cornerR} ry={cornerR} fill="url(#df2-body-v)" />
        <rect x={si} y={si} width={W - si * 2} height={H - si * 2} rx={scR} ry={scR} fill="#090909" />
        <rect x={-3} y="138" width="5" height="38" rx="2.5" fill="url(#df2-btn-l)" />
        <rect x={-3} y="192" width="5" height="62" rx="2.5" fill="url(#df2-btn-l)" />
        <rect x={-3} y="268" width="5" height="62" rx="2.5" fill="url(#df2-btn-l)" />
        <rect x={W - 2} y="168" width="5" height="100" rx="2.5" fill="url(#df2-btn-r)" />
        <rect x="0" y="0" width={W} height={H} rx={cornerR} ry={cornerR} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75" />
        <rect x="1" y="1" width={W - 2} height={H - 2} rx={cornerR - 1} ry={cornerR - 1} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" />
        <rect x={si} y={si} width={W - si * 2} height={H - si * 2} rx={scR} ry={scR} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
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
        {/* Notch — rounded bottom corners to match real iPhone */}
        <rect x={(W - notch.w) / 2} y="0" width={notch.w} height={notch.h} rx="10" ry="10"
          style={{ clipPath: "inset(0 0 0 0 round 0 0 10px 10px)" }} fill="#000000" />
        {/* Notch outer glow ring (bottom edge only) */}
        <path
          d={`M ${(W - notch.w) / 2} 0 L ${(W - notch.w) / 2} ${notch.h - 10} Q ${(W - notch.w) / 2} ${notch.h} ${(W - notch.w) / 2 + 10} ${notch.h} L ${(W + notch.w) / 2 - 10} ${notch.h} Q ${(W + notch.w) / 2} ${notch.h} ${(W + notch.w) / 2} ${notch.h - 10} L ${(W + notch.w) / 2} 0`}
          fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.75" />
        {/* Camera + speaker in notch */}
        <circle cx={W / 2 + 26} cy="14" r="7" fill="#111" />
        <circle cx={W / 2 + 26} cy="14" r="4.5" fill="#050505" />
        <circle cx={W / 2 + 26} cy="14" r="2.5" fill="#030303" />
        <circle cx={W / 2 + 24.5} cy="12.5" r="1.2" fill="rgba(255,255,255,0.1)" />
        <rect x={W / 2 - 38} y="10" width="36" height="8" rx="4" fill="#080808" />
      </svg>
    </div>
  );
}

// ── iPad ──────────────────────────────────────────────────────────────────────

function IPadFrame({ children, shadow }: { children: React.ReactNode; shadow?: boolean }) {
  const W = 300, H = 420;
  const cornerR = 22;
  const si = 14;
  const scR = cornerR - 4;

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
  const scR = cornerR - 4;

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
  const scR = cornerR - 4;

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
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", backgroundColor: "#ffffff" }}>
      {children ? (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {children}
        </div>
      ) : (
        <div style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "#ffffff",
          gap: 10,
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.22)", fontFamily: "var(--font)", textAlign: "center", padding: "0 16px", lineHeight: 1.4 }}>
            Upload Image Here
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

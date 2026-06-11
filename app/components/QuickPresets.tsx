"use client";

import { OptimizationConfig } from "./WorkspaceHub";

interface QuickPresetsProps {
  setConfig: React.Dispatch<React.SetStateAction<OptimizationConfig>>;
}

const PRESETS = [
  {
    name: "Sunset Flare",
    description: "Vibrant warm colors (16:9)",
    config: {
      padding: 48,
      gradientClass: "bg-gradient-to-tr from-orange-400 via-pink-500 to-indigo-600",
      borderRadius: "rounded-xl",
      dropShadow: "shadow-xl",
      aspectRatio: "aspect-video",
    },
  },
  {
    name: "Midnight Cyber",
    description: "Deep dark tech look (16:9)",
    config: {
      padding: 64,
      gradientClass: "bg-gradient-to-tr from-purple-900 via-indigo-950 to-slate-900",
      borderRadius: "rounded-3xl",
      dropShadow: "shadow-2xl",
      aspectRatio: "aspect-video",
    },
  },
  {
    name: "Emerald Mist",
    description: "Calm green aesthetic (16:9)",
    config: {
      padding: 32,
      gradientClass: "bg-gradient-to-tr from-teal-400 to-emerald-700",
      borderRadius: "rounded-md",
      dropShadow: "shadow-md",
      aspectRatio: "aspect-video",
    },
  },
  {
    name: "Neon Synth",
    description: "Retro cyberpunk vibes (16:9)",
    config: {
      padding: 56,
      gradientClass: "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500",
      borderRadius: "rounded-3xl",
      dropShadow: "shadow-2xl",
      aspectRatio: "aspect-video",
    },
  },
  {
    name: "Minimal Light",
    description: "Clean light layout (1:1)",
    config: {
      padding: 40,
      gradientClass: "bg-gradient-to-tr from-slate-100 to-slate-200",
      borderRadius: "rounded-xl",
      dropShadow: "shadow-md",
      aspectRatio: "aspect-square",
    },
  },
  {
    name: "Minimal Dark",
    description: "Clean dark layout (1:1)",
    config: {
      padding: 40,
      gradientClass: "bg-gradient-to-tr from-neutral-800 to-neutral-950",
      borderRadius: "rounded-xl",
      dropShadow: "shadow-md",
      aspectRatio: "aspect-square",
    },
  },
];

export default function QuickPresets({ setConfig }: QuickPresetsProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div className="comp-block" style={{ border: "none", background: "none", padding: "0 0 4px 0" }}>
        <div className="comp-label" style={{ marginBottom: "8px" }}>Quick Presets</div>
        <p style={{ fontSize: "12px", color: "var(--text-3)", lineHeight: "1.4" }}>
          Instantly apply designer configurations.
        </p>
      </div>

      {PRESETS.map((preset) => (
        <div
          key={preset.name}
          className="sel-row"
          style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: "10px" }}
          onClick={() => setConfig(preset.config)}
        >
          <div
            className={preset.config.gradientClass}
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: "1px solid var(--border)",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.2px" }}>
              {preset.name}
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-3)" }}>
              {preset.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

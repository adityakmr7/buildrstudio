"use client";

import { useEffect } from "react";
import { OptimizationConfig, GRADIENT_PRESETS, SavedPreset } from "./WorkspaceHub";

interface QuickPresetsProps {
  config: OptimizationConfig;
  setConfig: React.Dispatch<React.SetStateAction<OptimizationConfig>>;
}

// ─── Built-in presets (using new config schema) ───────────────────────────────

type CorePreset = Omit<OptimizationConfig, "annotations" | "savedPresets">;

const PRESETS: { name: string; description: string; config: CorePreset }[] = [
  {
    name: "Sunset Flare",
    description: "Vibrant warm gradient · 16:9",
    config: {
      padding: 48,
      borderRadius: "rounded-xl",
      dropShadow: "shadow-xl",
      aspectRatio: "aspect-video",
      backgroundType: "gradient",
      gradientPreset: "sunset",
      gradientDirection: 135,
      solidColor: "#6366f1",
      meshPreset: "cosmic",
      patternType: "dots",
      patternColor: "#ffffff",
      patternBgColor: "#1e1b4b",
      noiseIntensity: 0,
      backgroundImageUrl: null,
      frameStyle: "macos",
      frameDarkMode: false,
      browserUrl: "buildrstudio.in",
      captionTitle: "",
      captionSubtitle: "",
      captionAlign: "center",
      captionPosition: "bottom",
      captionTitleColor: "#ffffff",
      captionSubtitleColor: "rgba(255,255,255,0.75)",
      captionTitleSize: 18,
      captionGlass: true,
      imageBrightness: 100,
      imageContrast: 100,
      imageSaturation: 100,
      imageScale: 100,
    },
  },
  {
    name: "Midnight Cyber",
    description: "Deep dark tech · 16:9",
    config: {
      padding: 64,
      borderRadius: "rounded-3xl",
      dropShadow: "shadow-2xl",
      aspectRatio: "aspect-video",
      backgroundType: "gradient",
      gradientPreset: "midnight-cyber",
      gradientDirection: 135,
      solidColor: "#0f172a",
      meshPreset: "nordic",
      patternType: "dots",
      patternColor: "#ffffff",
      patternBgColor: "#0f0f23",
      noiseIntensity: 15,
      backgroundImageUrl: null,
      frameStyle: "macos",
      frameDarkMode: true,
      browserUrl: "buildrstudio.in",
      captionTitle: "",
      captionSubtitle: "",
      captionAlign: "center",
      captionPosition: "bottom",
      captionTitleColor: "#ffffff",
      captionSubtitleColor: "rgba(255,255,255,0.6)",
      captionTitleSize: 18,
      captionGlass: true,
      imageBrightness: 100,
      imageContrast: 105,
      imageSaturation: 90,
      imageScale: 100,
    },
  },
  {
    name: "Dev Terminal",
    description: "Dark tech vibes · terminal frame",
    config: {
      padding: 40,
      borderRadius: "rounded-md",
      dropShadow: "shadow-xl",
      aspectRatio: "aspect-video",
      backgroundType: "mesh",
      gradientPreset: "midnight-cyber",
      gradientDirection: 135,
      solidColor: "#0f172a",
      meshPreset: "nordic",
      patternType: "dots",
      patternColor: "#a5f3fc",
      patternBgColor: "#0c0f1a",
      noiseIntensity: 20,
      backgroundImageUrl: null,
      frameStyle: "terminal",
      frameDarkMode: true,
      browserUrl: "buildrstudio.in",
      captionTitle: "",
      captionSubtitle: "",
      captionAlign: "center",
      captionPosition: "bottom",
      captionTitleColor: "#6ee7b7",
      captionSubtitleColor: "rgba(110,231,183,0.7)",
      captionTitleSize: 16,
      captionGlass: false,
      imageBrightness: 100,
      imageContrast: 108,
      imageSaturation: 95,
      imageScale: 100,
    },
  },
  {
    name: "Product Hunt",
    description: "Cosmic mesh · browser frame",
    config: {
      padding: 56,
      borderRadius: "rounded-xl",
      dropShadow: "shadow-2xl",
      aspectRatio: "aspect-video",
      backgroundType: "mesh",
      gradientPreset: "aurora",
      gradientDirection: 135,
      solidColor: "#7c3aed",
      meshPreset: "cosmic",
      patternType: "dots",
      patternColor: "#ffffff",
      patternBgColor: "#0f0f23",
      noiseIntensity: 10,
      backgroundImageUrl: null,
      frameStyle: "browser",
      frameDarkMode: true,
      browserUrl: "buildrstudio.in",
      captionTitle: "Just Shipped 🚀",
      captionSubtitle: "buildrstudio.in",
      captionAlign: "center",
      captionPosition: "bottom",
      captionTitleColor: "#ffffff",
      captionSubtitleColor: "rgba(255,255,255,0.65)",
      captionTitleSize: 20,
      captionGlass: true,
      imageBrightness: 100,
      imageContrast: 100,
      imageSaturation: 100,
      imageScale: 100,
    },
  },
  {
    name: "Story Mode",
    description: "9:16 vertical · iPhone frame",
    config: {
      padding: 44,
      borderRadius: "rounded-xl",
      dropShadow: "shadow-xl",
      aspectRatio: "aspect-[9/16]",
      backgroundType: "gradient",
      gradientPreset: "aurora",
      gradientDirection: 180,
      solidColor: "#6366f1",
      meshPreset: "cosmic",
      patternType: "dots",
      patternColor: "#ffffff",
      patternBgColor: "#0f0f23",
      noiseIntensity: 8,
      backgroundImageUrl: null,
      frameStyle: "iphone",
      frameDarkMode: false,
      browserUrl: "buildrstudio.in",
      captionTitle: "",
      captionSubtitle: "",
      captionAlign: "center",
      captionPosition: "bottom",
      captionTitleColor: "#ffffff",
      captionSubtitleColor: "rgba(255,255,255,0.7)",
      captionTitleSize: 18,
      captionGlass: true,
      imageBrightness: 100,
      imageContrast: 100,
      imageSaturation: 100,
      imageScale: 100,
    },
  },
  {
    name: "Clean Minimal",
    description: "Soft light · no frame",
    config: {
      padding: 56,
      borderRadius: "rounded-3xl",
      dropShadow: "shadow-md",
      aspectRatio: "aspect-square",
      backgroundType: "solid",
      gradientPreset: "minimal-light",
      gradientDirection: 135,
      solidColor: "#f8fafc",
      meshPreset: "cosmic",
      patternType: "dots",
      patternColor: "#94a3b8",
      patternBgColor: "#f8fafc",
      noiseIntensity: 0,
      backgroundImageUrl: null,
      frameStyle: "none",
      frameDarkMode: false,
      browserUrl: "buildrstudio.in",
      captionTitle: "",
      captionSubtitle: "",
      captionAlign: "center",
      captionPosition: "bottom",
      captionTitleColor: "#0f172a",
      captionSubtitleColor: "rgba(15,23,42,0.6)",
      captionTitleSize: 18,
      captionGlass: false,
      imageBrightness: 102,
      imageContrast: 98,
      imageSaturation: 100,
      imageScale: 100,
    },
  },
  {
    name: "Neon Synth",
    description: "Retro cyberpunk · 16:9",
    config: {
      padding: 56,
      borderRadius: "rounded-3xl",
      dropShadow: "shadow-2xl",
      aspectRatio: "aspect-video",
      backgroundType: "gradient",
      gradientPreset: "neon-synth",
      gradientDirection: 45,
      solidColor: "#ec4899",
      meshPreset: "cosmic",
      patternType: "dots",
      patternColor: "#ffffff",
      patternBgColor: "#1a0a00",
      noiseIntensity: 25,
      backgroundImageUrl: null,
      frameStyle: "macos",
      frameDarkMode: false,
      browserUrl: "buildrstudio.in",
      captionTitle: "",
      captionSubtitle: "",
      captionAlign: "center",
      captionPosition: "bottom",
      captionTitleColor: "#ffffff",
      captionSubtitleColor: "rgba(255,255,255,0.75)",
      captionTitleSize: 18,
      captionGlass: true,
      imageBrightness: 100,
      imageContrast: 110,
      imageSaturation: 115,
      imageScale: 100,
    },
  },
  {
    name: "Dot Matrix",
    description: "Dark pattern bg · 1:1",
    config: {
      padding: 48,
      borderRadius: "rounded-xl",
      dropShadow: "shadow-xl",
      aspectRatio: "aspect-square",
      backgroundType: "pattern",
      gradientPreset: "midnight-cyber",
      gradientDirection: 135,
      solidColor: "#1e1b4b",
      meshPreset: "nordic",
      patternType: "dots",
      patternColor: "#818cf8",
      patternBgColor: "#0f0f23",
      noiseIntensity: 0,
      backgroundImageUrl: null,
      frameStyle: "browser",
      frameDarkMode: true,
      browserUrl: "buildrstudio.in",
      captionTitle: "",
      captionSubtitle: "",
      captionAlign: "center",
      captionPosition: "bottom",
      captionTitleColor: "#a5b4fc",
      captionSubtitleColor: "rgba(165,180,252,0.65)",
      captionTitleSize: 18,
      captionGlass: true,
      imageBrightness: 100,
      imageContrast: 100,
      imageSaturation: 100,
      imageScale: 100,
    },
  },
];

// Helper to build swatch gradient CSS for built-in presets
function presetSwatchStyle(preset: (typeof PRESETS)[0]): React.CSSProperties {
  if (preset.config.backgroundType === "gradient") {
    const gp = GRADIENT_PRESETS[preset.config.gradientPreset];
    if (gp) {
      const stops = gp.via ? `${gp.from}, ${gp.via}, ${gp.to}` : `${gp.from}, ${gp.to}`;
      return { background: `linear-gradient(135deg, ${stops})` };
    }
  }
  if (preset.config.backgroundType === "solid") {
    return { background: preset.config.solidColor };
  }
  if (preset.config.backgroundType === "mesh") {
    return { background: "#7c3aed" };
  }
  if (preset.config.backgroundType === "pattern") {
    return { background: preset.config.patternBgColor };
  }
  return { background: "#1a1a2e" };
}

// ─── QuickPresets ─────────────────────────────────────────────────────────────

export default function QuickPresets({ config, setConfig }: QuickPresetsProps) {
  // On mount, restore any user saved presets from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bs_saved_presets");
      if (stored) {
        const parsed: SavedPreset[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setConfig((prev) => ({ ...prev, savedPresets: parsed }));
        }
      }
    } catch {}
  }, [setConfig]);

  const applyPreset = (presetConfig: CorePreset) => {
    setConfig((prev) => ({
      ...prev,
      ...presetConfig,
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* Header */}
      <div style={{ padding: "0 4px" }}>
        <div className="comp-label" style={{ marginBottom: "4px" }}>Quick Presets</div>
        <p style={{ fontSize: "12px", color: "var(--text-3)", lineHeight: 1.4 }}>
          One-click designer configurations.
        </p>
      </div>

      {/* Built-in preset list */}
      <div className="presets-list">
        {PRESETS.map((preset) => (
          <div
            key={preset.name}
            className="sel-row"
            style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
            onClick={() => applyPreset(preset.config)}
          >
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                border: "1.5px solid var(--border)",
                flexShrink: 0,
                ...presetSwatchStyle(preset),
              }}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1px", minWidth: 0 }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {preset.name}
              </span>
              <span style={{ fontSize: "11px", color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {preset.description}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* User-saved presets from ControlSidebar */}
      {config.savedPresets.length > 0 && (
        <>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
            <div className="comp-label" style={{ marginBottom: "6px" }}>My Presets</div>
          </div>
          <div className="presets-list">
            {config.savedPresets.map((preset) => (
              <div
                key={preset.id}
                className="sel-row"
                style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                onClick={() => setConfig((prev) => ({ ...prev, ...preset.config }))}
              >
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    border: "1.5px solid var(--border)",
                    flexShrink: 0,
                    background: "var(--fill)",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.2px", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {preset.name}
                  </span>
                  <span style={{ fontSize: "10px", color: "var(--text-3)" }}>
                    Saved · {new Date(preset.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

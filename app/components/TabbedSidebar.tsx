"use client";

import { useRef, useState, useEffect } from "react";
import {
  OptimizationConfig,
  GRADIENT_PRESETS,
  MESH_PRESETS,
  Annotation,
  SavedPreset,
} from "./WorkspaceHub";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TabbedSidebarProps {
  config: OptimizationConfig;
  setConfig: React.Dispatch<React.SetStateAction<OptimizationConfig>>;
  onOpenPremium: () => void;
}

type TabId = "bg" | "frame" | "layout" | "caption" | "image" | "annotations" | "presets";

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: "bg",          icon: "🎨", label: "BG"      },
  { id: "frame",       icon: "🖥",  label: "Frame"   },
  { id: "layout",      icon: "📐", label: "Layout"  },
  { id: "caption",     icon: "✍️",  label: "Caption" },
  { id: "image",       icon: "🔧", label: "Image"   },
  { id: "annotations", icon: "📍", label: "Annot"   },
  { id: "presets",     icon: "⚡", label: "Presets" },
];

// ─── Preset data ──────────────────────────────────────────────────────────────

type CorePreset = Omit<OptimizationConfig, "annotations" | "savedPresets">;

const BUILTIN_PRESETS: { name: string; description: string; config: CorePreset }[] = [
  {
    name: "Sunset Flare",
    description: "Warm gradient · macOS · 16:9",
    config: {
      padding: 48, borderRadius: "rounded-xl", dropShadow: "shadow-xl", aspectRatio: "aspect-video",
      backgroundType: "gradient", gradientPreset: "sunset", gradientDirection: 135,
      solidColor: "#6366f1", meshPreset: "cosmic", patternType: "dots", patternColor: "#ffffff",
      patternBgColor: "#1e1b4b", noiseIntensity: 0, backgroundImageUrl: null,
      frameStyle: "macos", frameDarkMode: false, browserUrl: "buildrstudio.in",
      captionTitle: "", captionSubtitle: "", captionAlign: "center", captionPosition: "bottom",
      captionTitleColor: "#ffffff", captionSubtitleColor: "rgba(255,255,255,0.75)", captionTitleSize: 18, captionGlass: true,
      imageBrightness: 100, imageContrast: 100, imageSaturation: 100, imageScale: 100,
    },
  },
  {
    name: "Midnight Cyber",
    description: "Dark tech · noise · 16:9",
    config: {
      padding: 64, borderRadius: "rounded-3xl", dropShadow: "shadow-2xl", aspectRatio: "aspect-video",
      backgroundType: "gradient", gradientPreset: "midnight-cyber", gradientDirection: 135,
      solidColor: "#0f172a", meshPreset: "nordic", patternType: "dots", patternColor: "#ffffff",
      patternBgColor: "#0f0f23", noiseIntensity: 15, backgroundImageUrl: null,
      frameStyle: "macos", frameDarkMode: true, browserUrl: "buildrstudio.in",
      captionTitle: "", captionSubtitle: "", captionAlign: "center", captionPosition: "bottom",
      captionTitleColor: "#ffffff", captionSubtitleColor: "rgba(255,255,255,0.6)", captionTitleSize: 18, captionGlass: true,
      imageBrightness: 100, imageContrast: 105, imageSaturation: 90, imageScale: 100,
    },
  },
  {
    name: "Dev Terminal",
    description: "Mesh · terminal frame · 16:9",
    config: {
      padding: 40, borderRadius: "rounded-md", dropShadow: "shadow-xl", aspectRatio: "aspect-video",
      backgroundType: "mesh", gradientPreset: "midnight-cyber", gradientDirection: 135,
      solidColor: "#0f172a", meshPreset: "nordic", patternType: "dots", patternColor: "#a5f3fc",
      patternBgColor: "#0c0f1a", noiseIntensity: 20, backgroundImageUrl: null,
      frameStyle: "terminal", frameDarkMode: true, browserUrl: "buildrstudio.in",
      captionTitle: "", captionSubtitle: "", captionAlign: "center", captionPosition: "bottom",
      captionTitleColor: "#6ee7b7", captionSubtitleColor: "rgba(110,231,183,0.7)", captionTitleSize: 16, captionGlass: false,
      imageBrightness: 100, imageContrast: 108, imageSaturation: 95, imageScale: 100,
    },
  },
  {
    name: "Product Hunt",
    description: "Cosmic mesh · browser · caption",
    config: {
      padding: 56, borderRadius: "rounded-xl", dropShadow: "shadow-2xl", aspectRatio: "aspect-video",
      backgroundType: "mesh", gradientPreset: "aurora", gradientDirection: 135,
      solidColor: "#7c3aed", meshPreset: "cosmic", patternType: "dots", patternColor: "#ffffff",
      patternBgColor: "#0f0f23", noiseIntensity: 10, backgroundImageUrl: null,
      frameStyle: "browser", frameDarkMode: true, browserUrl: "buildrstudio.in",
      captionTitle: "Just Shipped 🚀", captionSubtitle: "buildrstudio.in",
      captionAlign: "center", captionPosition: "bottom",
      captionTitleColor: "#ffffff", captionSubtitleColor: "rgba(255,255,255,0.65)", captionTitleSize: 20, captionGlass: true,
      imageBrightness: 100, imageContrast: 100, imageSaturation: 100, imageScale: 100,
    },
  },
  {
    name: "Story Mode",
    description: "Aurora gradient · iPhone · 9:16",
    config: {
      padding: 44, borderRadius: "rounded-xl", dropShadow: "shadow-xl", aspectRatio: "aspect-[9/16]",
      backgroundType: "gradient", gradientPreset: "aurora", gradientDirection: 180,
      solidColor: "#6366f1", meshPreset: "cosmic", patternType: "dots", patternColor: "#ffffff",
      patternBgColor: "#0f0f23", noiseIntensity: 8, backgroundImageUrl: null,
      frameStyle: "iphone", frameDarkMode: false, browserUrl: "buildrstudio.in",
      captionTitle: "", captionSubtitle: "", captionAlign: "center", captionPosition: "bottom",
      captionTitleColor: "#ffffff", captionSubtitleColor: "rgba(255,255,255,0.7)", captionTitleSize: 18, captionGlass: true,
      imageBrightness: 100, imageContrast: 100, imageSaturation: 100, imageScale: 100,
    },
  },
  {
    name: "Clean Minimal",
    description: "Solid white · no frame · 1:1",
    config: {
      padding: 56, borderRadius: "rounded-3xl", dropShadow: "shadow-md", aspectRatio: "aspect-square",
      backgroundType: "solid", gradientPreset: "minimal-light", gradientDirection: 135,
      solidColor: "#f8fafc", meshPreset: "cosmic", patternType: "dots", patternColor: "#94a3b8",
      patternBgColor: "#f8fafc", noiseIntensity: 0, backgroundImageUrl: null,
      frameStyle: "none", frameDarkMode: false, browserUrl: "buildrstudio.in",
      captionTitle: "", captionSubtitle: "", captionAlign: "center", captionPosition: "bottom",
      captionTitleColor: "#0f172a", captionSubtitleColor: "rgba(15,23,42,0.6)", captionTitleSize: 18, captionGlass: false,
      imageBrightness: 102, imageContrast: 98, imageSaturation: 100, imageScale: 100,
    },
  },
  {
    name: "Neon Synth",
    description: "Cyberpunk gradient · noise · 16:9",
    config: {
      padding: 56, borderRadius: "rounded-3xl", dropShadow: "shadow-2xl", aspectRatio: "aspect-video",
      backgroundType: "gradient", gradientPreset: "neon-synth", gradientDirection: 45,
      solidColor: "#ec4899", meshPreset: "cosmic", patternType: "dots", patternColor: "#ffffff",
      patternBgColor: "#1a0a00", noiseIntensity: 25, backgroundImageUrl: null,
      frameStyle: "macos", frameDarkMode: false, browserUrl: "buildrstudio.in",
      captionTitle: "", captionSubtitle: "", captionAlign: "center", captionPosition: "bottom",
      captionTitleColor: "#ffffff", captionSubtitleColor: "rgba(255,255,255,0.75)", captionTitleSize: 18, captionGlass: true,
      imageBrightness: 100, imageContrast: 110, imageSaturation: 115, imageScale: 100,
    },
  },
  {
    name: "Dot Matrix",
    description: "Pattern dots · browser · 1:1",
    config: {
      padding: 48, borderRadius: "rounded-xl", dropShadow: "shadow-xl", aspectRatio: "aspect-square",
      backgroundType: "pattern", gradientPreset: "midnight-cyber", gradientDirection: 135,
      solidColor: "#1e1b4b", meshPreset: "nordic", patternType: "dots", patternColor: "#818cf8",
      patternBgColor: "#0f0f23", noiseIntensity: 0, backgroundImageUrl: null,
      frameStyle: "browser", frameDarkMode: true, browserUrl: "buildrstudio.in",
      captionTitle: "", captionSubtitle: "", captionAlign: "center", captionPosition: "bottom",
      captionTitleColor: "#a5b4fc", captionSubtitleColor: "rgba(165,180,252,0.65)", captionTitleSize: 18, captionGlass: true,
      imageBrightness: 100, imageContrast: 100, imageSaturation: 100, imageScale: 100,
    },
  },
];

// ─── Shared micro-components ──────────────────────────────────────────────────

function RangeSlider({ label, min, max, value, onChange, unit = "", step = 1 }: {
  label: string; min: number; max: number; value: number;
  onChange: (v: number) => void; unit?: string; step?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "12px", color: "var(--text-2)", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-1)", fontFamily: "monospace" }}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} className="opt-range" />
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <input type="color" value={value.startsWith("rgba") ? "#ffffff" : value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "26px", height: "26px", borderRadius: "6px", border: "1.5px solid var(--border)", cursor: "pointer", padding: "1px", background: "none", flexShrink: 0 }} />
      <span style={{ fontSize: "12px", color: "var(--text-2)", fontWeight: 500, flex: 1 }}>{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "80px", fontSize: "10px", fontFamily: "monospace", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "4px", padding: "4px 6px", color: "var(--text-1)" }} />
    </div>
  );
}

function SegmentedControl<T extends string>({ options, value, onChange }: {
  options: { label: string; value: T }[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div className="toggle-pill" style={{ display: "flex", width: "100%" }}>
      {options.map((o) => (
        <button key={o.value} type="button"
          className={`tp-option ${value === o.value ? "active" : ""}`}
          style={{ flex: 1, border: "none", background: "none", cursor: "pointer", padding: "7px 0", fontSize: "11px", textAlign: "center", fontFamily: "var(--font)" }}
          onClick={() => onChange(o.value)}
        >{o.label}</button>
      ))}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: "12px", color: "var(--text-2)", fontWeight: 500 }}>{label}</span>
      <button type="button" onClick={() => onChange(!value)}
        style={{ width: "34px", height: "18px", borderRadius: "9px", background: value ? "var(--fill)" : "var(--border-strong)", border: "none", cursor: "pointer", position: "relative", transition: "background .15s", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: "2px", left: value ? "16px" : "2px", width: "14px", height: "14px", borderRadius: "50%", background: "white", transition: "left .15s", boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }} />
      </button>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <span className="ctrl-label">{children}</span>;
}

// ─── TAB CONTENT: Background ──────────────────────────────────────────────────

const GRADIENT_DIRS = [
  { label: "↗", v: 45 }, { label: "→", v: 90 }, { label: "↘", v: 135 }, { label: "↓", v: 180 },
  { label: "↙", v: 225 }, { label: "←", v: 270 }, { label: "↖", v: 315 }, { label: "↑", v: 360 },
];
const SOLID_SWATCHES = ["#6366f1","#8b5cf6","#ec4899","#f43f5e","#0ea5e9","#10b981","#f97316","#0f172a","#ffffff","#f1f5f9","#1e293b","#111827"];
const PATTERN_OPTS = [
  { label: "Dots", value: "dots" }, { label: "Grid", value: "grid" },
  { label: "Diagonal", value: "diagonal" }, { label: "Crosshatch", value: "crosshatch" }, { label: "Circles", value: "circles" },
] as const;

function buildGradCSS(p: { from: string; via?: string; to: string }, dir: number) {
  return p.via
    ? `linear-gradient(${dir}deg, ${p.from}, ${p.via}, ${p.to})`
    : `linear-gradient(${dir}deg, ${p.from}, ${p.to})`;
}

function presetSwatchCSS(p: (typeof BUILTIN_PRESETS)[0]): React.CSSProperties {
  if (p.config.backgroundType === "gradient") {
    const gp = GRADIENT_PRESETS[p.config.gradientPreset];
    if (gp) return { background: buildGradCSS(gp, 135) };
  }
  if (p.config.backgroundType === "solid")   return { background: p.config.solidColor };
  if (p.config.backgroundType === "mesh")    return { background: "#7c3aed" };
  if (p.config.backgroundType === "pattern") return { background: p.config.patternBgColor };
  return { background: "#1a1a2e" };
}

function TabBackground({ config, update }: { config: OptimizationConfig; update: <K extends keyof OptimizationConfig>(k: K, v: OptimizationConfig[K]) => void }) {
  const bgFileRef = useRef<HTMLInputElement>(null);
  const bgTypes = ["gradient", "solid", "mesh", "pattern", "image"] as const;

  return (
    <div className="ctrl-section">
      {/* Type chips */}
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {bgTypes.map((t) => (
          <button key={t} type="button" onClick={() => update("backgroundType", t)}
            style={{ padding: "5px 10px", borderRadius: "var(--r-full)", fontSize: "11px", fontWeight: 600, border: "1.5px solid", cursor: "pointer", fontFamily: "var(--font)", textTransform: "capitalize", transition: "all .12s",
              background: config.backgroundType === t ? "var(--fill)" : "transparent",
              borderColor: config.backgroundType === t ? "var(--fill)" : "var(--border-strong)",
              color: config.backgroundType === t ? "var(--fill-text)" : "var(--text-2)" }}>
            {t}
          </button>
        ))}
      </div>

      <div className="ctrl-divider" />

      {/* Gradient */}
      {config.backgroundType === "gradient" && (
        <>
          <div>
            <SectionLabel>Preset</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
              {Object.entries(GRADIENT_PRESETS).map(([key, preset]) => (
                <button key={key} type="button" title={preset.name} onClick={() => update("gradientPreset", key)}
                  style={{ width: "100%", aspectRatio: "1", borderRadius: "50%", background: buildGradCSS(preset, 135), cursor: "pointer", transition: "transform .12s, border .12s",
                    border: config.gradientPreset === key ? "3px solid var(--text-1)" : "2px solid transparent",
                    transform: config.gradientPreset === key ? "scale(1.1)" : "scale(1)",
                    boxShadow: config.gradientPreset === key ? "0 0 0 2px var(--surface)" : "0 0 0 1.5px var(--border)" }} />
              ))}
            </div>
          </div>
          <div>
            <SectionLabel>Direction</SectionLabel>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {GRADIENT_DIRS.map((d) => (
                <button key={d.v} type="button" onClick={() => update("gradientDirection", d.v)}
                  style={{ width: "30px", height: "30px", borderRadius: "var(--r-sm)", border: "1.5px solid", borderColor: config.gradientDirection === d.v ? "var(--text-1)" : "var(--border)", background: config.gradientDirection === d.v ? "var(--fill-subtle)" : "transparent", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font)" }}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Solid */}
      {config.backgroundType === "solid" && (
        <>
          <ColorRow label="Color" value={config.solidColor} onChange={(v) => update("solidColor", v)} />
          <div>
            <SectionLabel>Swatches</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {SOLID_SWATCHES.map((c) => (
                <button key={c} type="button" onClick={() => update("solidColor", c)}
                  style={{ width: "22px", height: "22px", borderRadius: "5px", background: c, cursor: "pointer", border: config.solidColor === c ? "2px solid var(--text-1)" : "1px solid var(--border)" }} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Mesh */}
      {config.backgroundType === "mesh" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {Object.entries(MESH_PRESETS).map(([key, mesh]) => (
            <button key={key} type="button" onClick={() => update("meshPreset", key)}
              style={{ padding: "10px 8px", borderRadius: "var(--r-md)", border: "1.5px solid", borderColor: config.meshPreset === key ? "var(--text-1)" : "var(--border)", cursor: "pointer", background: mesh.base, position: "relative", overflow: "hidden", minHeight: "48px", fontFamily: "var(--font)" }}>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 20% 20%, ${mesh.colors[0]}aa 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, ${mesh.colors[1]}aa 0%, transparent 60%)` }} />
              <span style={{ position: "relative", zIndex: 1, fontSize: "10px", fontWeight: 700, color: "#fff" }}>{mesh.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Pattern */}
      {config.backgroundType === "pattern" && (
        <>
          <div>
            <SectionLabel>Pattern</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {PATTERN_OPTS.map((p) => (
                <button key={p.value} type="button" onClick={() => update("patternType", p.value)}
                  style={{ padding: "5px 9px", borderRadius: "var(--r-sm)", fontSize: "11px", fontWeight: 600, border: "1.5px solid", borderColor: config.patternType === p.value ? "var(--text-1)" : "var(--border)", background: config.patternType === p.value ? "var(--fill-subtle)" : "transparent", cursor: "pointer", fontFamily: "var(--font)", color: "var(--text-1)" }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <ColorRow label="Ink"        value={config.patternColor}   onChange={(v) => update("patternColor", v)} />
          <ColorRow label="Background" value={config.patternBgColor} onChange={(v) => update("patternBgColor", v)} />
        </>
      )}

      {/* Image */}
      {config.backgroundType === "image" && (
        <>
          <input ref={bgFileRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) update("backgroundImageUrl", URL.createObjectURL(f)); }} />
          {config.backgroundImageUrl ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ height: "64px", borderRadius: "var(--r-md)", backgroundImage: `url(${config.backgroundImageUrl})`, backgroundSize: "cover", backgroundPosition: "center", border: "1px solid var(--border)" }} />
              <div style={{ display: "flex", gap: "6px" }}>
                <button type="button" className="btn-outline btn-sm" onClick={() => bgFileRef.current?.click()}>Change</button>
                <button type="button" className="btn-ghost btn-sm" onClick={() => update("backgroundImageUrl", null)}>Remove</button>
              </div>
            </div>
          ) : (
            <button type="button" className="btn-outline btn-sm" onClick={() => bgFileRef.current?.click()}
              style={{ width: "100%", justifyContent: "center" }}>
              📁 Upload Background Image
            </button>
          )}
        </>
      )}

      <div className="ctrl-divider" />
      <RangeSlider label="Noise / Grain" min={0} max={80} value={config.noiseIntensity} onChange={(v) => update("noiseIntensity", v)} unit="%" />
    </div>
  );
}

// ─── TAB CONTENT: Frame ───────────────────────────────────────────────────────

const FRAME_OPTS = [
  { label: "macOS",    value: "macos",    icon: "🖥" },
  { label: "Browser",  value: "browser",  icon: "🌐" },
  { label: "Terminal", value: "terminal", icon: "⌨️" },
  { label: "iPhone",   value: "iphone",   icon: "📱" },
  { label: "Android",  value: "android",  icon: "🤖" },
  { label: "None",     value: "none",     icon: "⬜" },
] as const;

function TabFrame({ config, update }: { config: OptimizationConfig; update: <K extends keyof OptimizationConfig>(k: K, v: OptimizationConfig[K]) => void }) {
  return (
    <div className="ctrl-section">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
        {FRAME_OPTS.map((f) => (
          <button key={f.value} type="button" onClick={() => update("frameStyle", f.value)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "10px 6px", borderRadius: "var(--r-md)", border: "1.5px solid", borderColor: config.frameStyle === f.value ? "var(--text-1)" : "var(--border)", background: config.frameStyle === f.value ? "var(--fill-subtle)" : "transparent", cursor: "pointer", fontFamily: "var(--font)" }}>
            <span style={{ fontSize: "18px" }}>{f.icon}</span>
            <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-2)" }}>{f.label}</span>
          </button>
        ))}
      </div>
      <Toggle label="Dark frame bar" value={config.frameDarkMode} onChange={(v) => update("frameDarkMode", v)} />
      {config.frameStyle === "browser" && (
        <div>
          <SectionLabel>URL Bar Text</SectionLabel>
          <input type="text" className="input-field" value={config.browserUrl} onChange={(e) => update("browserUrl", e.target.value)}
            placeholder="buildrstudio.in" style={{ fontSize: "12px", padding: "7px 10px" }} />
        </div>
      )}
    </div>
  );
}

// ─── TAB CONTENT: Layout ──────────────────────────────────────────────────────

const ASPECT_OPTS = [
  { label: "16:9 Landscape", value: "aspect-video"   },
  { label: "1:1 Square",     value: "aspect-square"  },
  { label: "4:5 Portrait",   value: "aspect-[4/5]"   },
  { label: "9:16 Story",     value: "aspect-[9/16]"  },
];

function TabLayout({ config, update }: { config: OptimizationConfig; update: <K extends keyof OptimizationConfig>(k: K, v: OptimizationConfig[K]) => void }) {
  return (
    <div className="ctrl-section">
      <div>
        <SectionLabel>Aspect Ratio</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          {ASPECT_OPTS.map((o) => (
            <button key={o.value} type="button" onClick={() => update("aspectRatio", o.value)}
              style={{ padding: "8px 6px", borderRadius: "var(--r-sm)", fontSize: "11px", fontWeight: 600, border: "1.5px solid", borderColor: config.aspectRatio === o.value ? "var(--text-1)" : "var(--border)", background: config.aspectRatio === o.value ? "var(--fill-subtle)" : "transparent", cursor: "pointer", fontFamily: "var(--font)", color: "var(--text-1)" }}>
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <RangeSlider label="Padding" min={0} max={128} value={config.padding} onChange={(v) => update("padding", v)} unit="px" />
      <div>
        <SectionLabel>Border Radius</SectionLabel>
        <SegmentedControl
          options={[{ label: "None", value: "rounded-none" },{ label: "MD", value: "rounded-md" },{ label: "XL", value: "rounded-xl" },{ label: "3XL", value: "rounded-3xl" }]}
          value={config.borderRadius as "rounded-none" | "rounded-md" | "rounded-xl" | "rounded-3xl"}
          onChange={(v) => update("borderRadius", v)}
        />
      </div>
      <div>
        <SectionLabel>Drop Shadow</SectionLabel>
        <SegmentedControl
          options={[{ label: "None", value: "shadow-none" },{ label: "MD", value: "shadow-md" },{ label: "XL", value: "shadow-xl" },{ label: "2XL", value: "shadow-2xl" }]}
          value={config.dropShadow as "shadow-none" | "shadow-md" | "shadow-xl" | "shadow-2xl"}
          onChange={(v) => update("dropShadow", v)}
        />
      </div>
    </div>
  );
}

// ─── TAB CONTENT: Caption ─────────────────────────────────────────────────────

function TabCaption({ config, update }: { config: OptimizationConfig; update: <K extends keyof OptimizationConfig>(k: K, v: OptimizationConfig[K]) => void }) {
  return (
    <div className="ctrl-section">
      <div>
        <SectionLabel>Title</SectionLabel>
        <input type="text" className="input-field" placeholder="e.g. Just shipped v2.0 🚀"
          value={config.captionTitle} onChange={(e) => update("captionTitle", e.target.value)}
          style={{ fontSize: "12px", padding: "7px 10px" }} />
      </div>
      <div>
        <SectionLabel>Subtitle</SectionLabel>
        <input type="text" className="input-field" placeholder="e.g. buildrstudio.in"
          value={config.captionSubtitle} onChange={(e) => update("captionSubtitle", e.target.value)}
          style={{ fontSize: "12px", padding: "7px 10px" }} />
      </div>
      <RangeSlider label="Title Size" min={12} max={40} value={config.captionTitleSize} onChange={(v) => update("captionTitleSize", v)} unit="px" />
      <ColorRow label="Title color"    value={config.captionTitleColor}    onChange={(v) => update("captionTitleColor", v)} />
      <ColorRow label="Subtitle color" value={config.captionSubtitleColor} onChange={(v) => update("captionSubtitleColor", v)} />
      <div>
        <SectionLabel>Alignment</SectionLabel>
        <SegmentedControl
          options={[{ label: "Left", value: "left" },{ label: "Center", value: "center" },{ label: "Right", value: "right" }]}
          value={config.captionAlign} onChange={(v) => update("captionAlign", v)}
        />
      </div>
      <div>
        <SectionLabel>Position</SectionLabel>
        <SegmentedControl
          options={[{ label: "Top", value: "top" },{ label: "Bottom", value: "bottom" }]}
          value={config.captionPosition} onChange={(v) => update("captionPosition", v)}
        />
      </div>
      <Toggle label="Frosted glass bg" value={config.captionGlass} onChange={(v) => update("captionGlass", v)} />
    </div>
  );
}

// ─── TAB CONTENT: Image ───────────────────────────────────────────────────────

function TabImage({ config, update }: { config: OptimizationConfig; update: <K extends keyof OptimizationConfig>(k: K, v: OptimizationConfig[K]) => void }) {
  const isDefault = config.imageBrightness === 100 && config.imageContrast === 100 && config.imageSaturation === 100 && config.imageScale === 100;
  return (
    <div className="ctrl-section">
      <RangeSlider label="Brightness" min={50}  max={150} value={config.imageBrightness} onChange={(v) => update("imageBrightness", v)} unit="%" />
      <RangeSlider label="Contrast"   min={50}  max={150} value={config.imageContrast}   onChange={(v) => update("imageContrast", v)}   unit="%" />
      <RangeSlider label="Saturation" min={0}   max={200} value={config.imageSaturation} onChange={(v) => update("imageSaturation", v)} unit="%" />
      <RangeSlider label="Scale"      min={70}  max={110} value={config.imageScale}       onChange={(v) => update("imageScale", v)}       unit="%" />
      {!isDefault && (
        <button type="button" className="btn-ghost btn-sm" onClick={() => { update("imageBrightness", 100); update("imageContrast", 100); update("imageSaturation", 100); update("imageScale", 100); }}
          style={{ alignSelf: "flex-start", fontSize: "11px" }}>
          ↺ Reset to defaults
        </button>
      )}
    </div>
  );
}

// ─── TAB CONTENT: Annotations ─────────────────────────────────────────────────

const ANNOT_TYPES = [
  { label: "Badge",  value: "badge"       },
  { label: "Label",  value: "label"       },
  { label: "→",      value: "arrow-right" },
  { label: "←",      value: "arrow-left"  },
  { label: "↑",      value: "arrow-up"    },
  { label: "↓",      value: "arrow-down"  },
] as const;

function TabAnnotations({ config, update }: { config: OptimizationConfig; update: <K extends keyof OptimizationConfig>(k: K, v: OptimizationConfig[K]) => void }) {
  const [text,  setText]  = useState("🚀 Just Shipped");
  const [type,  setType]  = useState<Annotation["type"]>("badge");
  const [color, setColor] = useState("#ffffff");
  const [bg,    setBg]    = useState("#6366f1");
  const [size,  setSize]  = useState(14);

  const add = () => {
    if (!text.trim()) return;
    const ann: Annotation = { id: `ann-${Date.now()}`, type, text: text.trim(), x: 50, y: 50, color, bgColor: bg, fontSize: size };
    update("annotations", [...config.annotations, ann]);
  };

  return (
    <div className="ctrl-section">
      <p style={{ fontSize: "11px", color: "var(--text-3)", margin: 0, lineHeight: 1.5 }}>
        Add badges, labels, or arrows. Drag to position on the canvas.
      </p>
      <div>
        <SectionLabel>Type</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {ANNOT_TYPES.map((t) => (
            <button key={t.value} type="button" onClick={() => setType(t.value as Annotation["type"])}
              style={{ padding: "5px 9px", borderRadius: "var(--r-sm)", fontSize: "11px", fontWeight: 600, border: "1.5px solid", borderColor: type === t.value ? "var(--text-1)" : "var(--border)", background: type === t.value ? "var(--fill-subtle)" : "transparent", cursor: "pointer", fontFamily: "var(--font)", color: "var(--text-1)" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <input type="text" className="input-field" placeholder="Annotation text" value={text} onChange={(e) => setText(e.target.value)}
        style={{ fontSize: "12px", padding: "7px 10px" }} />
      <ColorRow label="Text color" value={color} onChange={setColor} />
      {type === "badge" && <ColorRow label="Badge bg" value={bg} onChange={setBg} />}
      <RangeSlider label="Font size" min={10} max={28} value={size} onChange={setSize} unit="px" />
      <button type="button" className="btn-fill btn-sm" onClick={add} style={{ justifyContent: "center", width: "100%" }}>
        + Add to Canvas
      </button>
      {config.annotations.length > 0 && (
        <>
          <div className="ctrl-divider" />
          <SectionLabel>Active ({config.annotations.length})</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", maxHeight: "160px", overflowY: "auto" }}>
            {config.annotations.map((ann) => (
              <div key={ann.id} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "7px 10px", background: "var(--surface-2)", borderRadius: "var(--r-sm)" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: ann.bgColor, border: "1px solid var(--border)", flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: "11px", color: "var(--text-1)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ann.text}</span>
                <span style={{ fontSize: "9px", color: "var(--text-3)", flexShrink: 0 }}>{ann.type}</span>
                <button type="button" onClick={() => update("annotations", config.annotations.filter((a) => a.id !== ann.id))}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: "12px", flexShrink: 0 }}>✕</button>
              </div>
            ))}
          </div>
          <button type="button" className="btn-ghost btn-sm" onClick={() => update("annotations", [])}
            style={{ fontSize: "11px", alignSelf: "flex-start" }}>Clear all</button>
        </>
      )}
    </div>
  );
}

// ─── TAB CONTENT: Presets ─────────────────────────────────────────────────────

function TabPresets({ config, setConfig }: { config: OptimizationConfig; setConfig: React.Dispatch<React.SetStateAction<OptimizationConfig>> }) {
  const [presetName, setPresetName] = useState("");

  const applyBuiltin = (c: CorePreset) => setConfig((prev) => ({ ...prev, ...c }));

  const savePreset = () => {
    if (!presetName.trim()) return;
    const { annotations: _a, savedPresets: _p, ...core } = config;
    const preset: SavedPreset = { id: `p-${Date.now()}`, name: presetName.trim(), config: core, createdAt: Date.now() };
    const updated = [...config.savedPresets, preset];
    setConfig((prev) => ({ ...prev, savedPresets: updated }));
    try { localStorage.setItem("bs_saved_presets", JSON.stringify(updated)); } catch {}
    setPresetName("");
  };

  const deletePreset = (id: string) => {
    const updated = config.savedPresets.filter((p) => p.id !== id);
    setConfig((prev) => ({ ...prev, savedPresets: updated }));
    try { localStorage.setItem("bs_saved_presets", JSON.stringify(updated)); } catch {}
  };

  return (
    <div className="ctrl-section">
      {/* Save current */}
      <div>
        <SectionLabel>Save Current Config</SectionLabel>
        <div style={{ display: "flex", gap: "6px" }}>
          <input type="text" className="input-field" placeholder="Preset name" value={presetName}
            onChange={(e) => setPresetName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && savePreset()}
            style={{ flex: 1, fontSize: "12px", padding: "7px 10px" }} />
          <button type="button" className="btn-fill btn-sm" onClick={savePreset} style={{ whiteSpace: "nowrap", flexShrink: 0 }}>Save</button>
        </div>
      </div>

      {/* My saved presets */}
      {config.savedPresets.length > 0 && (
        <>
          <div className="ctrl-divider" />
          <SectionLabel>My Presets</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {config.savedPresets.map((p) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "8px 10px", background: "var(--surface-2)", borderRadius: "var(--r-sm)" }}>
                <button type="button" onClick={() => setConfig((prev) => ({ ...prev, ...p.config }))}
                  style={{ flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--font)" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-1)", display: "block" }}>{p.name}</span>
                  <span style={{ fontSize: "9px", color: "var(--text-3)" }}>{new Date(p.createdAt).toLocaleDateString()}</span>
                </button>
                <button type="button" onClick={() => deletePreset(p.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: "12px" }}>✕</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Built-in presets */}
      <div className="ctrl-divider" />
      <SectionLabel>Built-in Presets</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {BUILTIN_PRESETS.map((preset) => (
          <div key={preset.name} className="sel-row"
            style={{ padding: "9px 10px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
            onClick={() => applyBuiltin(preset.config)}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", border: "1.5px solid var(--border)", flexShrink: 0, ...presetSwatchCSS(preset) }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-1)", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{preset.name}</span>
              <span style={{ fontSize: "10px", color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{preset.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TabbedSidebar ────────────────────────────────────────────────────────────

export default function TabbedSidebar({ config, setConfig, onOpenPremium }: TabbedSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabId>("bg");

  const update = <K extends keyof OptimizationConfig>(key: K, value: OptimizationConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  // Restore saved presets from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bs_saved_presets");
      if (stored) {
        const parsed: SavedPreset[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0)
          setConfig((prev) => ({ ...prev, savedPresets: parsed }));
      }
    } catch {}
  }, [setConfig]);

  return (
    <aside className="tabbed-sidebar">
      {/* Tab strip */}
      <nav className="sidebar-tab-grid" role="tablist">
        {TABS.map((tab) => (
          <button key={tab.id} role="tab" aria-selected={activeTab === tab.id} type="button"
            className={`sidebar-tab-btn${activeTab === tab.id ? " active" : ""}`}
            onClick={() => setActiveTab(tab.id)} title={tab.label}>
            <span className="sidebar-tab-icon">{tab.icon}</span>
            <span className="sidebar-tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <div className="sidebar-tab-content" role="tabpanel">
        {activeTab === "bg"          && <TabBackground    config={config} update={update} />}
        {activeTab === "frame"       && <TabFrame         config={config} update={update} />}
        {activeTab === "layout"      && <TabLayout        config={config} update={update} />}
        {activeTab === "caption"     && <TabCaption       config={config} update={update} />}
        {activeTab === "image"       && <TabImage         config={config} update={update} />}
        {activeTab === "annotations" && <TabAnnotations   config={config} update={update} />}
        {activeTab === "presets"     && <TabPresets       config={config} setConfig={setConfig} />}
      </div>

      {/* Pro callout (always visible at bottom) */}
      <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
        <button type="button" onClick={onOpenPremium}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "var(--r-md)", background: "var(--fill-subtle)", border: "1.5px solid var(--border)", cursor: "pointer", fontFamily: "var(--font)", transition: "all .12s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--text-1)"; e.currentTarget.style.background = "var(--fill)"; e.currentTarget.querySelector("span")!.style.color = "var(--fill-text)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--fill-subtle)"; e.currentTarget.querySelector("span")!.style.color = "var(--text-2)"; }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-2)", transition: "color .12s" }}>Remove watermark · 4K export</span>
          <span className="badge-pill" style={{ background: "var(--fill)", color: "var(--fill-text)", fontSize: "10px" }}>👑 Pro</span>
        </button>
      </div>
    </aside>
  );
}

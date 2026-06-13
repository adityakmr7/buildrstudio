"use client";

import { useState, useRef } from "react";
import { OptimizationConfig, GRADIENT_PRESETS, MESH_PRESETS, Annotation, SavedPreset } from "./WorkspaceHub";

interface ControlSidebarProps {
  config: OptimizationConfig;
  setConfig: React.Dispatch<React.SetStateAction<OptimizationConfig>>;
  onOpenPremium: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildGradientCSS(preset: { from: string; via?: string; to: string }, dir: number) {
  const stops = preset.via
    ? `${preset.from}, ${preset.via}, ${preset.to}`
    : `${preset.from}, ${preset.to}`;
  return `linear-gradient(${dir}deg, ${stops})`;
}

const DIRECTION_OPTIONS = [
  { label: "↗", value: 45 },
  { label: "→", value: 90 },
  { label: "↘", value: 135 },
  { label: "↓", value: 180 },
  { label: "↙", value: 225 },
  { label: "←", value: 270 },
  { label: "↖", value: 315 },
  { label: "↑", value: 360 },
];

const SOLID_SWATCHES = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#0ea5e9", "#10b981", "#f97316", "#0f172a",
  "#ffffff", "#f1f5f9", "#1e293b", "#111827",
];

const PATTERN_TYPES = [
  { label: "Dots",        value: "dots"       as const },
  { label: "Grid",        value: "grid"       as const },
  { label: "Diagonal",    value: "diagonal"   as const },
  { label: "Crosshatch",  value: "crosshatch" as const },
  { label: "Circles",     value: "circles"    as const },
];

const FRAME_STYLES = [
  { label: "macOS",     value: "macos"    as const, icon: "🖥" },
  { label: "Browser",   value: "browser"  as const, icon: "🌐" },
  { label: "Terminal",  value: "terminal" as const, icon: "⌨️" },
  { label: "iPhone",    value: "iphone"   as const, icon: "📱" },
  { label: "Android",   value: "android"  as const, icon: "🤖" },
  { label: "None",      value: "none"     as const, icon: "⬜" },
];

const ANNOTATION_TYPES = [
  { label: "Badge",     value: "badge"       as const },
  { label: "Label",     value: "label"       as const },
  { label: "→ Arrow",   value: "arrow-right" as const },
  { label: "← Arrow",   value: "arrow-left"  as const },
  { label: "↑ Arrow",   value: "arrow-up"    as const },
  { label: "↓ Arrow",   value: "arrow-down"  as const },
];

// ─── CollapsibleSection ───────────────────────────────────────────────────────

function CollapsibleSection({
  label,
  isOpen,
  onToggle,
  children,
  badge,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="comp-block" style={{ padding: 0, overflow: "hidden" }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font)",
          borderBottom: isOpen ? "1px solid var(--border)" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="comp-label" style={{ margin: 0 }}>{label}</span>
          {badge && (
            <span
              className="badge-pill"
              style={{ background: "var(--fill)", color: "var(--fill-text)", fontSize: "9px" }}
            >
              {badge}
            </span>
          )}
        </div>
        <span
          style={{
            fontSize: "10px",
            color: "var(--text-3)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            display: "inline-block",
          }}
        >
          ▼
        </span>
      </button>
      {isOpen && <div style={{ padding: "16px 18px" }}>{children}</div>}
    </div>
  );
}

// ─── TogglePill ───────────────────────────────────────────────────────────────

function TogglePill<T extends string>({
  options,
  value,
  onChange,
  small,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  small?: boolean;
}) {
  return (
    <div className="toggle-pill" style={{ display: "flex", width: "100%" }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`tp-option ${value === opt.value ? "active" : ""}`}
          style={{
            flex: 1,
            border: "none",
            background: "none",
            textAlign: "center",
            cursor: "pointer",
            padding: small ? "6px 0" : "8px 0",
            fontSize: small ? "11px" : "12px",
          }}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── RangeSlider ─────────────────────────────────────────────────────────────

function RangeSlider({
  label,
  min,
  max,
  value,
  onChange,
  unit = "",
  step = 1,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
  step?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: "var(--text-2)", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-1)" }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="opt-range"
      />
    </div>
  );
}

// ─── ColorInput ──────────────────────────────────────────────────────────────

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <input
        type="color"
        value={value.startsWith("rgba") ? "#ffffff" : value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "28px", height: "28px", borderRadius: "6px", border: "1.5px solid var(--border)", cursor: "pointer", padding: "1px", background: "none" }}
      />
      <span style={{ fontSize: "12px", color: "var(--text-2)", fontWeight: 500 }}>{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ flex: 1, fontSize: "11px", fontFamily: "monospace", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "4px", padding: "4px 6px", color: "var(--text-1)" }}
      />
    </div>
  );
}

// ─── ControlSidebar ───────────────────────────────────────────────────────────

export default function ControlSidebar({ config, setConfig, onOpenPremium }: ControlSidebarProps) {
  const update = <K extends keyof OptimizationConfig>(key: K, value: OptimizationConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  // Section open/close state
  const [open, setOpen] = useState({
    background: true,
    frame: true,
    layout: true,
    caption: false,
    imageAdj: false,
    annotations: false,
    presets: false,
  });
  const toggleSection = (k: keyof typeof open) => setOpen((prev) => ({ ...prev, [k]: !prev[k] }));

  // Annotation builder state
  const [newAnnotText, setNewAnnotText] = useState("🚀 Just Shipped");
  const [newAnnotType, setNewAnnotType] = useState<Annotation["type"]>("badge");
  const [newAnnotColor, setNewAnnotColor] = useState("#ffffff");
  const [newAnnotBg, setNewAnnotBg] = useState("#6366f1");
  const [newAnnotSize, setNewAnnotSize] = useState(14);

  // Save preset state
  const [presetName, setPresetName] = useState("");

  // Background image upload ref
  const bgFileRef = useRef<HTMLInputElement>(null);

  // Add annotation
  const addAnnotation = () => {
    if (!newAnnotText.trim()) return;
    const ann: Annotation = {
      id: `ann-${Date.now()}`,
      type: newAnnotType,
      text: newAnnotText.trim(),
      x: 50,
      y: 50,
      color: newAnnotColor,
      bgColor: newAnnotBg,
      fontSize: newAnnotSize,
    };
    update("annotations", [...config.annotations, ann]);
  };

  const removeAnnotation = (id: string) =>
    update("annotations", config.annotations.filter((a) => a.id !== id));

  // Save current config as named preset
  const savePreset = () => {
    if (!presetName.trim()) return;
    const { annotations: _a, savedPresets: _p, ...coreConfig } = config;
    const preset: SavedPreset = {
      id: `preset-${Date.now()}`,
      name: presetName.trim(),
      config: coreConfig,
      createdAt: Date.now(),
    };
    const updated = [...config.savedPresets, preset];
    update("savedPresets", updated);
    // Also persist to localStorage
    try { localStorage.setItem("bs_saved_presets", JSON.stringify(updated)); } catch {}
    setPresetName("");
  };

  const deletePreset = (id: string) => {
    const updated = config.savedPresets.filter((p) => p.id !== id);
    update("savedPresets", updated);
    try { localStorage.setItem("bs_saved_presets", JSON.stringify(updated)); } catch {}
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

      {/* ── BACKGROUND ── */}
      <CollapsibleSection label="Background" isOpen={open.background} onToggle={() => toggleSection("background")}>

        {/* Type selector */}
        <div style={{ marginBottom: "14px" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {(["gradient", "solid", "mesh", "pattern", "image"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => update("backgroundType", t)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--r-full)",
                  fontSize: "11px",
                  fontWeight: 600,
                  border: "1.5px solid",
                  cursor: "pointer",
                  background: config.backgroundType === t ? "var(--fill)" : "transparent",
                  borderColor: config.backgroundType === t ? "var(--fill)" : "var(--border-strong)",
                  color: config.backgroundType === t ? "var(--fill-text)" : "var(--text-2)",
                  fontFamily: "var(--font)",
                  transition: "all .15s",
                  textTransform: "capitalize",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Gradient controls */}
        {config.backgroundType === "gradient" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <span style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 600, display: "block", marginBottom: "10px" }}>PRESET</span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                {Object.entries(GRADIENT_PRESETS).map(([key, preset]) => {
                  const isSelected = config.gradientPreset === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      title={preset.name}
                      onClick={() => update("gradientPreset", key)}
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        borderRadius: "50%",
                        background: buildGradientCSS(preset, 135),
                        border: isSelected ? "3px solid var(--text-1)" : "2px solid var(--border)",
                        cursor: "pointer",
                        transform: isSelected ? "scale(1.1)" : "scale(1)",
                        transition: "transform 0.15s ease, border-color 0.15s ease",
                        boxShadow: isSelected ? "0 0 0 2px var(--bg)" : "none",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Direction */}
            <div>
              <span style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 600, display: "block", marginBottom: "8px" }}>DIRECTION</span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {DIRECTION_OPTIONS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => update("gradientDirection", d.value)}
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "var(--r-sm)",
                      border: "1.5px solid",
                      borderColor: config.gradientDirection === d.value ? "var(--text-1)" : "var(--border)",
                      background: config.gradientDirection === d.value ? "var(--fill-subtle)" : "transparent",
                      cursor: "pointer",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font)",
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Solid color controls */}
        {config.backgroundType === "solid" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <ColorInput label="Color" value={config.solidColor} onChange={(v) => update("solidColor", v)} />
            <div>
              <span style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 600, display: "block", marginBottom: "8px" }}>QUICK SWATCHES</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {SOLID_SWATCHES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => update("solidColor", c)}
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "6px",
                      background: c,
                      border: config.solidColor === c ? "2px solid var(--text-1)" : "1px solid var(--border)",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mesh controls */}
        {config.backgroundType === "mesh" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 600 }}>MESH PRESET</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {Object.entries(MESH_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => update("meshPreset", key)}
                  style={{
                    padding: "10px",
                    borderRadius: "var(--r-md)",
                    border: "1.5px solid",
                    borderColor: config.meshPreset === key ? "var(--text-1)" : "var(--border)",
                    cursor: "pointer",
                    background: preset.base,
                    position: "relative",
                    overflow: "hidden",
                    minHeight: "52px",
                    fontFamily: "var(--font)",
                  }}
                >
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `radial-gradient(ellipse at 20% 20%, ${preset.colors[0]}99 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, ${preset.colors[1]}99 0%, transparent 60%)`,
                  }} />
                  <span style={{ position: "relative", zIndex: 1, fontSize: "11px", fontWeight: 700, color: "#fff" }}>
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pattern controls */}
        {config.backgroundType === "pattern" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <span style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 600, display: "block", marginBottom: "8px" }}>PATTERN</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {PATTERN_TYPES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => update("patternType", p.value)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "var(--r-sm)",
                      fontSize: "11px",
                      fontWeight: 600,
                      border: "1.5px solid",
                      borderColor: config.patternType === p.value ? "var(--text-1)" : "var(--border)",
                      background: config.patternType === p.value ? "var(--fill-subtle)" : "transparent",
                      cursor: "pointer",
                      fontFamily: "var(--font)",
                      color: "var(--text-1)",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <ColorInput label="Ink Color"  value={config.patternColor}   onChange={(v) => update("patternColor", v)} />
            <ColorInput label="Background" value={config.patternBgColor} onChange={(v) => update("patternBgColor", v)} />
          </div>
        )}

        {/* Image background upload */}
        {config.backgroundType === "image" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              ref={bgFileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) update("backgroundImageUrl", URL.createObjectURL(file));
              }}
            />
            {config.backgroundImageUrl ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{
                  height: "72px",
                  borderRadius: "var(--r-md)",
                  backgroundImage: `url(${config.backgroundImageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: "1px solid var(--border)",
                }} />
                <div style={{ display: "flex", gap: "8px" }}>
                  <button type="button" className="btn-outline btn-sm" onClick={() => bgFileRef.current?.click()}>
                    Change Image
                  </button>
                  <button type="button" className="btn-ghost btn-sm" onClick={() => update("backgroundImageUrl", null)}>
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="btn-outline btn-sm"
                onClick={() => bgFileRef.current?.click()}
                style={{ width: "100%", justifyContent: "center" }}
              >
                📁 Upload Background Image
              </button>
            )}
          </div>
        )}

        {/* Noise texture (always visible) */}
        <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border)" }}>
          <RangeSlider
            label="Noise / Grain Texture"
            min={0} max={80} value={config.noiseIntensity}
            onChange={(v) => update("noiseIntensity", v)}
            unit="%"
          />
        </div>
      </CollapsibleSection>

      {/* ── FRAME ── */}
      <CollapsibleSection label="Frame Style" isOpen={open.frame} onToggle={() => toggleSection("frame")}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "14px" }}>
          {FRAME_STYLES.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => update("frameStyle", f.value)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                padding: "10px 6px",
                borderRadius: "var(--r-md)",
                border: "1.5px solid",
                borderColor: config.frameStyle === f.value ? "var(--text-1)" : "var(--border)",
                background: config.frameStyle === f.value ? "var(--fill-subtle)" : "transparent",
                cursor: "pointer",
                fontFamily: "var(--font)",
              }}
            >
              <span style={{ fontSize: "18px" }}>{f.icon}</span>
              <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-2)" }}>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Dark mode toggle for frame */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-2)", fontWeight: 500 }}>Dark frame bar</span>
          <button
            type="button"
            onClick={() => update("frameDarkMode", !config.frameDarkMode)}
            style={{
              width: "36px", height: "20px",
              borderRadius: "10px",
              background: config.frameDarkMode ? "var(--fill)" : "var(--border)",
              border: "none", cursor: "pointer", position: "relative", transition: "background .15s",
            }}
          >
            <span style={{
              position: "absolute",
              top: "2px",
              left: config.frameDarkMode ? "18px" : "2px",
              width: "16px", height: "16px",
              borderRadius: "50%",
              background: "white",
              transition: "left .15s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }} />
          </button>
        </div>

        {/* Browser URL (only when frame=browser) */}
        {config.frameStyle === "browser" && (
          <div>
            <span style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 600, display: "block", marginBottom: "6px" }}>URL BAR TEXT</span>
            <input
              type="text"
              className="input-field"
              value={config.browserUrl}
              onChange={(e) => update("browserUrl", e.target.value)}
              placeholder="buildrstudio.in"
              style={{ fontSize: "13px", padding: "8px 12px" }}
            />
          </div>
        )}
      </CollapsibleSection>

      {/* ── LAYOUT ── */}
      <CollapsibleSection label="Layout" isOpen={open.layout} onToggle={() => toggleSection("layout")}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Aspect ratio */}
          <div>
            <span style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 600, display: "block", marginBottom: "8px" }}>ASPECT RATIO</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              {[
                { label: "16:9 Landscape", value: "aspect-video" },
                { label: "1:1 Square",     value: "aspect-square" },
                { label: "4:5 Portrait",   value: "aspect-[4/5]"  },
                { label: "9:16 Story",     value: "aspect-[9/16]" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update("aspectRatio", opt.value)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "var(--r-sm)",
                    fontSize: "11px",
                    fontWeight: 600,
                    border: "1.5px solid",
                    borderColor: config.aspectRatio === opt.value ? "var(--text-1)" : "var(--border)",
                    background: config.aspectRatio === opt.value ? "var(--fill-subtle)" : "transparent",
                    cursor: "pointer",
                    fontFamily: "var(--font)",
                    color: "var(--text-1)",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Padding */}
          <RangeSlider label="Padding" min={0} max={128} value={config.padding} onChange={(v) => update("padding", v)} unit="px" />

          {/* Border radius */}
          <div>
            <span style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 600, display: "block", marginBottom: "8px" }}>BORDER RADIUS</span>
            <TogglePill
              options={[
                { label: "None",  value: "rounded-none" },
                { label: "MD",    value: "rounded-md"   },
                { label: "XL",    value: "rounded-xl"   },
                { label: "3XL",   value: "rounded-3xl"  },
              ]}
              value={config.borderRadius as "rounded-none" | "rounded-md" | "rounded-xl" | "rounded-3xl"}
              onChange={(v) => update("borderRadius", v)}
            />
          </div>

          {/* Drop shadow */}
          <div>
            <span style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 600, display: "block", marginBottom: "8px" }}>DROP SHADOW</span>
            <TogglePill
              options={[
                { label: "None", value: "shadow-none" },
                { label: "MD",   value: "shadow-md"   },
                { label: "XL",   value: "shadow-xl"   },
                { label: "2XL",  value: "shadow-2xl"  },
              ]}
              value={config.dropShadow as "shadow-none" | "shadow-md" | "shadow-xl" | "shadow-2xl"}
              onChange={(v) => update("dropShadow", v)}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* ── CAPTION ── */}
      <CollapsibleSection label="Caption / Text Overlay" isOpen={open.caption} onToggle={() => toggleSection("caption")}>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label className="input-label" style={{ fontSize: "11px", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "1px" }}>Title</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Just shipped v2.0 🚀"
              value={config.captionTitle}
              onChange={(e) => update("captionTitle", e.target.value)}
              style={{ fontSize: "13px", padding: "8px 12px" }}
            />
          </div>
          <div>
            <label className="input-label" style={{ fontSize: "11px", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "1px" }}>Subtitle</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. BuildrStudio · buildrstudio.in"
              value={config.captionSubtitle}
              onChange={(e) => update("captionSubtitle", e.target.value)}
              style={{ fontSize: "13px", padding: "8px 12px" }}
            />
          </div>

          <RangeSlider label="Title Font Size" min={12} max={40} value={config.captionTitleSize} onChange={(v) => update("captionTitleSize", v)} unit="px" />

          <ColorInput label="Title color"    value={config.captionTitleColor}    onChange={(v) => update("captionTitleColor", v)} />
          <ColorInput label="Subtitle color" value={config.captionSubtitleColor} onChange={(v) => update("captionSubtitleColor", v)} />

          <div>
            <span style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 600, display: "block", marginBottom: "8px" }}>ALIGNMENT</span>
            <TogglePill
              options={[
                { label: "Left",   value: "left"   },
                { label: "Center", value: "center" },
                { label: "Right",  value: "right"  },
              ]}
              value={config.captionAlign}
              onChange={(v) => update("captionAlign", v)}
            />
          </div>

          <div>
            <span style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 600, display: "block", marginBottom: "8px" }}>POSITION</span>
            <TogglePill
              options={[
                { label: "Top",    value: "top"    },
                { label: "Bottom", value: "bottom" },
              ]}
              value={config.captionPosition}
              onChange={(v) => update("captionPosition", v)}
            />
          </div>

          {/* Glass blur toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", color: "var(--text-2)", fontWeight: 500 }}>Frosted glass background</span>
            <button
              type="button"
              onClick={() => update("captionGlass", !config.captionGlass)}
              style={{
                width: "36px", height: "20px",
                borderRadius: "10px",
                background: config.captionGlass ? "var(--fill)" : "var(--border)",
                border: "none", cursor: "pointer", position: "relative", transition: "background .15s",
              }}
            >
              <span style={{
                position: "absolute", top: "2px",
                left: config.captionGlass ? "18px" : "2px",
                width: "16px", height: "16px",
                borderRadius: "50%", background: "white",
                transition: "left .15s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }} />
            </button>
          </div>
        </div>
      </CollapsibleSection>

      {/* ── IMAGE ADJUSTMENTS ── */}
      <CollapsibleSection label="Image Adjustments" isOpen={open.imageAdj} onToggle={() => toggleSection("imageAdj")}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <RangeSlider label="Brightness" min={50}  max={150} value={config.imageBrightness}  onChange={(v) => update("imageBrightness", v)}  unit="%" />
          <RangeSlider label="Contrast"   min={50}  max={150} value={config.imageContrast}    onChange={(v) => update("imageContrast", v)}    unit="%" />
          <RangeSlider label="Saturation" min={0}   max={200} value={config.imageSaturation}  onChange={(v) => update("imageSaturation", v)}  unit="%" />
          <RangeSlider label="Scale"      min={70}  max={110} value={config.imageScale}        onChange={(v) => update("imageScale", v)}        unit="%" />
          <button
            type="button"
            className="btn-ghost btn-sm"
            onClick={() => {
              update("imageBrightness", 100);
              update("imageContrast", 100);
              update("imageSaturation", 100);
              update("imageScale", 100);
            }}
            style={{ alignSelf: "flex-start", fontSize: "11px" }}
          >
            ↺ Reset adjustments
          </button>
        </div>
      </CollapsibleSection>

      {/* ── ANNOTATIONS ── */}
      <CollapsibleSection label="Annotations" isOpen={open.annotations} onToggle={() => toggleSection("annotations")} badge="NEW">
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <p style={{ fontSize: "12px", color: "var(--text-3)", lineHeight: 1.5 }}>
            Add badges, labels, or arrows on the canvas. Drag them to position.
          </p>

          {/* Type picker */}
          <div>
            <span style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 600, display: "block", marginBottom: "8px" }}>TYPE</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {ANNOTATION_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setNewAnnotType(t.value)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "var(--r-sm)",
                    fontSize: "11px",
                    fontWeight: 600,
                    border: "1.5px solid",
                    borderColor: newAnnotType === t.value ? "var(--text-1)" : "var(--border)",
                    background: newAnnotType === t.value ? "var(--fill-subtle)" : "transparent",
                    cursor: "pointer",
                    fontFamily: "var(--font)",
                    color: "var(--text-1)",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text */}
          <input
            type="text"
            className="input-field"
            placeholder="Annotation text"
            value={newAnnotText}
            onChange={(e) => setNewAnnotText(e.target.value)}
            style={{ fontSize: "13px", padding: "8px 12px" }}
          />

          {/* Colors + size */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <ColorInput label="Text color" value={newAnnotColor} onChange={setNewAnnotColor} />
            {newAnnotType === "badge" && (
              <ColorInput label="Badge bg" value={newAnnotBg} onChange={setNewAnnotBg} />
            )}
            <RangeSlider label="Font size" min={10} max={28} value={newAnnotSize} onChange={setNewAnnotSize} unit="px" />
          </div>

          <button
            type="button"
            className="btn-fill btn-sm"
            onClick={addAnnotation}
            style={{ justifyContent: "center" }}
          >
            + Add Annotation
          </button>

          {/* Existing annotations list */}
          {config.annotations.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
              <span style={{ fontSize: "11px", color: "var(--text-3)", fontWeight: 600 }}>ACTIVE ({config.annotations.length})</span>
              {config.annotations.map((ann) => (
                <div
                  key={ann.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "var(--surface-2)",
                    borderRadius: "var(--r-sm)",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        width: "10px", height: "10px", borderRadius: "50%",
                        background: ann.bgColor, border: "1px solid var(--border)", flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: "12px", color: "var(--text-1)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ann.text}
                    </span>
                    <span style={{ fontSize: "10px", color: "var(--text-3)", flexShrink: 0 }}>{ann.type}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAnnotation(ann.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: "14px", flexShrink: 0 }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-ghost btn-sm"
                onClick={() => update("annotations", [])}
                style={{ fontSize: "11px" }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* ── SAVE PRESET ── */}
      <CollapsibleSection label="Saved Presets" isOpen={open.presets} onToggle={() => toggleSection("presets")} badge="NEW">
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <p style={{ fontSize: "12px", color: "var(--text-3)", lineHeight: 1.5 }}>
            Save your current configuration as a named preset.
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              className="input-field"
              placeholder="Preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && savePreset()}
              style={{ flex: 1, fontSize: "13px", padding: "8px 12px" }}
            />
            <button type="button" className="btn-fill btn-sm" onClick={savePreset} style={{ whiteSpace: "nowrap" }}>
              Save
            </button>
          </div>

          {config.savedPresets.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {config.savedPresets.map((preset) => (
                <div
                  key={preset.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    background: "var(--surface-2)",
                    borderRadius: "var(--r-sm)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, ...preset.config }))}
                    style={{ flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--font)" }}
                  >
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-1)" }}>{preset.name}</span>
                    <span style={{ fontSize: "10px", color: "var(--text-3)", display: "block" }}>
                      {new Date(preset.createdAt).toLocaleDateString()}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePreset(preset.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", fontSize: "14px" }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* ── PRO CALLOUT ── */}
      <div
        className="comp-block"
        style={{ cursor: "pointer", transition: "all 0.15s ease", border: "1.5px solid var(--border)" }}
        onClick={onOpenPremium}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--text-1)";
          e.currentTarget.style.background = "var(--fill-subtle)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.background = "var(--surface)";
        }}
      >
        <div className="comp-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span>Branding Watermark</span>
          <span className="badge-pill" style={{ background: "var(--fill)", color: "var(--fill-text)" }}>👑 Go Pro</span>
        </div>
        <div>
          <span className="comp-name" style={{ fontSize: "13px", margin: 0 }}>via buildrStudio.in</span>
          <span className="comp-desc" style={{ fontSize: "11px", display: "block" }}>Click to remove watermark &amp; unlock 4K exports</span>
        </div>
      </div>
    </div>
  );
}

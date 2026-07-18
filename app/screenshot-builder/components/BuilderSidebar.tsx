"use client";

// ─── BuilderSidebar.tsx ──────────────────────────────────────────────────────
// Sidebar configuration control panel for the App Store Screenshot Builder.
// Offers 5 tabs: Device, Text, Style, Presets, Export.

import React, { useRef, useState } from "react";
import AICopywriter from "../../components/AICopywriter";
import type {
  BuilderConfig,
  DeviceId,
  Platform,
  GradDir,
  BgType,
  FrameMode,
} from "../lib/deviceSpecs";
import {
  APPSTORE_DEVICES,
  PLAYSTORE_DEVICES,
  GRADIENT_PRESETS,
  getDevice,
} from "../lib/deviceSpecs";

// ── Props ─────────────────────────────────────────────────────────────────────

interface BuilderSidebarProps {
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
  onExport: () => void;
  onExportAll: () => void;
  onExportAllSizes: () => void;
  onCopy: () => void;
  isExporting: boolean;
  screenCount: number;
  isWatermarkUnlocked: boolean;
  onOpenUnlockWatermark: () => void;
  onOpenPremium: () => void;
}

type TabId = "device" | "text" | "style" | "presets" | "export";

const TAB_ICONS: Record<TabId, React.ReactNode> = {
  device: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
  text: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
    </svg>
  ),
  style: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="0.5"/><circle cx="17.5" cy="10.5" r="0.5"/><circle cx="8.5" cy="7.5" r="0.5"/><circle cx="6.5" cy="12.5" r="0.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  ),
  presets: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  export: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
};

const TABS: { id: TabId; label: string }[] = [
  { id: "device",  label: "Device" },
  { id: "text",    label: "Text" },
  { id: "style",   label: "Style" },
  { id: "presets", label: "Presets" },
  { id: "export",  label: "Export" },
];

// ── Preset Options ────────────────────────────────────────────────────────────

const QUICK_PRESETS = [
  {
    name: "Indigo Dusk",
    desc: "Vibrant violet & pink gradient",
    config: {
      bgType: "gradient" as BgType,
      gradientPreset: "Indigo Dusk",
      gradientDir: "to bottom right" as GradDir,
      headlineColor: "#ffffff",
      subtextColor: "rgba(255,255,255,0.8)",
      frameMode: "flat" as FrameMode,
      frameVisible: true,
      frameShadow: true,
    },
  },
  {
    name: "Ocean Minimal",
    desc: "Clean blue, 3D tilted frame",
    config: {
      bgType: "gradient" as BgType,
      gradientPreset: "Ocean Breeze",
      gradientDir: "135deg" as GradDir,
      headlineColor: "#ffffff",
      subtextColor: "rgba(255,255,255,0.8)",
      frameMode: "tilt3d" as FrameMode,
      frameVisible: true,
      frameShadow: true,
    },
  },
  {
    name: "Golden Sunset",
    desc: "Warm orange-yellow gradient",
    config: {
      bgType: "gradient" as BgType,
      gradientPreset: "Sunset Blaze",
      gradientDir: "to bottom" as GradDir,
      headlineColor: "#ffffff",
      subtextColor: "rgba(255,255,255,0.85)",
      frameMode: "tilt3d" as FrameMode,
      frameVisible: true,
      frameShadow: true,
    },
  },
  {
    name: "Deep Slate",
    desc: "Dark slate with flat frame",
    config: {
      bgType: "solid" as BgType,
      solidColor: "#0f172a",
      headlineColor: "#ffffff",
      subtextColor: "rgba(255,255,255,0.7)",
      frameMode: "flat" as FrameMode,
      frameVisible: true,
      frameShadow: true,
    },
  },
  {
    name: "Clean Light",
    desc: "Minimal white style with dark text",
    config: {
      bgType: "gradient" as BgType,
      gradientPreset: "Arctic White",
      gradientDir: "to bottom" as GradDir,
      headlineColor: "#0f172a",
      subtextColor: "#475569",
      frameMode: "flat" as FrameMode,
      frameVisible: true,
      frameShadow: true,
    },
  },
  {
    name: "Aurora Mesh",
    desc: "Dynamic multi-color mesh, 3D frame",
    config: {
      bgType: "mesh" as BgType,
      meshColor1: "#6366f1",
      meshColor2: "#8b5cf6",
      meshColor3: "#ec4899",
      meshColor4: "#0ea5e9",
      headlineColor: "#ffffff",
      subtextColor: "rgba(255,255,255,0.85)",
      frameMode: "tilt3d" as FrameMode,
      frameVisible: true,
      frameShadow: true,
    },
  },
];

// ── Shared Micro-components ───────────────────────────────────────────────────

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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "12px", color: "var(--text-2)", fontWeight: 500 }}>
          {label}
        </span>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--text-1)",
            fontFamily: "monospace",
          }}
        >
          {value}
          {unit}
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

function rgbaToHex(rgba: string): string {
  const m = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return "#ffffff";
  const r = parseInt(m[1]).toString(16).padStart(2, "0");
  const g = parseInt(m[2]).toString(16).padStart(2, "0");
  const b = parseInt(m[3]).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}

function extractAlpha(val: string): number | null {
  const m = val.match(/rgba?\([^)]*,\s*([\d.]+)\s*\)/);
  return m ? parseFloat(m[1]) : null;
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const isRgba = value.startsWith("rgba");
  const alpha = isRgba ? extractAlpha(value) : null;
  const pickerValue = isRgba ? rgbaToHex(value) : value;

  const handlePickerChange = (hex: string) => {
    if (alpha !== null) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      onChange(`rgba(${r},${g},${b},${alpha})`);
    } else {
      onChange(hex);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <input
        type="color"
        value={pickerValue}
        onChange={(e) => handlePickerChange(e.target.value)}
        style={{
          width: "26px",
          height: "26px",
          borderRadius: "6px",
          border: "1.5px solid var(--border)",
          cursor: "pointer",
          padding: "1px",
          background: "none",
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: "12px", color: "var(--text-2)", fontWeight: 500, flex: 1 }}>
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "120px",
          fontSize: "10px",
          fontFamily: "monospace",
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          padding: "4px 6px",
          color: "var(--text-1)",
        }}
      />
    </div>
  );
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="toggle-pill" style={{ display: "flex", width: "100%" }}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={`tp-option ${value === o.value ? "active" : ""}`}
          style={{
            flex: 1,
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: "7px 0",
            fontSize: "11px",
            textAlign: "center",
            fontFamily: "var(--font)",
          }}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: "12px", color: "var(--text-2)", fontWeight: 500 }}>
        {label}
      </span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        style={{
          width: "34px",
          height: "18px",
          borderRadius: "9px",
          background: value ? "var(--fill)" : "var(--border-strong)",
          border: "none",
          cursor: "pointer",
          position: "relative",
          transition: "background .15s",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "2px",
            left: value ? "16px" : "2px",
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            background: "white",
            transition: "left .15s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
          }}
        />
      </button>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <span className="ctrl-label">{children}</span>;
}

// ── Preset Accordion ──────────────────────────────────────────────────────────

function PresetAccordion({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderRadius: "var(--r-md)",
        border: "1px solid var(--border)",
        overflow: "hidden",
        background: "var(--surface)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--font)",
          borderBottom: isOpen ? "1px solid var(--border)" : "none",
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-1)" }}>
          {title}
        </span>
        <span
          style={{
            fontSize: "9px",
            color: "var(--text-3)",
            display: "inline-block",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          ▼
        </span>
      </button>
      {isOpen && (
        <div
          style={{
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            background: "var(--surface-2)",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ── Tab: Device ────────────────────────────────────────────────────────────────

function TabDevice({
  config,
  update,
}: {
  config: BuilderConfig;
  update: <K extends keyof BuilderConfig>(k: K, v: BuilderConfig[K]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentDevice = getDevice(config.deviceId);
  const platform = currentDevice.platform;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      update("screenshotUrl", url);
    }
  };

  const handlePaste = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type);
            const url = URL.createObjectURL(blob);
            update("screenshotUrl", url);
            return;
          }
        }
      }
      alert("No image found on clipboard. Copy an image first!");
    } catch {
      alert("Please grant clipboard permission or upload a file manually.");
    }
  };

  return (
    <div className="ctrl-section">
      {/* Platform switcher */}
      <div>
        <SectionLabel>Platform</SectionLabel>
        <SegmentedControl
          options={[
            { label: "iOS App Store", value: "appstore" },
            { label: "Google Play Store", value: "playstore" },
          ]}
          value={platform}
          onChange={(newPlatform) => {
            const defaultId = newPlatform === "appstore" ? "iphone-67" : "android-phone";
            update("deviceId", defaultId as DeviceId);
          }}
        />
      </div>

      {/* Device picker */}
      <div>
        <SectionLabel>Target Device Size</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {(platform === "appstore" ? APPSTORE_DEVICES : PLAYSTORE_DEVICES).map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => update("deviceId", d.id)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "var(--r-md)",
                border: "1.5px solid",
                borderColor: config.deviceId === d.id ? "var(--text-1)" : "var(--border)",
                background: config.deviceId === d.id ? "var(--fill-subtle)" : "transparent",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--font)",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                transition: "all 0.15s ease",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--text-1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span>{d.label}</span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    color: "var(--text-3)",
                    fontFamily: "monospace",
                  }}
                >
                  {d.canvasW} × {d.canvasH}
                </span>
              </div>
              <div style={{ fontSize: "10px", color: "var(--text-3)" }}>{d.detail}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="ctrl-divider" />

      {/* Screenshot Upload / Paste */}
      <div>
        <SectionLabel>App Screenshot</SectionLabel>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {config.screenshotUrl ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div
              style={{
                height: "120px",
                borderRadius: "var(--r-md)",
                backgroundImage: `url(${config.screenshotUrl})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                border: "1.5px dashed var(--border-strong)",
                backgroundColor: "var(--surface-3)",
              }}
            />
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                type="button"
                className="btn-outline btn-sm"
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => fileInputRef.current?.click()}
              >
                Change Image
              </button>
              <button
                type="button"
                className="btn-ghost btn-sm"
                style={{ color: "var(--red, #ef4444)" }}
                onClick={() => update("screenshotUrl", null)}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              type="button"
              className="btn-outline btn-sm"
              style={{ width: "100%", justifyContent: "center", height: "60px", fontSize: "12px" }}
              onClick={() => fileInputRef.current?.click()}
            >
              Select Screenshot File
            </button>
            <button
              type="button"
              className="btn-ghost btn-sm"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={handlePaste}
            >
              Paste from Clipboard
            </button>
          </div>
        )}
      </div>

      {config.screenshotUrl && (
        <>
          <div className="ctrl-divider" />
          <RangeSlider
            label="Image Scale"
            min={0.5}
            max={1.5}
            step={0.05}
            value={config.imageScale}
            onChange={(v) => update("imageScale", v)}
            unit="x"
          />
          <RangeSlider
            label="Horizontal Offset"
            min={0}
            max={100}
            step={1}
            value={config.imageOffsetX}
            onChange={(v) => update("imageOffsetX", v)}
            unit="%"
          />
          <RangeSlider
            label="Vertical Offset"
            min={0}
            max={100}
            step={1}
            value={config.imageOffsetY}
            onChange={(v) => update("imageOffsetY", v)}
            unit="%"
          />
        </>
      )}
    </div>
  );
}

// ── Tab: Text ──────────────────────────────────────────────────────────────────

function TabText({
  config,
  update,
  onOpenPremium,
}: {
  config: BuilderConfig;
  update: <K extends keyof BuilderConfig>(k: K, v: BuilderConfig[K]) => void;
  onOpenPremium?: () => void;
}) {
  return (
    <div className="ctrl-section">
      <AICopywriter
        onApply={(headline, subtext) => {
          update("headline", headline);
          update("subtext", subtext);
        }}
        onUpgrade={onOpenPremium}
      />

      {/* Title / Headline */}
      <div>
        <SectionLabel>Headline</SectionLabel>
        <textarea
          className="input-field"
          value={config.headline}
          onChange={(e) => update("headline", e.target.value)}
          placeholder="Enter header marketing text..."
          style={{
            fontSize: "12px",
            padding: "8px 10px",
            minHeight: "60px",
            resize: "vertical",
            width: "100%",
            fontFamily: "var(--font)",
          }}
        />
      </div>

      <RangeSlider
        label="Headline Font Size"
        min={1.5}
        max={6.0}
        step={0.1}
        value={config.headlineSize}
        onChange={(v) => update("headlineSize", v)}
        unit="em"
      />

      <ColorRow
        label="Headline Color"
        value={config.headlineColor}
        onChange={(v) => update("headlineColor", v)}
      />

      <div className="ctrl-divider" />

      {/* Subtext */}
      <div>
        <SectionLabel>Subtext</SectionLabel>
        <input
          type="text"
          className="input-field"
          value={config.subtext}
          onChange={(e) => update("subtext", e.target.value)}
          placeholder="e.g. Free in the App Store"
          style={{ fontSize: "12px", padding: "7px 10px", width: "100%" }}
        />
      </div>

      <RangeSlider
        label="Subtext Font Size"
        min={0.8}
        max={3.0}
        step={0.1}
        value={config.subtextSize}
        onChange={(v) => update("subtextSize", v)}
        unit="em"
      />

      <ColorRow
        label="Subtext Color"
        value={config.subtextColor}
        onChange={(v) => update("subtextColor", v)}
      />

      <div className="ctrl-divider" />

      {/* Font Family */}
      <div>
        <SectionLabel>Font Family</SectionLabel>
        <select
          className="input-field"
          value={config.fontFamily || "DM Sans"}
          onChange={(e) => {
            update("fontFamily", e.target.value);
            // Load the font dynamically
            const link = document.createElement("link");
            link.href = `https://fonts.googleapis.com/css2?family=${e.target.value.replace(/ /g, "+")}:wght@400;500;700;800&display=swap`;
            link.rel = "stylesheet";
            document.head.appendChild(link);
          }}
          style={{ fontSize: "12px", padding: "7px 10px", width: "100%" }}
        >
          {["DM Sans", "Inter", "Space Grotesk", "Outfit", "Poppins", "Playfair Display", "Sora", "Manrope", "Plus Jakarta Sans", "Bricolage Grotesque"].map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      <div className="ctrl-divider" />

      {/* Headline / Subtext alignment position */}
      <div>
        <SectionLabel>Text Position</SectionLabel>
        <SegmentedControl
          options={[
            { label: "Top Caption", value: "top" },
            { label: "Bottom Caption", value: "bottom" },
          ]}
          value={config.textPosition}
          onChange={(v) => update("textPosition", v)}
        />
      </div>
    </div>
  );
}

// ── Tab: Style ─────────────────────────────────────────────────────────────────

function TabStyle({
  config,
  update,
  isWatermarkUnlocked,
  onOpenUnlockWatermark,
  onOpenPremium,
}: {
  config: BuilderConfig;
  update: <K extends keyof BuilderConfig>(k: K, v: BuilderConfig[K]) => void;
  isWatermarkUnlocked: boolean;
  onOpenUnlockWatermark: () => void;
  onOpenPremium: () => void;
}) {
  const bgTypes = ["gradient", "solid", "mesh"] as const;

  const meshColors = [
    { key: "meshColor1", label: "Color 1" },
    { key: "meshColor2", label: "Color 2" },
    { key: "meshColor3", label: "Color 3" },
    { key: "meshColor4", label: "Color 4" },
  ] as const;

  return (
    <div className="ctrl-section">
      {/* Background Type */}
      <div>
        <SectionLabel>Background Type</SectionLabel>
        <SegmentedControl
          options={[
            { label: "Gradient", value: "gradient" },
            { label: "Solid Color", value: "solid" },
            { label: "Mesh Gradient", value: "mesh" },
          ]}
          value={config.bgType}
          onChange={(v) => update("bgType", v)}
        />
      </div>

      {/* Gradient Presets */}
      {config.bgType === "gradient" && (
        <>
          <div>
            <SectionLabel>Gradient Presets</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {GRADIENT_PRESETS.map((p) => {
                const isSelected = config.gradientPreset === p.name;
                const backgroundVal = p.via
                  ? `linear-gradient(135deg, ${p.from}, ${p.via}, ${p.to})`
                  : `linear-gradient(135deg, ${p.from}, ${p.to})`;

                return (
                  <button
                    key={p.name}
                    type="button"
                    title={p.name}
                    onClick={() => update("gradientPreset", p.name)}
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      borderRadius: "50%",
                      background: backgroundVal,
                      cursor: "pointer",
                      transition: "transform 0.12s, border 0.12s",
                      border: isSelected ? "3px solid var(--text-1)" : "2px solid transparent",
                      transform: isSelected ? "scale(1.1)" : "scale(1)",
                      boxShadow: isSelected
                        ? "0 0 0 2px var(--surface)"
                        : "0 0 0 1.5px var(--border)",
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <SectionLabel>Gradient Direction</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px" }}>
              {([
                { label: "↗", value: "45deg" },
                { label: "→", value: "to right" },
                { label: "↘", value: "to bottom right" },
                { label: "↓", value: "to bottom" },
                { label: "↙", value: "135deg" },
                { label: "←", value: "to left" },
                { label: "↖", value: "to top right" },
                { label: "↑", value: "to top" },
              ] as { label: string; value: GradDir }[]).map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => update("gradientDir", d.value)}
                  style={{
                    padding: "6px",
                    fontSize: "14px",
                    background: config.gradientDir === d.value ? "var(--fill)" : "var(--surface-2, var(--surface))",
                    color: config.gradientDir === d.value ? "var(--fill-text)" : "var(--text-2)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.12s",
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Solid Color */}
      {config.bgType === "solid" && (
        <ColorRow
          label="Background Color"
          value={config.solidColor}
          onChange={(v) => update("solidColor", v)}
        />
      )}

      {/* Mesh Color pickers */}
      {config.bgType === "mesh" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <SectionLabel>Mesh Corners</SectionLabel>
          {meshColors.map((item) => (
            <ColorRow
              key={item.key}
              label={item.label}
              value={config[item.key]}
              onChange={(v) => update(item.key, v)}
            />
          ))}
        </div>
      )}

      <div className="ctrl-divider" />

      {/* Device Frame Style */}
      <div>
        <SectionLabel>Device Frame Style</SectionLabel>
        <SegmentedControl
          options={[
            { label: "Flat Outline", value: "flat" },
            { label: "3D Perspective Tilt", value: "tilt3d" },
          ]}
          value={config.frameMode}
          onChange={(v) => update("frameMode", v)}
        />
      </div>

      {/* 3D Tilt Controls */}
      {config.frameMode === "tilt3d" && (
        <>
          <RangeSlider
            label="Tilt X (Vertical)"
            min={-30}
            max={30}
            step={1}
            value={config.tiltX}
            onChange={(v) => update("tiltX", v)}
            unit="°"
          />
          <RangeSlider
            label="Tilt Y (Horizontal)"
            min={-30}
            max={30}
            step={1}
            value={config.tiltY}
            onChange={(v) => update("tiltY", v)}
            unit="°"
          />
        </>
      )}

      {/* Panoramic Layout Spanning */}
      <div>
        <SectionLabel>Panoramic Spanning Shift</SectionLabel>
        <SegmentedControl
          options={[
            { label: "None (Center)", value: "none" },
            { label: "Left Span (Shift Right)", value: "left" },
            { label: "Right Span (Shift Left)", value: "right" },
          ]}
          value={config.panoramic}
          onChange={(v) => update("panoramic", v)}
        />
      </div>

      {/* Frame Toggles */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Toggle
          label="Show device frame"
          value={config.frameVisible}
          onChange={(v) => update("frameVisible", v)}
        />
        <Toggle
          label="Render drop shadow"
          value={config.frameShadow}
          onChange={(v) => update("frameShadow", v)}
        />
        <Toggle
          label="Auto-sync styles across deck"
          value={config.autoSyncTheme}
          onChange={(v) => update("autoSyncTheme", v)}
        />
      </div>
      {/* Watermark Callout */}
      <div style={{ marginTop: "16px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
        {isWatermarkUnlocked ? (
          <button type="button" onClick={onOpenPremium}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "var(--r-md)", background: "var(--success-subtle)", border: "1.5px solid var(--success)", cursor: "pointer", fontFamily: "var(--font)", transition: "all .12s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--text-1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--success)"; }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--success-text)" }}>Watermark Unlocked! (24h)</span>
            <span className="badge-pill" style={{ background: "var(--success)", color: "white", fontSize: "10px" }}>Active</span>
          </button>
        ) : (
          <button type="button" onClick={onOpenUnlockWatermark}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "var(--r-md)", background: "var(--fill-subtle)", border: "1.5px solid var(--border)", cursor: "pointer", fontFamily: "var(--font)", transition: "all .12s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--text-1)"; e.currentTarget.style.background = "var(--fill)"; e.currentTarget.querySelector("span")!.style.color = "var(--fill-text)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--fill-subtle)"; e.currentTarget.querySelector("span")!.style.color = "var(--text-2)"; }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-2)", transition: "color .12s" }}>Remove watermark · 4K export</span>
            <span className="badge-pill" style={{ background: "var(--fill)", color: "var(--fill-text)", fontSize: "10px" }}>Pro</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ── Tab: Presets ───────────────────────────────────────────────────────────────

const LAYOUT_PRESETS = [
  {
    name: "Feature Highlight",
    desc: "Centered device frame, top captions, standard scale",
    config: {
      textPosition: "top" as const,
      headlineSize: 3.2,
      subtextSize: 1.4,
      frameVisible: true,
      frameMode: "flat" as const,
      panoramic: "none" as const,
      imageScale: 0.9,
      imageOffsetX: 50,
      imageOffsetY: 50,
    },
  },
  {
    name: "3D Mockup Hero",
    desc: "Bottom captions, large 3D tilted frame",
    config: {
      textPosition: "bottom" as const,
      headlineSize: 3.0,
      subtextSize: 1.3,
      frameVisible: true,
      frameMode: "tilt3d" as const,
      panoramic: "none" as const,
      imageScale: 0.95,
      imageOffsetX: 50,
      imageOffsetY: 50,
    },
  },
  {
    name: "Split-Frame Detailed View",
    desc: "Text at top, borderless screenshot zoomed taking lower half",
    config: {
      textPosition: "top" as const,
      headlineSize: 3.2,
      subtextSize: 1.4,
      frameVisible: false,
      panoramic: "none" as const,
      imageScale: 1.15,
      imageOffsetX: 50,
      imageOffsetY: 70,
    },
  },
  {
    name: "Panoramic Duo (Left)",
    desc: "Device shifted to the right boundary for left-side span",
    config: {
      textPosition: "top" as const,
      headlineSize: 3.2,
      subtextSize: 1.4,
      frameVisible: true,
      frameMode: "flat" as const,
      panoramic: "left" as const,
      imageScale: 1.0,
      imageOffsetX: 50,
      imageOffsetY: 50,
    },
  },
  {
    name: "Panoramic Duo (Right)",
    desc: "Device shifted to the left boundary for right-side span",
    config: {
      textPosition: "top" as const,
      headlineSize: 3.2,
      subtextSize: 1.4,
      frameVisible: true,
      frameMode: "flat" as const,
      panoramic: "right" as const,
      imageScale: 1.0,
      imageOffsetX: 50,
      imageOffsetY: 50,
    },
  },
];

function TabPresets({
  setConfig,
}: {
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
}) {
  const [openBuiltin, setOpenBuiltin] = useState(true);
  const [openLayouts, setOpenLayouts] = useState(true);

  const applyPreset = (presetPreset: typeof QUICK_PRESETS[0]["config"]) => {
    setConfig((prev) => ({
      ...prev,
      ...presetPreset,
    }));
  };

  const applyLayoutPreset = (layoutPreset: typeof LAYOUT_PRESETS[0]["config"]) => {
    setConfig((prev) => ({
      ...prev,
      ...layoutPreset,
    }));
  };

  return (
    <div className="ctrl-section" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <PresetAccordion
        title="Quick Style Presets"
        isOpen={openBuiltin}
        onToggle={() => setOpenBuiltin((v) => !v)}
      >
        <p style={{ fontSize: "11px", color: "var(--text-3)", margin: 0, lineHeight: 1.4 }}>
          Apply curated combinations of background gradient styles, text colors, and device tilt formats instantly.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
          {QUICK_PRESETS.map((preset) => {
            // compute swatch
            let bgVal = "#0f172a";
            if (preset.config.bgType === "gradient") {
              const p = GRADIENT_PRESETS.find((g) => g.name === preset.config.gradientPreset) ?? GRADIENT_PRESETS[0];
              bgVal = p.via
                ? `linear-gradient(135deg, ${p.from}, ${p.via}, ${p.to})`
                : `linear-gradient(135deg, ${p.from}, ${p.to})`;
            } else if (preset.config.bgType === "solid" && preset.config.solidColor) {
              bgVal = preset.config.solidColor;
            } else if (preset.config.bgType === "mesh") {
              bgVal = `linear-gradient(135deg, ${preset.config.meshColor1 || "#6366f1"}, ${preset.config.meshColor3 || "#ec4899"})`;
            }

            return (
              <div
                key={preset.name}
                onClick={() => applyPreset(preset.config)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px",
                  borderRadius: "var(--r-sm)",
                  cursor: "pointer",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  transition: "all 0.12s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--fill-subtle)";
                  e.currentTarget.style.borderColor = "var(--text-1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--surface)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    border: "1px solid var(--border)",
                    background: bgVal,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--text-1)",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {preset.name}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "var(--text-3)",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {preset.desc}
                  </span>
                </div>
                <span style={{ fontSize: "14px", color: "var(--text-3)", flexShrink: 0 }}>
                  ›
                </span>
              </div>
            );
          })}
        </div>
      </PresetAccordion>

      <PresetAccordion
        title="Marketing Layout Templates"
        isOpen={openLayouts}
        onToggle={() => setOpenLayouts((v) => !v)}
      >
        <p style={{ fontSize: "11px", color: "var(--text-3)", margin: 0, lineHeight: 1.4 }}>
          Instantly structure the screen layout: select device positions, caption alignment, tilts, or panoramic spanning mockups.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
          {LAYOUT_PRESETS.map((preset) => (
            <div
              key={preset.name}
              onClick={() => applyLayoutPreset(preset.config)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "var(--r-sm)",
                cursor: "pointer",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                transition: "all 0.12s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--fill-subtle)";
                e.currentTarget.style.borderColor = "var(--text-1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--surface)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "var(--text-1)",
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {preset.name}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    color: "var(--text-3)",
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {preset.desc}
                </span>
              </div>
              <span style={{ fontSize: "14px", color: "var(--text-3)", flexShrink: 0 }}>
                ›
              </span>
            </div>
          ))}
        </div>
      </PresetAccordion>
    </div>
  );
}

// ── Tab: Export ────────────────────────────────────────────────────────────────

function TabExport({ onExport, onExportAll, onExportAllSizes, onCopy, isExporting, screenCount }: {
  onExport: () => void;
  onExportAll: () => void;
  onExportAllSizes: () => void;
  onCopy: () => void;
  isExporting: boolean;
  screenCount: number;
}) {
  return (
    <div className="ctrl-section">
      <SectionLabel>Export Current Screen</SectionLabel>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          type="button"
          onClick={onExport}
          disabled={isExporting}
          className="btn-fill btn-lg"
          style={{ width: "100%", justifyContent: "center", display: "flex", gap: "8px", opacity: isExporting ? 0.6 : 1 }}
        >
          {isExporting ? "Exporting..." : "Download PNG"}
        </button>

        <button
          type="button"
          onClick={onCopy}
          disabled={isExporting}
          className="btn-outline btn-lg"
          style={{ width: "100%", justifyContent: "center", display: "flex", gap: "8px", opacity: isExporting ? 0.6 : 1 }}
        >
          Copy to Clipboard
        </button>
      </div>

      <div className="ctrl-divider" style={{ margin: "16px 0" }} />

      <SectionLabel>Export All Screens</SectionLabel>
      <p style={{ fontSize: "11px", color: "var(--text-3)", margin: "0 0 8px" }}>
        Download all {screenCount} screens as a ZIP file.
      </p>
      <button
        type="button"
        onClick={onExportAll}
        disabled={isExporting}
        className="btn-fill btn-lg"
        style={{
          width: "100%", justifyContent: "center", display: "flex", gap: "8px",
          background: isExporting ? undefined : "var(--fill)",
          opacity: isExporting ? 0.6 : 1,
        }}
      >
        {isExporting ? "Exporting..." : `Export All as ZIP (${screenCount})`}
      </button>

      <div className="ctrl-divider" style={{ margin: "16px 0" }} />

      <SectionLabel>Smart Resize — All Device Sizes</SectionLabel>
      <p style={{ fontSize: "11px", color: "var(--text-3)", margin: "0 0 8px", lineHeight: 1.4 }}>
        Auto-export every screen across all required App Store or Play Store device sizes. One click, store-ready ZIP.
      </p>
      <button
        type="button"
        onClick={onExportAllSizes}
        disabled={isExporting}
        className="btn-fill btn-lg"
        style={{
          width: "100%", justifyContent: "center", display: "flex", gap: "8px",
          background: isExporting ? undefined : "var(--fill)",
          opacity: isExporting ? 0.6 : 1,
        }}
      >
        {isExporting ? "Exporting..." : "Export All Sizes"}
      </button>

      <div className="ctrl-divider" style={{ margin: "16px 0" }} />

      <div style={{
        padding: "10px 12px",
        background: "var(--fill-subtle)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-md)",
        fontSize: "11px",
        color: "var(--text-2)",
        lineHeight: 1.4,
      }}>
        <strong>Shortcuts:</strong> ⌘S to export, ⌘⇧C to copy, ⌘Z / ⌘⇧Z for undo/redo.
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function BuilderSidebar({
  config,
  setConfig,
  onExport,
  onExportAll,
  onExportAllSizes,
  onCopy,
  isExporting,
  screenCount,
  isWatermarkUnlocked,
  onOpenUnlockWatermark,
  onOpenPremium,
}: BuilderSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabId>("device");

  const update = <K extends keyof BuilderConfig>(key: K, value: BuilderConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  return (
    <aside className="tabbed-sidebar">
      {/* Tab bar */}
      <nav className="sidebar-tab-grid" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            type="button"
            className={`sidebar-tab-btn${activeTab === tab.id ? " active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
          >
            <span className="sidebar-tab-icon">{TAB_ICONS[tab.id]}</span>
            <span className="sidebar-tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <div className="sidebar-tab-content" role="tabpanel">
        {activeTab === "device" && <TabDevice config={config} update={update} />}
        {activeTab === "text" && <TabText config={config} update={update} onOpenPremium={onOpenPremium} />}
        {activeTab === "style" && (
          <TabStyle
            config={config}
            update={update}
            isWatermarkUnlocked={isWatermarkUnlocked}
            onOpenUnlockWatermark={onOpenUnlockWatermark}
            onOpenPremium={onOpenPremium}
          />
        )}
        {activeTab === "presets" && <TabPresets setConfig={setConfig} />}
        {activeTab === "export" && <TabExport onExport={onExport} onExportAll={onExportAll} onExportAllSizes={onExportAllSizes} onCopy={onCopy} isExporting={isExporting} screenCount={screenCount} />}
      </div>
    </aside>
  );
}

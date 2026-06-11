"use client";

import { OptimizationConfig } from "./WorkspaceHub";

interface ControlSidebarProps {
  config: OptimizationConfig;
  setConfig: React.Dispatch<React.SetStateAction<OptimizationConfig>>;
  onOpenPremium: () => void;
}

const gradients = [
  { name: "Sunset", value: "bg-gradient-to-tr from-orange-400 via-pink-500 to-indigo-600" },
  { name: "Midnight Cyber", value: "bg-gradient-to-tr from-purple-900 via-indigo-950 to-slate-900" },
  { name: "Ocean", value: "bg-gradient-to-tr from-sky-400 to-emerald-600" },
  { name: "Emerald Mist", value: "bg-gradient-to-tr from-teal-400 to-emerald-700" },
  { name: "Neon Synth", value: "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500" },
  { name: "Minimalist Light", value: "bg-gradient-to-tr from-slate-100 to-slate-200" },
  { name: "Minimalist Dark", value: "bg-gradient-to-tr from-neutral-800 to-neutral-950" },
  { name: "Cyberpunk", value: "bg-gradient-to-tr from-yellow-200 via-pink-500 to-red-500" },
];

export default function ControlSidebar({ config, setConfig, onOpenPremium }: ControlSidebarProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Background Gradients */}
      <div className="comp-block">
        <div className="comp-label">Background Gradient</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
          {gradients.map((grad) => {
            const isSelected = config.gradientClass === grad.value;
            return (
              <button
                key={grad.value}
                type="button"
                className={grad.value}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  borderRadius: "50%",
                  border: isSelected
                    ? "2.5px solid var(--text-1)"
                    : "1.5px solid var(--border)",
                  cursor: "pointer",
                  transform: isSelected ? "scale(1.08)" : "scale(1)",
                  transition: "transform 0.15s ease, border-color 0.15s ease",
                  boxShadow: isSelected ? "0 0 0 2px var(--bg)" : "none",
                }}
                onClick={() => setConfig({ ...config, gradientClass: grad.value })}
                title={grad.name}
              />
            );
          })}
        </div>
      </div>

      {/* Padding Controller */}
      <div className="comp-block">
        <div className="comp-label">Padding</div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <input
            type="range"
            min="16"
            max="128"
            value={config.padding}
            onChange={(e) => setConfig({ ...config, padding: parseInt(e.target.value) })}
            style={{
              flex: 1,
              height: "6px",
              borderRadius: "3px",
              background: "var(--border-strong)",
              outline: "none",
              cursor: "pointer",
              WebkitAppearance: "none",
            }}
          />
          <span style={{ fontSize: "14px", fontWeight: 700, minWidth: "48px", textAlign: "right" }}>
            {config.padding}px
          </span>
        </div>
      </div>

      {/* Border Radius */}
      <div className="comp-block">
        <div className="comp-label">Border Radius</div>
        <div className="toggle-pill" style={{ display: "flex", width: "100%" }}>
          {[
            { label: "None", value: "rounded-none" },
            { label: "MD", value: "rounded-md" },
            { label: "XL", value: "rounded-xl" },
            { label: "3XL", value: "rounded-3xl" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`tp-option ${config.borderRadius === opt.value ? "active" : ""}`}
              style={{
                flex: 1,
                border: "none",
                background: "none",
                textAlign: "center",
                cursor: "pointer",
                padding: "8px 0",
              }}
              onClick={() => setConfig({ ...config, borderRadius: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shadow Style */}
      <div className="comp-block">
        <div className="comp-label">Drop Shadow</div>
        <div className="toggle-pill" style={{ display: "flex", width: "100%" }}>
          {[
            { label: "None", value: "shadow-none" },
            { label: "MD", value: "shadow-md" },
            { label: "XL", value: "shadow-xl" },
            { label: "2XL", value: "shadow-2xl" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`tp-option ${config.dropShadow === opt.value ? "active" : ""}`}
              style={{
                flex: 1,
                border: "none",
                background: "none",
                textAlign: "center",
                cursor: "pointer",
                padding: "8px 0",
              }}
              onClick={() => setConfig({ ...config, dropShadow: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="comp-block">
        <div className="comp-label">Aspect Ratio</div>
        <div className="toggle-pill" style={{ display: "flex", width: "100%" }}>
          {[
            { label: "16:9 Landscape", value: "aspect-video" },
            { label: "1:1 Square", value: "aspect-square" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`tp-option ${config.aspectRatio === opt.value ? "active" : ""}`}
              style={{
                flex: 1,
                border: "none",
                background: "none",
                textAlign: "center",
                cursor: "pointer",
                padding: "8px 0",
                fontSize: "12px",
              }}
              onClick={() => setConfig({ ...config, aspectRatio: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Watermark Branding Callout (Clickable for Pro Upgrade Modal) */}
      <div
        className="comp-block"
        style={{
          cursor: "pointer",
          transition: "all 0.15s ease",
          border: "1.5px solid var(--border)",
        }}
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
          <span className="badge-pill" style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "var(--fill)", color: "var(--fill-text)" }}>
            👑 Go Pro
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span className="comp-name" style={{ fontSize: "13px", margin: 0 }}>via buildrStudio.in</span>
            <span className="comp-desc" style={{ fontSize: "11px" }}>Click to remove watermark & unlock 4K exports</span>
          </div>
        </div>
      </div>
    </div>
  );
}

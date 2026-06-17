"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import Link from "next/link";
import AppHeader from "../components/AppHeader";
import { ChangelogCard, CARD_W, CARD_H, type CardData, type Template } from "../components/ChangeLogCard";

const TEMPLATES: { id: Template; label: string }[] = [
  { id: "minimal", label: "Minimal" },
  { id: "gradient", label: "Gradient" },
  { id: "bracket", label: "Bracket" },
];

const PRESETS = [
  { name: "Paper", bg: "#f6f5f1", fg: "#111111", accent: "#e85d3a" },
  { name: "Ink", bg: "#0f0f0e", fg: "#f5f3ee", accent: "#c9a84c" },
  { name: "Ocean", bg: "#0c2340", fg: "#f5f3ee", accent: "#5cbdb9" },
  { name: "Sand", bg: "#efe8dc", fg: "#3a2e1f", accent: "#c4654a" },
  { name: "Mint", bg: "#0d1b2a", fg: "#f5f3ee", accent: "#2dd4a8" },
  { name: "Rose", bg: "#fef0f5", fg: "#3d1029", accent: "#c44569" },
];

const TAG_OPTIONS = ["New", "Improved", "Fixed", "Breaking"];

const DEFAULT: CardData = {
  version: "v2.4.0",
  title: "Realtime collaboration is here",
  description: "Invite your team to edit documents together with cursors, presence, and instant sync.",
  date: "JUN 12, 2026",
  tags: ["New", "Improved"],
  template: "minimal",
  brand: "Acme",
  bg: PRESETS[0].bg,
  fg: PRESETS[0].fg,
  accent: PRESETS[0].accent,
  showVersion: true,
  showDate: true,
  showTags: true,
};

export default function ChangelogGenerator() {
  const [data, setData] = useState<CardData>(DEFAULT);
  const [scale, setScale] = useState(0.5);
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!wrapRef.current) return;
      const w = wrapRef.current.clientWidth;
      setScale(Math.min(1, (w - 36) / CARD_W));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const set = <K extends keyof CardData>(k: K, v: CardData[K]) => setData((d) => ({ ...d, [k]: v }));

  const toggleTag = (t: string) => {
    setData((d) => ({
      ...d,
      tags: d.tags.includes(t) ? d.tags.filter((x) => x !== t) : [...d.tags, t],
    }));
  };

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setData((d) => ({ ...d, bg: p.bg, fg: p.fg, accent: p.accent }));
  };

  const download = async () => {
    if (!cardRef.current) return;
    try {
      const url = await toPng(cardRef.current, {
        pixelRatio: 2,
        width: CARD_W,
        height: CARD_H,
        cacheBust: true,
      });
      const a = document.createElement("a");
      a.href = url;
      a.download = `changelog-${data.version.replace(/[^\w.-]/g, "_")}.png`;
      a.click();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="ink-app">
      <style>{`

        .swatch {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          cursor: pointer;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }
        .swatch:hover {
          transform: scale(1.05);
        }
        .swatch.active {
          transform: scale(1.08);
          border-color: var(--text-1);
          box-shadow: 0 0 0 2px var(--bg);
        }
        .ink-input, .ink-textarea {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: var(--r-md);
          padding: 10px 12px;
          font-size: 14px;
          font-family: var(--font);
          color: var(--text-1);
          width: 100%;
          outline: none;
          transition: border .15s;
        }
        .ink-input:focus, .ink-textarea:focus {
          border-color: var(--text-1);
        }
        .ink-textarea {
          resize: vertical;
          min-height: 80px;
        }
        .divider {
          height: 1px;
          background: var(--border);
          margin: 4px 0;
        }
        .color-fields-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 14px;
        }
        .generator-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          gap: 16px;
        }
        @media (max-width: 900px) {
          .generator-grid { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 640px) {
          .generator-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .generator-header button {
            width: 100%;
          }
        }
        @media (max-width: 480px) {
          .color-fields-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <AppHeader activeRoute="change-log" />

      <main className="page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 28px 64px" }}>
        {/* Header */}
        <header className="generator-header">
          <div>
            <div className="ink-label" style={{ marginBottom: 8 }}>Ink · Changelog</div>
            <h1 className="ink-title" style={{ fontSize: "32px", margin: 0 }}>Social Card Generator</h1>
          </div>
          <button className="btn-fill" onClick={download}>
            <DownloadIcon /> Export PNG
          </button>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 380px", gap: 28, alignItems: "start" }} className="generator-grid">
          {/* Preview */}
          <div ref={wrapRef} className="card-default" style={{ padding: 16, background: "var(--surface-2)" }}>
            <div
              style={{
                width: "100%",
                height: CARD_H * scale,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  transform: `scale(${scale})`,
                  transformOrigin: "center center",
                  flexShrink: 0,
                  boxShadow: "var(--shadow-lg)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <ChangelogCard data={data} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, padding: "0 4px" }}>
              <span className="ink-caption">1200 × 630 · OG ratio</span>
              <span className="ink-caption">{Math.round(scale * 100)}%</span>
            </div>
          </div>

          {/* Controls */}
          <aside className="card-default" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {/* Template */}
            <section>
              <div className="field-label" style={{ marginBottom: 10 }}>Template</div>
              <div className="toggle-pill" style={{ width: "100%" }}>
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    className={`tp-option ${data.template === t.id ? "active" : ""}`}
                    style={{ flex: 1 }}
                    onClick={() => set("template", t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </section>

            <div className="divider" />

            {/* Content */}
            <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="field">
                <label className="field-label">Brand</label>
                <input className="ink-input" value={data.brand} onChange={(e) => set("brand", e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field">
                  <label className="field-label">Version</label>
                  <input className="ink-input" value={data.version} onChange={(e) => set("version", e.target.value)} />
                </div>
                <div className="field">
                  <label className="field-label">Date</label>
                  <input className="ink-input" value={data.date} onChange={(e) => set("date", e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label className="field-label">Title</label>
                <input className="ink-input" value={data.title} onChange={(e) => set("title", e.target.value)} />
              </div>
              <div className="field">
                <label className="field-label">Description</label>
                <textarea className="ink-textarea" value={data.description} onChange={(e) => set("description", e.target.value)} />
              </div>
              <div className="field">
                <label className="field-label">Tags</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {TAG_OPTIONS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`chip-default ${data.tags.includes(t) ? "active" : ""}`}
                      onClick={() => toggleTag(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <div className="divider" />

            {/* Style */}
            <section>
              <div className="field-label" style={{ marginBottom: 10 }}>Color preset</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {PRESETS.map((p) => {
                  const active = data.bg === p.bg && data.fg === p.fg && data.accent === p.accent;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      title={p.name}
                      className={`swatch ${active ? "active" : ""}`}
                      onClick={() => applyPreset(p)}
                      style={{
                        background: `linear-gradient(135deg, ${p.bg} 0%, ${p.bg} 50%, ${p.accent} 50%, ${p.accent} 100%)`,
                      }}
                    />
                  );
                })}
              </div>
              <div className="color-fields-grid">
                <ColorField label="BG" value={data.bg} onChange={(v) => set("bg", v)} />
                <ColorField label="Text" value={data.fg} onChange={(v) => set("fg", v)} />
                <ColorField label="Accent" value={data.accent} onChange={(v) => set("accent", v)} />
              </div>
            </section>

            <div className="divider" />

            <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="field-label">Show</div>
              <Toggle label="Version" value={data.showVersion} onChange={(v) => set("showVersion", v)} />
              <Toggle label="Date" value={data.showDate} onChange={(v) => set("showDate", v)} />
              <Toggle label="Tags" value={data.showTags} onChange={(v) => set("showTags", v)} />
            </section>
          </aside>
        </div>

        {/* Offscreen full-size card for export */}
        <div style={{ position: "fixed", left: -99999, top: 0, pointerEvents: "none" }} aria-hidden>
          <ChangelogCard ref={cardRef} data={data} />
        </div>
      </main>
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="field" style={{ minWidth: 0 }}>
      <label className="field-label">{label}</label>
      <div style={{ display: "flex", width: "100%", alignItems: "center", gap: 6, border: "1.5px solid var(--border)", borderRadius: "var(--r-md)", padding: 4, background: "var(--surface)" }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 28, height: 28, border: "none", background: "transparent", padding: 0, cursor: "pointer", flexShrink: 0 }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", flex: 1, minWidth: 0, border: "none", background: "transparent", fontFamily: "ui-monospace, monospace", fontSize: 11, color: "var(--text-2)", outline: "none" }}
        />
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 12px",
        border: "1.5px solid var(--border)",
        borderRadius: "var(--r-md)",
        background: "var(--surface)",
        cursor: "pointer",
        fontFamily: "var(--font)",
        color: "var(--text-1)",
        fontSize: 13,
        fontWeight: 600,
        width: "100%",
      }}
    >
      <span>{label}</span>
      <span
        style={{
          width: 32,
          height: 18,
          borderRadius: 999,
          background: value ? "var(--fill)" : "var(--border)",
          position: "relative",
          transition: "background .15s",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: value ? 16 : 2,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: value ? "var(--fill-text)" : "var(--surface)",
            transition: "left .15s",
          }}
        />
      </span>
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, display: "inline-block", verticalAlign: "middle" }}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

"use client";

import type { BuilderConfig } from "../lib/deviceSpecs";
import { DEFAULT_CONFIG } from "../lib/deviceSpecs";

interface Template {
  name: string;
  category: string;
  screens: Partial<BuilderConfig>[];
}

const TEMPLATES: Template[] = [
  {
    name: "Fitness App",
    category: "Health",
    screens: [
      { headline: "Track Every Rep.", subtext: "Your personal fitness companion.", bgType: "gradient", gradientPreset: "Forest Mist", gradientDir: "to bottom right", headlineColor: "#ffffff", subtextColor: "rgba(255,255,255,0.8)" },
      { headline: "Smart Workouts", subtext: "AI-powered training plans.", bgType: "gradient", gradientPreset: "Forest Mist", gradientDir: "to bottom", headlineColor: "#ffffff", subtextColor: "rgba(255,255,255,0.8)" },
      { headline: "See Your Progress", subtext: "Beautiful charts & insights.", bgType: "gradient", gradientPreset: "Forest Mist", gradientDir: "135deg", headlineColor: "#ffffff", subtextColor: "rgba(255,255,255,0.8)" },
    ],
  },
  {
    name: "Fintech App",
    category: "Finance",
    screens: [
      { headline: "Money Made Simple.", subtext: "Banking that works for you.", bgType: "gradient", gradientPreset: "Night City", gradientDir: "to bottom", headlineColor: "#ffffff", subtextColor: "rgba(255,255,255,0.7)" },
      { headline: "Instant Transfers", subtext: "Send money in seconds.", bgType: "gradient", gradientPreset: "Night City", gradientDir: "to bottom right", headlineColor: "#ffffff", subtextColor: "rgba(255,255,255,0.7)" },
      { headline: "Smart Budgets", subtext: "Know where every dollar goes.", bgType: "gradient", gradientPreset: "Night City", gradientDir: "135deg", headlineColor: "#ffffff", subtextColor: "rgba(255,255,255,0.7)" },
    ],
  },
  {
    name: "Social App",
    category: "Social",
    screens: [
      { headline: "Connect With\nEveryone.", subtext: "Share moments that matter.", bgType: "gradient", gradientPreset: "Indigo Dusk", gradientDir: "to bottom right", headlineColor: "#ffffff", subtextColor: "rgba(255,255,255,0.8)" },
      { headline: "Real-Time Chat", subtext: "Messages, voice, and video.", bgType: "gradient", gradientPreset: "Indigo Dusk", gradientDir: "to bottom", headlineColor: "#ffffff", subtextColor: "rgba(255,255,255,0.8)" },
      { headline: "Your Community", subtext: "Groups, events, and more.", bgType: "gradient", gradientPreset: "Bubblegum", gradientDir: "to bottom right", headlineColor: "#ffffff", subtextColor: "rgba(255,255,255,0.8)" },
    ],
  },
  {
    name: "Productivity App",
    category: "Productivity",
    screens: [
      { headline: "Do More.\nStress Less.", subtext: "The task manager that adapts to you.", bgType: "gradient", gradientPreset: "Ocean Breeze", gradientDir: "to bottom", headlineColor: "#ffffff", subtextColor: "rgba(255,255,255,0.8)" },
      { headline: "Smart Reminders", subtext: "Never miss a deadline.", bgType: "gradient", gradientPreset: "Ocean Breeze", gradientDir: "to bottom right", headlineColor: "#ffffff", subtextColor: "rgba(255,255,255,0.8)" },
      { headline: "Team Sync", subtext: "Collaborate in real time.", bgType: "gradient", gradientPreset: "Ocean Breeze", gradientDir: "135deg", headlineColor: "#ffffff", subtextColor: "rgba(255,255,255,0.8)" },
    ],
  },
  {
    name: "Food Delivery",
    category: "Food",
    screens: [
      { headline: "Craving\nSomething?", subtext: "Delivered in 30 minutes.", bgType: "gradient", gradientPreset: "Sunset Blaze", gradientDir: "to bottom right", headlineColor: "#ffffff", subtextColor: "rgba(255,255,255,0.85)" },
      { headline: "Live Tracking", subtext: "Watch your order arrive.", bgType: "gradient", gradientPreset: "Sunset Blaze", gradientDir: "to bottom", headlineColor: "#ffffff", subtextColor: "rgba(255,255,255,0.85)" },
      { headline: "1000+ Restaurants", subtext: "Your favorites, one tap away.", bgType: "gradient", gradientPreset: "Sunset Blaze", gradientDir: "135deg", headlineColor: "#ffffff", subtextColor: "rgba(255,255,255,0.85)" },
    ],
  },
  {
    name: "Minimal / Clean",
    category: "General",
    screens: [
      { headline: "Your App Name.", subtext: "One line that sells.", bgType: "gradient", gradientPreset: "Arctic White", gradientDir: "to bottom", headlineColor: "#0f172a", subtextColor: "#475569", frameMode: "flat" as const },
      { headline: "Key Feature", subtext: "Describe the magic.", bgType: "gradient", gradientPreset: "Arctic White", gradientDir: "to bottom right", headlineColor: "#0f172a", subtextColor: "#475569", frameMode: "flat" as const },
      { headline: "Available Now", subtext: "Download on the App Store.", bgType: "gradient", gradientPreset: "Charcoal", gradientDir: "to bottom", headlineColor: "#ffffff", subtextColor: "rgba(255,255,255,0.7)", frameMode: "flat" as const },
    ],
  },
];

function gradientPreview(preset: string): string {
  const map: Record<string, string> = {
    "Forest Mist": "linear-gradient(135deg, #10b981, #34d399, #6ee7b7)",
    "Night City": "linear-gradient(135deg, #1e1b4b, #312e81, #4338ca)",
    "Indigo Dusk": "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
    "Ocean Breeze": "linear-gradient(135deg, #0ea5e9, #38bdf8, #7dd3fc)",
    "Sunset Blaze": "linear-gradient(135deg, #f97316, #fb923c, #fbbf24)",
    "Bubblegum": "linear-gradient(135deg, #f472b6, #e879f9, #a78bfa)",
    "Arctic White": "linear-gradient(135deg, #f8fafc, #f1f5f9, #e2e8f0)",
    "Charcoal": "linear-gradient(135deg, #111827, #1f2937, #374151)",
  };
  return map[preset] || "linear-gradient(135deg, #6366f1, #a855f7)";
}

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (screens: BuilderConfig[]) => void;
}

export default function TemplateGallery({ isOpen, onClose, onApply }: TemplateGalleryProps) {
  if (!isOpen) return null;

  const handleSelect = (template: Template) => {
    const screens = template.screens.map((partial) => ({
      ...DEFAULT_CONFIG,
      ...partial,
    }));
    onApply(screens);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(10, 10, 10, 0.5)",
        backdropFilter: "blur(8px)",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <div
        className="card-default"
        style={{
          width: "90%",
          maxWidth: "720px",
          maxHeight: "80vh",
          overflow: "auto",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          animation: "scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>Start from a template</h2>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-3)" }}>Pick a category, then customize with your screenshots.</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "var(--text-3)", padding: "4px" }}
          >
            ✕
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}>
          {TEMPLATES.map((template) => (
            <button
              key={template.name}
              onClick={() => handleSelect(template)}
              style={{
                textAlign: "left",
                background: "var(--surface)",
                border: "1.5px solid var(--border)",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.2s",
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--fill)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Preview swatch row */}
              <div style={{ display: "flex", height: "80px" }}>
                {template.screens.map((scr, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      background: gradientPreview(scr.gradientPreset || "Indigo Dusk"),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{
                      width: "22px",
                      height: "38px",
                      borderRadius: "5px",
                      border: "1.5px solid rgba(255,255,255,0.3)",
                      background: "rgba(0,0,0,0.2)",
                    }} />
                  </div>
                ))}
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-1)" }}>{template.name}</div>
                <div style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "2px" }}>
                  {template.category} · {template.screens.length} screens
                </div>
              </div>
            </button>
          ))}

          {/* Blank template */}
          <button
            onClick={onClose}
            style={{
              textAlign: "left",
              background: "var(--surface)",
              border: "1.5px dashed var(--border-strong)",
              borderRadius: "16px",
              overflow: "hidden",
              cursor: "pointer",
              transition: "all 0.2s",
              padding: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--text-1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; }}
          >
            <div style={{ height: "80px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-2)" }}>
              <span style={{ fontSize: "24px", opacity: 0.4 }}>➕</span>
            </div>
            <div style={{ padding: "12px 14px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-1)" }}>Start Blank</div>
              <div style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "2px" }}>Build from scratch</div>
            </div>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

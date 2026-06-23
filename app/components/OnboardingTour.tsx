"use client";

import { useState, useEffect } from "react";

const STEPS = [
  { title: "Upload a screenshot", desc: "Drag & drop or paste from clipboard into the Device tab.", icon: "📱" },
  { title: "Pick a style", desc: "Choose a gradient preset or layout from the Presets tab.", icon: "🎨" },
  { title: "Edit your copy", desc: "Click the headline on the canvas to edit, or use AI Copywriter.", icon: "✏️" },
  { title: "Export & share", desc: "Download PNG or export all screens as a ZIP from the Export tab.", icon: "⬇️" },
];

interface OnboardingTourProps {
  storageKey: string;
}

export default function OnboardingTour({ storageKey }: OnboardingTourProps) {
  const [step, setStep] = useState(-1);

  useEffect(() => {
    const seen = localStorage.getItem(storageKey);
    if (!seen) setStep(0);
  }, [storageKey]);

  const dismiss = () => {
    setStep(-1);
    localStorage.setItem(storageKey, "1");
  };

  if (step < 0) return null;

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999,
        background: "var(--surface)",
        border: "1.5px solid var(--border)",
        borderRadius: "16px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
        padding: "20px 24px",
        width: "90%",
        maxWidth: "440px",
        display: "flex",
        gap: "16px",
        alignItems: "flex-start",
        animation: "tourSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{
        width: "44px",
        height: "44px",
        borderRadius: "12px",
        background: "var(--fill-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        flexShrink: 0,
      }}>
        {current.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-1)" }}>{current.title}</span>
          <span style={{ fontSize: "11px", color: "var(--text-3)" }}>{step + 1}/{STEPS.length}</span>
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-2)", margin: "0 0 12px", lineHeight: 1.5 }}>{current.desc}</p>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {/* Progress dots */}
          <div style={{ display: "flex", gap: "4px", flex: 1 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === step ? "16px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: i === step ? "var(--fill)" : "var(--border)",
                transition: "all 0.2s",
              }} />
            ))}
          </div>
          <button
            onClick={dismiss}
            style={{
              background: "none",
              border: "none",
              fontSize: "12px",
              color: "var(--text-3)",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            Skip
          </button>
          <button
            onClick={() => isLast ? dismiss() : setStep(step + 1)}
            style={{
              background: "var(--fill)",
              color: "var(--on-fill, #fff)",
              border: "none",
              borderRadius: "8px",
              padding: "6px 16px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isLast ? "Got it!" : "Next"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes tourSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

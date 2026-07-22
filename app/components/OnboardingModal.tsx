"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    icon: "📸",
    title: "Upload a screenshot",
    body: "Drag in any screenshot from your app — or paste it with ⌘V. BuildrStudio wraps it in a device frame instantly.",
  },
  {
    icon: "✏️",
    title: "Write your headline",
    body: "Add a short headline and subtext per screen. Use AI Copywriter to generate 5 variations from your app description.",
  },
  {
    icon: "📦",
    title: "Export & submit",
    body: "Export a single screen or batch-export all App Store sizes at once. No resizing, no Figma.",
  },
];

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const router = useRouter();

  if (!isOpen) return null;

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  function finish() {
    onClose();
    router.push("/screenshot-builder");
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(10,10,10,0.5)",
        backdropFilter: "blur(8px)",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <div
        className="card-default"
        style={{
          width: "90%",
          maxWidth: "440px",
          padding: "40px 36px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Step dots */}
        <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? "20px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: i === step ? "var(--fill)" : "var(--border-strong)",
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px", lineHeight: 1 }}>{current.icon}</div>
          <h2 className="ink-title" style={{ fontSize: "20px", letterSpacing: "-0.4px", marginBottom: "10px" }}>
            {current.title}
          </h2>
          <p className="ink-body" style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.6, margin: 0 }}>
            {current.body}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              style={{
                flex: 1,
                padding: "11px",
                background: "var(--surface-2, var(--surface))",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-md)",
                color: "var(--text-2)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font)",
              }}
            >
              Back
            </button>
          )}
          <button
            onClick={() => (isLast ? finish() : setStep(s => s + 1))}
            style={{
              flex: 1,
              padding: "11px",
              background: "var(--fill)",
              border: "none",
              borderRadius: "var(--r-md)",
              color: "var(--fill-text)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font)",
            }}
          >
            {isLast ? "Open Screenshot Builder →" : "Next"}
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: "11px",
            color: "var(--text-3)",
            cursor: "pointer",
            fontFamily: "var(--font)",
            padding: 0,
          }}
        >
          Skip intro
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0 } to { transform: scale(1); opacity: 1 } }
      `}</style>
    </div>
  );
}

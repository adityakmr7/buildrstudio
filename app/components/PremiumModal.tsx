"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: "watermark" | "4k-export" | "3d-tilt" | "brand-presets" | "batch-export";
  defaultPlan?: "pro" | "ai_pro";
}

const FEATURE_HEADLINES: Record<string, string> = {
  watermark: "Remove the watermark",
  "4k-export": "Unlock 4K exports",
  "3d-tilt": "Unlock 3D device tilts",
  "brand-presets": "Save brand presets",
  "batch-export": "Batch multi-device export",
};

export default function PremiumModal({ isOpen, onClose, feature }: PremiumModalProps) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const isAuthenticated = status === "authenticated" && !!session?.user;
  const isPro = session?.user?.isPro;

  const handleCheckout = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "ai_pro" }),
      });
      const data = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Failed to start checkout");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
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
        backgroundColor: "rgba(10, 10, 10, 0.4)",
        backdropFilter: "blur(8px)",
        animation: "fadeIn 0.25s ease-out",
      }}
      onClick={onClose}
    >
      <div
        className="card-default"
        style={{
          width: "90%",
          maxWidth: "480px",
          padding: "36px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          position: "relative",
          animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: "var(--shadow-lg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "var(--text-3)",
            lineHeight: 1,
            padding: "4px",
          }}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Already Pro */}
        {isPro ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "36px" }}>✨</div>
            <h2
              className="ink-title"
              style={{ fontSize: "22px", letterSpacing: "-0.5px" }}
            >
              You&apos;re already Pro!
            </h2>
            <p
              className="ink-body"
              style={{ fontSize: "14px", color: "var(--text-2)" }}
            >
              All premium features are unlocked. Enjoy building with
              BuildrStudio Pro.
            </p>
            <button
              type="button"
              className="btn-outline btn-sm"
              onClick={onClose}
              style={{ alignSelf: "center", marginTop: "8px" }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", textAlign: "center" }}>
              <h2 className="ink-title" style={{ fontSize: "22px", letterSpacing: "-0.5px" }}>
                {feature ? (FEATURE_HEADLINES[feature] ?? "Go Pro") : "Go Pro"}
              </h2>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "4px" }}>
                <span style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-1px", color: "var(--text-1)" }}>$9</span>
                <span style={{ fontSize: "14px", color: "var(--text-3)" }}>/month</span>
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-3)", margin: 0 }}>
                Everything included. Cancel anytime.
              </p>
            </div>

            {/* Feature List */}
            <div
              style={{
                background: "var(--fill-subtle)",
                borderRadius: "var(--r-md)",
                padding: "14px 18px",
                fontSize: "13px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                color: "var(--text-2)",
              }}
            >
              {[
                ["Watermark-free exports", true],
                ["Batch export — all Apple & Google sizes", false],
                ["Canonical store filenames (ready to upload)", false],
                ["3D device tilts & 4K PNG", false],
                ["Unlimited AI headline generation", true],
                ["AI translation — 15+ languages", false],
                ["Custom brand presets & swatches", false],
              ].map(([label, bold]) => (
                <div key={label as string} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: "var(--fill)" }}>
                    <circle cx="7" cy="7" r="7" fill="currentColor" opacity="0.15"/>
                    <path d="M4 7l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={bold ? { fontWeight: 600 } : {}}>{label as string}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {error && (
                <div
                  style={{
                    background: "var(--fill-subtle)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--r-sm)",
                    color: "var(--text-2)",
                    fontSize: "12px",
                    padding: "10px 12px",
                  }}
                >
                  {error}
                </div>
              )}

              {isAuthenticated ? (
                <button
                  type="button"
                  className="btn-fill"
                  style={{ width: "100%", justifyContent: "center" }}
                  disabled={isLoading}
                  onClick={handleCheckout}
                >
                  {isLoading ? "Redirecting…" : "Get Pro — $9/mo"}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-fill"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => signIn("google", { callbackUrl: window.location.href })}
                >
                  Sign in with Google to continue
                </button>
              )}

              <span style={{ fontSize: "11px", color: "var(--text-3)", textAlign: "center" }}>
                {isAuthenticated
                  ? "Secure checkout via Lemon Squeezy. Cancel anytime."
                  : "Sign in first, then subscribe to unlock all Pro features."}
              </span>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

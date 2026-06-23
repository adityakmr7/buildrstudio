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
  watermark: "Remove Watermark — Go Pro",
  "4k-export": "Unlock 4K Exports — Go Pro",
  "3d-tilt": "Unlock 3D Device Tilts — Go Pro",
  "brand-presets": "Save Brand Presets — Go Pro",
  "batch-export": "Batch Multi-Device Export — Go Pro",
};

export default function PremiumModal({ isOpen, onClose, feature, defaultPlan }: PremiumModalProps) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"pro" | "ai_pro">(defaultPlan ?? "pro");

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
        body: JSON.stringify({ plan: selectedPlan }),
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "4px" }}>👑</div>
              <h2
                className="ink-title"
                style={{ fontSize: "22px", letterSpacing: "-0.5px" }}
              >
                {feature
                  ? (FEATURE_HEADLINES[feature] ?? "Upgrade Your Plan")
                  : "Upgrade Your Plan"}
              </h2>
            </div>

            {/* Plan Toggle */}
            <div style={{ display: "flex", gap: "8px" }}>
              {(["pro", "ai_pro"] as const).map((plan) => {
                const active = selectedPlan === plan;
                const isPro = plan === "pro";
                return (
                  <button
                    key={plan}
                    type="button"
                    onClick={() => setSelectedPlan(plan)}
                    style={{
                      flex: 1,
                      padding: "12px 10px",
                      borderRadius: "var(--r-md)",
                      border: active ? "2px solid var(--fill)" : "1px solid var(--border)",
                      background: active ? "var(--fill-subtle)" : "transparent",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-1)" }}>
                      {isPro ? "$4" : "$20"}
                      <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-3)" }}>/mo</span>
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: active ? "var(--fill)" : "var(--text-2)", marginTop: "2px" }}>
                      {isPro ? "Pro" : "AI Pro"}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feature List */}
            <div
              style={{
                background: "var(--fill-subtle)",
                borderRadius: "var(--r-md)",
                padding: "14px 18px",
                fontSize: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                color: "var(--text-2)",
              }}
            >
              <div style={{ display: "flex", gap: "8px" }}>
                <span>✨</span>
                <span><strong>Remove Watermark</strong> (Export clean screenshots)</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <span>🖥️</span>
                <span><strong>3D Device Tilts & 4K Export</strong></span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <span>📦</span>
                <span><strong>Batch Multi-Device Export</strong></span>
              </div>
              {selectedPlan === "ai_pro" && (
                <>
                  <div style={{ height: "1px", background: "var(--border)", margin: "4px 0" }} />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span>🤖</span>
                    <span><strong>Unlimited AI Copywriting</strong></span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span>🌍</span>
                    <span><strong>AI Translation (15+ languages)</strong></span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span>⚡</span>
                    <span><strong>Smart Tone & Category Targeting</strong></span>
                  </div>
                </>
              )}
            </div>

            {/* CTA */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
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
                  {isLoading ? "Redirecting..." : selectedPlan === "ai_pro" ? "Get AI Pro — $20/mo" : "Get Pro — $4/mo"}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-fill"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() =>
                    signIn("google", { callbackUrl: window.location.href })
                  }
                >
                  Sign in with Google to Subscribe
                </button>
              )}

              <span
                style={{
                  fontSize: "11px",
                  color: "var(--text-3)",
                  textAlign: "center",
                }}
              >
                {isAuthenticated
                  ? "Secure checkout via Lemon Squeezy. Cancel anytime."
                  : "Sign in first, then subscribe to unlock Pro features."}
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

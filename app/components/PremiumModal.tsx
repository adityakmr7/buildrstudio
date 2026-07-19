"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { track } from "@/app/lib/track";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: "watermark" | "4k-export" | "3d-tilt" | "brand-presets" | "batch-export";
  defaultPlan?: "pro" | "lifetime";
}

const FEATURE_HEADLINES: Record<string, string> = {
  watermark: "Remove the watermark",
  "4k-export": "Unlock 4K exports",
  "3d-tilt": "Unlock 3D device tilts",
  "brand-presets": "Save brand presets",
  "batch-export": "Batch multi-device export",
};

export default function PremiumModal({ isOpen, onClose, feature, defaultPlan = "lifetime" }: PremiumModalProps) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<"pro" | "lifetime">(defaultPlan);

  useEffect(() => {
    if (isOpen) {
      track("premium_modal_open", { feature: feature ?? "generic" });
    }
  }, [isOpen, feature]);

  if (!isOpen) return null;

  const isAuthenticated = status === "authenticated" && !!session?.user;
  const isPro = session?.user?.isPro;

  const handleCheckout = async () => {
    setIsLoading(true);
    setError("");
    track("checkout_start", { plan, feature: feature ?? "generic" });

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
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

  const ctaLabel = plan === "lifetime" ? "Get Launch Pack — $29 once" : "Get Pro — $9/mo";

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
              <p style={{ fontSize: "13px", color: "var(--text-3)", margin: 0 }}>
                Everything included. Pay once, or subscribe.
              </p>
            </div>

            {/* Plan Selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setPlan("lifetime")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: "var(--r-md)",
                  border: plan === "lifetime" ? "2px solid var(--fill)" : "1.5px solid var(--border)",
                  background: plan === "lifetime" ? "var(--fill-subtle)" : "transparent",
                  cursor: "pointer",
                  fontFamily: "var(--font)",
                  textAlign: "left",
                  position: "relative",
                }}
              >
                <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-1)" }}>
                    Launch Pack{" "}
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#fff",
                        background: "linear-gradient(135deg, #6366f1, #a855f7)",
                        borderRadius: "999px",
                        padding: "2px 8px",
                        marginLeft: "4px",
                        verticalAlign: "middle",
                        letterSpacing: "0.3px",
                      }}
                    >
                      BEST VALUE
                    </span>
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-3)" }}>
                    Pay once, keep Pro forever
                  </span>
                </span>
                <span style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text-1)", whiteSpace: "nowrap" }}>
                  $29
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPlan("pro")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: "var(--r-md)",
                  border: plan === "pro" ? "2px solid var(--fill)" : "1.5px solid var(--border)",
                  background: plan === "pro" ? "var(--fill-subtle)" : "transparent",
                  cursor: "pointer",
                  fontFamily: "var(--font)",
                  textAlign: "left",
                }}
              >
                <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-1)" }}>Monthly</span>
                  <span style={{ fontSize: "12px", color: "var(--text-3)" }}>Cancel anytime</span>
                </span>
                <span style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text-1)", whiteSpace: "nowrap" }}>
                  $9<span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-3)" }}>/mo</span>
                </span>
              </button>
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
                  {isLoading ? "Redirecting…" : ctaLabel}
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
                  ? "Secure checkout via Lemon Squeezy. 7-day money-back guarantee."
                  : "Sign in first, then unlock all Pro features."}
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

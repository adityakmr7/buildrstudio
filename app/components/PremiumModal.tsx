"use client";

import { useEffect, useState } from "react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Check if they already subscribed in this browser session
  useEffect(() => {
    if (isOpen) {
      const savedEmail = localStorage.getItem("premium_interest_email");
      const timer = setTimeout(() => {
        if (savedEmail) {
          setEmail(savedEmail);
          setIsSubmitted(true);
        } else {
          setIsSubmitted(false);
          setEmail("");
        }
        setSubmitError("");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "premium_modal",
          featureKey: "premium-branding-4k-export",
          pathname: window.location.pathname,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to save your request right now.");
      }

      localStorage.setItem("premium_interest_email", email);
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to save your request right now.");
    } finally {
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

        {/* Modal Header */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "36px", marginBottom: "4px" }}>👑</div>
          <h2 className="ink-title" style={{ fontSize: "22px", letterSpacing: "-0.5px" }}>
            Go Premium (Custom Branding & 4K Export)
          </h2>
        </div>

        {/* Modal Content */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p className="ink-body" style={{ fontSize: "14px", textAlign: "center", color: "var(--text-2)" }}>
              Premium features are coming soon. Drop your email below to request early access and get <strong>50% off</strong> when we launch.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
                  <span>🎨</span>
                  <span><strong>Custom Watermark / Logo</strong> (Add your own brand badge)</span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span>🖥️</span>
                  <span><strong>4K Serialization Rendering</strong> (Highest sharpness possible)</span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span>✍️</span>
                  <span><strong>Custom Typography</strong> (Change browser mockup fonts)</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "4px" }}>
              <input
                type="email"
                required
                className="input-field"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              {submitError && (
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
                  {submitError}
                </div>
              )}
              <button
                type="submit"
                className="btn-fill"
                style={{ width: "100%", justifyContent: "center" }}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Get 50% Off At Launch"}
              </button>
              <span style={{ fontSize: "11px", color: "var(--text-3)", textAlign: "center" }}>
                Get BuildrStudio launch updates. No spam.
              </span>
            </div>
          </form>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "center" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "var(--fill)",
                color: "var(--fill-text)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                margin: "0 auto",
              }}
            >
              ✓
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-1)" }}>
                You&apos;re on the list!
              </span>
              <p className="ink-body" style={{ fontSize: "13px", color: "var(--text-2)" }}>
                We have saved your email (<strong>{email}</strong>). We will send your <strong>50% discount code</strong> as soon as these features launch.
              </p>
            </div>
            <button
              type="button"
              className="btn-outline btn-sm"
              onClick={onClose}
              style={{ alignSelf: "center", marginTop: "8px" }}
            >
              Close
            </button>
          </div>
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

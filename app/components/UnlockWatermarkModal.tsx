"use client";

import { useEffect } from "react";
import { track } from "@/app/lib/track";

interface UnlockWatermarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
  onOpenPremium: () => void;
}

export default function UnlockWatermarkModal({
  isOpen,
  onClose,
  onUnlock,
  onOpenPremium,
}: UnlockWatermarkModalProps) {
  useEffect(() => {
    if (isOpen) track("watermark_modal_open");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTweetUnlock = () => {
    const text = encodeURIComponent(
      "Design beautiful screenshots and social graphics in seconds with BuildrStudio! 🚀✨\n"
    );
    const url = encodeURIComponent("https://buildrstudio.in");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    onUnlock();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
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
          maxWidth: "460px",
          padding: "32px",
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
          <div style={{ fontSize: "36px", marginBottom: "4px" }}>🔓</div>
          <h2 className="ink-title" style={{ fontSize: "20px", letterSpacing: "-0.5px" }}>
            Remove Watermark for Free!
          </h2>
          <p className="ink-body" style={{ fontSize: "14px", color: "var(--text-2)", marginTop: "4px" }}>
            Support BuildrStudio! Share a tweet about us on X to instantly unlock watermark-free exports for the next <strong>24 hours</strong>.
          </p>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
          <button
            type="button"
            className="btn-fill"
            onClick={handleTweetUnlock}
            style={{
              width: "100%",
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            <span>🐦</span> Tweet to Unlock (Free for 24h)
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "8px 0",
              position: "relative",
            }}
          >
            <div style={{ width: "100%", height: "1px", background: "var(--border)" }} />
            <span
              style={{
                position: "absolute",
                background: "var(--surface)",
                padding: "0 10px",
                fontSize: "11px",
                color: "var(--text-3)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              or
            </span>
          </div>

          <button
            type="button"
            className="btn-outline"
            onClick={onOpenPremium}
            style={{
              width: "100%",
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            <span>👑</span> Upgrade to Pro (Permanent)
          </button>

          <span
            style={{
              fontSize: "11px",
              color: "var(--text-3)",
              textAlign: "center",
              lineHeight: 1.4,
              marginTop: "4px",
            }}
          >
            After tweeting, you will instantly get clean exports. No verification required!
          </span>
        </div>
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

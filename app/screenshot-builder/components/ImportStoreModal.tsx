"use client";

import { useState } from "react";
import type { BuilderConfig } from "../lib/deviceSpecs";
import { DEFAULT_CONFIG } from "../lib/deviceSpecs";

interface ImportStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (screens: BuilderConfig[], screenshots: string[]) => void;
}

export default function ImportStoreModal({ isOpen, onClose, onImport }: ImportStoreModalProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleImport = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/import-store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");

      const screens: BuilderConfig[] = data.screens.map((s: { headline: string; subtext: string }, i: number) => {
        const rawUrl = data.appInfo.screenshots?.[i];
        const proxiedUrl = rawUrl ? `/api/proxy-image?url=${encodeURIComponent(rawUrl)}` : null;
        return {
          ...DEFAULT_CONFIG,
          headline: s.headline,
          subtext: s.subtext,
          gradientPreset: data.gradient,
          deviceId: data.platform === "android" ? "android-phone" as const : "iphone-67" as const,
          screenshotUrl: proxiedUrl,
        };
      });

      onImport(screens, data.appInfo.screenshots || []);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "rgba(10,10,10,0.5)", backdropFilter: "blur(8px)",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <div
        className="card-default"
        style={{
          width: "90%", maxWidth: "480px", padding: "32px",
          display: "flex", flexDirection: "column", gap: "20px",
          animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            Import from App Store
          </h2>
          <p style={{ margin: "6px 0 0", fontSize: "13px", color: "var(--text-3)", lineHeight: 1.5 }}>
            Paste your App Store or Play Store URL. We'll pull your app info, screenshots, and generate marketing copy automatically.
          </p>
        </div>

        <div>
          <input
            type="url"
            className="input-field"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://apps.apple.com/app/your-app/id123456789"
            style={{ fontSize: "13px", padding: "10px 12px", width: "100%" }}
            onKeyDown={(e) => e.key === "Enter" && handleImport()}
          />
          <p style={{ margin: "6px 0 0", fontSize: "11px", color: "var(--text-3)" }}>
            Supports: apps.apple.com and play.google.com URLs
          </p>
        </div>

        {error && (
          <p style={{ fontSize: "12px", color: "var(--error, #ef4444)", margin: 0 }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-outline btn-sm"
            style={{ cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={loading || !url.trim()}
            className="btn-fill btn-sm"
            style={{
              cursor: loading ? "not-allowed" : "pointer",
              opacity: !url.trim() ? 0.5 : 1,
              display: "flex", gap: "6px", alignItems: "center",
            }}
          >
            {loading ? "Importing..." : "Import & Generate"}
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

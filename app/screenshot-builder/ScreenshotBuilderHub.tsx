"use client";

// ─── ScreenshotBuilderHub.tsx ────────────────────────────────────────────────
// The core page manager for the App Store / Play Store Screenshot Builder.
// Holds state, coordinates export triggers, and renders the header + workspace.

import React, { useState, useRef } from "react";
import type { BuilderConfig } from "./lib/deviceSpecs";
import { DEFAULT_CONFIG } from "./lib/deviceSpecs";
import BuilderSidebar from "./components/BuilderSidebar";
import BuilderCanvas, { BuilderCanvasHandle } from "./components/BuilderCanvas";
import PremiumModal from "../components/PremiumModal";
import AppHeader from "../components/AppHeader";

export default function ScreenshotBuilderHub() {
  const [config, setConfig] = useState<BuilderConfig>(DEFAULT_CONFIG);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const canvasRef = useRef<BuilderCanvasHandle>(null);

  const handleExport = () => {
    if (canvasRef.current) {
      canvasRef.current.exportPng().catch((err) => {
        console.error("Export failed:", err);
      });
    }
  };

  const handleCopy = () => {
    if (canvasRef.current) {
      canvasRef.current.copyToClipboard().then(() => {
        alert("Copied PNG image to clipboard!");
      }).catch((err) => {
        console.error("Copy failed:", err);
      });
    }
  };

  return (
    <div className="workspace-root">
      <AppHeader activeRoute="screenshot-builder" onOpenPremium={() => setIsPremiumOpen(true)} />

      {/* ── BODY ── */}
      <div className="workspace-body">
        {/* Left config sidebar */}
        <BuilderSidebar
          config={config}
          setConfig={setConfig}
          onExport={handleExport}
          onCopy={handleCopy}
        />

        {/* Right canvas live preview */}
        <BuilderCanvas ref={canvasRef} config={config} />
      </div>

      {/* Premium modal */}
      <PremiumModal isOpen={isPremiumOpen} onClose={() => setIsPremiumOpen(false)} />
    </div>
  );
}

"use client";

// ─── ScreenshotBuilderHub.tsx ────────────────────────────────────────────────
// The core page manager for the App Store / Play Store Screenshot Builder.
// Holds state, coordinates export triggers, and renders the header + workspace.

import React, { useState, useRef } from "react";
import Link from "next/link";
import type { BuilderConfig } from "./lib/deviceSpecs";
import { DEFAULT_CONFIG } from "./lib/deviceSpecs";
import BuilderSidebar from "./components/BuilderSidebar";
import BuilderCanvas, { BuilderCanvasHandle } from "./components/BuilderCanvas";
import PremiumModal from "../components/PremiumModal";
import ThemeToggle from "../components/ThemeToggle";

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
      {/* ── HEADER ── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
          height: "54px",
          flexShrink: 0,
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          id="site-logo-link"
          style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "var(--fill)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: "var(--fill-text)",
              fontWeight: 800,
            }}
          >
            B
          </div>
          <span
            style={{
              fontSize: "16px",
              fontWeight: 800,
              color: "var(--text-1)",
              letterSpacing: "-0.4px",
            }}
          >
            BuildrStudio
          </span>
        </Link>

        {/* Visually hidden h1 for SEO */}
        <h1
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0,0,0,0)",
            whiteSpace: "nowrap",
            borderWidth: 0,
          }}
        >
          App Store Screenshot Builder — BuildrStudio
        </h1>

        {/* Center Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-1)" }}>
            App Store Screenshot Builder
          </span>
          <span className="badge-pill" style={{ fontSize: "9px" }}>
            Beta
          </span>
        </div>

        {/* Navigation & Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {[
            { href: "/",           label: "Optimizer" },
            { href: "/showcase",   label: "Showcase" },
            { href: "/roadmap",    label: "Roadmap" },
            { href: "/change-log", label: "Changelog" },
          ].map((n) => (
            <Link
              key={n.href}
              href={n.href}
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--text-2)",
                padding: "6px 10px",
                borderRadius: "var(--r-sm)",
                transition: "all .12s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--fill-subtle)";
                e.currentTarget.style.color = "var(--text-1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--text-2)";
              }}
            >
              {n.label}
            </Link>
          ))}
          <div
            style={{ width: "1px", height: "18px", background: "var(--border)", margin: "0 4px" }}
          />
          <button
            id="header-go-pro-btn"
            type="button"
            onClick={() => setIsPremiumOpen(true)}
            className="btn-fill btn-sm"
            style={{
              fontWeight: 700,
              fontSize: "11px",
              cursor: "pointer",
              border: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            👑 Go Pro
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="workspace-body" style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
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

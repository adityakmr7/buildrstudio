"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { domToPng } from "modern-screenshot";
import { OptimizationConfig } from "./WorkspaceHub";

interface LivePreviewCanvasProps {
  config: OptimizationConfig;
  imageSource: string | null;
  setImageSource: React.Dispatch<React.SetStateAction<string | null>>;
  onOpenPremium: () => void;
}

const gradientNameMapping: { [key: string]: string } = {
  "bg-gradient-to-tr from-orange-400 via-pink-500 to-indigo-600": "Sunset",
  "bg-gradient-to-tr from-purple-900 via-indigo-950 to-slate-900": "Midnight Cyber",
  "bg-gradient-to-tr from-sky-400 to-emerald-600": "Ocean",
  "bg-gradient-to-tr from-teal-400 to-emerald-700": "Emerald Mist",
  "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500": "Neon Synth",
  "bg-gradient-to-tr from-slate-100 to-slate-200": "Minimalist Light",
  "bg-gradient-to-tr from-neutral-800 to-neutral-950": "Minimalist Dark",
  "bg-gradient-to-tr from-yellow-200 via-pink-500 to-red-500": "Cyberpunk",
};

interface UmamiWindow extends Window {
  umami?: {
    track: (eventName: string, eventData?: Record<string, string | number | boolean>) => void;
  };
}

export default function LivePreviewCanvas({
  config,
  imageSource,
  setImageSource,
  onOpenPremium,
}: LivePreviewCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Handle image file capture
  const handleFileCapture = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const transientUrl = URL.createObjectURL(file);
    setImageSource(transientUrl);
  }, [setImageSource]);

  // Clipboard Paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleFileCapture(file);
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handleFileCapture]);

  // Drag-and-drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileCapture(file);
    }
  };

  // Trigger input selection
  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileCapture(file);
    }
  };

  // Canvas Serialization Export
  const handleExport = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);

    try {
      // Small timeout to allow state changes (if any) to commit
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvasDataStream = await domToPng(canvasRef.current, {
        quality: 1,
        scale: 2, // Sharp high-res multiplier
      });

      const triggerLink = document.createElement("a");
      triggerLink.download = `buildrstudio-render-${Date.now()}.png`;
      triggerLink.href = canvasDataStream;
      triggerLink.click();
      triggerLink.remove();

      // Trigger Umami Analytics Event
      const umamiWindow = typeof window !== "undefined" ? (window as unknown as UmamiWindow) : null;
      if (umamiWindow && umamiWindow.umami) {
        umamiWindow.umami.track("image_exported", {
          ratio: config.aspectRatio,
          theme: gradientNameMapping[config.gradientClass] || "Custom",
        });
      }
    } catch (executionError) {
      console.error("Critical rendering pipeline termination:", executionError);
    } finally {
      setIsExporting(false);
    }
  };

  // Clear loaded image
  const handleClear = () => {
    setImageSource(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Visual Canvas State Panel */}
      {!imageSource ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleSelectClick}
          className="card-default"
          style={{
            height: "400px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: isDragging
              ? "2px dashed var(--text-1)"
              : "2px dashed var(--border-strong)",
            background: isDragging ? "var(--fill-subtle)" : "var(--surface)",
            transition: "all 0.2s ease",
            gap: "16px",
            textAlign: "center",
            padding: "24px",
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/*"
            style={{ display: "none" }}
          />

          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "var(--fill-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            📸
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-1)" }}>
              Ingest your screenshot
            </span>
            <p style={{ fontSize: "13px", color: "var(--text-3)", maxWidth: "280px" }}>
              Drag & drop here, click to browse, or paste anywhere from clipboard (Cmd+V).
            </p>
          </div>

          <button
            type="button"
            className="btn-outline btn-sm"
            style={{ pointerEvents: "none", marginTop: "8px" }}
          >
            Select Image
          </button>
        </div>
      ) : (
        <>
          {/* Active Canvas Block */}
          <div
            style={{
              background: "var(--surface-3)",
              borderRadius: "var(--r-2xl)",
              border: "1px solid var(--border)",
              padding: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {/* The actual serializable container */}
            <div
              ref={canvasRef}
              className={`canvas-capture-wrapper relative overflow-hidden ${config.gradientClass} ${config.aspectRatio}`}
              style={{
                width: "100%",
                padding: `${config.padding}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Screenshot nested inside premium browser mockup frame */}
              <div
                className={`${config.borderRadius} ${config.dropShadow} overflow-hidden`}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  width: "100%",
                  maxHeight: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Mockup Window Header Control Bar */}
                <div
                  style={{
                    height: "30px",
                    background: "var(--surface-2)",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 12px",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#FF5F56",
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#FFBD2E",
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#27C93F",
                      display: "inline-block",
                    }}
                  />
                </div>

                {/* Main Screenshot Box */}
                <div
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--surface)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSource}
                    alt="Screenshot source"
                    style={{
                      width: "100%",
                      height: "100%",
                      maxHeight: config.aspectRatio === "aspect-square" ? "360px" : "320px",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>
              </div>

              {/* Watermark Layer (Clickable for Pro Upgrade Modal) */}
              <div
                className="badge-dark"
                style={{
                  position: "absolute",
                  bottom: "16px",
                  right: "16px",
                  fontSize: "11px",
                  fontWeight: 600,
                  opacity: 0.9,
                  zIndex: 10,
                  padding: "4px 10px",
                  userSelect: "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onClick={onOpenPremium}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                title="Upgrade to Pro to remove watermark"
              >
                via buildrStudio.in 👑
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button type="button" className="btn-ghost" onClick={handleClear}>
              Change Screenshot
            </button>

            <button
              type="button"
              className="btn-fill btn-lg"
              onClick={handleExport}
              disabled={isExporting}
              style={{
                minWidth: "160px",
                opacity: isExporting ? 0.75 : 1,
                cursor: isExporting ? "not-allowed" : "pointer",
              }}
            >
              {isExporting ? (
                <>
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      border: "2px solid var(--fill-text)",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 1s linear infinite",
                      marginRight: "4px",
                    }}
                  />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <span>📥</span>
                  <span>Export PNG</span>
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* Spinner animation keyframe injected locally */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

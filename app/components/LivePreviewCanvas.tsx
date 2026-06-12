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
  const [isCopying, setIsCopying] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  const [shareToast, setShareToast] = useState<{ show: boolean; platform: string } | null>(null);

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

  // Copy PNG to Clipboard
  const handleCopyToClipboard = async () => {
    if (!canvasRef.current) return;
    setIsCopying(true);
    setCopyStatus("idle");
    try {
      // Return a Promise directly in ClipboardItem to satisfy browser user activation checks (especially Safari/Chrome)
      const blobPromise = (async () => {
        const canvasDataStream = await domToPng(canvasRef.current!, {
          quality: 1,
          scale: 2,
        });
        const response = await fetch(canvasDataStream);
        return await response.blob();
      })();

      const clipboardItem = new ClipboardItem({
        "image/png": blobPromise as unknown as Blob,
      });

      await navigator.clipboard.write([clipboardItem]);
      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 2000);

      // Trigger Umami Event for Clipboard Copy
      const umamiWindow = typeof window !== "undefined" ? (window as unknown as UmamiWindow) : null;
      if (umamiWindow && umamiWindow.umami) {
        umamiWindow.umami.track("image_copied", {
          ratio: config.aspectRatio,
          theme: gradientNameMapping[config.gradientClass] || "Custom",
        });
      }
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } finally {
      setIsCopying(false);
    }
  };

  const shareToTwitter = () => {
    setShareToast({ show: true, platform: "X (Twitter)" });
    
    // Copy in the background
    handleCopyToClipboard();
    
    // Open X composer synchronously so browser doesn't block popup
    const tweetText = encodeURIComponent("Just optimized a screenshot for social using BuildrStudio! ✨ (Press Cmd+V to paste the image)\n\n");
    const tweetUrl = encodeURIComponent("https://buildrstudio.in");
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`, "_blank");
    
    setTimeout(() => {
      setShareToast(null);
    }, 3000);
  };

  const shareToLinkedIn = () => {
    setShareToast({ show: true, platform: "LinkedIn" });
    
    // Copy in the background
    handleCopyToClipboard();
    
    // Open LinkedIn feed directly so the user can paste the image in the composer
    window.open("https://www.linkedin.com/feed/", "_blank");
    
    setTimeout(() => {
      setShareToast(null);
    }, 3000);
  };

  const shareNative = async () => {
    if (!canvasRef.current) return;
    try {
      const canvasDataStream = await domToPng(canvasRef.current, {
        quality: 1,
        scale: 2,
      });
      const response = await fetch(canvasDataStream);
      const imageBlob = await response.blob();
      const file = new File([imageBlob], "buildrstudio-social-post.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "BuildrStudio Social Graphic",
          text: "Optimized screenshot via buildrStudio.in",
        });
      }
    } catch (err) {
      console.log("Native share cancelled or failed:", err);
    }
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
                maxWidth: config.aspectRatio === "aspect-video" ? "640px" : config.aspectRatio === "aspect-[4/5]" ? "400px" : "480px",
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
          <div className="canvas-action-buttons" style={{ display: "flex", gap: "12px", justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button type="button" className="btn-ghost" onClick={handleClear}>
              Change Screenshot
            </button>

            <button
              type="button"
              className="btn-outline btn-lg"
              onClick={handleCopyToClipboard}
              disabled={isCopying}
              style={{
                minWidth: "160px",
                opacity: isCopying ? 0.75 : 1,
                cursor: isCopying ? "not-allowed" : "pointer",
              }}
            >
              {isCopying ? "Copying..." : copyStatus === "success" ? "✓ Copied!" : copyStatus === "error" ? "❌ Error" : "📋 Copy to Clipboard"}
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

          {/* Quick Share & Engagement Panel */}
          <div
            className="comp-block"
            style={{
              marginTop: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="comp-label" style={{ marginBottom: "4px" }}>Share & Engagement</div>
            <div className="share-buttons-container" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <button
                type="button"
                className="btn-outline btn-sm"
                onClick={shareToTwitter}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span>🐦</span> Post on X (Twitter)
              </button>
              <button
                type="button"
                className="btn-outline btn-sm"
                onClick={shareToLinkedIn}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span>💼</span> Share on LinkedIn
              </button>
              {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                <button
                  type="button"
                  className="btn-outline btn-sm"
                  onClick={shareNative}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span>📤</span> System Share
                </button>
              )}
            </div>
            <p style={{ fontSize: "11px", color: "var(--text-3)", margin: 0, lineHeight: 1.4 }}>
              💡 <strong>Pro Tip:</strong> When you click <em>Post on X</em> or <em>Share on LinkedIn</em>, we copy the visual graphic directly to your clipboard automatically. Just press <strong>Cmd+V</strong> in the composer to attach it!
            </p>
          </div>
        </>
      )}

      {shareToast && shareToast.show && (
        <div
          style={{
            position: "fixed",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--fill)",
            color: "var(--fill-text)",
            padding: "16px 24px",
            borderRadius: "var(--r-xl)",
            boxShadow: "var(--shadow-lg)",
            zIndex: 2000,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "380px",
            width: "calc(100% - 40px)",
            animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>📋</span>
            <strong style={{ fontSize: "14px" }}>Image Copied to Clipboard!</strong>
          </div>
          <span style={{ fontSize: "12px", opacity: 0.9, lineHeight: 1.4 }}>
            Opening {shareToast.platform}... {shareToast.platform === "LinkedIn" ? "Click 'Start a post' and press " : "Just press "}<strong>Cmd+V</strong> (or <strong>Ctrl+V</strong>) to paste your post graphic!
          </span>
        </div>
      )}

      {/* Spinner animation keyframe injected locally */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

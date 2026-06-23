"use client";

// ─── ScreenshotBuilderHub.tsx ────────────────────────────────────────────────
// The core page manager for the App Store / Play Store Screenshot Builder.
// Holds state, coordinates export triggers, and renders the header + workspace.

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import type { BuilderConfig } from "./lib/deviceSpecs";
import { DEFAULT_CONFIG } from "./lib/deviceSpecs";
import BuilderSidebar from "./components/BuilderSidebar";
import BuilderCanvas, { BuilderCanvasHandle } from "./components/BuilderCanvas";
import PremiumModal from "../components/PremiumModal";
import AppHeader from "../components/AppHeader";
import UnlockWatermarkModal from "../components/UnlockWatermarkModal";
import { useToast } from "../components/Toast";

export default function ScreenshotBuilderHub() {
  const { data: session } = useSession();
  const [deck, setDeck] = useState<{
    screens: BuilderConfig[];
    activeScreenIndex: number;
  }>({
    screens: [
      {
        ...DEFAULT_CONFIG,
        headline: "Your App. Your Story.",
        subtext: "Download on the App Store today.",
      },
      {
        ...DEFAULT_CONFIG,
        headline: "Advanced Features",
        subtext: "Powerful tools at your fingertips.",
      },
      {
        ...DEFAULT_CONFIG,
        headline: "Beautiful Mockups",
        subtext: "Generated instantly in high-res.",
      },
    ],
    activeScreenIndex: 0,
  });
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isWatermarkUnlocked, setIsWatermarkUnlocked] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<BuilderCanvasHandle>(null);
  const { toast } = useToast();

  // Undo/redo history
  const historyRef = useRef<{ screens: BuilderConfig[]; activeScreenIndex: number }[]>([]);
  const futureRef = useRef<{ screens: BuilderConfig[]; activeScreenIndex: number }[]>([]);
  const lastSnapshotRef = useRef<string>("");

  const pushHistory = useCallback((snapshot: { screens: BuilderConfig[]; activeScreenIndex: number }) => {
    const key = JSON.stringify(snapshot.screens.map(s => ({ ...s, screenshotUrl: null })));
    if (key === lastSnapshotRef.current) return;
    lastSnapshotRef.current = key;
    historyRef.current.push(snapshot);
    if (historyRef.current.length > 50) historyRef.current.shift();
    futureRef.current = [];
  }, []);

  const undo = useCallback(() => {
    if (historyRef.current.length === 0) return;
    const prev = historyRef.current.pop()!;
    setDeck(current => {
      futureRef.current.push({ screens: current.screens, activeScreenIndex: current.activeScreenIndex });
      return prev;
    });
    lastSnapshotRef.current = "";
  }, []);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current.pop()!;
    setDeck(current => {
      historyRef.current.push({ screens: current.screens, activeScreenIndex: current.activeScreenIndex });
      return next;
    });
    lastSnapshotRef.current = "";
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const tag = (e.target as HTMLElement)?.tagName;
      const isEditable = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;
      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault();
        redo();
        return;
      }
      if (isEditable) return;
      if (e.key === "s") {
        e.preventDefault();
        handleExport();
      }
      if (e.key === "c" && e.shiftKey) {
        e.preventDefault();
        handleCopy();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  useEffect(() => {
    if (session?.user?.isPro) {
      setIsWatermarkUnlocked(true);
      return;
    }
    const checkUnlock = () => {
      const untilStr = localStorage.getItem("watermark_unlocked_until");
      if (untilStr) {
        const until = parseInt(untilStr, 10);
        if (until > Date.now()) {
          setIsWatermarkUnlocked(true);
        } else {
          localStorage.removeItem("watermark_unlocked_until");
          setIsWatermarkUnlocked(false);
        }
      } else {
        setIsWatermarkUnlocked(false);
      }
    };
    checkUnlock();
    window.addEventListener("focus", checkUnlock);
    return () => window.removeEventListener("focus", checkUnlock);
  }, [session?.user?.isPro]);

  const handleUnlockWatermark = () => {
    const unlockedUntil = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem("watermark_unlocked_until", unlockedUntil.toString());
    setIsWatermarkUnlocked(true);
  };

  const screens = deck.screens;
  const activeScreenIndex = deck.activeScreenIndex;
  const activeScreenConfig = screens[activeScreenIndex] || DEFAULT_CONFIG;

  const handleExport = () => {
    if (!canvasRef.current || isExporting) return;
    setIsExporting(true);
    canvasRef.current.exportPng().then(() => {
      toast("Screenshot exported!", "success", {
        label: "Share on X",
        onClick: () => {
          const text = encodeURIComponent("Just built these App Store screenshots in seconds with @BuildrStudio!\n");
          const url = encodeURIComponent("https://buildrstudio.in/screenshot-builder");
          window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
        },
      });
    }).catch((err) => {
      console.error("Export failed:", err);
      toast("Export failed — please try again", "error");
    }).finally(() => setIsExporting(false));
  };

  const handleExportAll = async () => {
    if (!canvasRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const originalIdx = deck.activeScreenIndex;

      for (let i = 0; i < deck.screens.length; i++) {
        setDeck(prev => ({ ...prev, activeScreenIndex: i }));
        // Wait for canvas to re-render with new config
        await new Promise(r => setTimeout(r, 300));
        const dataUrl = await canvasRef.current!.getCapture();
        const base64 = dataUrl.split(",")[1];
        zip.file(`screen-${i + 1}.png`, base64, { base64: true });
        toast(`Exporting screen ${i + 1}/${deck.screens.length}...`, "info");
      }

      setDeck(prev => ({ ...prev, activeScreenIndex: originalIdx }));
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `buildrstudio-screenshots.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
      toast(`All ${deck.screens.length} screens exported as ZIP!`, "success");
    } catch (err) {
      console.error("Batch export failed:", err);
      toast("Batch export failed — please try again", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = () => {
    if (canvasRef.current) {
      canvasRef.current.copyToClipboard().then(() => {
        toast("Copied to clipboard!", "success");
      }).catch((err) => {
        console.error("Copy failed:", err);
        toast("Copy failed — try exporting instead", "error");
      });
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setDeck((prev) => {
      const updated = [...prev.screens];
      const activeIdx = prev.activeScreenIndex;
      if (updated[activeIdx]) {
        updated[activeIdx] = {
          ...updated[activeIdx],
          screenshotUrl: url,
        };
      }
      return {
        ...prev,
        screens: updated,
      };
    });
  };

  // Bind global drag-and-drop and paste events
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const f = items[i].getAsFile();
          if (f) handleFile(f);
        }
      }
    };

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const f = files[0];
        if (f.type.startsWith("image/")) {
          handleFile(f);
        }
      }
    };

    window.addEventListener("paste", onPaste);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("drop", onDrop);

    return () => {
      window.removeEventListener("paste", onPaste);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("drop", onDrop);
    };
  }, [activeScreenIndex]);

  // Dominant color auto-extraction from screenshot
  useEffect(() => {
    const url = activeScreenConfig.screenshotUrl;
    if (!url) return;

    const extractColors = async () => {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          canvas.width = 30;
          canvas.height = 30;
          ctx.drawImage(img, 0, 0, 30, 30);

          const data = ctx.getImageData(0, 0, 30, 30).data;
          const colorCount: Record<string, number> = {};

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i+1];
            const b = data[i+2];
            const a = data[i+3];
            if (a < 200) continue;

            const qr = Math.round(r / 20) * 20;
            const qg = Math.round(g / 20) * 20;
            const qb = Math.round(b / 20) * 20;
            const hex = "#" + ((1 << 24) + (qr << 16) + (qg << 8) + qb).toString(16).slice(1);
            colorCount[hex] = (colorCount[hex] || 0) + 1;
          }

          const sorted = Object.entries(colorCount)
            .sort((a, b) => b[1] - a[1])
            .map((x) => x[0]);

          if (sorted.length > 0) {
            const dominantColor =
              sorted.find((c) => {
                const r = parseInt(c.slice(1, 3), 16);
                const g = parseInt(c.slice(3, 5), 16);
                const b = parseInt(c.slice(5, 7), 16);
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                return brightness > 30 && brightness < 225;
              }) || sorted[0];

            if (dominantColor) {
              setDeck((prev) => {
                const updated = [...prev.screens];
                const activeIdx = prev.activeScreenIndex;
                const active = updated[activeIdx];
                if (
                  active &&
                  active.bgType === "solid" &&
                  (active.solidColor === "#0f172a" || active.solidColor === "#6366f1")
                ) {
                  const nextActive = { ...active, solidColor: dominantColor };
                  updated[activeIdx] = nextActive;

                  // Propagate to other screens if autoSyncTheme is active
                  if (nextActive.autoSyncTheme) {
                    const synced = updated.map((scr, idx) => {
                      if (idx === activeIdx) return scr;
                      return { ...scr, solidColor: dominantColor };
                    });
                    return {
                      ...prev,
                      screens: synced,
                    };
                  }
                  return {
                    ...prev,
                    screens: updated,
                  };
                }
                return prev;
              });
            }
          }
        };
        img.src = url;
      } catch (err) {
        console.warn("Color extraction failed:", err);
      }
    };

    extractColors();
  }, [activeScreenConfig.screenshotUrl, activeScreenIndex]);

  const handleSetSingleConfig = (
    updateFnOrVal: React.SetStateAction<BuilderConfig>
  ) => {
    setDeck((prev) => {
      pushHistory({ screens: prev.screens, activeScreenIndex: prev.activeScreenIndex });
      const updatedScreens = [...prev.screens];
      const activeIdx = prev.activeScreenIndex;
      const current = updatedScreens[activeIdx] || DEFAULT_CONFIG;
      const next = typeof updateFnOrVal === "function"
        ? (updateFnOrVal as (p: BuilderConfig) => BuilderConfig)(current)
        : updateFnOrVal;

      updatedScreens[activeIdx] = next;

      // Sync theme properties if autoSyncTheme is enabled
      if (next.autoSyncTheme) {
        const themeKeys: Array<keyof BuilderConfig> = [
          "bgType",
          "gradientPreset",
          "gradientDir",
          "solidColor",
          "meshColor1",
          "meshColor2",
          "meshColor3",
          "meshColor4",
          "frameMode",
          "frameVisible",
          "frameShadow",
          "headlineColor",
          "subtextColor",
          "headlineSize",
          "subtextSize",
          "deviceId",
        ];

        const syncedScreens = updatedScreens.map((scr, idx) => {
          if (idx === activeIdx) return scr;
          const merged = { ...scr };
          themeKeys.forEach((key) => {
            if (next[key] !== current[key]) {
              (merged as any)[key] = next[key];
            }
          });
          return merged;
        });

        return {
          ...prev,
          screens: syncedScreens,
        };
      }

      return {
        ...prev,
        screens: updatedScreens,
      };
    });
  };

  const handleAddScreen = () => {
    setDeck((prev) => {
      const active = prev.screens[prev.activeScreenIndex] || DEFAULT_CONFIG;
      const newScreen: BuilderConfig = {
        ...DEFAULT_CONFIG,
        bgType: active.bgType,
        gradientPreset: active.gradientPreset,
        gradientDir: active.gradientDir,
        solidColor: active.solidColor,
        meshColor1: active.meshColor1,
        meshColor2: active.meshColor2,
        meshColor3: active.meshColor3,
        meshColor4: active.meshColor4,
        frameMode: active.frameMode,
        frameVisible: active.frameVisible,
        frameShadow: active.frameShadow,
        headlineColor: active.headlineColor,
        subtextColor: active.subtextColor,
        headlineSize: active.headlineSize,
        subtextSize: active.subtextSize,
        deviceId: active.deviceId,
        autoSyncTheme: active.autoSyncTheme,
        headline: `Screen ${prev.screens.length + 1}`,
        subtext: "Highlight key feature here.",
      };
      return {
        screens: [...prev.screens, newScreen],
        activeScreenIndex: prev.screens.length,
      };
    });
  };

  const handleDuplicateScreen = (idx: number) => {
    setDeck((prev) => {
      const target = prev.screens[idx];
      if (!target) return prev;
      const duplicated = { ...target };
      const updated = [...prev.screens];
      updated.splice(idx + 1, 0, duplicated);
      return {
        screens: updated,
        activeScreenIndex: idx + 1,
      };
    });
  };

  const handleDeleteScreen = (idx: number) => {
    if (deck.screens.length <= 1) {
      toast("You must keep at least one screen", "info");
      return;
    }
    setDeck((prev) => {
      const updated = prev.screens.filter((_, i) => i !== idx);
      let nextActive = prev.activeScreenIndex;
      if (idx === prev.activeScreenIndex) {
        nextActive = Math.max(0, idx - 1);
      } else if (idx < prev.activeScreenIndex) {
        nextActive = prev.activeScreenIndex - 1;
      }
      return {
        screens: updated,
        activeScreenIndex: nextActive,
      };
    });
  };

  const handleMoveScreen = (idx: number, direction: "left" | "right") => {
    const targetIdx = direction === "left" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= deck.screens.length) return;
    setDeck((prev) => {
      const updated = [...prev.screens];
      const temp = updated[idx];
      updated[idx] = updated[targetIdx];
      updated[targetIdx] = temp;

      let nextActive = prev.activeScreenIndex;
      if (prev.activeScreenIndex === idx) {
        nextActive = targetIdx;
      } else if (prev.activeScreenIndex === targetIdx) {
        nextActive = idx;
      }

      return {
        screens: updated,
        activeScreenIndex: nextActive,
      };
    });
  };

  return (
    <div className="workspace-root">
      <AppHeader activeRoute="screenshot-builder" onOpenPremium={() => setIsPremiumOpen(true)} />

      {/* ── BODY ── */}
      <div className="workspace-body" style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Left config sidebar */}
        <BuilderSidebar
          config={activeScreenConfig}
          setConfig={handleSetSingleConfig}
          onExport={handleExport}
          onExportAll={handleExportAll}
          onCopy={handleCopy}
          isExporting={isExporting}
          screenCount={deck.screens.length}
          isWatermarkUnlocked={isWatermarkUnlocked}
          onOpenUnlockWatermark={() => setIsUnlockModalOpen(true)}
          onOpenPremium={() => setIsPremiumOpen(true)}
        />

        {/* Right Column: Deck Navigator Strip + Canvas */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            height: "100%",
            minHeight: 0,
            background: "var(--surface-2)",
          }}
        >
          {/* Deck Navigator Strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "10px 20px",
              borderBottom: "1.5px solid var(--border)",
              background: "var(--surface)",
              overflowX: "auto",
              flexShrink: 0,
              scrollbarWidth: "none",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "var(--text-3)",
                letterSpacing: "1px",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Screens ({screens.length})
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {screens.map((scr, idx) => {
                const isActive = idx === activeScreenIndex;

                // Compute swatch
                let bgVal = "#0f172a";
                if (scr.bgType === "gradient") {
                  const p =
                    scr.gradientPreset === "Indigo Dusk"
                      ? { from: "#6366f1", via: "#a855f7", to: "#ec4899" }
                      : scr.gradientPreset === "Ocean Breeze"
                      ? { from: "#0ea5e9", via: "#38bdf8", to: "#7dd3fc" }
                      : scr.gradientPreset === "Sunset Blaze"
                      ? { from: "#f97316", via: "#fb923c", to: "#fbbf24" }
                      : scr.gradientPreset === "Arctic White"
                      ? { from: "#f8fafc", via: "#f1f5f9", to: "#e2e8f0" }
                      : { from: "#111827", via: "#1f2937", to: "#374151" };

                  bgVal = p.via
                    ? `linear-gradient(${scr.gradientDir}, ${p.from}, ${p.via}, ${p.to})`
                    : `linear-gradient(${scr.gradientDir}, ${p.from}, ${p.to})`;
                } else if (scr.bgType === "solid") {
                  bgVal = scr.solidColor;
                } else if (scr.bgType === "mesh") {
                  bgVal = `linear-gradient(135deg, ${scr.meshColor1 || "#6366f1"}, ${scr.meshColor3 || "#ec4899"})`;
                }

                return (
                  <div
                    key={idx}
                    className={`deck-card-container${isActive ? " active-card" : ""}`}
                    onClick={() => setDeck((prev) => ({ ...prev, activeScreenIndex: idx }))}
                    style={{
                      width: "120px",
                      height: "76px",
                      borderRadius: "var(--r-sm)",
                      background: bgVal,
                      border: isActive ? "2px solid var(--fill)" : "1.5px solid var(--border)",
                      position: "relative",
                      cursor: "pointer",
                      padding: "6px 8px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.18)" : "none",
                      transition: "all 0.15s ease",
                      overflow: "hidden",
                    }}
                  >
                    {/* Tiny headline */}
                    <div
                      style={{
                        fontSize: "9px",
                        fontWeight: 800,
                        color: scr.headlineColor || "#fff",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        maxWidth: "100%",
                      }}
                    >
                      {scr.headline || "Blank Screen"}
                    </div>

                    {/* Tiny specs badge */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "8px",
                          fontWeight: 700,
                          color: "#fff",
                          background: "rgba(0,0,0,0.4)",
                          padding: "1px 4px",
                          borderRadius: "3px",
                        }}
                      >
                        S{idx + 1}
                      </span>
                      {scr.panoramic !== "none" && (
                        <span
                          style={{
                            fontSize: "8px",
                            fontWeight: 800,
                            color: "#fde047",
                            background: "rgba(0,0,0,0.5)",
                            padding: "1px 4.5px",
                            borderRadius: "3px",
                          }}
                        >
                          ↔ {scr.panoramic.toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Actions Overlay */}
                    <div
                      className="deck-card-actions"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(15,23,42,0.9)",
                        backdropFilter: "blur(2px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        opacity: 0,
                        transition: "opacity 0.15s ease",
                        zIndex: 10,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeck((prev) => ({ ...prev, activeScreenIndex: idx }));
                      }}
                    >
                      <button
                        title="Move Left"
                        disabled={idx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveScreen(idx, "left");
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: idx === 0 ? "not-allowed" : "pointer",
                          fontSize: "11px",
                          opacity: idx === 0 ? 0.35 : 1,
                        }}
                      >
                        ◀️
                      </button>
                      <button
                        title="Duplicate"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateScreen(idx);
                        }}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "11px" }}
                      >
                        📋
                      </button>
                      <button
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteScreen(idx);
                        }}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "11px" }}
                      >
                        🗑️
                      </button>
                      <button
                        title="Move Right"
                        disabled={idx === screens.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveScreen(idx, "right");
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: idx === screens.length - 1 ? "not-allowed" : "pointer",
                          fontSize: "11px",
                          opacity: idx === screens.length - 1 ? 0.35 : 1,
                        }}
                      >
                        ▶️
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add Screen Button */}
              <button
                type="button"
                onClick={handleAddScreen}
                style={{
                  width: "120px",
                  height: "76px",
                  borderRadius: "var(--r-sm)",
                  border: "1.5px dashed var(--border-strong)",
                  background: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  cursor: "pointer",
                  color: "var(--text-2)",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--text-1)";
                  e.currentTarget.style.color = "var(--text-1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-strong)";
                  e.currentTarget.style.color = "var(--text-2)";
                }}
              >
                <span style={{ fontSize: "18px" }}>➕</span>
                <span style={{ fontSize: "10px", fontWeight: 700 }}>Add Screen</span>
              </button>
            </div>
          </div>

          {/* Right canvas live preview */}
          <BuilderCanvas
            ref={canvasRef}
            config={activeScreenConfig}
            onUpdateConfig={(key, val) => handleSetSingleConfig((prev) => ({ ...prev, [key]: val }))}
            isWatermarkUnlocked={isWatermarkUnlocked}
            onOpenUnlockWatermark={() => setIsUnlockModalOpen(true)}
          />
        </div>
      </div>

      {/* Premium modal */}
      <PremiumModal isOpen={isPremiumOpen} onClose={() => setIsPremiumOpen(false)} />

      <UnlockWatermarkModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        onUnlock={handleUnlockWatermark}
        onOpenPremium={() => {
          setIsUnlockModalOpen(false);
          setIsPremiumOpen(true);
        }}
      />

      <style>{`
        .deck-card-container {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease !important;
        }
        .deck-card-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.16) !important;
          border-color: var(--border-strong) !important;
        }
        .deck-card-container.active-card {
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25), 0 0 0 2px var(--fill) !important;
        }
        .deck-card-container:hover .deck-card-actions {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}

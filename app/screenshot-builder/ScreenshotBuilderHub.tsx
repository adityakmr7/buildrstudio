"use client";

// ─── ScreenshotBuilderHub.tsx ────────────────────────────────────────────────
// The core page manager for the App Store / Play Store Screenshot Builder.
// Holds state, coordinates export triggers, and renders the header + workspace.

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import type { BuilderConfig, DeviceId } from "./lib/deviceSpecs";
import { DEFAULT_CONFIG, APPSTORE_DEVICES, PLAYSTORE_DEVICES, getStoreFilename, getDevice } from "./lib/deviceSpecs";
import BuilderSidebar from "./components/BuilderSidebar";
import BuilderCanvas, { BuilderCanvasHandle } from "./components/BuilderCanvas";
import DeviceFrame from "./components/DeviceFrame";
import PremiumModal from "../components/PremiumModal";
import AppHeader from "../components/AppHeader";
import UnlockWatermarkModal from "../components/UnlockWatermarkModal";
import TemplateGallery from "./components/TemplateGallery";
import ImportStoreModal from "./components/ImportStoreModal";
import PostExportShareModal from "./components/PostExportShareModal";
import OnboardingTour from "../components/OnboardingTour";
import ToolCrossLinks from "../components/ToolCrossLinks";
import { useToast } from "../components/Toast";
import { track } from "@/app/lib/track";

// ── Multi-screen grid view ────────────────────────────────────────────────────

function MultiScreenGrid({
  screens,
  activeIndex,
  onSelectScreen,
  onUpdateConfig,
  isWatermarkUnlocked,
}: {
  screens: BuilderConfig[];
  activeIndex: number;
  onSelectScreen: (idx: number) => void;
  onUpdateConfig: (idx: number, key: keyof BuilderConfig, val: any) => void;
  isWatermarkUnlocked: boolean;
}) {
  const CARD_H = 320;

  function getCardBg(scr: BuilderConfig): string {
    if (scr.bgType === "solid") return scr.solidColor;
    if (scr.bgType === "gradient") {
      const presets: Record<string, { from: string; to: string }> = {
        "Indigo Dusk": { from: "#6366f1", to: "#ec4899" },
        "Ocean Breeze": { from: "#0ea5e9", to: "#7dd3fc" },
        "Sunset Blaze": { from: "#f97316", to: "#fbbf24" },
        "Arctic White": { from: "#f8fafc", to: "#e2e8f0" },
        "Midnight": { from: "#111827", to: "#374151" },
      };
      const p = presets[scr.gradientPreset] ?? { from: "#6366f1", to: "#ec4899" };
      return `linear-gradient(160deg, ${p.from}, ${p.to})`;
    }
    if (scr.bgType === "mesh") {
      return `radial-gradient(ellipse at 0% 0%, ${scr.meshColor1} 0%, transparent 60%), radial-gradient(ellipse at 100% 100%, ${scr.meshColor3} 0%, transparent 60%), ${scr.meshColor4}`;
    }
    return "#0f172a";
  }

  return (
    <div style={{
      flex: 1, minHeight: 0, overflowY: "auto", overflowX: "auto",
      display: "flex", flexWrap: "wrap", gap: "24px",
      padding: "32px", alignContent: "flex-start",
      background: "var(--surface-2)",
    }}>
      {screens.map((scr, idx) => {
        const spec = getDevice(scr.deviceId);
        const scale = CARD_H / spec.canvasH;
        const cardW = spec.canvasW * scale;
        const isActive = idx === activeIndex;

        return (
          <div
            key={idx}
            onClick={() => onSelectScreen(idx)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
              cursor: "pointer", flexShrink: 0,
            }}
          >
            {/* Frame preview */}
            <div style={{
              width: cardW, height: CARD_H,
              borderRadius: 12, overflow: "hidden",
              border: isActive ? "2.5px solid var(--fill)" : "2px solid transparent",
              boxShadow: isActive
                ? "0 0 0 4px var(--fill-subtle), 0 8px 32px var(--shadow-md)"
                : "var(--shadow-md)",
              transition: "all 0.15s ease",
              position: "relative",
            }}>
              {/* Background */}
              <div style={{
                width: spec.canvasW, height: spec.canvasH,
                transform: `scale(${scale})`, transformOrigin: "top left",
                background: getCardBg(scr),
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden",
              }}>
                {/* Headline */}
                {(scr.textPosition === "top") && scr.headline && (
                  <div style={{
                    width: "100%", textAlign: "center", padding: "0.8em 1.2em",
                    fontSize: `${scr.headlineSize}em`, fontWeight: 800,
                    color: scr.headlineColor, lineHeight: 1.1,
                    letterSpacing: "-0.03em", fontFamily: "var(--font)",
                  }}>{scr.headline}</div>
                )}

                {/* Device frame */}
                {scr.frameVisible && (() => {
                  let frameW = 300, frameH = 620;
                  if (spec.frameType === "ipad") { frameW = 300; frameH = 420; }
                  else if (spec.frameType === "android") { frameW = 290; frameH = 600; }
                  else if (spec.frameType === "android-tab") {
                    if (spec.isLandscape) { frameW = 500; frameH = 320; } else { frameW = 320; frameH = 440; }
                  }
                  const targetFrameH = spec.canvasH * 0.65;
                  const fs = targetFrameH / frameH;
                  return (
                    <div style={{ width: frameW * fs, height: frameH * fs, position: "relative", flexShrink: 0 }}>
                      <div style={{ position: "absolute", top: 0, left: 0, width: frameW, height: frameH, transform: `scale(${fs})`, transformOrigin: "top left" }}>
                        <DeviceFrame spec={spec} shadow={scr.frameShadow} imageScale={scr.imageScale} imageOffsetX={scr.imageOffsetX} imageOffsetY={scr.imageOffsetY}>
                          {scr.screenshotUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={scr.screenshotUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : null}
                        </DeviceFrame>
                      </div>
                    </div>
                  );
                })()}

                {/* Bottom headline */}
                {scr.textPosition !== "top" && scr.headline && (
                  <div style={{
                    width: "100%", textAlign: "center", padding: "0.8em 1.2em",
                    fontSize: `${scr.headlineSize}em`, fontWeight: 800,
                    color: scr.headlineColor, lineHeight: 1.1,
                    letterSpacing: "-0.03em", fontFamily: "var(--font)",
                  }}>{scr.headline}</div>
                )}

                {/* Watermark */}
                {!isWatermarkUnlocked && (
                  <div style={{
                    position: "absolute", bottom: 8, right: 10,
                    fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.6)",
                    background: "rgba(0,0,0,0.5)", padding: "3px 8px", borderRadius: "4px",
                    fontFamily: "var(--font)",
                  }}>Made with buildrstudio.in</div>
                )}
              </div>

              {/* Active indicator overlay */}
              {isActive && (
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  border: "2px solid var(--fill)", borderRadius: 10,
                }} />
              )}
            </div>

            {/* Screen label */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: isActive ? "var(--fill)" : "var(--text-2)", fontFamily: "var(--font)" }}>
                Screen {idx + 1}
              </span>
              <span style={{ fontSize: "10px", color: "var(--text-3)", fontFamily: "var(--font)" }}>
                {spec.canvasW} × {spec.canvasH}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Hub ──────────────────────────────────────────────────────────────────

export default function ScreenshotBuilderHub() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
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
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importStoreInitialUrl, setImportStoreInitialUrl] = useState<string | undefined>(undefined);
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; count: number }>({ isOpen: false, count: 1 });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDeckCollapsed, setIsDeckCollapsed] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("Untitled Project");
  const [isSaving, setIsSaving] = useState(false);
  const [savedProjects, setSavedProjects] = useState<{ id: string; name: string; updated_at: string }[]>([]);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
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

  // Load shared deck from URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("deck");
    if (shared) {
      try {
        const decoded = JSON.parse(atob(shared));
        if (Array.isArray(decoded) && decoded.length > 0) {
          setDeck({ screens: decoded.map((s: Partial<BuilderConfig>) => ({ ...DEFAULT_CONFIG, ...s })), activeScreenIndex: 0 });
          toast("Loaded shared deck!", "success");
        }
      } catch { /* ignore invalid */ }
    }
  }, []);

  const handleShareDeck = () => {
    const shareable = deck.screens.map(s => {
      const { screenshotUrl, ...rest } = s;
      return rest;
    });
    const encoded = btoa(JSON.stringify(shareable));
    const url = `${window.location.origin}/screenshot-builder?deck=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      toast("Share link copied to clipboard!", "success");
    }).catch(() => {
      toast("Failed to copy link", "error");
    });
  };

  // Auto-open import modal when ?url= is in the URL (e.g. from landing page hero)
  useEffect(() => {
    const url = searchParams.get("url");
    if (url) {
      setImportStoreInitialUrl(url);
      setIsImportOpen(true);
    }
  }, []);

  // Show template gallery on first visit
  useEffect(() => {
    const visited = localStorage.getItem("buildr_sb_visited");
    if (!visited) {
      setIsTemplateOpen(true);
      localStorage.setItem("buildr_sb_visited", "1");
    }
  }, []);

  const handleApplyTemplate = (screens: BuilderConfig[]) => {
    setDeck({ screens, activeScreenIndex: 0 });
  };

  const handleStoreImport = (screens: BuilderConfig[]) => {
    setDeck({ screens, activeScreenIndex: 0 });
    toast(`Imported ${screens.length} screens from App Store!`, "success");
  };

  const handleSaveProject = async () => {
    if (!session?.user?.id) { toast("Sign in to save projects", "info"); return; }
    setIsSaving(true);
    const config = deck.screens.map(s => ({ ...s, screenshotUrl: null }));
    try {
      if (currentProjectId) {
        await fetch(`/api/projects/${currentProjectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: projectName, config }),
        });
        toast("Project saved!", "success");
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: projectName, tool: "screenshot-builder", config }),
        });
        const data = await res.json();
        setCurrentProjectId(data.project.id);
        toast("Project created!", "success");
      }
    } catch { toast("Failed to save", "error"); }
    finally { setIsSaving(false); }
  };

  const handleLoadProjects = async () => {
    if (!session?.user?.id) { toast("Sign in to load projects", "info"); return; }
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setSavedProjects(data.projects || []);
      setShowProjectMenu(true);
    } catch { toast("Failed to load projects", "error"); }
  };

  const handleOpenProject = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();
      if (data.project) {
        const screens = (data.project.config as BuilderConfig[]).map(s => ({ ...DEFAULT_CONFIG, ...s }));
        setDeck({ screens, activeScreenIndex: 0 });
        setCurrentProjectId(data.project.id);
        setProjectName(data.project.name);
        setShowProjectMenu(false);
        toast(`Opened "${data.project.name}"`, "success");
      }
    } catch { toast("Failed to open project", "error"); }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      setSavedProjects(prev => prev.filter(p => p.id !== projectId));
      if (currentProjectId === projectId) setCurrentProjectId(null);
      toast("Project deleted", "success");
    } catch { toast("Failed to delete", "error"); }
  };

  const handleUnlockWatermark = () => {
    const unlockedUntil = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem("watermark_unlocked_until", unlockedUntil.toString());
    setIsWatermarkUnlocked(true);
    track("watermark_unlocked", { method: "tweet" });
  };

  const screens = deck.screens;
  const activeScreenIndex = deck.activeScreenIndex;
  const activeScreenConfig = screens[activeScreenIndex] || DEFAULT_CONFIG;

  const handleExport = () => {
    if (!canvasRef.current || isExporting) return;
    setIsExporting(true);
    const activeScreen = deck.screens[deck.activeScreenIndex];
    const device = getDevice(activeScreen?.deviceId || "iphone-67");
    const filename = getStoreFilename(device, deck.activeScreenIndex);
    track("export_single", { device: device.id, watermarked: !isWatermarkUnlocked });
    canvasRef.current.exportPng(filename).then(() => {
      setShareModal({ isOpen: true, count: 1 });
    }).catch((err) => {
      console.error("Export failed:", err);
      toast("Export failed. Please try again", "error");
    }).finally(() => setIsExporting(false));
  };

  const handleExportAll = async (smartResize = false) => {
    if (!canvasRef.current || isExporting) return;
    setIsExporting(true);
    track("export_batch", { allSizes: smartResize, screens: deck.screens.length });
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const originalIdx = deck.activeScreenIndex;
      const originalScreens = [...deck.screens];

      const currentPlatform = deck.screens[0]?.deviceId?.startsWith("android") ? "playstore" : "appstore";
      const deviceSizes: DeviceId[] = smartResize
        ? (currentPlatform === "appstore"
          ? APPSTORE_DEVICES.map(d => d.id)
          : PLAYSTORE_DEVICES.map(d => d.id))
        : [deck.screens[0]?.deviceId || "iphone-67"];

      for (const deviceId of deviceSizes) {
        const device = getDevice(deviceId);
        const folder = smartResize ? zip.folder(device.exportFolder)! : zip;

        for (let i = 0; i < originalScreens.length; i++) {
          setDeck(prev => {
            const updated = [...prev.screens];
            updated[i] = { ...originalScreens[i], deviceId };
            return { screens: updated, activeScreenIndex: i };
          });
          await new Promise(r => setTimeout(r, 400));
          const dataUrl = await canvasRef.current!.getCapture();
          const base64 = dataUrl.split(",")[1];
          const filename = getStoreFilename(device, i);
          folder.file(filename, base64, { base64: true });
        }
        if (smartResize) {
          toast(`Exported ${device.label}...`, "info");
        }
      }

      setDeck({ screens: originalScreens, activeScreenIndex: originalIdx });
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = smartResize
        ? `buildrstudio-all-sizes.zip`
        : `buildrstudio-screenshots.zip`;
      a.click();
      URL.revokeObjectURL(a.href);

      const totalFiles = smartResize
        ? deviceSizes.length * originalScreens.length
        : originalScreens.length;
      setShareModal({ isOpen: true, count: totalFiles });
    } catch (err) {
      console.error("Batch export failed:", err);
      toast("Batch export failed. Please try again", "error");
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
        toast("Copy failed. Try exporting instead", "error");
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
      return { ...prev, screens: updated };
    });

    // AI auto-layout (fire and forget, non-blocking)
    if (session?.user?.plan === "ai_pro") {
      const formData = new FormData();
      formData.append("screenshot", file);
      fetch("/api/ai/auto-layout", { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.suggestion) {
            const s = data.suggestion;
            toast("AI suggested a layout, applied!", "success");
            setDeck(prev => {
              const updated = [...prev.screens];
              const idx = prev.activeScreenIndex;
              if (updated[idx]) {
                updated[idx] = {
                  ...updated[idx],
                  headline: s.headline || updated[idx].headline,
                  subtext: s.subtext || updated[idx].subtext,
                  gradientPreset: s.suggestedGradient || updated[idx].gradientPreset,
                  textPosition: s.textPosition === "bottom" ? "bottom" : "top",
                };
              }
              return { ...prev, screens: updated };
            });
          }
        })
        .catch(() => {});
    }
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
          "fontFamily",
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
        {!isSidebarCollapsed && <BuilderSidebar
          config={activeScreenConfig}
          setConfig={handleSetSingleConfig}
          onExport={handleExport}
          onExportAll={() => handleExportAll(false)}
          onExportAllSizes={() => handleExportAll(true)}
          onCopy={handleCopy}
          isExporting={isExporting}
          screenCount={deck.screens.length}
          isWatermarkUnlocked={isWatermarkUnlocked}
          onOpenUnlockWatermark={() => setIsUnlockModalOpen(true)}
          onOpenPremium={() => setIsPremiumOpen(true)}
        />}

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
          {/* ── Toolbar row ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0 16px",
            height: "44px",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
            flexShrink: 0,
          }}>
            {/* Sidebar toggle */}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
              style={{
                background: "none", border: "1px solid var(--border)", borderRadius: "6px",
                width: "28px", height: "28px", display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer", color: "var(--text-2)", flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
            </button>

            <div style={{ width: "1px", height: "20px", background: "var(--border)", flexShrink: 0 }} />

            {/* Project name */}
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              style={{
                background: "transparent", border: "none", fontSize: "13px", fontWeight: 600,
                color: "var(--text-1)", width: "140px", padding: "4px 6px",
                borderRadius: "4px", outline: "none", fontFamily: "var(--font)",
              }}
              onFocus={(e) => { e.currentTarget.style.background = "var(--surface-2, var(--surface))"; }}
              onBlur={(e) => { e.currentTarget.style.background = "transparent"; }}
            />

            <div style={{ flex: 1 }} />

            {/* Grid view toggle */}
            <button
              type="button"
              onClick={() => setIsGridView(v => !v)}
              title={isGridView ? "Single screen view" : "View all screens"}
              style={{
                background: isGridView ? "var(--fill-subtle)" : "none",
                color: isGridView ? "var(--fill)" : "var(--text-2)",
                border: "1px solid var(--border)", borderRadius: "6px",
                width: "28px", height: "28px", display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer", flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="1" width="5" height="5" rx="1"/><rect x="8" y="1" width="5" height="5" rx="1"/>
                <rect x="1" y="8" width="5" height="5" rx="1"/><rect x="8" y="8" width="5" height="5" rx="1"/>
              </svg>
            </button>

            <div style={{ width: "1px", height: "20px", background: "var(--border)", flexShrink: 0 }} />

            {/* Action buttons */}
            {(["Templates", "Import App", "Share"] as const).map((label) => (
              <button
                key={label}
                type="button"
                onClick={label === "Templates" ? () => setIsTemplateOpen(true) : label === "Import App" ? () => setIsImportOpen(true) : handleShareDeck}
                style={{
                  background: "none", color: "var(--text-2)",
                  border: "1px solid var(--border)", borderRadius: "6px",
                  padding: "4px 12px", fontSize: "12px", fontWeight: 500,
                  cursor: "pointer", whiteSpace: "nowrap", height: "28px",
                  display: "flex", alignItems: "center",
                }}
              >
                {label}
              </button>
            ))}

            <div style={{ width: "1px", height: "20px", background: "var(--border)", flexShrink: 0 }} />

            <button
              type="button"
              onClick={handleSaveProject}
              disabled={isSaving}
              style={{
                background: "var(--fill)", color: "var(--fill-text)",
                border: "none", borderRadius: "6px",
                padding: "4px 14px", fontSize: "12px", fontWeight: 600,
                cursor: "pointer", whiteSpace: "nowrap", height: "28px",
                display: "flex", alignItems: "center", opacity: isSaving ? 0.6 : 1,
              }}
            >
              {isSaving ? "Saving..." : currentProjectId ? "Save" : "Save New"}
            </button>
            <button
              type="button"
              onClick={handleLoadProjects}
              style={{
                background: "none", color: "var(--text-2)",
                border: "1px solid var(--border)", borderRadius: "6px",
                padding: "4px 12px", fontSize: "12px", fontWeight: 500,
                cursor: "pointer", whiteSpace: "nowrap", height: "28px",
                display: "flex", alignItems: "center",
              }}
            >
              Open
            </button>
          </div>

          {/* ── Deck strip ── */}
          <div style={{
            borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
            flexShrink: 0,
            overflow: "visible",
          }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: isDeckCollapsed ? "6px 16px" : "10px 16px 8px",
            overflowX: "auto",
            overflowY: "visible",
            scrollbarWidth: "none",
          }}>
            {/* Deck collapse toggle */}
            <button
              type="button"
              onClick={() => setIsDeckCollapsed(!isDeckCollapsed)}
              title={isDeckCollapsed ? "Show screens" : "Hide screens"}
              style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "4px",
                color: "var(--text-3)", padding: "2px 4px", borderRadius: "4px",
                flexShrink: 0,
              }}
            >
              <svg
                width="10" height="10" viewBox="0 0 10 10" fill="none"
                style={{ transform: isDeckCollapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}
              >
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Screens {isDeckCollapsed ? `(${screens.length})` : ""}
              </span>
            </button>

            {isDeckCollapsed ? null : (<>

            {screens.map((scr, idx) => {
              const isActive = idx === activeScreenIndex;
              let bgVal = "#0f172a";
              if (scr.bgType === "gradient") {
                const p = scr.gradientPreset === "Indigo Dusk" ? { from: "#6366f1", to: "#ec4899" }
                  : scr.gradientPreset === "Ocean Breeze" ? { from: "#0ea5e9", to: "#7dd3fc" }
                  : scr.gradientPreset === "Sunset Blaze" ? { from: "#f97316", to: "#fbbf24" }
                  : scr.gradientPreset === "Arctic White" ? { from: "#f8fafc", to: "#e2e8f0" }
                  : { from: "#111827", to: "#374151" };
                bgVal = `linear-gradient(135deg, ${p.from}, ${p.to})`;
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
                    width: "54px",
                    height: "72px",
                    borderRadius: "6px",
                    background: bgVal,
                    border: isActive ? "2px solid var(--fill)" : "1.5px solid var(--border)",
                    position: "relative",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "4px",
                    boxShadow: isActive ? "0 0 0 3px var(--fill-subtle)" : "none",
                    transition: "all 0.15s ease",
                    overflow: "visible",
                    flexShrink: 0,
                  }}
                >
                  {/* Screenshot thumbnail */}
                  <div style={{ position: "absolute", inset: 0, borderRadius: "5px", overflow: "hidden" }}>
                    {scr.screenshotUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={scr.screenshotUrl}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: 0.4,
                        }}
                      />
                    )}
                  </div>

                  {/* Screen number badge */}
                  <span style={{
                    position: "relative",
                    fontSize: "10px", fontWeight: 700,
                    color: "#fff",
                    background: "rgba(0,0,0,0.45)",
                    borderRadius: "3px",
                    padding: "1px 5px",
                    letterSpacing: "0.03em",
                  }}>
                    {idx + 1}
                  </span>

                  {/* Delete button — top-right, visible on hover */}
                  <button
                    className="deck-card-delete"
                    title="Remove screen"
                    onClick={(e) => { e.stopPropagation(); handleDeleteScreen(idx); }}
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-6px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: "var(--destructive)",
                      border: "1.5px solid var(--bg)",
                      color: "#fff",
                      fontSize: "9px",
                      lineHeight: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      opacity: 0,
                      transition: "opacity 0.15s ease",
                      zIndex: 20,
                      padding: 0,
                    }}
                  >
                    <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                      <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              );
            })}

            {/* Add Screen */}
            <button
              type="button"
              onClick={handleAddScreen}
              style={{
                width: "54px", height: "72px",
                borderRadius: "6px",
                border: "1.5px dashed var(--border-strong)",
                background: "transparent",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: "3px", cursor: "pointer", color: "var(--text-3)",
                transition: "all 0.15s ease", flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--fill)"; e.currentTarget.style.color = "var(--fill)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--text-3)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.04em" }}>ADD</span>
            </button>
          </>)}
          </div>
          </div>

          {/* Canvas area — single or grid view */}
          {isGridView ? (
            <MultiScreenGrid
              screens={screens}
              activeIndex={activeScreenIndex}
              onSelectScreen={(idx) => setDeck(prev => ({ ...prev, activeScreenIndex: idx }))}
              onUpdateConfig={(idx, key, val) => {
                setDeck(prev => {
                  const updated = [...prev.screens];
                  if (updated[idx]) updated[idx] = { ...updated[idx], [key]: val };
                  return { ...prev, screens: updated };
                });
              }}
              isWatermarkUnlocked={isWatermarkUnlocked}
            />
          ) : (
            <BuilderCanvas
              ref={canvasRef}
              config={activeScreenConfig}
              onUpdateConfig={(key, val) => handleSetSingleConfig((prev) => ({ ...prev, [key]: val }))}
              isWatermarkUnlocked={isWatermarkUnlocked}
              onOpenUnlockWatermark={() => setIsUnlockModalOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Saved projects dropdown */}
      {showProjectMenu && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(10,10,10,0.4)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowProjectMenu(false)}
        >
          <div
            className="card-default"
            style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              width: "90%", maxWidth: "400px", maxHeight: "60vh", overflow: "auto",
              padding: "24px", display: "flex", flexDirection: "column", gap: "12px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>Saved Projects</h3>
            {savedProjects.length === 0 ? (
              <p style={{ fontSize: "13px", color: "var(--text-3)", margin: 0 }}>No saved projects yet. Create your first one!</p>
            ) : (
              savedProjects.map((p) => (
                <div key={p.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "10px",
                  background: p.id === currentProjectId ? "var(--fill-subtle)" : "var(--surface)",
                }}>
                  <button
                    onClick={() => handleOpenProject(p.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", flex: 1, padding: 0 }}
                  >
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-1)" }}>{p.name}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-3)" }}>{new Date(p.updated_at).toLocaleDateString()}</div>
                  </button>
                  <button
                    onClick={() => handleDeleteProject(p.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: "4px", display: "flex", alignItems: "center" }}
                    title="Delete"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Import from store */}
      <ImportStoreModal
        isOpen={isImportOpen}
        onClose={() => { setIsImportOpen(false); setImportStoreInitialUrl(undefined); }}
        onImport={handleStoreImport}
        initialUrl={importStoreInitialUrl}
      />

      <PostExportShareModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ isOpen: false, count: 1 })}
        exportCount={shareModal.count}
        projectName={projectName}
      />

      {/* Template gallery */}
      <TemplateGallery
        isOpen={isTemplateOpen}
        onClose={() => setIsTemplateOpen(false)}
        onApply={handleApplyTemplate}
      />

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

      <ToolCrossLinks current="/screenshot-builder" />
      <OnboardingTour storageKey="buildr_sb_onboarding" />

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
        .deck-card-container:hover .deck-card-delete {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}

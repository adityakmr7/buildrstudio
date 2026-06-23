// ─── Device Specs — App Store Screenshot Builder ────────────────────────────
// Canonical canvas dimensions per Apple and Google guidelines (June 2026)

export type Platform = "appstore" | "playstore";

export type DeviceId =
  | "iphone-67"
  | "iphone-65"
  | "iphone-55"
  | "ipad-129"
  | "ipad-11"
  | "android-phone"
  | "android-7tab"
  | "android-10tab";

export interface DeviceSpec {
  id: DeviceId;
  platform: Platform;
  label: string;          // Display name
  detail: string;         // e.g. "Required" / "Optional"
  canvasW: number;        // Actual output pixel width
  canvasH: number;        // Actual output pixel height
  frameAspect: number;    // canvasW / canvasH — for preview scaling
  frameType: "iphone-dynamic" | "iphone-notch" | "ipad" | "android" | "android-tab";
  isLandscape?: boolean;
}

export const DEVICE_SPECS: DeviceSpec[] = [
  // ── Apple App Store ──────────────────────────────────────────────────────
  {
    id: "iphone-67",
    platform: "appstore",
    label: "iPhone 6.7″",
    detail: "Required · iPhone 16 Pro Max",
    canvasW: 1290,
    canvasH: 2796,
    frameAspect: 1290 / 2796,
    frameType: "iphone-dynamic",
  },
  {
    id: "iphone-65",
    platform: "appstore",
    label: "iPhone 6.5″",
    detail: "Required · iPhone 15 Plus",
    canvasW: 1242,
    canvasH: 2688,
    frameAspect: 1242 / 2688,
    frameType: "iphone-notch",
  },
  {
    id: "iphone-55",
    platform: "appstore",
    label: "iPhone 5.5″",
    detail: "Optional · iPhone 8 Plus",
    canvasW: 1242,
    canvasH: 2208,
    frameAspect: 1242 / 2208,
    frameType: "iphone-notch",
  },
  {
    id: "ipad-129",
    platform: "appstore",
    label: "iPad 12.9″",
    detail: "Required if iPad supported",
    canvasW: 2048,
    canvasH: 2732,
    frameAspect: 2048 / 2732,
    frameType: "ipad",
  },
  {
    id: "ipad-11",
    platform: "appstore",
    label: "iPad 11″",
    detail: "Optional · iPad Pro",
    canvasW: 1668,
    canvasH: 2388,
    frameAspect: 1668 / 2388,
    frameType: "ipad",
  },
  // ── Google Play Store ─────────────────────────────────────────────────────
  {
    id: "android-phone",
    platform: "playstore",
    label: "Phone",
    detail: "Required · 1080 × 1920",
    canvasW: 1080,
    canvasH: 1920,
    frameAspect: 1080 / 1920,
    frameType: "android",
  },
  {
    id: "android-7tab",
    platform: "playstore",
    label: "7″ Tablet",
    detail: "Optional · 1200 × 1920",
    canvasW: 1200,
    canvasH: 1920,
    frameAspect: 1200 / 1920,
    frameType: "android-tab",
  },
  {
    id: "android-10tab",
    platform: "playstore",
    label: "10″ Tablet",
    detail: "Optional · 1920 × 1200",
    canvasW: 1920,
    canvasH: 1200,
    frameAspect: 1920 / 1200,
    frameType: "android-tab",
    isLandscape: true,
  },
];

export const APPSTORE_DEVICES  = DEVICE_SPECS.filter((d) => d.platform === "appstore");
export const PLAYSTORE_DEVICES = DEVICE_SPECS.filter((d) => d.platform === "playstore");

export function getDevice(id: DeviceId): DeviceSpec {
  return DEVICE_SPECS.find((d) => d.id === id)!;
}

// ── Builder Config ────────────────────────────────────────────────────────

export type BgType = "gradient" | "solid" | "mesh";
export type TextPosition = "top" | "bottom";
export type FrameMode = "flat" | "tilt3d";
export type GradDir = "to right" | "to bottom" | "to bottom right" | "135deg" | "45deg" | "to left" | "to top" | "to top right";

export const GRADIENT_PRESETS: Array<{ name: string; from: string; via?: string; to: string }> = [
  { name: "Indigo Dusk",    from: "#6366f1", via: "#a855f7", to: "#ec4899" },
  { name: "Ocean Breeze",   from: "#0ea5e9", via: "#38bdf8", to: "#7dd3fc" },
  { name: "Sunset Blaze",   from: "#f97316", via: "#fb923c", to: "#fbbf24" },
  { name: "Forest Mist",    from: "#10b981", via: "#34d399", to: "#6ee7b7" },
  { name: "Night City",     from: "#1e1b4b", via: "#312e81", to: "#4338ca" },
  { name: "Bubblegum",      from: "#f472b6", via: "#e879f9", to: "#a78bfa" },
  { name: "Charcoal",       from: "#111827", via: "#1f2937", to: "#374151" },
  { name: "Arctic White",   from: "#f8fafc", via: "#f1f5f9", to: "#e2e8f0" },
  { name: "Coral Reef",     from: "#ff6b6b", via: "#ee5a24", to: "#f9ca24" },
  { name: "Mint Fresh",     from: "#00b894", via: "#55efc4", to: "#81ecec" },
  { name: "Berry Crush",    from: "#6c5ce7", via: "#a29bfe", to: "#fd79a8" },
  { name: "Slate Storm",    from: "#2d3436", via: "#636e72", to: "#b2bec3" },
  { name: "Peach Glow",     from: "#fab1a0", via: "#ff7675", to: "#fd79a8" },
  { name: "Electric Lime",  from: "#00b09b", via: "#96c93d", to: "#d4fc79" },
  { name: "Deep Space",     from: "#000428", via: "#004e92", to: "#1a2980" },
  { name: "Rose Gold",      from: "#f4c4f3", via: "#fc5c7d", to: "#6a82fb" },
];

export interface BuilderConfig {
  // Platform
  deviceId: DeviceId;

  // Image
  screenshotUrl: string | null;
  imageScale: number;       // 0.5 – 1.5
  imageOffsetX: number;     // percentage 0–100
  imageOffsetY: number;     // percentage 0–100

  // Text
  headline: string;
  subtext: string;
  textPosition: TextPosition;
  headlineColor: string;
  subtextColor: string;
  headlineSize: number;
  subtextSize: number;
  fontFamily: string;

  // Background
  bgType: BgType;
  gradientPreset: string;
  gradientDir: GradDir;
  solidColor: string;
  meshColor1: string;
  meshColor2: string;
  meshColor3: string;
  meshColor4: string;

  // Frame
  frameMode: FrameMode;
  frameVisible: boolean;
  frameShadow: boolean;
  tiltX: number;
  tiltY: number;

  // Spanning / Deck sync settings
  panoramic: "none" | "left" | "right";
  autoSyncTheme: boolean;
}

export const DEFAULT_CONFIG: BuilderConfig = {
  deviceId: "iphone-67",
  screenshotUrl: null,
  imageScale: 0.9,
  imageOffsetX: 50,
  imageOffsetY: 50,
  headline: "Your App. Your Story.",
  subtext: "Download on the App Store today.",
  textPosition: "top",
  headlineColor: "#ffffff",
  subtextColor: "rgba(255,255,255,0.75)",
  headlineSize: 3.2,
  subtextSize: 1.4,
  fontFamily: "DM Sans",
  bgType: "gradient",
  gradientPreset: "Indigo Dusk",
  gradientDir: "to bottom",
  solidColor: "#0f172a",
  meshColor1: "#6366f1",
  meshColor2: "#8b5cf6",
  meshColor3: "#ec4899",
  meshColor4: "#0ea5e9",
  frameMode: "flat",
  frameVisible: true,
  frameShadow: true,
  tiltX: 4,
  tiltY: -14,
  panoramic: "none",
  autoSyncTheme: true,
};

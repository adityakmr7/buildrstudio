// Lightweight client-side event tracking via Umami.
// Safe to call anywhere — no-ops when the script hasn't loaded (dev, ad-blockers).

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string | number | boolean>) => void;
    };
  }
}

export function track(event: string, data?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(event, data);
  } catch {
    // never let analytics break the app
  }
}

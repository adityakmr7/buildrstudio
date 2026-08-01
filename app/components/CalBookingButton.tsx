"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

// ─── CONFIGURATION ────────────────────────────────────────────────────────────
// Change this slug to match your Cal.com event type.
// e.g. "adityakmr7/ai-audit" or "adityakmr7/30min" or just "adityakmr7"
export const CAL_LINK = "adityakmr7";

/**
 * Preloads the Cal.com embed script on mount so the modal opens instantly
 * when any CTA button is clicked. Mount this once at the top of a page.
 */
export function CalLoader() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "ai-audit" });
      cal("ui", {
        theme: "dark",
        hideEventTypeDetails: false,
        layout: "month_view",
        cssVarsPerTheme: {
          dark: {
            "cal-bg": "#080B0F",
            "cal-bg-emphasis": "#0C1015",
            "cal-border": "rgba(255,255,255,0.09)",
            "cal-brand": "#2563EB",
            "cal-brand-emphasis": "#1D4ED8",
            "cal-text": "#F5F5F5",
            "cal-text-emphasis": "#F5F5F5",
            "cal-text-subtle": "rgba(245,245,245,0.50)",
          },
          light: {
            "cal-brand": "#2563EB",
            "cal-brand-emphasis": "#1D4ED8",
          },
        },
      });
    })();
  }, []);

  return null;
}

/**
 * Drop-in button that opens the Cal.com modal on click.
 * Accepts any style/className overrides.
 */
export default function CalBookingButton({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <button
      data-cal-namespace="ai-audit"
      data-cal-link={CAL_LINK}
      data-cal-config='{"layout":"month_view","theme":"dark"}'
      style={{
        cursor: "pointer",
        border: "none",
        background: "none",
        padding: 0,
        margin: 0,
        font: "inherit",
        color: "inherit",
        display: "inline-flex",
        alignItems: "center",
        ...style,
      }}
      className={className}
    >
      {children}
    </button>
  );
}

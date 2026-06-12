import React, { forwardRef } from "react";

export type Template = "minimal" | "gradient" | "bracket";

export interface CardData {
  version: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  template: Template;
  brand: string;
  bg: string;
  fg: string;
  accent: string;
  showVersion: boolean;
  showDate: boolean;
  showTags: boolean;
}

interface Props {
  data: CardData;
}

export const CARD_W = 1200;
export const CARD_H = 630;

export const ChangelogCard = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const { template, bg, fg, accent, brand, version, title, description, date, tags, showVersion, showDate, showTags } = data;

  const baseStyle: React.CSSProperties = {
    width: CARD_W,
    height: CARD_H,
    background: bg,
    color: fg,
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Inter, sans-serif",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  if (template === "minimal") {
    return (
      <div ref={ref} style={baseStyle}>
        <div style={{ padding: 80, display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3 }}>{brand}</div>
            {showVersion && (
              <div style={{ fontSize: 16, fontWeight: 600, color: accent, fontFamily: "ui-monospace, monospace" }}>{version}</div>
            )}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {showTags && tags.length > 0 && (
              <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
                {tags.map((t) => (
                  <span key={t} style={{ fontSize: 14, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: 1.5 }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            <h1 style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.05, margin: 0 }}>
              {title}
            </h1>
            {description && (
              <p style={{ fontSize: 24, marginTop: 28, opacity: 0.7, lineHeight: 1.45, maxWidth: 900 }}>
                {description}
              </p>
            )}
          </div>
          {showDate && (
            <div style={{ fontSize: 16, opacity: 0.5, fontFamily: "ui-monospace, monospace" }}>{date}</div>
          )}
        </div>
      </div>
    );
  }

  if (template === "gradient") {
    return (
      <div
        ref={ref}
        style={{
          ...baseStyle,
          background: `linear-gradient(135deg, ${bg} 0%, ${accent} 100%)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.18), transparent 50%)",
          }}
        />
          <div style={{ padding: 80, display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{brand}</div>
              {showVersion && (
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    padding: "8px 16px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.22)",
                    fontFamily: "ui-monospace, monospace",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {version}
                </div>
              )}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {showTags && tags.length > 0 && (
                <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                  {tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        padding: "6px 14px",
                        borderRadius: 999,
                        background: "rgba(0,0,0,0.25)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <h1 style={{ fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1, margin: 0 }}>
                {title}
              </h1>
              {description && (
                <p style={{ fontSize: 24, marginTop: 24, opacity: 0.88, lineHeight: 1.4, maxWidth: 900 }}>
                  {description}
                </p>
              )}
            </div>
            {showDate && (
              <div style={{ fontSize: 16, opacity: 0.8, fontFamily: "ui-monospace, monospace" }}>{date}</div>
            )}
          </div>
      </div>
    );
  }

  // bracket
  return (
    <div ref={ref} style={baseStyle}>
      <div style={{ padding: 64, display: "flex", flexDirection: "column", height: "100%", border: `2px solid ${fg}`, margin: 24, borderRadius: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 24, borderBottom: `1px solid ${fg}33` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: accent }} />
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.2 }}>{brand}</div>
          </div>
          {showVersion && (
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "ui-monospace, monospace" }}>
              [{version}]
            </div>
          )}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 16 }}>
          {showTags && tags.length > 0 && (
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              {tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "5px 12px",
                    border: `1.5px solid ${accent}`,
                    color: accent,
                    borderRadius: 4,
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                    fontFamily: "ui-monospace, monospace",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          <h1 style={{ fontSize: 68, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05, margin: 0 }}>
            {title}
          </h1>
          {description && (
            <p style={{ fontSize: 22, marginTop: 22, opacity: 0.72, lineHeight: 1.5, maxWidth: 880 }}>
              {description}
            </p>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 20, borderTop: `1px solid ${fg}33`, fontFamily: "ui-monospace, monospace", fontSize: 14, opacity: 0.7 }}>
          <span>// changelog</span>
          {showDate && <span>{date}</span>}
        </div>
      </div>
    </div>
  );
});

ChangelogCard.displayName = "ChangelogCard";

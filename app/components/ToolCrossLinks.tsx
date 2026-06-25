"use client";

import Link from "next/link";

const TOOLS = [
  { href: "/screenshot-builder", label: "Screenshot Builder", icon: "📱" },
  { href: "/social-optimizer", label: "Social Optimizer", icon: "🎨" },
  { href: "/change-log", label: "Changelog Generator", icon: "⚡" },
];

export default function ToolCrossLinks({ current }: { current: string }) {
  const others = TOOLS.filter((t) => t.href !== current);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      padding: "8px 16px",
      background: "var(--surface)",
      borderTop: "1px solid var(--border)",
      fontSize: "12px",
      flexWrap: "wrap",
    }}>
      <span style={{ color: "var(--text-3)", fontWeight: 600 }}>Also try:</span>
      {others.map((tool) => (
        <Link
          key={tool.href}
          href={tool.href}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 12px",
            borderRadius: "8px",
            background: "var(--fill-subtle)",
            color: "var(--fill)",
            fontWeight: 600,
            textDecoration: "none",
            transition: "all 0.15s",
            fontSize: "11px",
          }}
        >
          <span>{tool.icon}</span> {tool.label}
        </Link>
      ))}
    </div>
  );
}

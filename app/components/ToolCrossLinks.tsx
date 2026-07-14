"use client";

import Link from "next/link";

const TOOLS = [
  { href: "/screenshot-builder", label: "Screenshot Builder", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> },
  { href: "/social-optimizer",   label: "Social Optimizer",   icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> },
  { href: "/change-log",         label: "Changelog Generator", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
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
          {tool.icon} {tool.label}
        </Link>
      ))}
    </div>
  );
}

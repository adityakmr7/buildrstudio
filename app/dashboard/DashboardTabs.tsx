"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard/integrations", label: "Agents" },
  { href: "/dashboard/leads", label: "Leads" },
];

// Shared sub-navigation for /dashboard/* pages.
export default function DashboardTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Dashboard" style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border)", marginBottom: 28 }}>
      {TABS.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            style={{
              padding: "10px 14px",
              fontSize: 13.5,
              fontWeight: 600,
              color: active ? "var(--text)" : "var(--muted)",
              borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

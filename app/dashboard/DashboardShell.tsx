import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import DashboardTabs from "./DashboardTabs";

// Common frame for the server-rendered dashboard pages (conversations,
// unanswered, leads) — same header/tabs as the Agents page.
export default function DashboardShell({
  title,
  intro,
  children,
  maxWidth = 1000,
}: {
  title: string;
  intro: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: number;
}) {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100svh" }}>
      <SiteNav />
      <section style={{ padding: "48px 24px 80px" }}>
        <div style={{ maxWidth, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--text)", margin: "0 0 8px" }}>{title}</h1>
          <p style={{ fontSize: 14.5, color: "var(--muted)", margin: "0 0 24px" }}>{intro}</p>
          <DashboardTabs />
          {children}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

export function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: 20, borderRadius: 2, background: "rgba(240,128,110,0.08)", border: "1px solid rgba(240,128,110,0.32)", color: "#f0a08f", fontSize: 13.5, marginBottom: 24 }}>
      {children}
    </div>
  );
}

export function EmptyBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: 32, borderRadius: 2, background: "var(--surface)", border: "1px solid var(--border)", textAlign: "center", fontSize: 14, color: "var(--muted)" }}>
      {children}
    </div>
  );
}

export function formatIst(d: Date, withYear = false) {
  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
    hour: "2-digit",
    minute: "2-digit",
  });
}

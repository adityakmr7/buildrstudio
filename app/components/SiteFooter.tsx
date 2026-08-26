import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Agents", href: "/agents" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "hello@buildrstudio.in", href: "mailto:hello@buildrstudio.in" },
];

export default function SiteFooter() {
  return (
    <footer style={{ padding: "32px 0", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
          Buildr<span style={{ color: "var(--accent)" }}>Studio</span>
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="site-footer-link"
              style={{ fontSize: 12, color: "var(--muted-2)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p style={{ fontSize: 12, color: "var(--muted-2)", margin: 0 }}>
          © {new Date().getFullYear()} Buildr Studio
        </p>
      </div>
      <style>{`.site-footer-link:hover { color: var(--text) !important; }`}</style>
    </footer>
  );
}

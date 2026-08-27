"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Robot, FlowArrow, Brain, Database, CaretRight, MagnifyingGlass } from "@phosphor-icons/react";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import BusinessTypeSelector from "../components/BusinessTypeSelector";
import { AGENT_CATALOG, type AgentProduct, type CatalogCategory, type Outcome, type BusinessType } from "../lib/agentCatalog";

const ICONS = { Robot, FlowArrow, Brain, Database };
const CATEGORIES: ("All" | CatalogCategory)[] = ["All", "Support", "Knowledge", "Automation", "Multi-Agent"];

const OUTCOME_LABELS: Record<Outcome, string> = {
  "customer-support": "Customer Support",
  sales: "Sales",
  "website-assistant": "Website Assistant",
  knowledge: "Knowledge",
  operations: "Operations",
  marketing: "Marketing",
};

function StatusChip({ status }: { status: AgentProduct["status"] }) {
  const live = status === "live";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        fontFamily: "monospace",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        padding: "4px 10px",
        borderRadius: 999,
        color: live ? "#16A34A" : "var(--muted)",
        background: live ? "rgba(22,163,74,0.10)" : "var(--surface-alt)",
        border: live ? "1px solid rgba(22,163,74,0.24)" : "1px solid var(--border)",
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: live ? "#16A34A" : "var(--muted-2)" }} />
      {live ? "Live" : "Coming soon"}
    </span>
  );
}

function ProductCard({ product }: { product: AgentProduct }) {
  const Icon = ICONS[product.icon];
  return (
    <div
      className="agent-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 26,
        borderRadius: 16,
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <Link href={`/agents/${product.slug}`} style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `${product.accent}1A`,
              color: product.accent,
              flexShrink: 0,
            }}
          >
            <Icon size={22} weight="duotone" />
          </div>
          <StatusChip status={product.status} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: product.accent, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
            {product.category}
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: "var(--text)", margin: "0 0 8px" }}>{product.name}</h3>
          <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--muted)", margin: "0 0 8px" }}>{product.tagline}</p>
          {product.businessTypes.length > 0 && (
            <p style={{ fontSize: 12, color: "var(--muted-2)", margin: 0 }}>
              Best for: {product.businessTypes.slice(0, 3).join(" • ")}
            </p>
          )}
        </div>
      </Link>

      {product.status === "live" ? (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href={`/agents/${product.slug}#demo`} className="agent-card-arrow" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: product.accent }}>
            Try live <CaretRight size={11} weight="bold" />
          </Link>
          <Link href={`/agents/${product.slug}#pricing`} style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-2)" }}>
            View pricing
          </Link>
        </div>
      ) : (
        <Link href={`/agents/${product.slug}`} className="agent-card-arrow" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: product.accent }}>
          View details <CaretRight size={11} weight="bold" />
        </Link>
      )}
      <style>{`.agent-card:hover { border-color: var(--border-strong) !important; box-shadow: 0 8px 24px rgba(15,23,42,0.06); }`}</style>
    </div>
  );
}

function AgentsHero({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  return (
    <section style={{ padding: "56px 24px 36px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "clamp(30px, 4.5vw, 48px)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            margin: "0 0 14px",
          }}
        >
          The agent catalog
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--muted)", maxWidth: "56ch", margin: "0 0 28px" }}>
          Each one embeds on your site with a single script tag. Need something that isn&apos;t here yet?{" "}
          <a href="mailto:hello@buildrstudio.in" style={{ color: "var(--accent)", textDecoration: "underline" }}>
            Tell us what you need.
          </a>
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            maxWidth: 420,
            padding: "10px 16px",
            borderRadius: 12,
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <MagnifyingGlass size={16} style={{ color: "var(--muted-2)", flexShrink: 0 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or category…"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "var(--text)", fontFamily: "var(--font)" }}
          />
        </div>
      </div>
    </section>
  );
}

export default function AgentsCatalogHub() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState<"All" | CatalogCategory>("All");
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);

  const outcomeParam = searchParams.get("outcome");
  const activeOutcome = outcomeParam && outcomeParam in OUTCOME_LABELS ? (outcomeParam as Outcome) : null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = AGENT_CATALOG.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.whoFor.toLowerCase().includes(q);
      const matchesOutcome = !activeOutcome || p.outcomes.includes(activeOutcome);
      return matchesCategory && matchesQuery && matchesOutcome;
    });
    // Business type never hides products (only 4 general-purpose agents
    // exist) — it re-sorts so relevant ones float to the top.
    if (businessType) {
      return [...list].sort((a, b) => {
        const aMatch = a.businessTypes.includes(businessType) ? 0 : 1;
        const bMatch = b.businessTypes.includes(businessType) ? 0 : 1;
        return aMatch - bMatch;
      });
    }
    return list;
  }, [query, category, activeOutcome, businessType]);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100svh" }}>
      <SiteNav />
      <AgentsHero query={query} setQuery={setQuery} />

      <section style={{ padding: "0 24px 20px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <BusinessTypeSelector value={businessType} onChange={setBusinessType} />
        </div>
      </section>

      <section style={{ padding: "0 24px 16px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: active ? "1px solid var(--accent)" : "1px solid var(--border)",
                  background: active ? "var(--accent-soft)" : "var(--surface)",
                  color: active ? "var(--accent)" : "var(--muted)",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
      </section>

      <section style={{ padding: "24px 24px 96px" }}>
        <div
          style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}
          className="catalog-grid"
        >
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        {filtered.length === 0 && activeOutcome && (
          <div style={{ maxWidth: 480, margin: "40px auto 0", textAlign: "center" }}>
            <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 16px" }}>
              We don&apos;t have a {OUTCOME_LABELS[activeOutcome]} agent yet — tell us what you need
              and we&apos;ll let you know when one launches.
            </p>
            <a
              href="mailto:hello@buildrstudio.in"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 9, background: "var(--accent)", color: "#fff", fontSize: 14, fontWeight: 600 }}
            >
              Tell us what you need
            </a>
          </div>
        )}
        {filtered.length === 0 && !activeOutcome && (
          <div style={{ maxWidth: 1280, margin: "40px auto 0", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
            No agents match that search — try a different term or category.
          </div>
        )}
      </section>

      <SiteFooter />
      <style>{`
        @media (max-width: 700px) {
          .catalog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

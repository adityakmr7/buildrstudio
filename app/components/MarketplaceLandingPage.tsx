"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Robot,
  FlowArrow,
  Brain,
  Database,
  ArrowRight,
  CheckCircle,
  MagnifyingGlass,
  Plus,
  Minus,
  Code,
  Lightning,
  ChatCircleDots,
} from "@phosphor-icons/react";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import OutcomeDiscovery from "./OutcomeDiscovery";
import { AGENT_CATALOG } from "../lib/agentCatalog";

const CATEGORY_ICONS = { Robot, FlowArrow, Brain, Database };

// ─── HERO ──────────────────────────────────────────────────────────────────

function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/agents?q=${encodeURIComponent(query.trim())}` : "/agents");
  };

  const stats = [
    { value: `${AGENT_CATALOG.length}`, label: "Agent categories" },
    { value: `${AGENT_CATALOG.filter((p) => p.status === "live").length}`, label: "Live today" },
    { value: "1", label: "Script tag to install" },
    { value: "0", label: "Code required" },
  ];

  return (
    <section style={{ position: "relative", padding: "72px 24px 56px", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: -80,
          left: "50%",
          transform: "translateX(-50%)",
          width: 900,
          height: 500,
          pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.14) 0%, transparent 65%)",
        }}
      />
      <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <h1
          style={{
            fontSize: "clamp(34px, 5.5vw, 58px)",
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            margin: "0 0 18px",
          }}
        >
          AI employees for <br />
          <em style={{ color: "var(--accent)", fontStyle: "italic" }}>your business</em>
        </h1>

        <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--muted)", maxWidth: "52ch", margin: "0 auto 28px" }}>
          Deploy pre-built AI agents for customer support, knowledge, and automation in minutes.
          No AI expertise required.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
          <a
            href="#solutions"
            className="hero-cta-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 26px",
              borderRadius: 10,
              fontSize: 14.5,
              fontWeight: 600,
              background: "var(--accent)",
              color: "#fff",
            }}
          >
            Find my AI agent
            <ArrowRight size={14} weight="bold" />
          </a>
          <Link
            href="/agents"
            className="hero-cta-secondary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 26px",
              borderRadius: 10,
              fontSize: 14.5,
              fontWeight: 600,
              background: "var(--surface)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            }}
          >
            Browse agents
          </Link>
        </div>

        <form onSubmit={submit} style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              maxWidth: 480,
              padding: "6px 8px 6px 18px",
              borderRadius: 14,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
            }}
          >
            <MagnifyingGlass size={17} style={{ color: "var(--muted-2)", flexShrink: 0 }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search agents — support, knowledge, automation…"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 14,
                color: "var(--text)",
                fontFamily: "var(--font)",
              }}
            />
            <button
              type="submit"
              className="hero-search-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <ArrowRight size={16} weight="bold" />
            </button>
          </div>
        </form>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }} className="hero-stats">
          {stats.map((stat) => (
            <div key={stat.label} style={{ padding: "16px 8px", borderRadius: 12, background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: "var(--accent)", letterSpacing: "-0.02em" }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hero-search-btn:hover { background: #1D4ED8 !important; }
        .hero-cta-primary:hover { background: #1D4ED8 !important; }
        .hero-cta-secondary:hover { border-color: var(--border-strong) !important; }
        @media (max-width: 560px) {
          .hero-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}

// ─── VALUE PROPS ───────────────────────────────────────────────────────────

const VALUE_PROPS = [
  {
    icon: Code,
    title: "One script tag, any stack",
    description: "Paste a single embed snippet into plain HTML, WordPress, React, or Vue. No build step, no SDK to learn.",
  },
  {
    icon: Lightning,
    title: "Live in minutes",
    description: "Subscribe, get your API key and embed code instantly, and start chatting with visitors the same day.",
  },
  {
    icon: ChatCircleDots,
    title: "Configurable, not generic",
    description: "Set your own knowledge base, greeting, brand color, and widget position from your dashboard.",
  },
];

function ValueProps() {
  return (
    <section style={{ padding: "72px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", margin: "0 0 12px" }}>
            Skip the build, keep the control
          </h2>
          <p style={{ fontSize: 15, color: "var(--muted)", maxWidth: "48ch", margin: "0 auto" }}>
            Every agent ships pre-built and production-ready — you configure it for your content, not your codebase.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="value-props-grid">
          {VALUE_PROPS.map((prop) => (
            <div
              key={prop.title}
              style={{
                padding: 28,
                borderRadius: 16,
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  marginBottom: 18,
                }}
              >
                <prop.icon size={22} weight="duotone" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", margin: "0 0 8px" }}>{prop.title}</h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--muted)", margin: 0 }}>{prop.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .value-props-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── CATALOG PREVIEW ───────────────────────────────────────────────────────

function CatalogPreview() {
  return (
    <section style={{ padding: "72px 24px", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", margin: "0 0 10px" }}>
              Built for every team
            </h2>
            <p style={{ fontSize: 15, color: "var(--muted)", maxWidth: "48ch", margin: 0 }}>
              Four agent categories, each drawn from real client work — not generic templates.
            </p>
          </div>
          <Link
            href="/agents"
            className="catalog-preview-link"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--accent)" }}
          >
            Browse full catalog <ArrowRight size={13} weight="bold" />
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="catalog-preview-grid">
          {AGENT_CATALOG.map((product) => {
            const Icon = CATEGORY_ICONS[product.icon];
            return (
              <div
                key={product.slug}
                className="catalog-preview-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  padding: 22,
                  borderRadius: 14,
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                }}
              >
                <Link href={`/agents/${product.slug}`} style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 9,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `${product.accent}1A`,
                      color: product.accent,
                    }}
                  >
                    <Icon size={19} weight="duotone" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text)", margin: "0 0 6px" }}>{product.name}</h3>
                    <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--muted)", margin: 0 }}>{product.tagline}</p>
                  </div>
                </Link>
                {product.status === "live" ? (
                  <div style={{ display: "flex", gap: 12, marginTop: "auto" }}>
                    <Link href={`/agents/${product.slug}#demo`} style={{ fontSize: 11.5, fontWeight: 600, color: product.accent }}>
                      Try live →
                    </Link>
                    <Link href={`/agents/${product.slug}#pricing`} style={{ fontSize: 11.5, fontWeight: 600, color: "var(--muted-2)" }}>
                      View pricing
                    </Link>
                  </div>
                ) : (
                  <span
                    style={{
                      marginTop: "auto",
                      fontSize: 10,
                      fontFamily: "monospace",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "var(--muted-2)",
                    }}
                  >
                    ○ Coming soon
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .catalog-preview-link:hover { color: #1D4ED8 !important; }
        .catalog-preview-card:hover { border-color: var(--border-strong) !important; }
        @media (max-width: 900px) {
          .catalog-preview-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .catalog-preview-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── COMPARISON ────────────────────────────────────────────────────────────

const COMPARISON_ROWS = [
  { label: "Time to first working agent", diy: "Weeks of engineering time", buildr: "Minutes" },
  { label: "Ongoing maintenance", diy: "Your team owns it", buildr: "We run and monitor it" },
  { label: "Embed on any site", diy: "Custom integration work", buildr: "One script tag" },
  { label: "Need something bespoke?", diy: "Full custom build", buildr: "Custom engagements available" },
];

function ComparisonSection() {
  return (
    <section id="pricing" style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", margin: "0 0 12px" }}>
            Buy it vs. build it
          </h2>
          <p style={{ fontSize: 15, color: "var(--muted)", margin: 0 }}>
            Pricing per agent is being finalized — see each agent&apos;s page for current details.
          </p>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 520, borderCollapse: "collapse", background: "var(--surface)", borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "16px 20px", fontSize: 12, fontWeight: 600, color: "var(--muted)", borderBottom: "1px solid var(--border)" }} />
                <th style={{ textAlign: "left", padding: "16px 20px", fontSize: 12, fontWeight: 600, color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                  Building it yourself
                </th>
                <th style={{ textAlign: "left", padding: "16px 20px", fontSize: 13, fontWeight: 700, color: "var(--accent)", borderBottom: "1px solid var(--border)", background: "var(--accent-soft)" }}>
                  Buildr Studio
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.label}>
                  <td style={{ padding: "14px 20px", fontSize: 13.5, fontWeight: 600, color: "var(--text)", borderBottom: "1px solid var(--border)" }}>{row.label}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13.5, color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>{row.diy}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13.5, color: "var(--text)", borderBottom: "1px solid var(--border)", background: "var(--accent-soft)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <CheckCircle size={14} weight="fill" style={{ color: "var(--accent)" }} />
                      {row.buildr}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ──────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote:
      "The support agent handles about 70% of our first-response tickets without a human touching them. Our team now focuses on the complex stuff.",
    name: "James R.",
    role: "VP of Operations",
    company: "Series B SaaS",
  },
  {
    quote:
      "We embedded the knowledge assistant into our internal wiki and stopped getting the same three Slack questions every week.",
    name: "Priya M.",
    role: "Head of RevOps",
    company: "E-commerce scale-up",
  },
];

function TestimonialsSection() {
  return (
    <section style={{ padding: "80px 24px", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", margin: "0 0 40px" }}>
          What early users say
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} style={{ display: "flex", flexDirection: "column", gap: 16, padding: 28, borderRadius: 14, background: "var(--bg)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "var(--text)", margin: 0, flex: 1 }}>&ldquo;{t.quote}&rdquo;</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, background: "var(--accent-soft)", color: "var(--accent)", flexShrink: 0 }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted-2)" }}>{t.role}, {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 20, fontSize: 11, textAlign: "center", color: "var(--muted-2)" }}>
          Sample testimonials — representative of the client work these agents are drawn from.
        </p>
      </div>
      <style>{`
        @media (max-width: 700px) {
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "Do I need a developer to install an agent?",
    a: "No. After subscribing, your dashboard gives you a single script tag — paste it before the closing </body> tag on any website (plain HTML, WordPress, Shopify, React, Vue) and the widget appears.",
  },
  {
    q: "Can I try an agent before paying?",
    a: "Yes — every agent works on a small trial message quota as soon as you generate an API key, so you can test it on a staging page before committing.",
  },
  {
    q: "What happens if I hit my monthly message limit?",
    a: "The widget shows a graceful message and stops responding until the next billing cycle, or you can upgrade to a higher tier from your dashboard.",
  },
  {
    q: "Can I customize how the widget looks?",
    a: "Yes — greeting text, brand color, and widget position (bottom-left or bottom-right) are all configurable from your dashboard.",
  },
  {
    q: "What if I need something the catalog doesn't cover?",
    a: "We also take on custom-built agent engagements for teams that need bespoke integrations or workflows beyond the catalog — reach out and we'll scope it.",
  },
  {
    q: "How does billing work?",
    a: "Subscriptions are billed monthly through Paddle, our merchant of record, which handles tax/VAT automatically. Cancel anytime from your dashboard.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", margin: "0 0 36px", textAlign: "center" }}>
          Frequently asked <span style={{ color: "var(--accent)" }}>questions</span>
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} style={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface)", overflow: "hidden" }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 20px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: 14.5,
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  {item.q}
                  {isOpen ? <Minus size={15} style={{ color: "var(--accent)", flexShrink: 0 }} /> : <Plus size={15} style={{ color: "var(--muted)", flexShrink: 0 }} />}
                </button>
                {isOpen && (
                  <p style={{ margin: 0, padding: "0 20px 18px", fontSize: 13.5, lineHeight: 1.65, color: "var(--muted)" }}>
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── CTA BANNER ────────────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section style={{ padding: "88px 24px", position: "relative", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.12) 0%, transparent 60%)",
        }}
      />
      <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "var(--text)", margin: "0 0 16px" }}>
          Pick an agent, ship it today
        </h2>
        <p style={{ fontSize: 15, color: "var(--muted)", maxWidth: "42ch", margin: "0 auto 32px" }}>
          Browse the catalog, subscribe, and get your embed code in the same session.
        </p>
        <Link
          href="/agents"
          className="cta-banner-link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            padding: "15px 32px",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 600,
            background: "var(--accent)",
            color: "#fff",
          }}
        >
          Browse agents
          <ArrowRight size={16} weight="bold" />
        </Link>
      </div>
      <style>{`.cta-banner-link:hover { background: #1D4ED8 !important; transform: translateY(-2px); }`}</style>
    </section>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────

export default function MarketplaceLandingPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100svh" }}>
      <SiteNav />
      <Hero />
      <OutcomeDiscovery />
      <ValueProps />
      <CatalogPreview />
      <ComparisonSection />
      <TestimonialsSection />
      <FAQSection />
      <CTABanner />
      <SiteFooter />
    </div>
  );
}

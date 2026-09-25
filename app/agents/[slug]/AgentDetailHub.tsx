"use client";

import Link from "next/link";
import { Robot, FlowArrow, Brain, Database, CheckCircle, CaretLeft, Lightning } from "@phosphor-icons/react";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import PaddleCheckoutButton from "../../components/PaddleCheckoutButton";
import LiveDemoChat from "./LiveDemoChat";
import type { AgentProduct } from "../../lib/agentCatalog";
import type { OperationalAgent } from "./page";

const ICONS = { Robot, FlowArrow, Brain, Database };

function StatusChip({ status }: { status: AgentProduct["status"] }) {
  const live = status === "live";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        fontFamily: "var(--font-mono)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        padding: "4px 10px",
        borderRadius: 2,
        color: live ? "var(--success)" : "var(--muted)",
        background: live ? "rgba(125,206,160,0.10)" : "var(--surface-alt)",
        border: live ? "1px solid rgba(125,206,160,0.28)" : "1px solid var(--border)",
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: live ? "var(--success)" : "var(--muted-2)" }} />
      {live ? "Live" : "Coming soon"}
    </span>
  );
}

function DetailHero({ product }: { product: AgentProduct }) {
  const Icon = ICONS[product.icon];
  return (
    <section style={{ padding: "48px 24px 36px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Link href="/agents" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
          <CaretLeft size={12} weight="bold" /> All agents
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--surface-alt)",
              color: "var(--text)",
              flexShrink: 0,
            }}
          >
            <Icon size={24} weight="duotone" />
          </div>
          <StatusChip status={product.status} />
        </div>

        <h1 style={{ fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 600, lineHeight: 1.02, letterSpacing: "-0.04em", color: "var(--text)", margin: "0 0 14px", maxWidth: "22ch" }}>
          {product.name}
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--muted)", maxWidth: "58ch", margin: "0 0 20px" }}>
          {product.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--muted-2)" }}>
          <Lightning size={14} />
          {product.installTime}
        </div>
      </div>
    </section>
  );
}

function LiveDemoSection({ product }: { product: AgentProduct }) {
  return (
    <section id="demo" style={{ padding: "0 24px 56px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {product.status === "live" ? (
          <LiveDemoChat product={product} />
        ) : (
          <div
            style={{
              borderRadius: 2,
              border: "1px dashed var(--border-strong)",
              background: "var(--surface)",
              padding: "32px 24px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 13.5, color: "var(--muted)", margin: 0 }}>
              A live demo will be available once this agent launches.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function InfoGrid({ product }: { product: AgentProduct }) {
  const rows = [
    { label: "Who it's for", value: product.whoFor },
    { label: "Precedent", value: product.precedent },
    { label: "Pre-built for you", value: product.prebuilt },
    { label: "You configure", value: product.configurable },
  ];
  return (
    <section style={{ padding: "40px 24px", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="info-grid">
        {rows.map((row) => (
          <div key={row.label}>
            <h3 style={{ fontSize: 12, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-2)", margin: "0 0 8px" }}>
              {row.label}
            </h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--text)", margin: 0 }}>{row.value}</p>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 700px) {
          .info-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </section>
  );
}

function WhatsIncluded({ product }: { product: AgentProduct }) {
  return (
    <section style={{ padding: "64px 24px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--text)", margin: "0 0 24px" }}>
          What&apos;s included
        </h2>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
          {product.whatsIncluded.map((item) => (
            <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14.5, color: "var(--text)" }}>
              <CheckCircle size={18} weight="fill" style={{ color: "var(--muted)", flexShrink: 0, marginTop: 2 }} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TrustInfo({ product }: { product: AgentProduct }) {
  const rows = [
    { label: "Setup time", value: product.installTime },
    { label: "Knowledge sources", value: product.connectsTo.length > 0 ? product.connectsTo.join(", ") : "Not yet available" },
    { label: "Deployment", value: "Website widget (one script tag)" },
  ];
  return (
    <section style={{ padding: "0 24px 64px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <h3 style={{ fontSize: 12, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-2)", margin: "0 0 14px" }}>
          Connects to
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="trust-info-grid">
          {rows.map((row) => (
            <div key={row.label} style={{ padding: 18, borderRadius: 2, background: "var(--bg)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted-2)", marginBottom: 6 }}>
                {row.label}
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)" }}>{row.value}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 700px) {
          .trust-info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function TierCard({
  tier,
  product,
  dbTier,
  agentId,
}: {
  tier: AgentProduct["tiers"][number];
  product: AgentProduct;
  dbTier?: OperationalAgent["tiers"][number];
  agentId?: string;
}) {
  const canCheckout = product.status === "live" && !!dbTier && !!agentId;

  return (
    <div
      style={{
        padding: 26,
        borderRadius: 2,
        background: "var(--bg)",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div>
        <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 8 }}>
          {tier.name}
        </div>
        <div style={{ fontSize: 21, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{tier.price}</div>
        <div style={{ fontSize: 12, color: "var(--muted-2)" }}>{tier.messagesIncluded}</div>
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {tier.features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--muted)" }}>
            <CheckCircle size={14} weight="fill" style={{ color: "var(--muted)", flexShrink: 0, marginTop: 3 }} />
            {f}
          </li>
        ))}
      </ul>

      {canCheckout && dbTier && agentId ? (
        <PaddleCheckoutButton
          agentId={agentId}
          tierId={dbTier.id}
          paddlePriceId={dbTier.paddlePriceId}
          label={dbTier.paddlePriceId ? "Get this agent" : "Notify me when priced"}
          className="tier-cta"
          style={{
            marginTop: "auto",
            padding: "12px 20px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            background: "var(--accent)",
            color: "var(--accent-ink)",
            width: "100%",
          }}
        />
      ) : (
        <a
          href="mailto:hello@buildrstudio.in"
          style={{
            marginTop: "auto",
            padding: "12px 20px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            background: "var(--surface-alt)",
            color: "var(--muted)",
            textAlign: "center",
          }}
        >
          {product.status === "live" ? "Contact us" : "Join the waitlist"}
        </a>
      )}
    </div>
  );
}

function PricingSection({ product, dbAgent }: { product: AgentProduct; dbAgent: OperationalAgent | null }) {
  return (
    <section id="pricing" style={{ padding: "64px 24px", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--text)", margin: "0 0 8px" }}>
          Pricing
        </h2>
        <p style={{ fontSize: 13.5, color: "var(--muted-2)", margin: "0 0 28px" }}>
          {product.tiers.some((t) => t.price === "Pricing TBD")
            ? "Final prices are being finalized — email us for a quote in the meantime."
            : "Subscribe to lock in current pricing."}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="tier-grid">
          {product.tiers.map((tier) => {
            const dbTier = dbAgent?.tiers.find((t) => t.name === tier.name.toLowerCase());
            return (
              <TierCard key={tier.name} tier={tier} product={product} dbTier={dbTier} agentId={dbAgent?.id} />
            );
          })}
        </div>
      </div>
      <style>{`
        .tier-cta:hover { background: var(--accent-mid) !important; }
        @media (max-width: 700px) {
          .tier-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function FAQSection({ product }: { product: AgentProduct }) {
  return (
    <section style={{ padding: "64px 24px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--text)", margin: "0 0 24px" }}>
          FAQ
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {product.faq.map((f) => (
            <div key={f.question} style={{ paddingBottom: 18, borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text)", margin: "0 0 8px" }}>{f.question}</h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--muted)", margin: 0 }}>{f.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AgentDetailHub({ product, dbAgent }: { product: AgentProduct; dbAgent: OperationalAgent | null }) {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100svh" }}>
      <SiteNav />
      <DetailHero product={product} />
      <LiveDemoSection product={product} />
      <InfoGrid product={product} />
      <WhatsIncluded product={product} />
      {product.status === "live" && <TrustInfo product={product} />}
      <PricingSection product={product} dbAgent={dbAgent} />
      <FAQSection product={product} />
      <SiteFooter />
    </div>
  );
}

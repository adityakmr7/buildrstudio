"use client";

import Link from "next/link";
import { Robot, FlowArrow, Brain, Database, CheckCircle, CaretLeft, Lightning } from "@phosphor-icons/react";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import PaddleCheckoutButton from "../../components/PaddleCheckoutButton";
import StartTrialButton from "../../components/StartTrialButton";
import RazorpayCheckoutButton from "../../components/RazorpayCheckoutButton";
import { useRazorpayPlans, type InrTier } from "../../components/useRazorpayPlans";
import { useState } from "react";
import { TRIAL_DAYS, TRIAL_MESSAGE_LIMIT, TRIAL_SUMMARY } from "../../lib/trial";
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
        {product.status === "live" && (
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginTop: 24 }}>
            <StartTrialButton
              agentSlug={product.slug}
              label="Start free trial"
              className="trial-cta"
              style={{ padding: "12px 22px", borderRadius: 8, fontSize: 14, fontWeight: 600, background: "var(--accent)", color: "var(--accent-ink)", border: "none" }}
            />
            <a href="#pricing" style={{ fontSize: 13.5, color: "var(--muted)", textDecoration: "underline", textUnderlineOffset: 3 }}>
              See pricing
            </a>
            <span style={{ fontSize: 12.5, color: "var(--muted-2)" }}>{TRIAL_SUMMARY}.</span>
          </div>
        )}
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
  inr,
}: {
  tier: AgentProduct["tiers"][number];
  product: AgentProduct;
  dbTier?: OperationalAgent["tiers"][number];
  agentId?: string;
  // Set when the buyer picked INR and this tier has a Razorpay plan.
  inr?: InrTier;
}) {
  const canCheckout = product.status === "live" && !!dbTier && !!agentId;
  const ctaStyle: React.CSSProperties = {
    marginTop: "auto",
    padding: "12px 20px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    background: "var(--accent)",
    color: "var(--accent-ink)",
    width: "100%",
  };

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
        <div style={{ fontSize: 21, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{inr ? inr.priceLabel : tier.price}</div>
        <div style={{ fontSize: 12, color: "var(--muted-2)" }}>
          {tier.messagesIncluded}
          {inr && " · Billed in INR via Razorpay (UPI AutoPay, cards, netbanking)"}
        </div>
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {tier.features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--muted)" }}>
            <CheckCircle size={14} weight="fill" style={{ color: "var(--muted)", flexShrink: 0, marginTop: 3 }} />
            {f}
          </li>
        ))}
      </ul>

      {canCheckout && inr ? (
        <RazorpayCheckoutButton tierId={inr.tierId} label="Get this agent (pay in ₹)" className="tier-cta" style={ctaStyle} />
      ) : canCheckout && dbTier && agentId ? (
        <PaddleCheckoutButton
          agentId={agentId}
          tierId={dbTier.id}
          paddlePriceId={dbTier.paddlePriceId}
          label={dbTier.paddlePriceId ? "Get this agent" : "Notify me when priced"}
          className="tier-cta"
          style={ctaStyle}
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

// USD (Paddle) / INR (Razorpay) switch. Only rendered when Razorpay is
// configured and at least one tier has an INR plan; defaults to INR for
// visitors who look Indian (geo header / Accept-Language), USD otherwise.
function CurrencyToggle({ value, onChange }: { value: "usd" | "inr"; onChange: (v: "usd" | "inr") => void }) {
  const opt = (v: "usd" | "inr", label: string) => (
    <button
      type="button"
      onClick={() => onChange(v)}
      aria-pressed={value === v}
      style={{
        padding: "7px 14px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        border: "none",
        background: value === v ? "var(--surface-alt)" : "transparent",
        color: value === v ? "var(--text)" : "var(--muted)",
      }}
    >
      {label}
    </button>
  );
  return (
    <div role="group" aria-label="Currency" style={{ display: "inline-flex", gap: 2, padding: 3, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg)", marginBottom: 20 }}>
      {opt("usd", "Pay in USD")}
      {opt("inr", "Pay in ₹ INR · UPI")}
    </div>
  );
}

function PricingSection({ product, dbAgent }: { product: AgentProduct; dbAgent: OperationalAgent | null }) {
  const plans = useRazorpayPlans(product.status === "live" ? product.slug : null);
  const [choice, setChoice] = useState<"usd" | "inr" | null>(null);
  const inrAvailable = plans.enabled && plans.tiers.length > 0;
  const currency = inrAvailable ? (choice ?? (plans.suggestInr ? "inr" : "usd")) : "usd";
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
        {product.status === "live" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              padding: 18,
              marginBottom: 20,
              borderRadius: 2,
              background: "var(--bg)",
              border: "1px solid var(--border-strong)",
            }}
          >
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>Try it on your own site first</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>
                {TRIAL_DAYS} days, {TRIAL_MESSAGE_LIMIT} messages, no card. Sign in with Google and you get a real embed code.
              </div>
            </div>
            <StartTrialButton
              agentSlug={product.slug}
              label="Start free trial"
              className="trial-cta"
              style={{ padding: "11px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, background: "var(--surface-alt)", color: "var(--text)", border: "1px solid var(--border-strong)" }}
            />
          </div>
        )}
        {inrAvailable && <CurrencyToggle value={currency} onChange={setChoice} />}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="tier-grid">
          {product.tiers.map((tier) => {
            const dbTier = dbAgent?.tiers.find((t) => t.name === tier.name.toLowerCase());
            const inr = currency === "inr" ? plans.tiers.find((t) => t.tierName === tier.name.toLowerCase()) : undefined;
            return (
              <TierCard key={tier.name} tier={tier} product={product} dbTier={dbTier} agentId={dbAgent?.id} inr={inr} />
            );
          })}
        </div>
      </div>
      <style>{`
        .tier-cta:hover { background: var(--accent-mid) !important; }
        .trial-cta:hover { filter: brightness(1.08); }
        @media (max-width: 700px) {
          .tier-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// Generic trial FAQ, shown on live agents only. Kept here rather than in
// agentCatalog.ts so the trial numbers come from app/lib/trial.ts.
const TRIAL_FAQ = {
  question: "Is there a free trial?",
  answer: `Yes. Sign in with Google and start a ${TRIAL_DAYS}-day trial with ${TRIAL_MESSAGE_LIMIT} messages. No card needed. You get a real API key and embed code, so you can test it on your own site. When the trial ends or the messages run out, the widget stops replying until you pick a plan. Upgrading keeps the same key, so nothing on your site needs to change. One trial per agent per account.`,
};

function FAQSection({ product }: { product: AgentProduct }) {
  const faq = product.status === "live" ? [TRIAL_FAQ, ...product.faq] : product.faq;
  return (
    <section style={{ padding: "64px 24px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--text)", margin: "0 0 24px" }}>
          FAQ
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {faq.map((f) => (
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

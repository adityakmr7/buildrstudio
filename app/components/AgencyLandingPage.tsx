"use client";

import React, { useState, useEffect } from "react";
import CalBookingButton, { CalLoader } from "./CalBookingButton";
import Link from "next/link";
import Image from "next/image";
import {
  Robot,
  FlowArrow,
  Brain,
  Database,
  ArrowRight,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Minus,
  Plus,
  CaretDown,
} from "@phosphor-icons/react";

// ─── NAV ───────────────────────────────────────────────────────────────────

function AgencyNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 64,
        display: "flex",
        alignItems: "center",
        transition: "background 0.3s, border-color 0.3s",
        background: scrolled ? "rgba(8,11,15,0.90)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
      }}
    >
      <div style={{
        maxWidth: 1280,
        margin: "0 auto",
        width: "100%",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", color: "#F5F5F5" }}>
            Buildr<span style={{ color: "#3B82F6" }}>Studio</span>
          </span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {[
            { label: "Services", href: "#services" },
            { label: "Process", href: "#process" },
            { label: "ROI Estimator", href: "#roi" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-link"
              style={{ fontSize: 14, color: "rgba(245,245,245,0.50)", textDecoration: "none", transition: "color 0.2s" }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <CalBookingButton
          className="cta-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
            padding: "10px 20px",
            borderRadius: 8,
            background: "#2563EB",
            color: "#fff",
            transition: "background 0.2s",
          }}
        >
          Book an AI Audit
          <ArrowRight size={13} weight="bold" />
        </CalBookingButton>
      </div>

      <style>{`
        .nav-link:hover { color: #F5F5F5 !important; }
        .cta-btn:hover { background: #1D4ED8 !important; }
      `}</style>
    </header>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────

function AgencyHero() {
  return (
    <section
      style={{
        position: "relative",
        background: "#080B0F",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Grid texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
      }} />
      {/* Radial glow */}
      <div style={{
        position: "absolute", top: 0, left: "-10%", width: "55%", height: "100%", pointerEvents: "none",
        background: "radial-gradient(ellipse at 20% 50%, rgba(37,99,235,0.14) 0%, transparent 65%)",
      }} />

      <div style={{
        position: "relative",
        maxWidth: 1280,
        margin: "0 auto",
        width: "100%",
        padding: "80px 24px 48px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 48,
        alignItems: "center",
      }}
        className="hero-grid"
      >
        {/* Left copy */}
        <div>
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 11, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.16em",
            padding: "6px 12px", borderRadius: 999,
            color: "#3B82F6",
            background: "rgba(59,130,246,0.10)",
            border: "1px solid rgba(59,130,246,0.22)",
            marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3B82F6", display: "inline-block" }} />
            AI Automation Agency
          </div>

          <h1 style={{
            fontSize: "clamp(38px, 5vw, 62px)",
            fontWeight: 700,
            lineHeight: 1.06,
            letterSpacing: "-0.03em",
            color: "#F5F5F5",
            margin: "0 0 20px",
          }}>
            We Build AI That{" "}
            <br />
            Works{" "}
            <em style={{ color: "#3B82F6", fontStyle: "italic" }}>For You</em>
          </h1>

          <p style={{
            fontSize: 17,
            lineHeight: 1.65,
            color: "rgba(245,245,245,0.55)",
            maxWidth: "46ch",
            margin: "0 0 36px",
          }}>
            Custom AI agents, n8n workflow automation, and RAG pipelines that
            eliminate manual ops — deployed in weeks, not months.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
            <CalBookingButton
              className="hero-cta-primary"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "13px 24px", borderRadius: 9, fontSize: 14, fontWeight: 600,
                background: "#2563EB", color: "#fff",
                transition: "all 0.2s",
              }}
            >
              Book an AI Audit
              <ArrowRight size={15} weight="bold" />
            </CalBookingButton>
            <a
              href="#services"
              className="hero-cta-secondary"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "13px 24px", borderRadius: 9, fontSize: 14, fontWeight: 500,
                color: "rgba(245,245,245,0.75)", textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.13)",
                background: "rgba(255,255,255,0.04)",
                transition: "all 0.2s",
              }}
            >
              See our services
              <CaretDown size={13} />
            </a>
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {["OpenAI Partner", "n8n Certified", "SOC-2 Aware"].map((badge) => (
              <div key={badge} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "rgba(245,245,245,0.38)" }}>
                <CheckCircle size={13} weight="fill" style={{ color: "#22c55e" }} />
                {badge}
              </div>
            ))}
          </div>
        </div>

        {/* Right: image */}
        <div className="hero-image-col" style={{ position: "relative" }}>
          <div style={{
            position: "absolute", inset: -24, pointerEvents: "none",
            background: "radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.12) 0%, transparent 70%)",
            borderRadius: 24,
          }} />
          <div style={{
            position: "relative",
            borderRadius: 18,
            overflow: "hidden",
            border: "1px solid rgba(59,130,246,0.16)",
            boxShadow: "0 0 80px rgba(37,99,235,0.10), 0 24px 64px rgba(0,0,0,0.55)",
          }}>
            <Image
              src="/hero-workflow.png"
              alt="AI agent workflow diagram"
              width={700}
              height={525}
              style={{ width: "100%", height: "auto", display: "block" }}
              priority
            />
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        color: "rgba(245,245,245,0.20)",
      }}>
        <span style={{ fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.18em" }}>Scroll</span>
        <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, rgba(59,130,246,0.5), transparent)" }} />
      </div>

      <style>{`
        .hero-cta-primary:hover { background: #1D4ED8 !important; transform: translateY(-1px); }
        .hero-cta-secondary:hover { background: rgba(255,255,255,0.08) !important; color: #F5F5F5 !important; }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; padding-top: 100px !important; }
          .hero-image-col { display: none !important; }
        }
      `}</style>
    </section>
  );
}

// ─── PROOF STRIP ───────────────────────────────────────────────────────────

const TECH_LOGOS = [
  { name: "OpenAI", slug: "openai" },
  { name: "Anthropic", slug: "anthropic" },
  { name: "n8n", slug: "n8n" },
  { name: "Supabase", slug: "supabase" },
  { name: "Pinecone", slug: "pineconedata" },
  { name: "LangChain", slug: "langchain" },
  { name: "Vercel", slug: "vercel" },
  { name: "PostgreSQL", slug: "postgresql" },
];

function ProofStrip() {
  return (
    <section style={{
      padding: "40px 0",
      background: "#0C1015",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      overflow: "hidden",
    }}>
      <p style={{
        textAlign: "center", fontSize: 10, fontFamily: "monospace",
        textTransform: "uppercase", letterSpacing: "0.18em",
        color: "rgba(245,245,245,0.22)", marginBottom: 28,
      }}>
        Built with the tools that power the modern AI stack
      </p>

      <div style={{ position: "relative" }}>
        {/* Fade edges */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, zIndex: 1, background: "linear-gradient(to right, #0C1015, transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, zIndex: 1, background: "linear-gradient(to left, #0C1015, transparent)", pointerEvents: "none" }} />

        <div style={{ display: "flex", gap: 48, alignItems: "center", animation: "agency-marquee 30s linear infinite", width: "max-content" }}>
          {[...TECH_LOGOS, ...TECH_LOGOS].map((logo, i) => (
            <div key={`${logo.slug}-${i}`} style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0, color: "rgba(245,245,245,0.35)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://cdn.simpleicons.org/${logo.slug}/888888`}
                alt={logo.name}
                width={18}
                height={18}
                style={{ opacity: 0.55, flexShrink: 0 }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
              <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes agency-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes agency-marquee { from, to { transform: none; } }
        }
      `}</style>
    </section>
  );
}

// ─── SERVICES BENTO ────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: Robot,
    title: "AI Support Agents",
    description:
      "Context-aware conversational agents trained on your docs, ticketing system, and CRM — handling 60–80% of support volume autonomously.",
    accent: "#2563EB",
    accentBg: "rgba(37,99,235,0.07)",
  },
  {
    icon: FlowArrow,
    title: "n8n / Make Automation",
    description:
      "End-to-end workflow automation connecting your entire SaaS stack — no manual handoffs, no missed triggers.",
    accent: "#0EA5E9",
    accentBg: "rgba(14,165,233,0.07)",
  },
  {
    icon: Brain,
    title: "Custom Multi-Agent Systems",
    description:
      "Orchestrated agent networks that research, decide, and act — from lead qualification pipelines to autonomous reporting systems.",
    accent: "#6366F1",
    accentBg: "rgba(99,102,241,0.07)",
  },
  {
    icon: Database,
    title: "RAG Knowledge Base Integration",
    description:
      "Retrieval-augmented pipelines over your internal docs, knowledge base, and product data — accurate answers grounded in your source of truth.",
    accent: "#10B981",
    accentBg: "rgba(16,185,129,0.07)",
  },
];

function ServiceCard({ service }: { service: typeof SERVICES[0] }) {
  const Icon = service.icon;
  return (
    <div
      className="service-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 28,
        borderRadius: 14,
        height: "100%",
        background: service.accentBg,
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "border-color 0.25s, background 0.25s",
        boxSizing: "border-box",
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
        background: `${service.accent}1A`,
        border: `1px solid ${service.accent}33`,
        color: service.accent,
        flexShrink: 0,
      }}>
        <Icon size={22} weight="duotone" />
      </div>

      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#F5F5F5", margin: "0 0 8px" }}>
          {service.title}
        </h3>
        <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "rgba(245,245,245,0.50)", margin: 0 }}>
          {service.description}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, color: service.accent, opacity: 0, transition: "opacity 0.2s" }} className="service-card-arrow">
        Learn more <ArrowRight size={11} weight="bold" />
      </div>
    </div>
  );
}

function ServicesSection() {
  return (
    <section id="services" style={{ padding: "96px 0", background: "#080B0F" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 52 }}>
          <h2 style={{
            fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em",
            lineHeight: 1.1, color: "#F5F5F5", margin: "0 0 14px",
          }}>
            What we build
          </h2>
          <p style={{ fontSize: 15, color: "rgba(245,245,245,0.45)", maxWidth: "52ch", margin: 0 }}>
            Four core automation disciplines. Each engineered for your stack, your data, your ops.
          </p>
        </div>

        {/* Grid — 2 rows: [wide card | narrow card] + [narrow | wide] */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto auto", gap: 16 }} className="services-grid">
          {/* Row 1: Service 0 spans 1 col (left), Service 1 spans 1 col (right) — Service 0 gets a big card */}
          <div style={{ gridColumn: "1 / 2", gridRow: "1 / 2" }}>
            <ServiceCard service={SERVICES[0]} />
          </div>
          <div style={{ gridColumn: "2 / 3", gridRow: "1 / 2" }}>
            <ServiceCard service={SERVICES[1]} />
          </div>
          {/* Row 2: Service 2 (left), Service 3 (right, wider) */}
          <div style={{ gridColumn: "1 / 2", gridRow: "2 / 3" }}>
            <ServiceCard service={SERVICES[2]} />
          </div>
          <div style={{ gridColumn: "2 / 3", gridRow: "2 / 3" }}>
            <ServiceCard service={SERVICES[3]} />
          </div>
        </div>
      </div>

      <style>{`
        .service-card:hover { border-color: rgba(255,255,255,0.14) !important; background: rgba(255,255,255,0.04) !important; }
        .service-card:hover .service-card-arrow { opacity: 1 !important; }
        @media (max-width: 700px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── ROI ESTIMATOR ─────────────────────────────────────────────────────────

const HOURLY_VALUE = 60;
const AUTOMATION_RATE = 0.72;

function ROIEstimator() {
  const [weeklyHours, setWeeklyHours] = useState(20);

  const clamp = (v: number) => Math.max(2, Math.min(80, v));
  const monthlyHoursReclaimed = Math.round(weeklyHours * 4 * AUTOMATION_RATE);
  const monthlySaving = monthlyHoursReclaimed * HOURLY_VALUE;
  const annualSaving = monthlySaving * 12;
  const pct = ((weeklyHours - 2) / 78) * 100;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const stats = [
    { label: "Hours reclaimed / month", value: `${monthlyHoursReclaimed}h`, icon: Clock, accent: "#3B82F6" },
    { label: "Monthly value recovered", value: fmt(monthlySaving), icon: ArrowUpRight, accent: "#10B981" },
    { label: "Annual impact", value: fmt(annualSaving), icon: ArrowUpRight, accent: "#6366F1" },
  ];

  return (
    <section id="roi" style={{ padding: "96px 0", background: "#0C1015" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#F5F5F5", margin: "0 0 12px" }}>
            Calculate your ROI
          </h2>
          <p style={{ fontSize: 15, color: "rgba(245,245,245,0.45)", margin: 0 }}>
            See how much time and money automation reclaims for your team.
          </p>
        </div>

        {/* Card */}
        <div style={{
          borderRadius: 18,
          padding: "40px 40px 32px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.09)",
        }}>
          {/* Slider row */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <label htmlFor="roi-slider" style={{ fontSize: 14, color: "rgba(245,245,245,0.65)" }}>
                Manual ops hours per <strong style={{ color: "#F5F5F5" }}>week</strong>
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => setWeeklyHours(h => clamp(h - 2))}
                  aria-label="Decrease"
                  style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "#F5F5F5", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Minus size={13} weight="bold" />
                </button>
                <span style={{ fontSize: 24, fontWeight: 700, color: "#3B82F6", minWidth: 60, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
                  {weeklyHours}h
                </span>
                <button
                  onClick={() => setWeeklyHours(h => clamp(h + 2))}
                  aria-label="Increase"
                  style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", color: "#F5F5F5", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Plus size={13} weight="bold" />
                </button>
              </div>
            </div>

            <input
              id="roi-slider"
              type="range"
              min={2} max={80} step={2}
              value={weeklyHours}
              onChange={e => setWeeklyHours(Number(e.target.value))}
              style={{
                width: "100%",
                height: 5,
                borderRadius: 3,
                outline: "none",
                cursor: "pointer",
                background: `linear-gradient(to right, #2563EB ${pct}%, rgba(255,255,255,0.12) ${pct}%)`,
                accentColor: "#2563EB",
                appearance: "none",
                WebkitAppearance: "none",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 11, color: "rgba(245,245,245,0.25)" }}>2h</span>
              <span style={{ fontSize: 11, color: "rgba(245,245,245,0.25)" }}>80h</span>
            </div>
          </div>

          {/* Stats — 3 equal columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }} className="roi-stats-grid">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} style={{
                  padding: "18px 16px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}>
                  <Icon size={16} weight="duotone" style={{ color: stat.accent, marginBottom: 10, display: "block" }} />
                  <div style={{ fontSize: 26, fontWeight: 700, color: stat.accent, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 6, fontVariantNumeric: "tabular-nums" }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(245,245,245,0.40)", lineHeight: 1.4 }}>{stat.label}</div>
                </div>
              );
            })}
          </div>

          <p style={{ marginTop: 20, fontSize: 11, textAlign: "center", color: "rgba(245,245,245,0.22)" }}>
            Estimate based on 72% automation rate and {fmt(HOURLY_VALUE)}/hr blended ops cost. Actual results vary.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .roi-stats-grid { grid-template-columns: 1fr !important; }
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #2563EB;
          border: 2px solid #fff;
          cursor: pointer;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.25);
        }
        input[type="range"]::-moz-range-thumb {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #2563EB;
          border: 2px solid #fff;
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}

// ─── PROCESS ───────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    title: "AI Audit",
    description:
      "A 60-minute deep-dive into your current workflows, tool stack, and highest-leverage automation opportunities. We map the exact ROI before writing a single line of code.",
    duration: "Week 1",
  },
  {
    num: "02",
    title: "Build & Integrate",
    description:
      "We architect and deploy your custom agents, workflows, or RAG pipeline — fully integrated with your existing stack. Weekly progress updates, no black boxes.",
    duration: "Weeks 2–5",
  },
  {
    num: "03",
    title: "Deploy & Handoff",
    description:
      "Production deployment with full monitoring, runbooks, and a live handoff session. Your team runs it; we stay on retainer if you want to scale.",
    duration: "Week 6+",
  },
];

function ProcessSection() {
  return (
    <section id="process" style={{ padding: "96px 0", background: "#080B0F" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="process-grid">
          {/* Left: header (no sticky — was causing overlap) */}
          <div>
            <h2 style={{
              fontSize: "clamp(28px, 3.8vw, 50px)", fontWeight: 700, letterSpacing: "-0.03em",
              lineHeight: 1.1, color: "#F5F5F5", margin: "0 0 18px",
            }}>
              From audit to deployed — in 6 weeks
            </h2>
            <p style={{ fontSize: 15, color: "rgba(245,245,245,0.45)", maxWidth: "40ch", margin: "0 0 28px" }}>
              A repeatable, low-friction engagement model built for teams that can&apos;t afford a 6-month integration project.
            </p>
            <CalBookingButton
              className="process-cta"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 22px", borderRadius: 9, fontSize: 14, fontWeight: 600,
                background: "#2563EB", color: "#fff",
                transition: "background 0.2s",
              }}
            >
              Book an AI Audit
              <ArrowRight size={14} weight="bold" />
            </CalBookingButton>
          </div>

          {/* Right: steps */}
          <div>
            {STEPS.map((step, i) => (
              <div key={step.num} style={{ display: "flex", gap: 20, paddingBottom: i < STEPS.length - 1 ? 40 : 0, position: "relative" }}>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div style={{
                    position: "absolute", left: 19, top: 44, bottom: 0, width: 1,
                    background: "linear-gradient(to bottom, rgba(37,99,235,0.40), rgba(37,99,235,0.04))",
                  }} />
                )}
                {/* Number */}
                <div style={{
                  flexShrink: 0, width: 40, height: 40, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontFamily: "monospace", fontWeight: 700,
                  background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.35)", color: "#3B82F6",
                }}>
                  {step.num}
                </div>
                {/* Content */}
                <div style={{ paddingTop: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#F5F5F5", margin: 0 }}>{step.title}</h3>
                    <span style={{
                      fontSize: 11, fontFamily: "monospace", padding: "2px 8px", borderRadius: 999,
                      color: "rgba(245,245,245,0.35)", border: "1px solid rgba(255,255,255,0.09)",
                    }}>{step.duration}</span>
                  </div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "rgba(245,245,245,0.50)", margin: 0 }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .process-cta:hover { background: #1D4ED8 !important; }
        @media (max-width: 768px) {
          .process-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}

// ─── TESTIMONIALS ──────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote:
      "The AI support agent Buildr Studio built handles 70% of our first-response tickets without human intervention. Our support team now focuses exclusively on complex issues.",
    name: "James R.",
    role: "VP of Operations",
    company: "Series B SaaS",
  },
  {
    quote:
      "They mapped our entire onboarding workflow, found 14 hours of weekly manual work we didn't even notice, and automated 11 of them in three weeks.",
    name: "Priya M.",
    role: "Head of RevOps",
    company: "E-commerce Scale-up",
  },
];

function TestimonialsSection() {
  return (
    <section style={{ padding: "96px 0", background: "#0C1015" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#F5F5F5", margin: "0 0 44px" }}>
          What clients say
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} style={{
              display: "flex", flexDirection: "column", gap: 18, padding: 28, borderRadius: 14,
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div style={{ fontSize: 40, lineHeight: 0.8, color: "rgba(37,99,235,0.45)", fontFamily: "Georgia, serif" }}>&ldquo;</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "rgba(245,245,245,0.70)", margin: 0, flex: 1 }}>{t.quote}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, background: "rgba(37,99,235,0.15)", color: "#3B82F6", flexShrink: 0 }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#F5F5F5" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(245,245,245,0.38)" }}>{t.role}, {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 20, fontSize: 11, textAlign: "center", color: "rgba(245,245,245,0.20)" }}>
          Sample testimonials — representative of client outcomes.
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

// ─── CTA BANNER ────────────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section style={{ padding: "96px 0", background: "#080B0F", position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.16) 0%, transparent 60%)",
      }} />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative" }}>
        <h2 style={{ fontSize: "clamp(30px, 4.5vw, 54px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.08, color: "#F5F5F5", margin: "0 0 18px" }}>
          Ready to automate?
        </h2>
        <p style={{ fontSize: 15, color: "rgba(245,245,245,0.45)", maxWidth: "40ch", margin: "0 auto 36px" }}>
          Book a free 60-minute AI Audit and we&apos;ll identify your top automation opportunities — no commitment.
        </p>
        <CalBookingButton
          className="cta-banner-btn"
          style={{
            display: "inline-flex", alignItems: "center", gap: 9,
            padding: "15px 32px", borderRadius: 10, fontSize: 15, fontWeight: 600,
            background: "#2563EB", color: "#fff",
            transition: "all 0.2s",
          }}
        >
          Book an AI Audit
          <ArrowRight size={16} weight="bold" />
        </CalBookingButton>
      </div>
      <style>{`.cta-banner-btn:hover { background: #1D4ED8 !important; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(37,99,235,0.30); }`}</style>
    </section>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────

function AgencyFooter() {
  return (
    <footer style={{ padding: "32px 0", background: "#080B0F", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#F5F5F5" }}>
          Buildr<span style={{ color: "#3B82F6" }}>Studio</span>
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          {[
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "hello@buildrstudio.in", href: "mailto:hello@buildrstudio.in" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="footer-link"
              style={{ fontSize: 12, color: "rgba(245,245,245,0.32)", textDecoration: "none", transition: "color 0.2s" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p style={{ fontSize: 12, color: "rgba(245,245,245,0.20)", margin: 0 }}>
          © {new Date().getFullYear()} Buildr Studio
        </p>
      </div>
      <style>{`.footer-link:hover { color: rgba(245,245,245,0.75) !important; }`}</style>
    </footer>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────

export default function AgencyLandingPage() {
  return (
    <div style={{ background: "#080B0F", minHeight: "100svh" }}>
      {/* Pre-loads Cal.com embed script so the modal opens instantly */}
      <CalLoader />
      <AgencyNav />
      <AgencyHero />
      <ProofStrip />
      <ServicesSection />
      <ROIEstimator />
      <ProcessSection />
      <TestimonialsSection />
      <CTABanner />
      <AgencyFooter />
    </div>
  );
}

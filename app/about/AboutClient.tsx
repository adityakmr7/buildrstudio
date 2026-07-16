"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SPEC_ROWS = [
  { label: "BASED",   value: "Bengaluru, India" },
  { label: "ROLE",    value: "Full-Stack Engineer" },
  { label: "CURRENT", value: "SDE-2 @ Groww" },
  { label: "STATUS",  value: "Open to Work" },
  { label: "STACK",   value: "React · React Native · Next.js · TypeScript · AI/LLM" },
  { label: "XP",      value: "5+ years · Fintech & SaaS" },
];

const SKILLS = [
  { category: "Frontend",       items: ["React / Next.js — 95", "React Native — 92", "TypeScript — 90", "Redux / Zustand — 85"] },
  { category: "Backend",        items: ["Node.js — 88", "REST APIs — 90", "GraphQL — 82", "WebSockets — 78"] },
  { category: "AI / ML",        items: ["LLM APIs (OpenAI/Gemini) — 85", "Prompt Engineering — 88", "RAG Pipelines — 80", "AI Agents — 75"] },
  { category: "Infrastructure", items: ["PostgreSQL / MongoDB — 86", "CI/CD Pipelines — 85", "AWS / Docker — 80", "Redis / Caching — 78"] },
];

const ACHIEVEMENTS = [
  { title: "10+ products shipped to production",           meta: "Ship Master" },
  { title: "3 apps published on iOS App Store",           meta: "App Store Pioneer" },
  { title: "3+ years building wealth management at scale", meta: "Fintech Veteran" },
  { title: "LLM APIs integrated into production apps",     meta: "AI Integration" },
  { title: "npm package with community adoption",          meta: "Open Source" },
  { title: "Reduced UI latency by 40% in production",     meta: "Performance" },
  { title: "Autonomous AI chatbot with human escalation",  meta: "AI Agent Builder" },
];

const PROJECTS = [
  {
    name: "BuildrStudio",
    role: "Founder & Lead Engineer",
    desc: "AI-powered screenshot generator for indie developers. Full-stack: Next.js, Gemini API, PostgreSQL, LemonSqueezy billing.",
    tags: ["Next.js", "Gemini API", "PostgreSQL"],
    href: "/screenshot-builder",
    status: "Active",
  },
  {
    name: "AI Customer Support Chatbot",
    role: "Full-Stack AI Engineer",
    desc: "Intelligent support agent with streaming chat UI, auto-escalation to humans, and 24/7 availability. Built with Vercel AI SDK.",
    tags: ["Next.js 16", "Gemini API", "Vercel AI SDK"],
    href: "https://github.com/adityakmr7",
    status: "Complete",
  },
  {
    name: "AI Resume Assistant",
    role: "Full-Stack AI Engineer",
    desc: "Semantic search + RAG pipeline that matches resumes to job descriptions with structured LLM output.",
    tags: ["React", "RAG", "LLM APIs"],
    href: "https://github.com/adityakmr7",
    status: "Complete",
  },
  {
    name: "Anchor — Tiny Habits",
    role: "iOS Developer",
    desc: "Minimal iOS habit tracker with streak system. Swift & SwiftUI, zero-friction daily check-ins.",
    tags: ["Swift", "SwiftUI", "iOS"],
    href: "/anchor/support",
    status: "Live",
  },
  {
    name: "React Native Toastify",
    role: "Creator & Maintainer",
    desc: "Open-source notification library for React Native with active community adoption.",
    tags: ["React Native", "TypeScript", "npm"],
    href: "https://github.com/adityakmr7",
    status: "Maintained",
  },
];

const EXPERIENCE = [
  { role: "SDE-2",         company: "Groww",            period: "Aug 2025 — Present",      desc: "Wealth management products at scale. React Native + TypeScript." },
  { role: "SDE-2",         company: "Fisdom → Groww",   period: "Oct 2024 — Aug 2025",     desc: "Reduced UI latency 40%. Platform performance +35%." },
  { role: "SDE-1",         company: "Fisdom",            period: "Jul 2022 — Oct 2024",     desc: "Full-stack fintech: mutual funds, portfolio, REST + GraphQL APIs." },
  { role: "Associate Dev", company: "Bluespacelabs",    period: "Mar 2021 — May 2022",     desc: "SaaS communication platform. WebSockets + real-time systems." },
  { role: "Web Developer", company: "IIH Global",       period: "Jul 2020 — Feb 2021",     desc: "Modernized legacy apps with React + Redux." },
];

export default function AboutClient() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("adityakmr9672@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ab">
      <style>{`
        /* ── Base ── */
        .ab {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text-1);
          font-family: var(--font);
        }
        .ab-inner {
          max-width: 780px;
          margin: 0 auto;
          padding: 80px 32px 120px;
        }

        /* ── Accent ── */
        .ab-accent { color: var(--fill); }
        .ab-accent-bg { background: var(--fill); color: var(--fill-text); }
        .ab-accent-underline {
          display: inline-block;
          border-bottom: 3px solid var(--fill);
          padding-bottom: 2px;
        }

        /* ── Hero ── */
        .ab-hero { margin-bottom: 80px; }
        .ab-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-3);
          margin-bottom: 24px;
          font-family: monospace;
        }
        .ab-eyebrow-sq {
          width: 10px; height: 10px;
          background: var(--fill);
          display: inline-block;
          flex-shrink: 0;
        }
        .ab-headline {
          font-size: clamp(48px, 8vw, 88px);
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -3px;
          text-transform: uppercase;
          margin: 0 0 40px;
          color: var(--text-1);
        }
        .ab-headline-hl {
          display: inline-block;
          background: var(--fill);
          color: var(--fill-text);
          padding: 0 8px;
          letter-spacing: -3px;
        }

        /* ── Avatar row ── */
        .ab-identity {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 40px;
        }
        .ab-avatar {
          width: 64px; height: 64px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--border);
          flex-shrink: 0;
        }
        .ab-bio {
          font-size: 15px;
          color: var(--text-2);
          line-height: 1.65;
        }

        /* ── Spec table ── */
        .ab-spec {
          border: 1px solid var(--text-1);
          margin-bottom: 40px;
        }
        .ab-spec-header {
          background: var(--text-1);
          color: var(--bg);
          padding: 10px 16px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-family: monospace;
        }
        .ab-spec-row {
          display: grid;
          grid-template-columns: 100px 1fr;
          border-top: 1px solid var(--border);
        }
        .ab-spec-row:first-of-type { border-top: none; }
        .ab-spec-key {
          padding: 11px 16px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-3);
          font-family: monospace;
          border-right: 1px solid var(--border);
        }
        .ab-spec-val {
          padding: 11px 16px;
          font-size: 13px;
          color: var(--text-1);
          font-weight: 500;
        }

        /* ── CTA buttons ── */
        .ab-ctas { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 80px; }
        .ab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 24px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.15s;
          border: 1.5px solid var(--text-1);
          font-family: var(--font);
        }
        .ab-btn:hover { opacity: 0.75; }
        .ab-btn-fill { background: var(--fill); color: var(--fill-text); border-color: var(--fill); }
        .ab-btn-outline { background: transparent; color: var(--text-1); }

        /* ── Section label ── */
        .ab-section { margin-bottom: 64px; }
        .ab-section-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-3);
          margin-bottom: 20px;
          font-family: monospace;
        }

        /* ── Skills ── */
        .ab-skills-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border: 1px solid var(--border);
        }
        .ab-skill-group { border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 20px; }
        .ab-skill-group:nth-child(2n) { border-right: none; }
        .ab-skill-group:nth-last-child(-n+2) { border-bottom: none; }
        .ab-skill-cat {
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; font-family: monospace;
          color: var(--fill); margin-bottom: 12px;
        }
        .ab-skill-item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid var(--border);
          font-size: 13px; color: var(--text-2);
        }
        .ab-skill-item:last-child { border-bottom: none; }
        .ab-skill-num { font-family: monospace; font-size: 12px; color: var(--fill); font-weight: 700; }

        /* ── Achievements ── */
        .ab-ach-list { border: 1px solid var(--border); }
        .ab-ach-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: center;
          padding: 14px 20px;
          border-bottom: 1px solid var(--border);
          transition: background 0.12s;
        }
        .ab-ach-row:last-child { border-bottom: none; }
        .ab-ach-row:hover { background: var(--surface); }
        .ab-ach-title { font-size: 14px; color: var(--text-1); font-weight: 500; }
        .ab-ach-meta {
          font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; font-family: monospace;
          color: var(--fill); white-space: nowrap;
        }

        /* ── Projects ── */
        .ab-project {
          border: 1px solid var(--border);
          margin-bottom: -1px;
          padding: 24px;
          text-decoration: none;
          display: block;
          color: var(--text-1);
          transition: background 0.12s;
          position: relative;
        }
        .ab-project:hover { background: var(--surface); }
        .ab-project-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 6px; }
        .ab-project-name {
          font-size: 18px; font-weight: 800; letter-spacing: -0.5px;
          border-bottom: 2px solid var(--fill); padding-bottom: 1px; display: inline-block;
        }
        .ab-project-status {
          font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          font-family: monospace; color: var(--text-3); white-space: nowrap; padding-top: 4px;
        }
        .ab-project-status.active { color: var(--fill); }
        .ab-project-role { font-size: 11px; color: var(--text-3); font-family: monospace; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
        .ab-project-desc { font-size: 13px; color: var(--text-2); line-height: 1.6; margin-bottom: 12px; }
        .ab-project-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .ab-project-tag {
          font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          font-family: monospace; padding: 3px 8px; border: 1px solid var(--border);
          color: var(--text-3);
        }

        /* ── Experience ── */
        .ab-exp-list { border: 1px solid var(--border); }
        .ab-exp-row {
          display: grid; grid-template-columns: 160px 1fr;
          border-bottom: 1px solid var(--border);
          transition: background 0.12s;
        }
        .ab-exp-row:last-child { border-bottom: none; }
        .ab-exp-row:hover { background: var(--surface); }
        .ab-exp-period {
          padding: 16px 20px;
          font-size: 11px; font-weight: 700; color: var(--text-3);
          font-family: monospace; border-right: 1px solid var(--border);
          line-height: 1.5;
        }
        .ab-exp-body { padding: 16px 20px; }
        .ab-exp-role { font-size: 14px; font-weight: 700; color: var(--text-1); }
        .ab-exp-co { font-size: 12px; color: var(--fill); font-weight: 600; margin-bottom: 4px; }
        .ab-exp-desc { font-size: 12px; color: var(--text-2); line-height: 1.5; }

        /* ── Contact ── */
        .ab-contact {
          border: 1px solid var(--text-1);
          padding: 48px 40px;
          text-align: center;
        }
        .ab-contact-headline {
          font-size: clamp(32px, 5vw, 52px); font-weight: 900;
          letter-spacing: -2px; text-transform: uppercase;
          line-height: 1; margin-bottom: 16px;
        }
        .ab-contact-sub { font-size: 14px; color: var(--text-2); line-height: 1.7; max-width: 440px; margin: 0 auto 32px; }

        /* ── Ticker ── */
        .ab-ticker {
          overflow: hidden; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          background: var(--text-1); color: var(--bg); margin: 64px 0;
          padding: 12px 0; white-space: nowrap;
        }
        .ab-ticker-inner {
          display: inline-flex; gap: 48px;
          animation: ab-scroll 20s linear infinite;
          font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; font-family: monospace;
        }
        @keyframes ab-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .ab-inner { padding: 48px 20px 80px; }
          .ab-headline { letter-spacing: -2px; }
          .ab-skills-grid { grid-template-columns: 1fr; }
          .ab-skill-group { border-right: none; border-bottom: 1px solid var(--border); }
          .ab-skill-group:last-child { border-bottom: none; }
          .ab-exp-row { grid-template-columns: 1fr; }
          .ab-exp-period { border-right: none; border-bottom: 1px solid var(--border); }
          .ab-contact { padding: 32px 20px; }
          .ab-spec-row { grid-template-columns: 90px 1fr; }
        }
      `}</style>

      <div className="ab-inner">

        {/* ── HERO ── */}
        <section className="ab-hero">
          <div className="ab-eyebrow">
            <span className="ab-eyebrow-sq" />
            Full-Stack Engineer &nbsp;·&nbsp; Builder &nbsp;·&nbsp; Bengaluru, India
          </div>

          <h1 className="ab-headline">
            YOU BUILD IT.<br />
            <span className="ab-headline-hl">I SHIP IT.</span>
          </h1>

          <div className="ab-identity">
            <div className="ab-avatar">
              <Image src="/aditya-avatar.png" alt="Aditya Kumar" width={64} height={64} style={{ width: "100%", height: "100%", objectFit: "cover" }} priority />
            </div>
            <p className="ab-bio">
              Senior Software Engineer with 5+ years designing and scaling full-stack web and mobile apps across Fintech and SaaS. Specialized in AI/LLM integrations, React Native, and high-performance systems.
            </p>
          </div>

          <div className="ab-spec">
            <div className="ab-spec-header">Builder Spec</div>
            {SPEC_ROWS.map(row => (
              <div className="ab-spec-row" key={row.label}>
                <div className="ab-spec-key">{row.label}</div>
                <div className="ab-spec-val">{row.value}</div>
              </div>
            ))}
          </div>

          <div className="ab-ctas">
            <a href="https://topmate.io/adityakmr/" target="_blank" rel="noopener noreferrer" className="ab-btn ab-btn-fill">Book a Call →</a>
            <button className="ab-btn ab-btn-outline" onClick={handleCopyEmail}>
              {copied ? "Copied!" : "Copy Email"}
            </button>
            <a href="https://github.com/adityakmr7" target="_blank" rel="noopener noreferrer" className="ab-btn ab-btn-outline">GitHub</a>
            <a href="https://x.com/adityakmr7" target="_blank" rel="noopener noreferrer" className="ab-btn ab-btn-outline">X / Twitter</a>
            <a href="https://linkedin.com/in/adityakmr7" target="_blank" rel="noopener noreferrer" className="ab-btn ab-btn-outline">LinkedIn</a>
          </div>
        </section>

        {/* ── TICKER ── */}
        <div className="ab-ticker">
          <div className="ab-ticker-inner">
            {["React Native", "Next.js", "TypeScript", "Node.js", "GraphQL", "PostgreSQL", "AI/LLM APIs", "AWS", "RAG Pipelines", "Prompt Engineering",
              "React Native", "Next.js", "TypeScript", "Node.js", "GraphQL", "PostgreSQL", "AI/LLM APIs", "AWS", "RAG Pipelines", "Prompt Engineering"].map((t, i) => (
              <span key={i}>{t} <span style={{ opacity: 0.4 }}>·</span></span>
            ))}
          </div>
        </div>

        {/* ── SKILLS ── */}
        <section className="ab-section">
          <div className="ab-section-label">
            <span className="ab-eyebrow-sq" />
            Stack Depth
          </div>
          <div className="ab-skills-grid">
            {SKILLS.map(group => (
              <div className="ab-skill-group" key={group.category}>
                <div className="ab-skill-cat">{group.category}</div>
                {group.items.map(item => {
                  const [name, num] = item.split(" — ");
                  return (
                    <div className="ab-skill-item" key={item}>
                      <span>{name}</span>
                      <span className="ab-skill-num">{num}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* ── PROOF ── */}
        <section className="ab-section">
          <div className="ab-section-label">
            <span className="ab-eyebrow-sq" />
            Proof, Not Adjectives
          </div>
          <div className="ab-ach-list">
            {ACHIEVEMENTS.map(a => (
              <div className="ab-ach-row" key={a.title}>
                <span className="ab-ach-title">{a.title}</span>
                <span className="ab-ach-meta">{a.meta}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHAT I'VE SHIPPED ── */}
        <section className="ab-section">
          <div className="ab-section-label">
            <span className="ab-eyebrow-sq" />
            What I&apos;ve Shipped
          </div>
          <div>
            {PROJECTS.map(p => (
              <Link href={p.href} className="ab-project" key={p.name}>
                <div className="ab-project-top">
                  <span className="ab-project-name">{p.name}</span>
                  <span className={`ab-project-status${p.status === "Active" || p.status === "Live" ? " active" : ""}`}>{p.status}</span>
                </div>
                <div className="ab-project-role">{p.role}</div>
                <p className="ab-project-desc">{p.desc}</p>
                <div className="ab-project-tags">
                  {p.tags.map(t => <span className="ab-project-tag" key={t}>{t}</span>)}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── EXPERIENCE ── */}
        <section className="ab-section">
          <div className="ab-section-label">
            <span className="ab-eyebrow-sq" />
            Career Timeline
          </div>
          <div className="ab-exp-list">
            {EXPERIENCE.map(e => (
              <div className="ab-exp-row" key={e.company + e.role}>
                <div className="ab-exp-period">{e.period.split("—").map((p, i) => <div key={i}>{p.trim()}</div>)}</div>
                <div className="ab-exp-body">
                  <div className="ab-exp-role">{e.role}</div>
                  <div className="ab-exp-co">{e.company}</div>
                  <div className="ab-exp-desc">{e.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TRY THE TOOL ── */}
        <section className="ab-section">
          <div className="ab-section-label">
            <span className="ab-eyebrow-sq" />
            Built By Me
          </div>
          <Link href="/screenshot-builder" style={{ textDecoration: "none", display: "block", border: "1px solid var(--border)", padding: "24px", transition: "background 0.12s", color: "var(--text-1)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--surface)")}
            onMouseLeave={e => (e.currentTarget.style.background = "")}>
            <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace", color: "var(--fill)", marginBottom: "8px" }}>Active Project</div>
            <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px", borderBottom: "2px solid var(--fill)", display: "inline-block", paddingBottom: "2px", marginBottom: "8px" }}>BuildrStudio</div>
            <p style={{ fontSize: "13px", color: "var(--text-2)", lineHeight: 1.6, margin: "0 0 16px" }}>Paste your App Store URL — get device-framed mockups with AI headlines, ready to submit in seconds. Free tool, no Figma needed.</p>
            <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "monospace", color: "var(--fill)" }}>Try it free →</span>
          </Link>
        </section>

        {/* ── CONTACT ── */}
        <section>
          <div className="ab-contact">
            <div className="ab-contact-headline">
              Ready to<br /><span className="ab-headline-hl">Team Up?</span>
            </div>
            <p className="ab-contact-sub">
              5+ years in Fintech & SaaS. Available for senior full-stack, React Native, or AI engineering roles — remote or Bengaluru.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://topmate.io/adityakmr/" target="_blank" rel="noopener noreferrer" className="ab-btn ab-btn-fill">Book a Call →</a>
              <button className="ab-btn ab-btn-outline" onClick={handleCopyEmail}>
                {copied ? "Copied!" : "Copy Email"}
              </button>
              <a href="https://linkedin.com/in/adityakmr7" target="_blank" rel="noopener noreferrer" className="ab-btn ab-btn-outline">LinkedIn</a>
              <a href="https://substack.com/@adityakmr7" target="_blank" rel="noopener noreferrer" className="ab-btn ab-btn-outline">Substack</a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import TerminalQuest from "./TerminalQuest";

// ── GAME DATA ────────────────────────────────────────────────────────────────

const PLAYER = {
  name: "Aditya Kumar",
  class: "Full-Stack Engineer",
  title: "Senior Software Engineer @ Groww",
  level: 28,
  xpCurrent: 7200,
  xpMax: 10000,
  location: "Bengaluru, India",
  status: "Open to Work",
  bio: "Senior Software Engineer with 5+ years designing and scaling full-stack web and mobile apps across Fintech and SaaS. Specialized in AI/LLM integrations, React Native, and high-performance systems.",
};

const SKILL_TREES: { category: string; color: string; skills: { name: string; level: number; max: number }[] }[] = [
  {
    category: "Frontend",
    color: "#6366f1",
    skills: [
      { name: "React / Next.js", level: 95, max: 100 },
      { name: "React Native", level: 92, max: 100 },
      { name: "TypeScript", level: 90, max: 100 },
      { name: "Redux / Zustand", level: 85, max: 100 },
    ],
  },
  {
    category: "Backend",
    color: "#10b981",
    skills: [
      { name: "Node.js", level: 88, max: 100 },
      { name: "GraphQL", level: 82, max: 100 },
      { name: "REST APIs", level: 90, max: 100 },
      { name: "WebSockets", level: 78, max: 100 },
    ],
  },
  {
    category: "AI / ML",
    color: "#f59e0b",
    skills: [
      { name: "LLM APIs (OpenAI/Gemini)", level: 85, max: 100 },
      { name: "RAG Pipelines", level: 80, max: 100 },
      { name: "Prompt Engineering", level: 88, max: 100 },
      { name: "AI Agents", level: 75, max: 100 },
    ],
  },
  {
    category: "Infrastructure",
    color: "#0ea5e9",
    skills: [
      { name: "PostgreSQL / MongoDB", level: 86, max: 100 },
      { name: "AWS / Docker", level: 80, max: 100 },
      { name: "CI/CD Pipelines", level: 85, max: 100 },
      { name: "Redis / Caching", level: 78, max: 100 },
    ],
  },
];

const ACHIEVEMENTS = [
  { icon: "🏆", title: "Ship Master", desc: "10+ products shipped to production", rarity: "Legendary" },
  { icon: "📱", title: "App Store Pioneer", desc: "3 apps published on iOS App Store", rarity: "Epic" },
  { icon: "🔥", title: "Fintech Veteran", desc: "3+ years building wealth management at scale", rarity: "Epic" },
  { icon: "🤖", title: "AI Whisperer", desc: "Integrated LLM APIs into production apps", rarity: "Rare" },
  { icon: "📦", title: "Open Source Creator", desc: "Published npm package with community adoption", rarity: "Rare" },
  { icon: "⚡", title: "Performance Slayer", desc: "Reduced UI latency by 40% in production", rarity: "Epic" },
  { icon: "💬", title: "AI Agent Builder", desc: "Built autonomous AI chatbot with human escalation", rarity: "Rare" },
];

const QUESTS = [
  {
    name: "BuildrStudio AI Platform",
    role: "Founder & Lead Engineer",
    desc: "Built an AI-powered screenshot generator used by indie developers. Full-stack: Next.js, Gemini API, PostgreSQL, LemonSqueezy billing.",
    tags: ["Next.js", "Gemini API", "PostgreSQL"],
    href: "/screenshot-builder",
    status: "Active",
    color: "#6366f1",
    xp: 2500,
  },
  {
    name: "AI Customer Support Chatbot",
    role: "Full-Stack AI Engineer",
    desc: "Intelligent support agent that answers pricing, features, and account questions 24/7. Built with Vercel AI SDK, Gemini, and streaming chat UI with auto-escalation to humans.",
    tags: ["Next.js 16", "Gemini API", "Vercel AI SDK", "Zod"],
    href: "https://github.com/adityakmr7/ai-projects/tree/main/customer-support-chatbot",
    status: "Complete",
    color: "#8b5cf6",
    xp: 1600,
  },
  {
    name: "AI Resume Assistant",
    role: "Full-Stack AI Engineer",
    desc: "Semantic search + RAG pipeline that matches resumes to job descriptions with structured LLM output.",
    tags: ["React", "RAG", "LLM APIs"],
    href: "https://github.com/adityakmr7",
    status: "Complete",
    color: "#f59e0b",
    xp: 1800,
  },
  {
    name: "Anchor — Tiny Habits",
    role: "iOS Developer",
    desc: "Minimal iOS habit tracker with streak system. Swift & SwiftUI, zero-friction daily check-ins.",
    tags: ["Swift", "SwiftUI", "iOS"],
    href: "/anchor/support",
    status: "Complete",
    color: "#0ea5e9",
    xp: 1500,
  },
  {
    name: "React Native Toastify",
    role: "Creator & Maintainer",
    desc: "Open-source notification library for React Native with active community adoption.",
    tags: ["React Native", "TypeScript", "npm"],
    href: "https://github.com/adityakmr7",
    status: "Maintained",
    color: "#10b981",
    xp: 1200,
  },
];

const EXPERIENCE_LOG = [
  { role: "SDE-2", company: "Groww", period: "Aug 2025 — Present", xp: "+2500 XP", color: "#6366f1", desc: "Wealth management products at scale. React Native + TypeScript." },
  { role: "SDE-2", company: "Fisdom → Groww", period: "Oct 2024 — Aug 2025", xp: "+2000 XP", color: "#0ea5e9", desc: "Reduced UI latency 40%. Platform performance +35%." },
  { role: "SDE-1", company: "Fisdom", period: "Jul 2022 — Oct 2024", xp: "+1800 XP", color: "#10b981", desc: "Full-stack fintech: mutual funds, portfolio, REST + GraphQL APIs." },
  { role: "Associate Dev", company: "Bluespacelabs", period: "Mar 2021 — May 2022", xp: "+1200 XP", color: "#f59e0b", desc: "SaaS communication platform. WebSockets + real-time systems." },
  { role: "Web Developer", company: "IIH Global", period: "Jul 2020 — Feb 2021", xp: "+800 XP", color: "#ec4899", desc: "Modernized legacy apps with React + Redux." },
];

// ── COMPONENT ────────────────────────────────────────────────────────────────

export default function AboutClient() {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSkillTree, setActiveSkillTree] = useState(0);
  const [visibleSkills, setVisibleSkills] = useState<boolean[]>(() => SKILL_TREES[0].skills.map(() => false));
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  useEffect(() => {
    if (!skillsRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          SKILL_TREES[activeSkillTree].skills.forEach((_, i) => {
            setTimeout(() => {
              setVisibleSkills(prev => { const next = [...prev]; next[i] = true; return next; });
            }, i * 150);
          });
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(skillsRef.current);
    return () => observer.disconnect();
  }, [activeSkillTree]);

  useEffect(() => {
    const timer = setTimeout(() => {
      SKILL_TREES[activeSkillTree].skills.forEach((_, i) => {
        setTimeout(() => {
          setVisibleSkills(prev => { const next = [...prev]; next[i] = true; return next; });
        }, i * 150);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [activeSkillTree]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("adityakmr9672@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rarityColor = (r: string) => {
    if (r === "Legendary") return { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" };
    if (r === "Epic") return { bg: "#ede9fe", border: "#8b5cf6", text: "#5b21b6" };
    return { bg: "#e0f2fe", border: "#38bdf8", text: "#0369a1" };
  };

  return (
    <div className="gp">
      <style>{`
        .gp { min-height: 100vh; background: var(--bg); color: var(--text-1); font-family: var(--font); overflow-x: hidden; }

        .gp-hero { position: relative; padding: 60px 24px 0; overflow: hidden; }
        .gp-hero-ambient { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .gp-hero-ambient::before { content: ''; position: absolute; width: 600px; height: 600px; top: -200px; left: -100px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%); }
        .gp-hero-ambient::after { content: ''; position: absolute; width: 500px; height: 500px; top: -100px; right: -80px; border-radius: 50%; background: radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%); }

        .char-card { position: relative; z-index: 1; max-width: 920px; margin: 0 auto; display: grid; grid-template-columns: auto 1fr; gap: 40px; align-items: center; padding: 40px; background: var(--surface); border: 1.5px solid var(--border); border-radius: 24px; }

        .char-left { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .char-avatar { position: relative; width: 180px; height: 180px; }
        .char-avatar-ring { position: absolute; inset: -6px; border-radius: 50%; border: 3px solid #6366f1; opacity: 0.6; animation: char-pulse 2s ease-in-out infinite; }
        @keyframes char-pulse { 0%,100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.02); } }
        .char-avatar-inner { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; border: 3px solid var(--border); }
        .char-level { display: inline-flex; align-items: center; gap: 4px; padding: 4px 14px; border-radius: 9999px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; }

        .char-right { display: flex; flex-direction: column; gap: 12px; }
        .char-status { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 9999px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); color: #059669; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; width: fit-content; }
        [data-theme="dark"] .char-status { color: #34d399; background: rgba(16,185,129,0.12); }
        .char-status-dot { width: 7px; height: 7px; border-radius: 50%; background: #10b981; animation: blink 1.5s ease-in-out infinite; }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .char-name { font-size: clamp(32px, 4vw, 48px); font-weight: 800; letter-spacing: -1.5px; line-height: 1.1; }
        .char-name span { background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .char-class { font-size: 15px; color: var(--text-2); font-weight: 500; }
        .char-bio { font-size: 14px; color: var(--text-2); line-height: 1.7; max-width: 500px; }

        .xp-bar-wrap { margin-top: 4px; }
        .xp-label { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-3); margin-bottom: 4px; }
        .xp-bar { height: 8px; border-radius: 4px; background: var(--border); overflow: hidden; }
        .xp-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, #6366f1, #a855f7); transition: width 1.5s cubic-bezier(0.16, 1, 0.3, 1); }

        .char-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
        .char-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; text-decoration: none; border: none; font-family: var(--font); }
        .char-btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; }
        .char-btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
        .char-btn-outline { background: var(--surface); color: var(--text-1); border: 1.5px solid var(--border); }
        .char-btn-outline:hover { border-color: var(--text-2); transform: translateY(-1px); }

        .char-socials { display: flex; gap: 6px; flex-wrap: wrap; }
        .char-social { padding: 4px 10px; border-radius: 8px; background: var(--surface-2, var(--bg)); border: 1px solid var(--border); font-size: 11px; font-weight: 500; color: var(--text-2); text-decoration: none; transition: all 0.15s; }
        .char-social:hover { border-color: #6366f1; color: #6366f1; transform: translateY(-1px); }

        .gp-main { max-width: 920px; margin: 0 auto; padding: 48px 24px 80px; display: flex; flex-direction: column; gap: 56px; }

        .section-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .section-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .section-title { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
        .section-sub { font-size: 12px; color: var(--text-3); margin-left: auto; font-weight: 500; }

        .skill-tabs { display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap; }
        .skill-tab { padding: 6px 14px; border-radius: 8px; border: 1.5px solid var(--border); background: var(--surface); font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; color: var(--text-2); font-family: var(--font); }
        .skill-tab.active { border-color: currentColor; }
        .skill-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 10px; background: var(--surface); border: 1px solid var(--border); margin-bottom: 8px; }
        .skill-name { font-size: 13px; font-weight: 600; color: var(--text-1); min-width: 160px; }
        .skill-bar { flex: 1; height: 10px; border-radius: 5px; background: var(--border); overflow: hidden; }
        .skill-fill { height: 100%; border-radius: 5px; transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .skill-pct { font-size: 12px; font-weight: 700; min-width: 32px; text-align: right; }

        .achievements-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
        .ach-card { padding: 16px; border-radius: 14px; background: var(--surface); border: 1.5px solid var(--border); display: flex; gap: 12px; align-items: flex-start; transition: all 0.2s; cursor: default; }
        .ach-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); border-color: var(--border-strong); }
        .ach-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
        .ach-title { font-size: 14px; font-weight: 700; color: var(--text-1); }
        .ach-desc { font-size: 12px; color: var(--text-2); margin-top: 2px; }
        .ach-rarity { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }

        .quest-card { display: block; text-decoration: none; padding: 20px 24px; border-radius: 16px; background: var(--surface); border: 1.5px solid var(--border); margin-bottom: 12px; transition: all 0.2s; position: relative; overflow: hidden; }
        .quest-card:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.06); border-color: var(--border-strong); }
        .quest-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; }
        .quest-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .quest-name { font-size: 17px; font-weight: 700; color: var(--text-1); }
        .quest-role { font-size: 12px; color: var(--text-3); }
        .quest-status { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
        .quest-desc { font-size: 13px; color: var(--text-2); line-height: 1.6; margin-bottom: 12px; }
        .quest-footer { display: flex; justify-content: space-between; align-items: center; }
        .quest-tags { display: flex; gap: 5px; flex-wrap: wrap; }
        .quest-tag { padding: 2px 8px; border-radius: 6px; background: var(--surface-2, var(--bg)); font-size: 11px; font-weight: 600; color: var(--text-3); }
        .quest-xp { font-size: 13px; font-weight: 700; }

        .exp-row { display: grid; grid-template-columns: 80px 1fr auto; gap: 16px; align-items: center; padding: 14px 18px; border-radius: 12px; background: var(--surface); border: 1px solid var(--border); margin-bottom: 8px; transition: border-color 0.2s; }
        .exp-row:hover { border-color: var(--border-strong); }
        .exp-period { font-size: 10px; color: var(--text-3); font-weight: 600; text-align: center; line-height: 1.4; }
        .exp-role { font-size: 14px; font-weight: 700; color: var(--text-1); }
        .exp-company { font-size: 12px; color: var(--text-3); }
        .exp-desc { font-size: 12px; color: var(--text-2); margin-top: 2px; }
        .exp-xp { font-size: 12px; font-weight: 700; white-space: nowrap; }

        .contact-card { position: relative; overflow: hidden; border-radius: 24px; padding: 48px; text-align: center; background: var(--surface); border: 1.5px solid var(--border); }
        .contact-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(168,85,247,0.03) 50%, rgba(16,185,129,0.04) 100%); pointer-events: none; }
        .contact-inner { position: relative; z-index: 1; }
        .contact-title { font-size: clamp(22px, 3vw, 32px); font-weight: 800; letter-spacing: -1px; margin-bottom: 12px; }
        .contact-sub { font-size: 14px; color: var(--text-2); line-height: 1.7; margin-bottom: 28px; max-width: 440px; margin-left: auto; margin-right: auto; }
        .contact-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }

        .fade-g { opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .fade-g.in { opacity: 1; transform: translateY(0); }

        @media (max-width: 700px) {
          .char-card { grid-template-columns: 1fr; text-align: center; padding: 28px 20px; }
          .char-left { order: -1; }
          .char-avatar { width: 140px; height: 140px; }
          .char-right { align-items: center; }
          .char-bio { margin: 0 auto; }
          .char-actions, .char-socials { justify-content: center; }
          .skill-name { min-width: 120px; }
          .exp-row { grid-template-columns: 1fr; gap: 4px; }
          .exp-period { text-align: left; }
          .contact-card { padding: 32px 20px; }
        }
      `}</style>

      <section className="gp-hero">
        <div className="gp-hero-ambient" />

        <div className={`char-card fade-g ${mounted ? "in" : ""}`}>
          <div className="char-left">
            <div className="char-avatar">
              <div className="char-avatar-ring" />
              <div className="char-avatar-inner">
                <Image src="/aditya-avatar.png" alt="Aditya Kumar" width={180} height={180} style={{ width: "100%", height: "100%", objectFit: "cover" }} priority />
              </div>
            </div>
            <span className="char-level">LVL {PLAYER.level}</span>
          </div>

          <div className="char-right">
            <span className="char-status"><span className="char-status-dot" /> {PLAYER.status}</span>
            <h1 className="char-name"><span>{PLAYER.name}</span></h1>
            <div className="char-class">{PLAYER.class} &nbsp;·&nbsp; {PLAYER.location}</div>
            <p className="char-bio">{PLAYER.bio}</p>

            <div className="xp-bar-wrap">
              <div className="xp-label">
                <span>XP Progress</span>
                <span>{PLAYER.xpCurrent.toLocaleString()} / {PLAYER.xpMax.toLocaleString()}</span>
              </div>
              <div className="xp-bar">
                <div className="xp-fill" style={{ width: mounted ? `${(PLAYER.xpCurrent / PLAYER.xpMax) * 100}%` : "0%" }} />
              </div>
            </div>

            <div className="char-actions">
              <button className="char-btn char-btn-primary" onClick={handleCopyEmail}>
                {copied ? "✅ Copied!" : "✉️ Recruit Me"}
              </button>
              <a href="https://github.com/adityakmr7" target="_blank" rel="noopener noreferrer" className="char-btn char-btn-outline">GitHub</a>
              <a href="https://x.com/adityakmr7" target="_blank" rel="noopener noreferrer" className="char-btn char-btn-outline">𝕏 Twitter</a>
            </div>

            <div className="char-socials">
              <a href="https://linkedin.com/in/adityakmr7" target="_blank" rel="noopener noreferrer" className="char-social">💼 LinkedIn</a>
              <a href="https://substack.com/@adityakmr7" target="_blank" rel="noopener noreferrer" className="char-social">✍️ Substack</a>
              <span className="char-social">🕐 IST (UTC+5:30)</span>
              <span className="char-social">🏢 Groww</span>
            </div>
          </div>
        </div>
      </section>

      <main className="gp-main">
        {/* ── SKILL TREES ── */}
        <section ref={skillsRef}>
          <div className="section-bar">
            <div className="section-icon" style={{ background: "rgba(99,102,241,0.1)" }}>⚔️</div>
            <span className="section-title">Skill Tree</span>
            <span className="section-sub">Select a branch to inspect</span>
          </div>

          <div className="skill-tabs">
            {SKILL_TREES.map((tree, i) => (
              <button
                key={tree.category}
                className={`skill-tab${activeSkillTree === i ? " active" : ""}`}
                style={activeSkillTree === i ? { color: tree.color, borderColor: tree.color, background: `${tree.color}10` } : {}}
                onClick={() => {
                  setActiveSkillTree(i);
                  setVisibleSkills(SKILL_TREES[i].skills.map(() => false));
                }}
              >
                {tree.category}
              </button>
            ))}
          </div>

          {SKILL_TREES[activeSkillTree].skills.map((skill, i) => (
            <div key={skill.name} className="skill-row">
              <span className="skill-name">{skill.name}</span>
              <div className="skill-bar">
                <div
                  className="skill-fill"
                  style={{
                    width: visibleSkills[i] ? `${skill.level}%` : "0%",
                    background: SKILL_TREES[activeSkillTree].color,
                  }}
                />
              </div>
              <span className="skill-pct" style={{ color: SKILL_TREES[activeSkillTree].color }}>
                {visibleSkills[i] ? skill.level : 0}
              </span>
            </div>
          ))}
        </section>

        {/* ── ACHIEVEMENTS ── */}
        <section>
          <div className="section-bar">
            <div className="section-icon" style={{ background: "rgba(245,158,11,0.1)" }}>🏅</div>
            <span className="section-title">Achievements</span>
            <span className="section-sub">{ACHIEVEMENTS.length} unlocked</span>
          </div>

          <div className="achievements-grid">
            {ACHIEVEMENTS.map((ach) => {
              const rc = rarityColor(ach.rarity);
              return (
                <div key={ach.title} className="ach-card">
                  <div className="ach-icon" style={{ background: rc.bg }}>{ach.icon}</div>
                  <div>
                    <div className="ach-title">{ach.title}</div>
                    <div className="ach-desc">{ach.desc}</div>
                    <span className="ach-rarity" style={{ background: rc.bg, color: rc.text, border: `1px solid ${rc.border}` }}>
                      {ach.rarity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── QUEST LOG (Projects) ── */}
        <section>
          <div className="section-bar">
            <div className="section-icon" style={{ background: "rgba(14,165,233,0.1)" }}>📜</div>
            <span className="section-title">Quest Log</span>
            <span className="section-sub">{QUESTS.length} quests</span>
          </div>

          {QUESTS.map((q) => (
            <Link key={q.name} href={q.href} className="quest-card" style={{ ["--qc" as string]: q.color }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: q.color }} />
              <div className="quest-top">
                <div>
                  <div className="quest-name">{q.name}</div>
                  <div className="quest-role">{q.role}</div>
                </div>
                <span className="quest-status" style={{
                  background: q.status === "Active" ? "rgba(16,185,129,0.1)" : "var(--surface-2, var(--bg))",
                  color: q.status === "Active" ? "#059669" : "var(--text-3)",
                  border: q.status === "Active" ? "1px solid rgba(16,185,129,0.3)" : "1px solid var(--border)",
                }}>{q.status}</span>
              </div>
              <div className="quest-desc">{q.desc}</div>
              <div className="quest-footer">
                <div className="quest-tags">
                  {q.tags.map(t => <span key={t} className="quest-tag">{t}</span>)}
                </div>
                <span className="quest-xp" style={{ color: q.color }}>+{q.xp.toLocaleString()} XP</span>
              </div>
            </Link>
          ))}
        </section>

        {/* ── MINI GAMES ── */}
        <section>
          <div className="section-bar">
            <div className="section-icon" style={{ background: "rgba(99,102,241,0.1)" }}>🎮</div>
            <span className="section-title">Play to Learn</span>
            <span className="section-sub">Interactive exploration</span>
          </div>

          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-1)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ padding: "2px 8px", borderRadius: "6px", background: "rgba(126,231,135,0.1)", color: "#7ee787", fontSize: "11px", fontWeight: 700 }}>Terminal</span>
            Type commands to explore my profile
          </div>
          <TerminalQuest />
        </section>

        {/* ── EXPERIENCE LOG ── */}
        <section>
          <div className="section-bar">
            <div className="section-icon" style={{ background: "rgba(236,72,153,0.1)" }}>📋</div>
            <span className="section-title">Experience Log</span>
            <span className="section-sub">Career timeline</span>
          </div>

          {EXPERIENCE_LOG.map((exp) => (
            <div key={exp.company + exp.role} className="exp-row">
              <div className="exp-period">{exp.period.split("—").map((p, i) => <div key={i}>{p.trim()}</div>)}</div>
              <div>
                <div className="exp-role">{exp.role} <span style={{ fontWeight: 500, color: "var(--text-3)" }}>@ {exp.company}</span></div>
                <div className="exp-desc">{exp.desc}</div>
              </div>
              <span className="exp-xp" style={{ color: exp.color }}>{exp.xp}</span>
            </div>
          ))}
        </section>

        {/* ── CONTACT (Boss Fight) ── */}
        <section>
          <div className="contact-card">
            <div className="contact-inner">
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>⚔️</div>
              <h2 className="contact-title">Ready to team up?</h2>
              <p className="contact-sub">
                5+ years in Fintech & SaaS. Available for senior full-stack, React Native, or AI engineering roles — remote or Bengaluru. Let&apos;s build something legendary.
              </p>
              <div className="contact-actions">
                <button className="char-btn char-btn-primary" onClick={handleCopyEmail} style={{ padding: "12px 28px", fontSize: "15px" }}>
                  {copied ? "✅ Email Copied!" : "✉️ Send Party Invite"}
                </button>
                <a href="https://linkedin.com/in/adityakmr7" target="_blank" rel="noopener noreferrer" className="char-btn char-btn-outline" style={{ padding: "12px 28px", fontSize: "15px" }}>
                  💼 LinkedIn
                </a>
                <a href="https://github.com/adityakmr7" target="_blank" rel="noopener noreferrer" className="char-btn char-btn-outline" style={{ padding: "12px 28px", fontSize: "15px" }}>
                  GitHub
                </a>
                <a href="https://substack.com/@adityakmr7" target="_blank" rel="noopener noreferrer" className="char-btn char-btn-outline" style={{ padding: "12px 28px", fontSize: "15px" }}>
                  ✍️ Substack
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const SKILLS = [
  { name: "React Native", icon: "📱", cat: "Frontend" },
  { name: "React / Next.js", icon: "⚛️", cat: "Frontend" },
  { name: "TypeScript", icon: "🔷", cat: "Frontend" },
  { name: "Redux / Zustand", icon: "🔄", cat: "Frontend" },
  { name: "Node.js", icon: "🟢", cat: "Backend" },
  { name: "GraphQL", icon: "◈", cat: "Backend" },
  { name: "REST APIs", icon: "🔗", cat: "Backend" },
  { name: "WebSockets", icon: "⚡", cat: "Backend" },
  { name: "PostgreSQL", icon: "🐘", cat: "Database" },
  { name: "MongoDB", icon: "🍃", cat: "Database" },
  { name: "Redis", icon: "🔴", cat: "Database" },
  { name: "Vector DBs", icon: "🧮", cat: "Database" },
  { name: "OpenAI / Gemini", icon: "🤖", cat: "AI" },
  { name: "RAG Pipelines", icon: "🧠", cat: "AI" },
  { name: "Prompt Engineering", icon: "✨", cat: "AI" },
  { name: "LLM Agents", icon: "🕹️", cat: "AI" },
  { name: "AWS", icon: "☁️", cat: "Cloud" },
  { name: "Docker", icon: "🐳", cat: "Cloud" },
  { name: "CI/CD", icon: "🚀", cat: "Cloud" },
  { name: "GitHub Actions", icon: "🔧", cat: "Cloud" },
];

const STATS = [
  { value: "5+", label: "Years experience" },
  { value: "10+", label: "Projects shipped" },
  { value: "3+", label: "Apps in stores" },
  { value: "2", label: "Domains: Fintech & SaaS" },
];

const PROJECTS = [
  {
    emoji: "🛠",
    name: "BuildrStudio AI Platform",
    tagline: "Founder & Lead Engineer",
    desc: "AI-powered platform for developers and indie founders. Integrated LLM APIs (Gemini) for content generation, workflow automation, and screenshot optimization. Full-stack architecture with Next.js, PostgreSQL, and LemonSqueezy billing.",
    tags: ["Next.js", "TypeScript", "Gemini API", "PostgreSQL", "LemonSqueezy"],
    href: "/screenshot-builder",
    color: "#6366f1",
    gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  },
  {
    emoji: "🤖",
    name: "AI Resume Assistant",
    tagline: "Full-stack AI application",
    desc: "Analyzes resumes and job descriptions to generate tailored recommendations. Implemented semantic search, RAG pipelines, and structured LLM output generation for personalized matching.",
    tags: ["React", "Node.js", "PostgreSQL", "RAG", "LLM APIs"],
    href: "https://github.com/adityakmr7",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
  },
  {
    emoji: "⚓",
    name: "Anchor — Tiny Habits",
    tagline: "iOS habit tracker with streak system",
    desc: "Beautifully minimal iOS habit tracker focused on consistency over complexity, built with Swift & SwiftUI for zero friction daily check-ins.",
    tags: ["Swift", "SwiftUI", "iOS", "CoreData"],
    href: "/anchor/support",
    color: "#0ea5e9",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
  },
  {
    emoji: "📦",
    name: "React Native Toastify",
    tagline: "Creator & Maintainer · Open Source",
    desc: "Published open-source React Native notification library with active community adoption. Focused on performance, developer experience, and extensibility.",
    tags: ["React Native", "TypeScript", "Open Source", "npm"],
    href: "https://github.com/adityakmr7",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },
];

const EXPERIENCES = [
  {
    role: "Software Development Engineer 2",
    company: "Groww",
    period: "Aug 2025 — Present",
    desc: "Leading development for wealth management products serving large-scale fintech customers. Architected scalable full-stack solutions with React Native, React, and TypeScript. Established CI/CD pipelines improving deployment reliability across multiple teams.",
    color: "#6366f1",
  },
  {
    role: "Software Development Engineer 2",
    company: "Fisdom (Acquired by Groww)",
    period: "Oct 2024 — Aug 2025",
    desc: "Delivered business-critical fintech solutions across mobile, web, and backend. Optimized real-time market data pipelines reducing UI latency by 40%. Improved platform performance by 35% through bundle reduction and architecture enhancements.",
    color: "#0ea5e9",
  },
  {
    role: "Software Development Engineer 1",
    company: "Fisdom",
    period: "Jul 2022 — Oct 2024",
    desc: "Built full-stack fintech applications integrating REST and GraphQL APIs for mutual funds, investments, and portfolio management. Built reusable UI systems and improved user onboarding journeys.",
    color: "#10b981",
  },
  {
    role: "Associate Software Developer",
    company: "Bluespacelabs",
    period: "Mar 2021 — May 2022",
    desc: "Built SaaS communication platforms with React.js, Node.js, and WebSocket-based real-time systems. Implemented CI/CD automation reducing production release times by 40%.",
    color: "#f59e0b",
  },
  {
    role: "Web Developer",
    company: "IIH Global",
    period: "Jul 2020 — Feb 2021",
    desc: "Modernized legacy enterprise applications using React, Redux, and Material UI. Developed reusable components and improved maintainability across multiple client projects.",
    color: "#ec4899",
  },
];

export default function AboutClient() {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("adityakmr9672@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="about-page">
      <style>{`
        .about-page {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text-1);
          font-family: var(--font);
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .about-hero {
          position: relative;
          padding: 72px 24px 0;
          overflow: hidden;
        }

        /* Ambient background */
        .hero-ambient {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .hero-ambient::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          top: -200px; left: -100px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          filter: blur(40px);
        }
        .hero-ambient::after {
          content: '';
          position: absolute;
          width: 500px; height: 500px;
          top: -150px; right: -80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%);
          filter: blur(40px);
        }
        .hero-ambient-green {
          position: absolute;
          width: 400px; height: 400px;
          bottom: -100px; left: 40%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%);
          filter: blur(40px);
        }

        /* Hero inner grid */
        .hero-inner {
          position: relative;
          z-index: 1;
          max-width: 920px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 48px;
          align-items: center;
          padding-bottom: 64px;
          border-bottom: 1px solid var(--border);
        }

        /* Left: text */
        .hero-left {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .hero-otw {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px 6px 10px;
          border-radius: 9999px;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.3);
          color: #059669;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          width: fit-content;
        }
        [data-theme="dark"] .hero-otw {
          background: rgba(16,185,129,0.12);
          border-color: rgba(16,185,129,0.25);
          color: #34d399;
        }
        .hero-otw-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #10b981;
          animation: pulse-dot 1.8s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
          50% { box-shadow: 0 0 0 5px rgba(16,185,129,0); }
        }

        .hero-name {
          font-size: clamp(40px, 5.5vw, 64px);
          font-weight: 800;
          letter-spacing: -2px;
          line-height: 1.05;
          color: var(--text-1);
        }
        .hero-name span {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          color: var(--text-2);
          font-weight: 500;
        }
        .hero-title-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--text-3);
        }

        .hero-bio {
          font-size: 15px;
          color: var(--text-2);
          line-height: 1.75;
          max-width: 480px;
        }

        /* CTA buttons */
        .hero-ctas {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          padding-top: 4px;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          border-radius: 10px;
          background: var(--fill);
          color: var(--fill-text);
          font-size: 13px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: opacity 0.18s, transform 0.15s;
          text-decoration: none;
          font-family: var(--font);
        }
        .btn-primary:hover { opacity: 0.82; transform: translateY(-1px); }
        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          border-radius: 10px;
          background: var(--surface);
          color: var(--text-1);
          font-size: 13px;
          font-weight: 600;
          border: 1px solid var(--border);
          cursor: pointer;
          transition: all 0.18s;
          text-decoration: none;
        }
        .btn-outline:hover {
          background: var(--surface-2);
          border-color: var(--border-strong);
          transform: translateY(-1px);
        }

        /* Social pills row */
        .hero-socials {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .social-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 9999px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--text-2);
          font-size: 12px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .social-pill:hover {
          background: var(--surface);
          border-color: var(--border-strong);
          color: var(--text-1);
          transform: translateY(-1px);
        }

        /* Right: Avatar card */
        .hero-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }
        .avatar-card {
          position: relative;
          width: 200px;
          height: 200px;
        }
        .avatar-card-bg {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, #6366f1 0%, #a855f7 33%, #ec4899 66%, #6366f1 100%);
          animation: spin-slow 6s linear infinite;
          opacity: 0.6;
          filter: blur(1px);
        }
        .avatar-card-mask {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          background: var(--bg);
        }
        .avatar-card-inner {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid rgba(255,255,255,0.1);
          box-shadow: 0 20px 60px rgba(99,102,241,0.25), 0 8px 24px rgba(0,0,0,0.1);
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }

        /* Floating badges on avatar */
        .avatar-badge {
          position: absolute;
          padding: 5px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          animation: float-badge 3s ease-in-out infinite;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .avatar-badge-1 {
          top: -8px; right: -24px;
          background: rgba(99,102,241,0.9);
          color: white;
          animation-delay: 0s;
        }
        .avatar-badge-2 {
          bottom: 10px; left: -28px;
          background: rgba(16,185,129,0.9);
          color: white;
          animation-delay: 1.5s;
        }
        @keyframes float-badge {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        /* Stats bar */
        .stats-bar {
          display: flex;
          align-items: center;
          gap: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          max-width: 920px;
          margin: 0 auto;
        }
        .stat-item {
          flex: 1;
          padding: 20px 24px;
          text-align: center;
          border-right: 1px solid var(--border);
          transition: background 0.2s;
        }
        .stat-item:last-child { border-right: none; }
        .stat-item:hover { background: var(--surface-2); }
        .stat-value {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -1px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
        }
        .stat-label {
          font-size: 11px;
          color: var(--text-3);
          font-weight: 500;
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ── MAIN ── */
        .about-main {
          max-width: 920px;
          margin: 0 auto;
          padding: 64px 24px 100px;
          display: flex;
          flex-direction: column;
          gap: 72px;
        }

        /* Section header */
        .section-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
        }
        .section-eyebrow-line {
          height: 2px;
          width: 32px;
          background: linear-gradient(90deg, #6366f1, #a855f7);
          border-radius: 2px;
        }
        .section-eyebrow-text {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-3);
        }

        /* Skills */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 10px;
        }
        .skill-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 10px;
          background: var(--surface);
          border: 1px solid var(--border);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-2);
          transition: all 0.18s;
          cursor: default;
        }
        .skill-chip:hover {
          border-color: #6366f1;
          color: #6366f1;
          background: rgba(99,102,241,0.05);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99,102,241,0.1);
        }
        [data-theme="dark"] .skill-chip:hover {
          background: rgba(99,102,241,0.1);
        }
        .skill-icon { font-size: 15px; }

        /* Projects */
        .projects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .project-card {
          display: block;
          text-decoration: none;
          border-radius: 20px;
          border: 1px solid var(--border);
          background: var(--surface);
          overflow: hidden;
          transition: all 0.22s;
          position: relative;
        }
        .project-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.08);
          border-color: var(--border-strong);
        }
        .project-card-accent {
          height: 4px;
          width: 100%;
        }
        .project-card-body {
          padding: 24px 28px;
        }
        .project-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .project-icon-wrap {
          width: 48px; height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }
        .project-name {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-1);
          margin-bottom: 2px;
        }
        .project-tagline {
          font-size: 12px;
          color: var(--text-3);
          font-weight: 500;
        }
        .project-arrow {
          font-size: 20px;
          color: var(--text-3);
          transition: all 0.2s;
          margin-top: 4px;
        }
        .project-card:hover .project-arrow {
          color: var(--text-1);
          transform: translate(3px, -3px);
        }
        .project-desc {
          font-size: 14px;
          color: var(--text-2);
          line-height: 1.7;
          margin-bottom: 16px;
        }
        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .project-tag {
          padding: 3px 10px;
          border-radius: 6px;
          background: var(--surface-2);
          font-size: 11px;
          font-weight: 600;
          color: var(--text-3);
          letter-spacing: 0.02em;
        }

        /* Experience */
        .exp-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .exp-card {
          padding: 24px 28px;
          border-radius: 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 20px;
          align-items: flex-start;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .exp-card:hover {
          border-color: var(--border-strong);
          box-shadow: var(--shadow-sm);
        }
        .exp-indicator {
          width: 3px;
          height: 100%;
          min-height: 60px;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .exp-content {}
        .exp-top {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 4px;
          flex-wrap: wrap;
        }
        .exp-role {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-1);
        }
        .exp-period {
          font-size: 12px;
          color: var(--text-3);
          font-weight: 500;
          white-space: nowrap;
          padding: 2px 8px;
          background: var(--surface-2);
          border-radius: 6px;
        }
        .exp-company {
          font-size: 13px;
          color: var(--text-3);
          margin-bottom: 10px;
        }
        .exp-desc {
          font-size: 14px;
          color: var(--text-2);
          line-height: 1.65;
        }

        /* Contact */
        .contact-card {
          position: relative;
          overflow: hidden;
          border-radius: 24px;
          padding: 56px 48px;
          text-align: center;
          background: var(--surface);
          border: 1px solid var(--border);
        }
        .contact-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg,
            rgba(99,102,241,0.06) 0%,
            rgba(168,85,247,0.04) 50%,
            rgba(16,185,129,0.05) 100%
          );
          pointer-events: none;
        }
        /* decorative circles */
        .contact-deco-1 {
          position: absolute;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.1), transparent);
          top: -100px; left: -100px;
          pointer-events: none;
        }
        .contact-deco-2 {
          position: absolute;
          width: 240px; height: 240px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,0.08), transparent);
          bottom: -80px; right: -60px;
          pointer-events: none;
        }
        .contact-inner {
          position: relative;
          z-index: 1;
        }
        .contact-emoji {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }
        .contact-title {
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 12px;
        }
        .contact-sub {
          font-size: 15px;
          color: var(--text-2);
          line-height: 1.7;
          margin-bottom: 32px;
          max-width: 440px;
          margin-left: auto;
          margin-right: auto;
        }
        .contact-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn-lg {
          padding: 13px 28px;
          border-radius: 12px;
          font-size: 15px;
        }

        /* Fade-in animation */
        .fade-up {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .fade-up.in { opacity: 1; transform: translateY(0); }
        .fade-up.d1 { transition-delay: 0.05s; }
        .fade-up.d2 { transition-delay: 0.12s; }
        .fade-up.d3 { transition-delay: 0.18s; }
        .fade-up.d4 { transition-delay: 0.24s; }
        .fade-up.d5 { transition-delay: 0.30s; }
        .fade-up.d6 { transition-delay: 0.36s; }

        /* Responsive */
        @media (max-width: 700px) {
          .hero-inner {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 32px;
          }
          .hero-right { order: -1; }
          .avatar-card { width: 160px; height: 160px; }
          .hero-otw, .hero-ctas, .hero-socials {
            justify-content: center;
          }
          .hero-bio { margin: 0 auto; }
          .stats-bar { flex-wrap: wrap; border-radius: 12px; }
          .stat-item {
            flex: 1 1 45%;
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
          .stat-item:nth-child(odd) { border-right: 1px solid var(--border); }
          .stat-item:nth-last-child(-n+2) { border-bottom: none; }
          .contact-card { padding: 36px 24px; }
          .skills-grid { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="hero-ambient">
          <div className="hero-ambient-green" />
        </div>

        <div className="hero-inner">
          {/* Left */}
          <div className="hero-left">
            <div className={`fade-up d1 ${mounted ? "in" : ""}`}>
              <span className="hero-otw">
                <span className="hero-otw-dot" />
                Open to Work — Full-time & Freelance
              </span>
            </div>

            <div className={`fade-up d2 ${mounted ? "in" : ""}`}>
              <h1 className="hero-name">
                Hi, I&apos;m <span>Aditya Kumar</span>
              </h1>
            </div>

            <div className={`hero-title fade-up d3 ${mounted ? "in" : ""}`}>
              <span>Senior Software Engineer</span>
              <span className="hero-title-dot" />
              <span>📍 Bengaluru, India</span>
            </div>

            <p className={`hero-bio fade-up d3 ${mounted ? "in" : ""}`}>
              Senior Software Engineer with 5+ years designing and scaling
              full-stack web and mobile apps across Fintech and SaaS. Experienced
              in AI/LLM integrations, RAG pipelines, React Native, and Node.js.
              Currently at Groww, building wealth management products at scale.
            </p>

            <div className={`hero-ctas fade-up d4 ${mounted ? "in" : ""}`}>
              <button className="btn-primary" onClick={handleCopyEmail}>
                {copied ? "✅ Copied!" : "✉️ Email me"}
              </button>
              <a
                href="https://github.com/adityakmr7"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                🐙 GitHub
              </a>
              <a
                href="https://x.com/adityakmr7"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                𝕏 Twitter
              </a>
            </div>

            <div className={`hero-socials fade-up d5 ${mounted ? "in" : ""}`}>
              <a
                href="https://linkedin.com/in/adityakmr7"
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill"
              >
                💼 LinkedIn
              </a>
              <span className="social-pill" style={{ cursor: "default" }}>
                🕐 IST (UTC+5:30)
              </span>
              <span className="social-pill" style={{ cursor: "default" }}>
                📍 Open to remote & Bengaluru
              </span>
              <span className="social-pill" style={{ cursor: "default" }}>
                🏢 Currently @ Groww
              </span>
            </div>
          </div>

          {/* Right: Avatar */}
          <div className={`hero-right fade-up d2 ${mounted ? "in" : ""}`}>
            <div className="avatar-card">
              <div className="avatar-card-bg" />
              <div className="avatar-card-mask" />
              <div className="avatar-card-inner">
                <Image
                  src="/aditya-avatar.png"
                  alt="Aditya Kumar"
                  width={200}
                  height={200}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  priority
                />
              </div>
              <div className="avatar-badge avatar-badge-1">⚡ Building</div>
              <div className="avatar-badge avatar-badge-2">✅ Available</div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className={`stats-bar fade-up d6 ${mounted ? "in" : ""}`}
          style={{ marginTop: 0 }}>
          {STATS.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN ── */}
      <main className="about-main">

        {/* Skills */}
        <section>
          <div className="section-eyebrow">
            <div className="section-eyebrow-line" />
            <span className="section-eyebrow-text">Skills & Technologies</span>
          </div>
          <div className="skills-grid">
            {SKILLS.map((s) => (
              <div key={s.name} className="skill-chip">
                <span className="skill-icon">{s.icon}</span>
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section>
          <div className="section-eyebrow">
            <div className="section-eyebrow-line" />
            <span className="section-eyebrow-text">Things I&apos;ve Built</span>
          </div>
          <div className="projects-grid">
            {PROJECTS.map((p) => (
              <Link key={p.name} href={p.href} className="project-card">
                <div
                  className="project-card-accent"
                  style={{ background: p.gradient }}
                />
                <div className="project-card-body">
                  <div className="project-header">
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div
                        className="project-icon-wrap"
                        style={{ background: `${p.color}18` }}
                      >
                        {p.emoji}
                      </div>
                      <div>
                        <div className="project-name">{p.name}</div>
                        <div className="project-tagline">{p.tagline}</div>
                      </div>
                    </div>
                    <span className="project-arrow">↗</span>
                  </div>
                  <p className="project-desc">{p.desc}</p>
                  <div className="project-tags">
                    {p.tags.map((t) => (
                      <span key={t} className="project-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section>
          <div className="section-eyebrow">
            <div className="section-eyebrow-line" />
            <span className="section-eyebrow-text">Experience</span>
          </div>
          <div className="exp-grid">
            {EXPERIENCES.map((e) => (
              <div key={e.role} className="exp-card">
                <div
                  className="exp-indicator"
                  style={{ background: e.color, minHeight: 60 }}
                />
                <div className="exp-content">
                  <div className="exp-top">
                    <span className="exp-role">{e.role}</span>
                    <span className="exp-period">{e.period}</span>
                  </div>
                  <div className="exp-company">{e.company}</div>
                  <p className="exp-desc">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section>
          <div className="contact-card">
            <div className="contact-deco-1" />
            <div className="contact-deco-2" />
            <div className="contact-inner">
              <span className="contact-emoji">🤝</span>
              <h2 className="contact-title">Let&apos;s build something together</h2>
              <p className="contact-sub">
                5+ years in Fintech & SaaS. Available for senior full-stack,
                React Native, or AI engineering roles — remote or Bengaluru.
                Let&apos;s talk.
              </p>
              <div className="contact-actions">
                <button
                  className="btn-primary btn-lg"
                  onClick={handleCopyEmail}
                >
                  {copied ? "✅ Copied!" : "✉️ Copy email"}
                </button>
                <a
                  href="https://linkedin.com/in/adityakmr7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline btn-lg"
                >
                  💼 LinkedIn
                </a>
                <a
                  href="https://github.com/adityakmr7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline btn-lg"
                >
                  🐙 GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import PremiumModal from "./PremiumModal";
import AppHeader from "./AppHeader";

const FAQS = [
  {
    q: "Do I need a credit card to get started?",
    a: "No. You can use all core features of BuildrStudio completely free without entering any billing details.",
  },
  {
    q: "How does the Batch Store Exporter work?",
    a: "Under the Pro plan, you can upload a single screenshot, and our system automatically renders and packs it in all canonical resolutions required by Apple and Google. You get a clean ZIP file instantly.",
  },
  {
    q: "Can I save my custom brand colors and gradients?",
    a: "Yes. The Pro tier includes a Brand Presets kit where you can lock in your exact hex codes, brand fonts, and custom watermark text for automatic use on any tool.",
  },
  {
    q: "Do I have to subscribe, or can I pay once?",
    a: "Both work. The Launch Pack is a one-time $29 purchase that unlocks every Pro feature forever — ideal if you ship a release every few months. The $9/mo subscription is there if you prefer monthly billing. Both come with a 7-day money-back guarantee.",
  },
  {
    q: "Can I localize my screenshots into other languages?",
    a: "Yes. The built-in AI copywriter generates and translates headlines in 15+ languages. Localized screenshots typically convert 20–30% better in non-English markets, and BuildrStudio makes producing every locale a few clicks instead of a design project.",
  },
];

export default function SaaSLandingPage() {
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [heroUrl, setHeroUrl] = useState("");
  const [heroLoading, setHeroLoading] = useState(false);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleHeroImport = () => {
    const trimmed = heroUrl.trim();
    if (!trimmed) { heroInputRef.current?.focus(); return; }
    setHeroLoading(true);
    router.push(`/screenshot-builder?url=${encodeURIComponent(trimmed)}`);
  };

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="slp">
      <style>{`
        .slp {
          min-height: 100vh;
          background-color: var(--bg);
          color: var(--text-1);
          font-family: var(--font);
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          transition: background-color .3s;
        }

        /* ─── HERO ─── */
        .slp-hero {
          max-width: 1280px;
          margin: 0 auto;
          padding: 80px 48px 72px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .slp-hero-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .slp-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          background: var(--fill-subtle);
          border: 1px solid var(--border-strong);
          border-radius: var(--r-xl);
          font-size: 11px;
          font-weight: 700;
          color: var(--fill);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 24px;
          animation: slp-fadein 0.5s ease both;
        }
        .slp-hero-h1 {
          font-size: clamp(40px, 5.5vw, 72px);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -2.5px;
          margin: 0 0 20px;
          color: var(--text-1);
          animation: slp-fadein 0.5s 0.08s ease both;
        }
        .slp-hero-h1 mark {
          background: var(--fill);
          color: var(--fill-text);
          padding: 0 6px;
          border-radius: 4px;
          font-style: normal;
        }
        .slp-hero-sub {
          font-size: 17px;
          color: var(--text-2);
          max-width: 480px;
          line-height: 1.6;
          margin: 0 0 32px;
          animation: slp-fadein 0.5s 0.16s ease both;
        }
        .slp-import-wrap {
          display: flex;
          width: 100%;
          max-width: 520px;
          border-radius: var(--r-md);
          overflow: hidden;
          border: 1.5px solid var(--border-strong);
          background: var(--surface);
          box-shadow: 0 4px 20px rgba(0,0,0,0.07);
          transition: border-color 0.15s, box-shadow 0.15s;
          animation: slp-fadein 0.5s 0.22s ease both;
        }
        .slp-import-wrap:focus-within {
          border-color: var(--fill);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .slp-import-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-family: var(--font);
          font-size: 14px;
          color: var(--text-1);
          padding: 14px 16px;
          min-width: 0;
        }
        .slp-import-input::placeholder { color: var(--text-3); }
        .slp-import-btn {
          flex-shrink: 0;
          background: var(--fill);
          color: var(--fill-text);
          border: none;
          padding: 12px 20px;
          font-family: var(--font);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: opacity 0.15s;
        }
        .slp-import-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .slp-import-btn:hover:not(:disabled) { opacity: 0.85; }
        .slp-import-btn:active:not(:disabled) { transform: scale(0.98); }
        .slp-import-hint {
          font-size: 12px;
          color: var(--text-3);
          margin: 10px 0 0;
          animation: slp-fadein 0.5s 0.28s ease both;
        }

        /* ─── HERO RIGHT: product preview ─── */
        .slp-hero-right {
          animation: slp-fadein-up 0.6s 0.12s ease both;
        }
        .slp-preview-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.10);
        }
        .slp-preview-topbar {
          background: var(--surface-2);
          border-bottom: 1px solid var(--border);
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .slp-preview-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .slp-preview-body {
          padding: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
        }
        .slp-mockup-tile {
          border-radius: 12px;
          aspect-ratio: 9/16;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding: 12px 8px;
          position: relative;
          overflow: hidden;
        }
        .slp-mockup-tile-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
        }
        .slp-mockup-tile-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.0) 55%);
        }
        .slp-mockup-tile-label {
          font-size: 11px;
          font-weight: 800;
          color: #fff;
          text-align: center;
          line-height: 1.2;
          position: relative;
          z-index: 1;
        }
        .slp-mockup-tile-sub {
          font-size: 9px;
          color: rgba(255,255,255,0.7);
          text-align: center;
          margin-top: 3px;
          position: relative;
          z-index: 1;
        }
        .slp-preview-status {
          border-top: 1px solid var(--border);
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          color: var(--text-3);
        }
        .slp-preview-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          display: inline-block;
          margin-right: 5px;
        }

        /* ─── SECTION: two tools ─── */
        .slp-tools-section {
          border-top: 1px solid var(--border);
          background: var(--surface-2);
          padding: 72px 0;
        }
        .slp-tools-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 48px;
        }
        .slp-tools-heading {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 24px;
          margin-bottom: 40px;
        }
        .slp-tools-h2 {
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 900;
          letter-spacing: -1.5px;
          margin: 0 0 8px;
          line-height: 1.05;
        }
        .slp-tools-sub {
          font-size: 15px;
          color: var(--text-2);
          margin: 0;
        }
        .slp-tools-link {
          font-size: 13px;
          font-weight: 700;
          color: var(--fill);
          white-space: nowrap;
          text-decoration: none;
        }
        .slp-tools-link:hover { opacity: 0.8; }

        /* Launch flow strip */
        .slp-flow {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 32px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .slp-flow-step {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border: 1px solid var(--border);
          border-right: none;
          background: var(--surface);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-2);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .slp-flow-step:first-child { border-radius: var(--r-md) 0 0 var(--r-md); }
        .slp-flow-step:last-child { border-right: 1px solid var(--border); border-radius: 0 var(--r-md) var(--r-md) 0; }
        .slp-flow-step.active {
          border-color: var(--fill);
          background: var(--fill-subtle);
          color: var(--fill);
          font-weight: 700;
          z-index: 1;
        }
        .slp-flow-arrow {
          color: var(--text-3);
          font-size: 13px;
          flex-shrink: 0;
          padding: 0 4px;
        }

        /* Two tool cards */
        .slp-tool-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .slp-tool-card {
          display: flex;
          flex-direction: column;
          gap: 18px;
          padding: 32px;
          background: var(--bg);
          border: 1.5px solid var(--border);
          border-radius: 18px;
          text-decoration: none;
          color: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .slp-tool-card:hover {
          border-color: var(--fill);
          box-shadow: 0 16px 40px rgba(99,102,241,0.08);
        }
        .slp-tool-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .slp-tool-badge {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-3);
          margin-bottom: 2px;
        }
        .slp-tool-name {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin: 0 0 8px;
        }
        .slp-tool-desc {
          font-size: 14px;
          color: var(--text-2);
          line-height: 1.6;
          margin: 0 0 14px;
        }
        .slp-tool-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 13px;
          color: var(--text-2);
          flex: 1;
        }
        .slp-tool-features li { display: flex; gap: 8px; }
        .slp-tool-features li::before { content: "✓"; color: var(--fill); font-weight: 700; flex-shrink: 0; }
        .slp-tool-cta {
          font-size: 13px;
          font-weight: 700;
          color: var(--fill);
          margin-top: auto;
        }

        /* ─── SECTION: before/after ─── */
        .slp-ba-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 80px 48px;
        }
        .slp-ba-heading {
          margin-bottom: 48px;
        }
        .slp-ba-h2 {
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 900;
          letter-spacing: -1.5px;
          margin: 0 0 8px;
        }
        .slp-ba-sub {
          font-size: 15px;
          color: var(--text-2);
          margin: 0;
        }
        .slp-ba-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .slp-ba-card {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: var(--surface);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .slp-ba-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.10);
        }
        .slp-ba-visual {
          display: flex;
          height: 220px;
          overflow: hidden;
        }
        .slp-ba-before {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          position: relative;
          background: #0a0a0f;
          overflow: hidden;
        }
        .slp-ba-before img {
          width: 72px;
          height: auto;
          border-radius: 10px;
          opacity: 0.9;
          box-shadow: 0 4px 20px rgba(0,0,0,0.6);
        }
        .slp-ba-after {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          position: relative;
          overflow: hidden;
        }
        .slp-ba-after-frame {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .slp-ba-after-frame img {
          width: 56px;
          height: auto;
          border-radius: 8px;
          position: relative;
          z-index: 2;
        }
        .slp-ba-after-bezel {
          position: absolute;
          inset: -5px -4px;
          border-radius: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          background: rgba(0,0,0,0.15);
          z-index: 1;
          pointer-events: none;
        }
        .slp-ba-label {
          position: absolute;
          top: 8px;
          left: 8px;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.45);
          z-index: 3;
        }
        .slp-ba-label.right {
          left: auto;
          right: 8px;
          color: rgba(255,255,255,0.7);
        }
        .slp-ba-after-tag {
          position: absolute;
          bottom: 8px;
          left: 0; right: 0;
          text-align: center;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.6);
          z-index: 3;
        }
        .slp-ba-divider {
          width: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--surface);
          font-size: 14px;
          color: var(--text-3);
          flex-shrink: 0;
          z-index: 1;
        }
        .slp-ba-meta {
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border);
        }
        .slp-ba-meta-tool {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-2);
        }
        .slp-ba-meta-time {
          font-size: 11px;
          color: var(--fill);
          font-weight: 600;
        }

        /* ─── SECTION: AI spotlight ─── */
        .slp-ai {
          max-width: 1280px;
          margin: 0 auto 0;
          padding: 0 48px 80px;
        }
        .slp-ai-card {
          background: var(--fill-subtle);
          border: 1.5px solid var(--fill);
          border-radius: 16px;
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .slp-ai-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--fill);
          margin-bottom: 6px;
          display: block;
        }
        .slp-ai-title {
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 6px;
          letter-spacing: -0.3px;
        }
        .slp-ai-desc {
          font-size: 13px;
          color: var(--text-2);
          margin: 0;
          line-height: 1.55;
        }

        /* ─── SECTION: VS comparison ─── */
        .slp-vs {
          background: var(--text-1);
          color: var(--bg);
          padding: 80px 48px;
        }
        .slp-vs-inner {
          max-width: 1280px;
          margin: 0 auto;
        }
        .slp-vs-h2 {
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 900;
          letter-spacing: -1.5px;
          margin: 0 0 8px;
          color: var(--bg);
        }
        .slp-vs-sub {
          font-size: 15px;
          color: rgba(var(--bg-rgb, 255,255,255), 0.6);
          margin: 0 0 48px;
          opacity: 0.65;
        }
        .slp-vs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .slp-vs-col {
          border-radius: 16px;
          padding: 28px;
        }
        .slp-vs-col.bad {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .slp-vs-col.good {
          background: var(--fill);
          border: 1px solid var(--fill);
        }
        .slp-vs-colhead {
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .slp-vs-col.bad .slp-vs-colhead { color: rgba(255,255,255,0.5); }
        .slp-vs-col.good .slp-vs-colhead { color: var(--fill-text); }
        .slp-vs-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .slp-vs-item {
          font-size: 14px;
          line-height: 1.45;
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }
        .slp-vs-col.bad .slp-vs-item { color: rgba(255,255,255,0.55); }
        .slp-vs-col.good .slp-vs-item { color: var(--fill-text); opacity: 0.92; }
        .slp-vs-marker { flex-shrink: 0; font-size: 13px; }

        /* ─── SECTION: pricing ─── */
        .slp-pricing {
          max-width: 1280px;
          margin: 0 auto;
          padding: 80px 48px;
        }
        .slp-pricing-heading {
          margin-bottom: 48px;
        }
        .slp-pricing-h2 {
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 900;
          letter-spacing: -1.5px;
          margin: 0 0 8px;
        }
        .slp-pricing-sub {
          font-size: 15px;
          color: var(--text-2);
          margin: 0;
        }
        .slp-price-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1040px;
        }
        .slp-price-card {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 18px;
          padding: 36px 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: relative;
        }
        .slp-price-card.pro {
          border-color: var(--fill);
          box-shadow: 0 12px 40px rgba(99,102,241,0.1);
        }
        .slp-badge-pro {
          position: absolute;
          top: 18px;
          right: 18px;
          background: var(--fill);
          color: var(--fill-text);
          font-size: 10px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--r-xl);
          letter-spacing: 0.04em;
        }
        .slp-price-name {
          font-size: 18px;
          font-weight: 800;
          margin: 0;
        }
        .slp-price-val {
          font-size: 44px;
          font-weight: 900;
          letter-spacing: -2px;
          color: var(--text-1);
          line-height: 1;
        }
        .slp-price-period {
          font-size: 13px;
          color: var(--text-3);
        }
        .slp-price-desc {
          font-size: 13px;
          color: var(--text-3);
          margin: 0;
        }
        .slp-price-feats {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }
        .slp-price-feat {
          font-size: 13px;
          color: var(--text-2);
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .slp-price-feat-mark {
          color: var(--fill);
          font-weight: 700;
          flex-shrink: 0;
        }

        /* ─── SECTION: FAQs ─── */
        .slp-faq {
          border-top: 1px solid var(--border);
          max-width: 1280px;
          margin: 0 auto;
          padding: 80px 48px;
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 80px;
          align-items: start;
        }
        .slp-faq-left h2 {
          font-size: clamp(28px, 3vw, 40px);
          font-weight: 900;
          letter-spacing: -1.5px;
          margin: 0 0 12px;
        }
        .slp-faq-left p {
          font-size: 14px;
          color: var(--text-2);
          line-height: 1.6;
          margin: 0;
        }
        .slp-faq-item {
          border-bottom: 1px solid var(--border);
        }
        .slp-faq-q {
          width: 100%;
          background: none;
          border: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
          font-weight: 700;
          color: var(--text-1);
          cursor: pointer;
          text-align: left;
          padding: 16px 0;
          font-family: var(--font);
          gap: 16px;
        }
        .slp-faq-q:hover { color: var(--fill); }
        .slp-faq-icon { flex-shrink: 0; font-size: 18px; font-weight: 400; color: var(--text-3); }
        .slp-faq-a {
          font-size: 14px;
          color: var(--text-2);
          line-height: 1.6;
          padding: 0 0 16px;
        }

        /* ─── FOOTER ─── */
        .slp-footer {
          margin-top: auto;
          background: var(--surface-2);
          border-top: 1px solid var(--border);
          padding: 40px 48px;
        }
        .slp-footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .slp-footer-brand {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-1);
        }
        .slp-footer-desc {
          font-size: 12px;
          color: var(--text-3);
          margin: 4px 0 0;
        }
        .slp-footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        .slp-footer-link {
          font-size: 13px;
          color: var(--text-3);
          text-decoration: none;
          transition: color 0.15s;
        }
        .slp-footer-link:hover { color: var(--text-1); }
        .slp-footer-copy {
          font-size: 11px;
          color: var(--text-3);
          white-space: nowrap;
        }

        /* ─── ANIMATIONS ─── */
        @keyframes slp-fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slp-fadein-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 900px) {
          .slp-hero { grid-template-columns: 1fr; gap: 40px; padding: 48px 24px 56px; }
          .slp-hero-right { display: none; }
          .slp-tools-inner { padding: 0 24px; }
          .slp-tool-grid { grid-template-columns: 1fr; }
          .slp-tools-heading { grid-template-columns: 1fr; }
          .slp-ba-section { padding: 56px 24px; }
          .slp-ba-grid { grid-template-columns: 1fr; }
          .slp-vs { padding: 56px 24px; }
          .slp-vs-grid { grid-template-columns: 1fr; }
          .slp-pricing { padding: 56px 24px; }
          .slp-price-grid { grid-template-columns: 1fr; max-width: 400px; }
          .slp-faq { grid-template-columns: 1fr; gap: 32px; padding: 56px 24px; }
          .slp-ai { padding: 0 24px 56px; }
          .slp-footer { padding: 32px 24px; }
          .slp-footer-inner { flex-direction: column; align-items: flex-start; }
          .slp-flow { margin-bottom: 20px; }
        }
      `}</style>

      {/* HEADER */}
      <AppHeader activeRoute="home" onOpenPremium={() => setIsPremiumOpen(true)} />

      {/* HERO */}
      <section className="slp-hero">
        <div className="slp-hero-left">
          <div className="slp-badge">Free Screenshot Generator</div>
          <h1 className="slp-hero-h1">
            App Store Screenshots<br />
            That <mark>Convert</mark>
          </h1>
          <p className="slp-hero-sub">
            Paste your App Store URL — get device-framed mockups with AI headlines, localized into 15+ languages, ready to submit in minutes.
          </p>
          <div style={{ width: "100%", maxWidth: "520px" }}>
            <div className="slp-import-wrap">
              <input
                ref={heroInputRef}
                type="url"
                className="slp-import-input"
                placeholder="https://apps.apple.com/app/your-app/id..."
                value={heroUrl}
                onChange={(e) => setHeroUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleHeroImport()}
              />
              <button
                type="button"
                className="slp-import-btn"
                onClick={handleHeroImport}
                disabled={heroLoading}
              >
                {heroLoading ? "Loading..." : "Generate"}
              </button>
            </div>
            <p className="slp-import-hint">
              Supports apps.apple.com and play.google.com.{" "}
              <Link href="/screenshot-builder" style={{ color: "var(--text-3)", textDecoration: "underline" }}>
                Start from scratch
              </Link>
            </p>
          </div>
        </div>

        {/* Product preview — right side */}
        <div className="slp-hero-right">
          <div className="slp-preview-card">
            <div className="slp-preview-topbar">
              <div className="slp-preview-dot" style={{ background: "#ef4444" }} />
              <div className="slp-preview-dot" style={{ background: "#f59e0b" }} />
              <div className="slp-preview-dot" style={{ background: "#22c55e" }} />
              <span style={{ marginLeft: "8px", fontSize: "11px", color: "var(--text-3)" }}>Screenshot Builder</span>
            </div>
            <div className="slp-preview-body">
              <div className="slp-mockup-tile" style={{ background: "#1DB954" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="slp-mockup-tile-img" src="https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/f3/ce/05/f3ce0547-690a-b355-b1dd-6b6e91808279/IOS_-_5.5_-_S01_-_EN_-_CA_U005bEnglish__U0028Canada_U0029_U005d.png/392x696bb.png" alt="Spotify App Store screenshot" />
                <div className="slp-mockup-tile-overlay" />
                <div className="slp-mockup-tile-label">Spotify</div>
                <div className="slp-mockup-tile-sub">Music</div>
              </div>
              <div className="slp-mockup-tile" style={{ background: "#3b6fa0" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="slp-mockup-tile-img" src="https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/4e/87/9d/4e879dd8-bf44-69df-a4f5-092ef3688f76/748cb6a5-5588-4d86-af93-7add35562d37_iPhone_5.5_Inch_01.png/392x696bb.png" alt="Calm App Store screenshot" />
                <div className="slp-mockup-tile-overlay" />
                <div className="slp-mockup-tile-label">Calm</div>
                <div className="slp-mockup-tile-sub">Meditation</div>
              </div>
              <div className="slp-mockup-tile" style={{ background: "#ff0000" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="slp-mockup-tile-img" src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e8/5d/12/e85d121e-8bcf-4f57-cf07-ed23b57f1b30/f1192f1f-430d-469a-b032-cdf77b8b04c7_iOS-5.5-in_1.jpg/392x696bb.jpg" alt="YouTube App Store screenshot" />
                <div className="slp-mockup-tile-overlay" />
                <div className="slp-mockup-tile-label">YouTube</div>
                <div className="slp-mockup-tile-sub">Video</div>
              </div>
            </div>
            <div className="slp-preview-status">
              <span>
                <span className="slp-preview-status-dot" />
                3 screenshots ready
              </span>
              <span style={{ color: "var(--fill)", fontWeight: 700 }}>Export PNG</span>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS SECTION */}
      <section className="slp-tools-section" id="tools">
        <div className="slp-tools-inner">
          <div className="slp-tools-heading">
            <div>
              <h2 className="slp-tools-h2">Every visual your launch needs</h2>
              <p className="slp-tools-sub">Two focused tools. From build to ship to announce, without Figma.</p>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <div className="slp-flow">
                <div className="slp-flow-step">Build your app</div>
                <span className="slp-flow-arrow">→</span>
                <div className="slp-flow-step active">Screenshot Builder</div>
                <span className="slp-flow-arrow">→</span>
                <div className="slp-flow-step active">Launch Cards</div>
                <span className="slp-flow-arrow">→</span>
                <div className="slp-flow-step">Post on X / LinkedIn</div>
              </div>
            </div>
          </div>

          <div className="slp-tool-grid">
            <Link href="/screenshot-builder" className="slp-tool-card">
              <div className="slp-tool-icon" style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              </div>
              <div>
                <div className="slp-tool-badge">App Store · Play Store</div>
                <h3 className="slp-tool-name">Screenshot Builder</h3>
                <p className="slp-tool-desc">
                  Paste your store URL to auto-import screenshots, or upload your own. Add device frames, headlines, and gradients. Export at every required size in one click.
                </p>
                <ul className="slp-tool-features">
                  <li>Auto-import from App Store / Play Store</li>
                  <li>AI headlines in 15+ languages</li>
                  <li>Smart resize across all device sizes</li>
                  <li>iPhone, iPad, Android frames</li>
                </ul>
              </div>
              <span className="slp-tool-cta">Start Building →</span>
            </Link>

            <Link href="/social-optimizer" className="slp-tool-card">
              <div className="slp-tool-icon" style={{ background: "linear-gradient(135deg, #f97316, #ec4899)" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>
              </div>
              <div>
                <div className="slp-tool-badge">X · LinkedIn · Instagram</div>
                <h3 className="slp-tool-name">Launch Cards</h3>
                <p className="slp-tool-desc">
                  You shipped. Now tell the world. Drop a screenshot, pick a dev frame, add a headline, and export a share-ready card in 30 seconds.
                </p>
                <ul className="slp-tool-features">
                  <li>X/Twitter, LinkedIn and square formats</li>
                  <li>Dev frames: browser, terminal, macOS</li>
                  <li>Mesh gradients and 10+ presets</li>
                  <li>One-click copy to clipboard</li>
                </ul>
              </div>
              <span className="slp-tool-cta">Make a Launch Card →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* AI SPOTLIGHT */}
      <div className="slp-ai" style={{ marginTop: "32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0" }}>
          <div className="slp-ai-card">
            <div style={{ flex: 1, minWidth: "260px" }}>
              <span className="slp-ai-label">Now Live</span>
              <h3 className="slp-ai-title">AI-Powered Copywriter</h3>
              <p className="slp-ai-desc">
                Generate high-converting App Store headlines in 15+ languages. Describe your app, pick a tone, get 5 ready-to-use copy suggestions powered by AI, built into every tool.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPremiumOpen(true)}
              className="btn-outline btn-sm"
              style={{ display: "flex", gap: "8px", alignItems: "center", fontWeight: 700, cursor: "pointer", flexShrink: 0 }}
            >
              Get AI Updates
            </button>
          </div>
        </div>
      </div>

      {/* BEFORE / AFTER */}
      <section className="slp-ba-section">
        <div className="slp-ba-heading">
          <h2 className="slp-ba-h2">Raw Screenshot, Store-Ready in Seconds</h2>
          <p className="slp-ba-sub">See what BuildrStudio does to plain app screenshots.</p>
        </div>
        <div className="slp-ba-grid">
          {[
            {
              screenshotUrl: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/f3/ce/05/f3ce0547-690a-b355-b1dd-6b6e91808279/IOS_-_5.5_-_S01_-_EN_-_CA_U005bEnglish__U0028Canada_U0029_U005d.png/392x696bb.png",
              appName: "Spotify",
              afterGradient: "linear-gradient(135deg, #1DB954 0%, #121212 100%)",
              tool: "App Store Screenshot",
              time: "12 sec",
            },
            {
              screenshotUrl: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/4e/87/9d/4e879dd8-bf44-69df-a4f5-092ef3688f76/748cb6a5-5588-4d86-af93-7add35562d37_iPhone_5.5_Inch_01.png/392x696bb.png",
              appName: "Calm",
              afterGradient: "linear-gradient(135deg, #3b6fa0 0%, #a8c5da 100%)",
              tool: "App Store Screenshot",
              time: "8 sec",
            },
          ].map((item, idx) => (
            <div key={idx} className="slp-ba-card">
              <div className="slp-ba-visual">
                <div className="slp-ba-before">
                  <span className="slp-ba-label">Before</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.screenshotUrl} alt={`${item.appName} raw screenshot`} />
                </div>
                <div className="slp-ba-divider">→</div>
                <div className="slp-ba-after" style={{ background: item.afterGradient }}>
                  <span className="slp-ba-label right">After</span>
                  <div className="slp-ba-after-frame">
                    <div className="slp-ba-after-bezel" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.screenshotUrl} alt={`${item.appName} framed mockup`} />
                  </div>
                  <span className="slp-ba-after-tag">{item.appName} · BuildrStudio</span>
                </div>
              </div>
              <div className="slp-ba-meta">
                <span className="slp-ba-meta-tool">{item.tool}</span>
                <span className="slp-ba-meta-time">Ready in {item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VS SECTION — inverted background for contrast */}
      <section className="slp-vs">
        <div className="slp-vs-inner">
          <h2 className="slp-vs-h2">Built for Builders</h2>
          <p className="slp-vs-sub">Why indie makers choose BuildrStudio over general design platforms.</p>
          <div className="slp-vs-grid">
            <div className="slp-vs-col bad">
              <div className="slp-vs-colhead">Figma / Photoshop</div>
              <ul className="slp-vs-list">
                <li className="slp-vs-item"><span className="slp-vs-marker">-</span>Infinite canvas leads to layout paralysis</li>
                <li className="slp-vs-item"><span className="slp-vs-marker">-</span>Manual sizing and aspect ratios are error-prone</li>
                <li className="slp-vs-item"><span className="slp-vs-marker">-</span>Mockups require complex device templates</li>
                <li className="slp-vs-item"><span className="slp-vs-marker">-</span>Drag-and-drop handles are slow and finicky</li>
              </ul>
            </div>
            <div className="slp-vs-col good">
              <div className="slp-vs-colhead">BuildrStudio</div>
              <ul className="slp-vs-list">
                <li className="slp-vs-item"><span className="slp-vs-marker">+</span>Purpose-built templates ensure gorgeous alignment</li>
                <li className="slp-vs-item"><span className="slp-vs-marker">+</span>Pre-loaded resolutions match store requirements automatically</li>
                <li className="slp-vs-item"><span className="slp-vs-marker">+</span>Toggleable 3D device perspective frames instantly</li>
                <li className="slp-vs-item"><span className="slp-vs-marker">+</span>Copy directly to clipboard or export high-res 4K PNGs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="slp-pricing">
        <div className="slp-pricing-heading">
          <h2 className="slp-pricing-h2">Simple, honest pricing</h2>
          <p className="slp-pricing-sub">Free forever. Pay once for your launch, or subscribe if you ship often.</p>
        </div>
        <div className="slp-price-grid">
          <div className="slp-price-card">
            <h3 className="slp-price-name">Free</h3>
            <div>
              <span className="slp-price-val">$0</span>
              <span className="slp-price-period"> / forever</span>
            </div>
            <p className="slp-price-desc">Build and export screenshots with no account required.</p>
            <ul className="slp-price-feats">
              <li className="slp-price-feat"><span className="slp-price-feat-mark">✓</span> All device frames and templates</li>
              <li className="slp-price-feat"><span className="slp-price-feat-mark">✓</span> Gradients, solid colors and mesh</li>
              <li className="slp-price-feat"><span className="slp-price-feat-mark">✓</span> PNG export (with watermark)</li>
              <li className="slp-price-feat"><span className="slp-price-feat-mark">✓</span> 5 AI headline generations</li>
            </ul>
            <Link
              href="/screenshot-builder"
              className="btn-outline btn-md"
              style={{ textAlign: "center", textDecoration: "none" }}
            >
              Start for free
            </Link>
          </div>
          <div className="slp-price-card pro">
            <span className="slp-badge-pro">Best value</span>
            <h3 className="slp-price-name" style={{ color: "var(--fill)" }}>Launch Pack</h3>
            <div>
              <span className="slp-price-val">$29</span>
              <span className="slp-price-period"> one-time</span>
            </div>
            <p className="slp-price-desc">Pay once, keep every Pro feature forever. Built for shipping a launch.</p>
            <ul className="slp-price-feats">
              <li className="slp-price-feat" style={{ fontWeight: 600 }}><span className="slp-price-feat-mark">✦</span> Watermark-free exports, forever</li>
              <li className="slp-price-feat"><span className="slp-price-feat-mark">✓</span> Batch export: all Apple and Google sizes</li>
              <li className="slp-price-feat"><span className="slp-price-feat-mark">✓</span> Canonical store filenames, ready to upload</li>
              <li className="slp-price-feat"><span className="slp-price-feat-mark">✓</span> 3D device tilts and 4K PNG</li>
              <li className="slp-price-feat"><span className="slp-price-feat-mark">✓</span> Unlimited AI headline generation</li>
              <li className="slp-price-feat"><span className="slp-price-feat-mark">✓</span> AI translation in 15+ languages</li>
              <li className="slp-price-feat"><span className="slp-price-feat-mark">✓</span> Custom brand presets and swatches</li>
            </ul>
            <button
              type="button"
              onClick={() => setIsPremiumOpen(true)}
              className="btn-fill btn-md"
              style={{ width: "100%", justifyContent: "center", fontWeight: 700, cursor: "pointer", border: "none" }}
            >
              Get Launch Pack · $29
            </button>
          </div>
          <div className="slp-price-card">
            <h3 className="slp-price-name">Pro Monthly</h3>
            <div>
              <span className="slp-price-val">$9</span>
              <span className="slp-price-period"> /month</span>
            </div>
            <p className="slp-price-desc">Same Pro features, billed monthly. Cancel anytime.</p>
            <ul className="slp-price-feats">
              <li className="slp-price-feat"><span className="slp-price-feat-mark">✓</span> Everything in Launch Pack</li>
              <li className="slp-price-feat"><span className="slp-price-feat-mark">✓</span> Ideal for agencies and frequent shippers</li>
              <li className="slp-price-feat"><span className="slp-price-feat-mark">✓</span> Priority support</li>
            </ul>
            <button
              type="button"
              onClick={() => setIsPremiumOpen(true)}
              className="btn-outline btn-md"
              style={{ width: "100%", justifyContent: "center", fontWeight: 700, cursor: "pointer" }}
            >
              Get Pro · $9/mo
            </button>
          </div>
        </div>
      </section>

      {/* FAQs — split layout */}
      <section className="slp-faq">
        <div className="slp-faq-left">
          <h2>Frequently asked questions</h2>
          <p>Everything you need to know about BuildrStudio. Can&apos;t find the answer? Reach out on X.</p>
        </div>
        <div>
          {FAQS.map((faq, idx) => (
            <div key={idx} className="slp-faq-item">
              <button onClick={() => toggleFaq(idx)} className="slp-faq-q">
                <span>{faq.q}</span>
                <span className="slp-faq-icon">{faqOpen === idx ? "−" : "+"}</span>
              </button>
              {faqOpen === idx && <div className="slp-faq-a">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="slp-footer">
        <div className="slp-footer-inner">
          <div>
            <div className="slp-footer-brand">BuildrStudio</div>
            <div className="slp-footer-desc">Launch visuals for indie developers.</div>
          </div>
          <div className="slp-footer-links">
            <Link href="/screenshot-builder" className="slp-footer-link">Screenshot Builder</Link>
            <Link href="/app-store-screenshot-sizes" className="slp-footer-link">Screenshot Sizes Guide</Link>
            <Link href="/social-optimizer" className="slp-footer-link">Launch Cards</Link>
            <Link href="/updates" className="slp-footer-link">What&apos;s New</Link>
            <Link href="/support" className="slp-footer-link">Support</Link>
            <Link href="/terms" className="slp-footer-link">Terms</Link>
            <Link href="/privacy" className="slp-footer-link">Privacy</Link>
            <Link href="/refund" className="slp-footer-link">Refund Policy</Link>
          </div>
          <div className="slp-footer-copy">
            &copy; {new Date().getFullYear()} BuildrStudio
          </div>
        </div>
      </footer>

      <PremiumModal isOpen={isPremiumOpen} onClose={() => setIsPremiumOpen(false)} />
    </div>
  );
}

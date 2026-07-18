"use client";

// ─── AppHeader.tsx ───────────────────────────────────────────────────────────
// Unified, premium, responsive header navigation component.
// Features a luxury style gold/neon gradient CTA, responsive layout scaling
// (hiding branding text and toggler text on small screens), and a horizontal
// slide-over mobile menu overlay with a blurred backdrop.

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import PremiumModal from "./PremiumModal";
import AuthModal from "./AuthModal";
import UserMenu from "./UserMenu";

interface AppHeaderProps {
  activeRoute?: "social-optimizer" | "screenshot-builder" | "roadmap" | "change-log" | "home";
  onOpenPremium?: () => void;
}

export default function AppHeader({ activeRoute, onOpenPremium }: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [prevRoute, setPrevRoute] = useState(activeRoute);

  if (activeRoute !== prevRoute) {
    setPrevRoute(activeRoute);
    setMobileMenuOpen(false);
  }

  const handleProClick = () => {
    if (onOpenPremium) {
      onOpenPremium();
    } else {
      setIsPremiumOpen(true);
    }
  };

  return (
    <>
      <header className="unified-header">
        <style>{`
          .unified-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            border-bottom: 1px solid var(--border);
            background: var(--surface);
            height: 58px;
            position: sticky;
            top: 0;
            z-index: 999;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            flex-shrink: 0;
            width: 100%;
            box-sizing: border-box;
            transition: background-color .3s, border .3s;
            box-shadow: 0 1px 2px rgba(0,0,0,0.02);
          }

          /* Logo */
          .hdr-logo {
            display: flex;
            align-items: center;
            gap: 9px;
            text-decoration: none;
            flex-shrink: 0;
            z-index: 1001;
            transition: opacity 0.2s ease;
          }
          .hdr-logo:hover {
            opacity: 0.85;
          }
          .hdr-logo-mark {
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .hdr-logo-wordmark {
            display: flex;
            align-items: baseline;
            gap: 0px;
            line-height: 1;
          }
          .hdr-logo-buildr {
            font-size: 15px;
            font-weight: 800;
            color: var(--text-1);
            letter-spacing: -0.6px;
          }
          .hdr-logo-studio {
            font-size: 15px;
            font-weight: 400;
            color: var(--text-3);
            letter-spacing: -0.3px;
          }

          /* Desktop Navigation */
          .hdr-nav {
            display: flex;
            align-items: center;
            gap: 4px;
          }
          .hdr-link {
            font-size: 13px;
            font-weight: 600;
            color: var(--text-2);
            padding: 8px 12px;
            border-radius: var(--r-sm);
            text-decoration: none;
            transition: all 0.15s ease;
            cursor: pointer;
            border: none;
            background: none;
            font-family: var(--font);
            display: inline-flex;
            align-items: center;
          }
          .hdr-link:hover,
          .hdr-link.active {
            background: var(--fill-subtle);
            color: var(--text-1);
          }

          /* Tools Dropdown Container */
          .dropdown-container {
            position: relative;
            padding-bottom: 8px;
            margin-bottom: -8px;
          }
          .hdr-dropdown-btn {
            display: flex;
            align-items: center;
            gap: 4px;
          }
          .hdr-dropdown-btn span.arrow {
            font-size: 8px;
            transition: transform 0.2s ease;
          }
          .dropdown-container:hover .hdr-dropdown-btn span.arrow {
            transform: rotate(180deg);
          }

          /* Tools Dropdown Menu */
          .hdr-dropdown-menu {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(12px) scale(0.97);
            width: 280px;
            background: var(--surface);
            border: 1px solid var(--border-strong);
            border-radius: var(--r-md);
            box-shadow: 0 15px 35px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.05);
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            z-index: 1100;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .dropdown-container:hover .hdr-dropdown-menu,
          .dropdown-container:focus-within .hdr-dropdown-menu {
            opacity: 1;
            transform: translateX(-50%) translateY(4px) scale(1);
            pointer-events: auto;
          }

          /* Arrow Pointer */
          .hdr-dropdown-menu::before {
            content: "";
            position: absolute;
            top: -6px;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
            width: 12px;
            height: 12px;
            background: var(--surface);
            border-top: 1px solid var(--border-strong);
            border-left: 1px solid var(--border-strong);
          }

          .dropdown-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            border-radius: var(--r-sm);
            text-decoration: none;
            color: var(--text-1);
            transition: all 0.15s ease;
            position: relative;
            z-index: 1;
          }
          .dropdown-item:hover {
            background: var(--fill-subtle);
            transform: translateX(4px);
          }
          .dropdown-item-icon-wrap {
            width: 30px;
            height: 30px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            flex-shrink: 0;
            transition: transform 0.2s ease;
          }
          .dropdown-item:hover .dropdown-item-icon-wrap {
            transform: scale(1.1);
          }
          
          /* Gradients for tool icons */
          .icon-social { background: linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(244,63,94,0.15) 100%); }
          .icon-screens { background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.15) 100%); }
          .icon-change { background: linear-gradient(135deg, rgba(234,179,8,0.1) 0%, rgba(202,138,4,0.15) 100%); }

          .dropdown-item-info {
            display: flex;
            flex-direction: column;
            line-height: 1.25;
          }
          .dropdown-item-title {
            font-size: 13px;
            font-weight: 700;
            color: var(--text-1);
          }
          .dropdown-item-desc {
            font-size: 11px;
            color: var(--text-3);
            margin-top: 2px;
          }

          /* Actions */
          .hdr-actions {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          /* Premium Upgrade CTA Button */
          .pro-btn {
            background: #09090b;
            color: #fef3c7 !important;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(251, 191, 36, 0.32);
            padding: 7px 14px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 12px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            box-shadow: 0 0 0 1px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4), 0 0 16px rgba(251,191,36,0.06), inset 0 1px 0 rgba(255,255,255,0.06);
            transition: all 0.2s ease;
            font-family: var(--font);
            text-decoration: none;
            z-index: 10;
            letter-spacing: 0.01em;
          }
          .pro-btn:hover {
            background: #111114;
            border-color: rgba(251, 191, 36, 0.58);
            box-shadow: 0 0 0 1px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.4), 0 0 24px rgba(251,191,36,0.14), inset 0 1px 0 rgba(255,255,255,0.08);
            transform: translateY(-1px);
          }
          .pro-btn:active {
            transform: translateY(0px);
          }
          .pro-btn-shimmer {
            position: absolute;
            inset: 0;
            background: linear-gradient(105deg, transparent 35%, rgba(251,191,36,0.07) 50%, transparent 65%);
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            border-radius: inherit;
          }
          .pro-btn:hover .pro-btn-shimmer {
            opacity: 1;
          }

          /* Mobile Menu Toggle Burger Button */
          .burger-btn {
            display: none;
            background: none;
            border: none;
            color: var(--text-2);
            font-size: 20px;
            cursor: pointer;
            padding: 4px 8px;
            z-index: 1001;
            transition: color 0.15s ease;
          }
          .burger-btn:hover {
            color: var(--text-1);
          }

          /* Mobile Drawer Side slide-over */
          .mobile-drawer-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s ease;
          }
          .mobile-drawer-backdrop.open {
            opacity: 1;
            pointer-events: auto;
          }
          .mobile-drawer-panel {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            max-width: 320px;
            background: var(--surface);
            z-index: 10000;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 24px;
            box-shadow: -10px 0 30px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            overflow-y: auto;
          }
          .mobile-drawer-panel.open {
            transform: translateX(0);
          }

          .mobile-drawer-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .mobile-drawer-close {
            background: none;
            border: none;
            font-size: 20px;
            color: var(--text-2);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .mobile-drawer-close:hover {
            color: var(--text-1);
          }

          .mobile-section-label {
            font-size: 11px;
            font-weight: 700;
            color: var(--text-3);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
            display: block;
          }
          .mobile-grid {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .mobile-link {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-2);
            padding: 12px 14px;
            background: var(--surface-2);
            border: 1px solid var(--border);
            border-radius: var(--r-md);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.15s ease;
          }
          .mobile-link:hover,
          .mobile-link.active {
            border-color: var(--text-1);
            color: var(--text-1);
            background: var(--fill-subtle);
          }

          /* Responsive Rules */
          @media (max-width: 1024px) {
            .hdr-nav {
              display: none;
            }
            .burger-btn {
              display: block;
            }
          }

          @media (max-width: 640px) {
            .pro-btn-text {
              display: none;
            }
            .pro-btn {
              padding: 8px 10px;
              border-radius: 50%;
              width: 32px;
              height: 32px;
              justify-content: center;
              font-size: 14px;
            }
            .unified-header {
              padding: 0 16px;
            }
          }

          @media (max-width: 500px) {
            .hdr-logo-wordmark {
              display: none;
            }
          }
        `}</style>

        {/* Left: Logo */}
        <Link href="/" className="hdr-logo">
          <div className="hdr-logo-mark">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="30" height="30" rx="8" fill="#09090b"/>
              {/* Back screen layer */}
              <rect x="14" y="6" width="11" height="15" rx="2.5" fill="#3f3f46"/>
              {/* Middle screen layer */}
              <rect x="11" y="8.5" width="11" height="15" rx="2.5" fill="#52525b"/>
              {/* Front screen layer — brand indigo */}
              <rect x="5" y="11" width="13" height="17" rx="2.5" fill="url(#logoFg)"/>
              {/* Screen notch on front */}
              <rect x="10" y="11" width="3" height="1.5" rx="0.75" fill="rgba(0,0,0,0.4)"/>
              <defs>
                <linearGradient id="logoFg" x1="5" y1="11" x2="18" y2="28" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#818cf8"/>
                  <stop offset="100%" stopColor="#6366f1"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="hdr-logo-wordmark">
            <span className="hdr-logo-buildr">Buildr</span>
            <span className="hdr-logo-studio">Studio</span>
          </div>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hdr-nav">
          {/* Tools Dropdown */}
          <div className="dropdown-container">
            <button
              type="button"
              className={`hdr-link hdr-dropdown-btn ${
                activeRoute === "social-optimizer" ||
                activeRoute === "screenshot-builder" ||
                activeRoute === "change-log"
                  ? "active"
                  : ""
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline-block",verticalAlign:"middle",marginRight:"4px"}}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>Tools <span className="arrow">▼</span>
            </button>

            <div className="hdr-dropdown-menu">
              <Link href="/screenshot-builder" className="dropdown-item">
                <div className="dropdown-item-icon-wrap icon-screens"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></div>
                <div className="dropdown-item-info">
                  <span className="dropdown-item-title">Screenshot Builder</span>
                  <span className="dropdown-item-desc">iOS & Play Store mockups · Main tool</span>
                </div>
              </Link>

              <Link href="/social-optimizer" className="dropdown-item">
                <div className="dropdown-item-icon-wrap icon-social"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></div>
                <div className="dropdown-item-info">
                  <span className="dropdown-item-title">Social Optimizer</span>
                  <span className="dropdown-item-desc">Screenshots to social posts</span>
                </div>
              </Link>

              <Link href="/change-log" className="dropdown-item">
                <div className="dropdown-item-icon-wrap icon-change"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
                <div className="dropdown-item-info">
                  <span className="dropdown-item-title">Changelog Maker</span>
                  <span className="dropdown-item-desc">Release log social graphics</span>
                </div>
              </Link>
            </div>
          </div>

          <Link href="/roadmap" className={`hdr-link ${activeRoute === "roadmap" ? "active" : ""}`}>
            Roadmap
          </Link>
          <Link href="/about" className="hdr-link">
            About
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="hdr-actions">
          <button
            type="button"
            onClick={handleProClick}
            className="pro-btn"
            aria-label="Go Pro"
          >
            <span className="pro-btn-shimmer" />
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span className="pro-btn-text">Go Pro</span>
          </button>

          <UserMenu
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenPremium={handleProClick}
          />

          <ThemeToggle />

          {/* Burger menu button on mobile */}
          <button
            type="button"
            className="burger-btn"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Navigation Backdrop */}
      <div 
        className={`mobile-drawer-backdrop ${mobileMenuOpen ? "open" : ""}`} 
        onClick={() => setMobileMenuOpen(false)} 
      />

      {/* Mobile Navigation Drawer Panel */}
      <div className={`mobile-drawer-panel ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <div className="hdr-logo">
            <div className="hdr-logo-mark">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="30" rx="8" fill="#09090b"/>
                <rect x="14" y="6" width="11" height="15" rx="2.5" fill="#3f3f46"/>
                <rect x="11" y="8.5" width="11" height="15" rx="2.5" fill="#52525b"/>
                <rect x="5" y="11" width="13" height="17" rx="2.5" fill="url(#logoFg2)"/>
                <rect x="10" y="11" width="3" height="1.5" rx="0.75" fill="rgba(0,0,0,0.4)"/>
                <defs>
                  <linearGradient id="logoFg2" x1="5" y1="11" x2="18" y2="28" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#818cf8"/>
                    <stop offset="100%" stopColor="#6366f1"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="hdr-logo-wordmark">
              <span className="hdr-logo-buildr">Buildr</span>
              <span className="hdr-logo-studio">Studio</span>
            </div>
          </div>
          <button 
            type="button" 
            className="mobile-drawer-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div>
          <span className="mobile-section-label">Launch Creative Tools</span>
          <div className="mobile-grid">
            <Link
              href="/social-optimizer"
              className={`mobile-link ${activeRoute === "social-optimizer" ? "active" : ""}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              <span>Social Optimizer</span>
            </Link>
            <Link
              href="/screenshot-builder"
              className={`mobile-link ${activeRoute === "screenshot-builder" ? "active" : ""}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              <span>Screenshot Builder</span>
            </Link>
            <Link
              href="/change-log"
              className={`mobile-link ${activeRoute === "change-log" ? "active" : ""}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <span>Changelog Maker</span>
            </Link>
          </div>
        </div>

        <div style={{ height: "1px", background: "var(--border)", margin: "4px 0" }} />

        <div>
          <span className="mobile-section-label">General</span>
          <div className="mobile-grid">
            <Link
              href="/roadmap"
              className={`mobile-link ${activeRoute === "roadmap" ? "active" : ""}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              <span>Product Roadmap</span>
            </Link>
            <Link href="/about" className="mobile-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>About Me</span>
            </Link>
            <Link href="/updates" className="mobile-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>What&apos;s New</span>
            </Link>
            <Link href="/support" className="mobile-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span>Support</span>
            </Link>
          </div>
        </div>

        <div style={{ flexGrow: 1 }} />

        <button
          type="button"
          className="pro-btn"
          style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "13px" }}
          onClick={() => {
            setMobileMenuOpen(false);
            handleProClick();
          }}
        >
          <span className="pro-btn-shimmer" />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span>Unlock Pro</span>
        </button>
      </div>

      {/* Renders modal fallback if onOpenPremium prop was not provided */}
      {!onOpenPremium && (
        <PremiumModal isOpen={isPremiumOpen} onClose={() => setIsPremiumOpen(false)} />
      )}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}

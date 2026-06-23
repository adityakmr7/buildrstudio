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
  activeRoute?: "social-optimizer" | "screenshot-builder" | "showcase" | "blog" | "roadmap" | "change-log" | "home";
  onOpenPremium?: () => void;
}

export default function AppHeader({ activeRoute, onOpenPremium }: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Close menus when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeRoute]);

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
            gap: 10px;
            text-decoration: none;
            flex-shrink: 0;
            z-index: 1001;
            transition: transform 0.2s ease;
          }
          .hdr-logo:hover {
            transform: scale(1.02);
          }
          .hdr-logo-mark {
            width: 32px;
            height: 32px;
            border-radius: 9px;
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            color: #ffffff;
            font-weight: 800;
            box-shadow: 0 4px 10px rgba(99, 102, 241, 0.25);
          }
          .hdr-logo-text {
            font-size: 16px;
            font-weight: 800;
            color: var(--text-1);
            letter-spacing: -0.5px;
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

          /* Luxury Upgrade CTA Button */
          .pro-btn {
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
            color: #ffffff !important;
            position: relative;
            overflow: hidden;
            border: none;
            padding: 8px 16px;
            border-radius: var(--r-full);
            font-weight: 700;
            font-size: 12px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
            transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
            font-family: var(--font);
            text-decoration: none;
            z-index: 10;
          }
          .pro-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(124, 58, 237, 0.4);
            opacity: 0.95;
          }
          .pro-btn:active {
            transform: translateY(1px);
          }
          .pro-btn::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
              to bottom right,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0) 40%,
              rgba(255, 255, 255, 0.4) 50%,
              rgba(255, 255, 255, 0) 60%,
              rgba(255, 255, 255, 0) 100%
            );
            transform: rotate(30deg);
            transition: transform 0.5s;
            pointer-events: none;
          }
          .pro-btn:hover::after {
            transform: translate(50%, 50%) rotate(30deg);
            transition: transform 0.8s ease-in-out;
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
            .hdr-logo-text {
              display: none;
            }
          }
        `}</style>

        {/* Left: Logo */}
        <Link href="/" className="hdr-logo">
          <div className="hdr-logo-mark">B</div>
          <span className="hdr-logo-text">BuildrStudio</span>
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
              🛠 Tools <span className="arrow">▼</span>
            </button>

            <div className="hdr-dropdown-menu">
              <Link href="/social-optimizer" className="dropdown-item">
                <div className="dropdown-item-icon-wrap icon-social">🎨</div>
                <div className="dropdown-item-info">
                  <span className="dropdown-item-title">Social Optimizer</span>
                  <span className="dropdown-item-desc">Screenshots to viral social posts</span>
                </div>
              </Link>

              <Link href="/screenshot-builder" className="dropdown-item">
                <div className="dropdown-item-icon-wrap icon-screens">📱</div>
                <div className="dropdown-item-info">
                  <span className="dropdown-item-title">Screenshot Builder</span>
                  <span className="dropdown-item-desc">iOS & Play Store console mockups</span>
                </div>
              </Link>

              <Link href="/change-log" className="dropdown-item">
                <div className="dropdown-item-icon-wrap icon-change">⚡</div>
                <div className="dropdown-item-info">
                  <span className="dropdown-item-title">Changelog Maker</span>
                  <span className="dropdown-item-desc">Release log social graphics</span>
                </div>
              </Link>
            </div>
          </div>

          <Link href="/showcase" className={`hdr-link ${activeRoute === "showcase" ? "active" : ""}`}>
            Showcase
          </Link>
          <Link href="/blog" className={`hdr-link ${activeRoute === "blog" ? "active" : ""}`}>
            Blog
          </Link>
          <Link href="/roadmap" className={`hdr-link ${activeRoute === "roadmap" ? "active" : ""}`}>
            Roadmap
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="hdr-actions">
          <button
            type="button"
            onClick={handleProClick}
            className="pro-btn"
            aria-label="Go Premium Pro"
          >
            <span>👑</span>
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
            <div className="hdr-logo-mark">B</div>
            <span className="hdr-logo-text">BuildrStudio</span>
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
              <span>🎨</span>
              <span>Social Optimizer</span>
            </Link>
            <Link
              href="/screenshot-builder"
              className={`mobile-link ${activeRoute === "screenshot-builder" ? "active" : ""}`}
            >
              <span>📱</span>
              <span>Screenshot Builder</span>
            </Link>
            <Link
              href="/change-log"
              className={`mobile-link ${activeRoute === "change-log" ? "active" : ""}`}
            >
              <span>⚡</span>
              <span>Changelog Maker</span>
            </Link>
          </div>
        </div>

        <div style={{ height: "1px", background: "var(--border)", margin: "4px 0" }} />

        <div>
          <span className="mobile-section-label">General</span>
          <div className="mobile-grid">
            <Link
              href="/showcase"
              className={`mobile-link ${activeRoute === "showcase" ? "active" : ""}`}
            >
              <span>⭐</span>
              <span>Showcase Gallery</span>
            </Link>
            <Link href="/blog" className={`mobile-link ${activeRoute === "blog" ? "active" : ""}`}>
              <span>📝</span>
              <span>Blog Publication</span>
            </Link>
            <Link
              href="/roadmap"
              className={`mobile-link ${activeRoute === "roadmap" ? "active" : ""}`}
            >
              <span>🗺️</span>
              <span>Product Roadmap</span>
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
          <span>👑</span>
          <span>Unlock Premium Pro</span>
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

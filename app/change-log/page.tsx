import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "../components/AppHeader";

export const metadata: Metadata = {
  title: "Changelog Card — Moved | BuildrStudio",
  description:
    "The Changelog Card tool has been retired. Use Launch Cards to create share-ready graphics for X, LinkedIn, and Instagram.",
  alternates: { canonical: "https://buildrstudio.in/change-log" },
  robots: { index: false, follow: false },
};

export default function ChangelogSunsetPage() {
  return (
    <div className="ink-app">
      <AppHeader activeRoute="home" />

      <style>{`
        .sunset-wrap {
          max-width: 560px;
          margin: 100px auto;
          padding: 0 24px;
          text-align: center;
        }
        .sunset-icon {
          width: 64px;
          height: 64px;
          border-radius: var(--r-xl);
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 28px;
          font-size: 28px;
        }
        .sunset-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-3);
          margin-bottom: 10px;
        }
        .sunset-title {
          font-size: clamp(24px, 4vw, 34px);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: var(--text-1);
          margin: 0 0 14px;
        }
        .sunset-desc {
          font-size: 15px;
          color: var(--text-3);
          line-height: 1.65;
          margin: 0 0 36px;
        }
        .sunset-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: var(--fill);
          color: var(--fill-text);
          border-radius: var(--r-md);
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .sunset-cta:hover { opacity: 0.85; }
        .sunset-secondary {
          display: block;
          margin-top: 16px;
          font-size: 13px;
          color: var(--text-3);
        }
        .sunset-secondary a {
          color: var(--fill);
          text-decoration: none;
        }
        .sunset-secondary a:hover { text-decoration: underline; }
      `}</style>

      <div className="sunset-wrap">
        <div className="sunset-icon">📦</div>
        <p className="sunset-eyebrow">This tool has been retired</p>
        <h1 className="sunset-title">Changelog Cards is no longer available</h1>
        <p className="sunset-desc">
          We&apos;ve focused BuildrStudio on two core tools. The Changelog Card
          feature has been retired — but everything it could do (and more) lives
          in <strong>Launch Cards</strong>, our social graphic maker for X,
          LinkedIn, and Instagram.
        </p>
        <Link href="/social-optimizer" className="sunset-cta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          Try Launch Cards
        </Link>
        <span className="sunset-secondary">
          Or go back to the <Link href="/">homepage</Link>
        </span>
      </div>
    </div>
  );
}

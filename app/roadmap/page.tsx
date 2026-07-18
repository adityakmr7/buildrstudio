import type { Metadata } from "next";
import Link from "next/link";
import AppHeader from "../components/AppHeader";
import { siteConfig } from "@/app/lib/siteConfig";

export const metadata: Metadata = {
  title: "Roadmap — Moved | BuildrStudio",
  description:
    "The BuildrStudio roadmap has been retired. Follow @adityakmr7 on X for the latest updates.",
  alternates: { canonical: "https://buildrstudio.in/roadmap" },
  robots: { index: false, follow: false },
};

export default function RoadmapSunsetPage() {
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
        <div className="sunset-icon">🗺️</div>
        <p className="sunset-eyebrow">This page has been retired</p>
        <h1 className="sunset-title">The public roadmap is no longer available</h1>
        <p className="sunset-desc">
          We&apos;ve moved to a leaner feedback loop. Follow{" "}
          <a
            href={siteConfig.author.twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--fill)" }}
          >
            @{siteConfig.author.twitter}
          </a>{" "}
          on X for the latest updates, or reach out directly via the support page.
        </p>
        <Link href="/updates" className="sunset-cta">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          See what&apos;s shipped
        </Link>
        <span className="sunset-secondary">
          Or <Link href="/support">contact support</Link> with feedback
        </span>
      </div>
    </div>
  );
}

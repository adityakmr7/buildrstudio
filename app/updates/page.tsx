import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import AppHeader from "../components/AppHeader";
import ToolCrossLinks from "../components/ToolCrossLinks";

export const metadata: Metadata = {
  title: "Product Updates — BuildrStudio",
  description: "See what's new in BuildrStudio — latest improvements, bug fixes, and new features for the screenshot builder, social optimizer, and more.",
  alternates: { canonical: "https://buildrstudio.in/updates" },
  openGraph: {
    title: "Product Updates — BuildrStudio",
    description: "Latest improvements, bug fixes, and new features shipped to BuildrStudio.",
    type: "website",
    url: "https://buildrstudio.in/updates",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "BuildrStudio", item: "https://buildrstudio.in" },
    { "@type": "ListItem", position: 2, name: "Updates", item: "https://buildrstudio.in/updates" },
  ],
};

interface Release {
  version: string;
  date: string;
  title: string;
  tags: Array<{ label: string; color: string }>;
  items: { type: "new" | "improved" | "fixed"; text: string }[];
}

const RELEASES: Release[] = [
  {
    version: "v2.6",
    date: "Jul 2026",
    title: "Premium UI & Export Fix",
    tags: [
      { label: "New", color: "#6366f1" },
      { label: "Fixed", color: "#10b981" },
    ],
    items: [
      { type: "new", text: "New premium logomark — dark app-icon with stacked screen layers" },
      { type: "new", text: "Go Pro button redesigned with black-card aesthetic and amber gold accent" },
      { type: "fixed", text: "Screenshot export (Download PNG, Export All ZIP, Export All Sizes) now works reliably — switched from modern-screenshot to html-to-image" },
      { type: "improved", text: "Booking link updated from Topmate to cal.com/adityakmr7" },
    ],
  },
  {
    version: "v2.5",
    date: "Jul 2026",
    title: "Device Frame Overhaul & Canvas Drag",
    tags: [
      { label: "New", color: "#6366f1" },
      { label: "Improved", color: "#f59e0b" },
      { label: "Fixed", color: "#10b981" },
    ],
    items: [
      { type: "new", text: "Drag the device bezel to reposition the frame anywhere on the canvas" },
      { type: "new", text: "Drag the screenshot inside the frame to pan and reposition the image" },
      { type: "improved", text: "iPhone frame redesigned with dark titanium finish — closer to real hardware" },
      { type: "improved", text: "Dynamic Island now uses OLED-correct pure black with subtle bloom ring" },
      { type: "fixed", text: "Inner screen corner radius corrected to cornerR − 4 for all device types" },
      { type: "fixed", text: "White space around uploaded images removed — image fills the frame edge-to-edge" },
    ],
  },
  {
    version: "v2.4",
    date: "Jun 2026",
    title: "Canvas, Zoom & Multi-Screen Grid",
    tags: [
      { label: "New", color: "#6366f1" },
      { label: "Improved", color: "#f59e0b" },
    ],
    items: [
      { type: "new", text: "Zoom and pan the preview canvas with Ctrl+Scroll and middle-drag" },
      { type: "new", text: "Multi-screen grid view — see all screens in your deck at once" },
      { type: "new", text: "Collapsible deck strip to reclaim vertical space" },
      { type: "improved", text: "Premium device frames with accurate bezels for iPhone, iPad, and Android" },
      { type: "improved", text: "Toolbar redesigned with project name input, save/open, and view toggle" },
    ],
  },
  {
    version: "v2.3",
    date: "May 2026",
    title: "Simplified Pricing & Store Exports",
    tags: [
      { label: "New", color: "#6366f1" },
      { label: "Improved", color: "#f59e0b" },
    ],
    items: [
      { type: "new", text: "Canonical Apple/Google store filenames in all exports (e.g. iPhone_6.7_01.png)" },
      { type: "improved", text: "Pricing simplified to Free + single Pro ($9/mo) — no confusing tiers" },
      { type: "new", text: "Post-export share modal for organic growth sharing" },
    ],
  },
  {
    version: "v2.2",
    date: "Apr 2026",
    title: "Hero Import & AI Auto-Layout",
    tags: [
      { label: "New", color: "#6366f1" },
    ],
    items: [
      { type: "new", text: "Paste any App Store or Play Store URL in the hero to auto-import screenshots" },
      { type: "new", text: "AI Auto-Layout suggests headline, gradient, and text position from your screenshot (AI Pro)" },
      { type: "improved", text: "5× free AI headline generations before upgrade prompt" },
    ],
  },
  {
    version: "v2.1",
    date: "Mar 2026",
    title: "About Page Redesign",
    tags: [
      { label: "Improved", color: "#f59e0b" },
    ],
    items: [
      { type: "improved", text: "About page redesigned with editorial style — inspired by independent maker portfolios" },
      { type: "improved", text: "Replaced emoji icons with inline SVGs throughout the app for cleaner rendering" },
    ],
  },
  {
    version: "v2.0",
    date: "Feb 2026",
    title: "Brand Voice AI",
    tags: [
      { label: "New", color: "#6366f1" },
    ],
    items: [
      { type: "new", text: "AI-powered brand voice for generating screenshot headlines that match your app's tone" },
      { type: "new", text: "Google OAuth sign-in and saved project history" },
      { type: "new", text: "Lemon Squeezy subscription billing integrated" },
    ],
  },
];

const TYPE_ICONS = {
  new: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  improved: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  ),
  fixed: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

const TYPE_COLORS = {
  new: "#6366f1",
  improved: "#f59e0b",
  fixed: "#10b981",
};

export default function UpdatesPage() {
  return (
    <>
      <Script id="json-ld-updates" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="ink-app">
        <AppHeader activeRoute="home" />

        <style>{`
          .updates-wrap {
            max-width: 680px;
            margin: 0 auto;
            padding: 64px 24px 96px;
          }
          .updates-eyebrow {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--fill);
            margin-bottom: 10px;
          }
          .updates-title {
            font-size: clamp(28px, 5vw, 40px);
            font-weight: 800;
            color: var(--text-1);
            letter-spacing: -0.04em;
            line-height: 1.1;
            margin: 0 0 12px;
          }
          .updates-subtitle {
            font-size: 15px;
            color: var(--text-3);
            line-height: 1.6;
            margin: 0 0 56px;
          }

          /* Timeline */
          .timeline {
            display: flex;
            flex-direction: column;
            gap: 0;
            position: relative;
          }
          .timeline::before {
            content: '';
            position: absolute;
            left: 0;
            top: 8px;
            bottom: 8px;
            width: 1px;
            background: var(--border);
          }

          .release {
            padding: 0 0 48px 28px;
            position: relative;
          }
          .release:last-child {
            padding-bottom: 0;
          }
          .release-dot {
            position: absolute;
            left: -4px;
            top: 7px;
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: var(--fill);
            border: 2px solid var(--bg);
            box-shadow: 0 0 0 2px var(--fill);
          }
          .release-meta {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
            flex-wrap: wrap;
          }
          .release-version {
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--fill);
            background: var(--fill-subtle);
            padding: 2px 8px;
            border-radius: 4px;
          }
          .release-date {
            font-size: 12px;
            color: var(--text-3);
            font-weight: 500;
          }
          .release-tag {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.05em;
            padding: 2px 7px;
            border-radius: 20px;
            color: #fff;
          }
          .release-title {
            font-size: 19px;
            font-weight: 800;
            color: var(--text-1);
            letter-spacing: -0.03em;
            margin: 0 0 16px;
            line-height: 1.2;
          }
          .release-items {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .release-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            font-size: 14px;
            color: var(--text-2);
            line-height: 1.55;
          }
          .release-item-icon {
            width: 22px;
            height: 22px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-top: 1px;
          }
          .subscribe-banner {
            margin-top: 64px;
            padding: 28px 32px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .subscribe-title {
            font-size: 16px;
            font-weight: 700;
            color: var(--text-1);
            margin: 0;
          }
          .subscribe-desc {
            font-size: 13px;
            color: var(--text-3);
            margin: 0;
          }
          .subscribe-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-top: 4px;
            font-size: 13px;
            font-weight: 600;
            color: var(--fill);
            text-decoration: none;
          }
          .subscribe-link:hover {
            text-decoration: underline;
          }
        `}</style>

        <div className="updates-wrap">
          <p className="updates-eyebrow">What&apos;s New</p>
          <h1 className="updates-title">Product Updates</h1>
          <p className="updates-subtitle">
            Every improvement, fix, and new feature shipped to BuildrStudio — tracked here so you always know what changed.
          </p>

          <div className="timeline">
            {RELEASES.map((release) => (
              <div key={release.version} className="release">
                <div className="release-dot" />
                <div className="release-meta">
                  <span className="release-version">{release.version}</span>
                  <span className="release-date">{release.date}</span>
                  {release.tags.map((t) => (
                    <span key={t.label} className="release-tag" style={{ background: t.color }}>{t.label}</span>
                  ))}
                </div>
                <h2 className="release-title">{release.title}</h2>
                <div className="release-items">
                  {release.items.map((item, i) => (
                    <div key={i} className="release-item">
                      <div
                        className="release-item-icon"
                        style={{
                          background: `${TYPE_COLORS[item.type]}18`,
                          color: TYPE_COLORS[item.type],
                        }}
                      >
                        {TYPE_ICONS[item.type]}
                      </div>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="subscribe-banner">
            <p className="subscribe-title">Stay in the loop</p>
            <p className="subscribe-desc">Have feedback or a feature request? Vote on the roadmap or reach out directly.</p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "4px" }}>
              <Link href="/roadmap" className="subscribe-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                Vote on the roadmap
              </Link>
              <Link href="/support" className="subscribe-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Contact support
              </Link>
            </div>
          </div>
        </div>

        <ToolCrossLinks current="/updates" />
      </div>
    </>
  );
}

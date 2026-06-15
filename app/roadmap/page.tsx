import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import RoadmapRequestForm from "../components/RoadmapRequestForm";
import ThemeToggle from "../components/ThemeToggle";

export const metadata: Metadata = {
  title: "Product Roadmap — Vote on What We Build Next",
  description:
    "Vote on upcoming BuildrStudio tools: launch asset generators, content cards, carousels, README visuals, app store screenshots, and more. Your vote shapes what ships next.",
  alternates: {
    canonical: "https://buildrstudio.in/roadmap",
  },
  openGraph: {
    title: "Product Roadmap — BuildrStudio",
    description:
      "Vote on upcoming BuildrStudio tools and shape what we ship next — from launch asset generators to README visuals and app store screenshots.",
    type: "website",
    url: "https://buildrstudio.in/roadmap",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuildrStudio Product Roadmap",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Roadmap — BuildrStudio",
    description:
      "Vote on what BuildrStudio builds next — launch assets, content cards, app store screenshots, and more.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "BuildrStudio", item: "https://buildrstudio.in" },
    { "@type": "ListItem", position: 2, name: "Roadmap", item: "https://buildrstudio.in/roadmap" },
  ],
};



export default function RoadmapPage() {
  return (
    <>
      <Script
        id="json-ld-roadmap"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        .site-header {
          display: flex;
          align-items: center;

          justify-content: space-between;
          padding: 20px 40px;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
          position: sticky;
          top: 0;
          z-index: 100;
          transition: background .3s, border .3s;
        }
        .site-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
        }
        .site-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .site-logo-mark {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--fill);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: var(--fill-text);
          font-weight: 800;
        }
        .site-logo-text {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-1);
          letter-spacing: -0.5px;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-link {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-2);
          padding: 8px 14px;
          border-radius: var(--r-sm);
          transition: all .15s;
          cursor: pointer;
        }
        .nav-link:hover,
        .nav-link.active {
          background: var(--fill-subtle);
          color: var(--text-1);
        }
        .roadmap-page {
          max-width: 1180px;
        }
        .roadmap-hero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 24px;
          align-items: end;
          margin-bottom: 28px;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--border);
        }
        .roadmap-kicker {
          margin-bottom: 12px;
        }
        .roadmap-title {
          font-size: 40px;
          font-weight: 800;
          letter-spacing: -1.2px;
          line-height: 1.05;
          color: var(--text-1);
          margin-bottom: 12px;
        }
        .roadmap-copy {
          max-width: 680px;
          color: var(--text-2);
          font-size: 16px;
          line-height: 1.7;
        }
        .roadmap-shell {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          gap: 24px;
          align-items: start;
        }
        .roadmap-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .roadmap-card {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: var(--r-xl);
          padding: 22px;
          text-align: left;
          cursor: pointer;
          font-family: var(--font);
          transition: border .15s, background .15s, transform .15s, box-shadow .15s;
          min-height: 180px;
        }
        .roadmap-card:hover {
          border-color: var(--border-strong);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }
        .roadmap-card.active {
          border-color: var(--text-1);
          background: var(--fill-subtle);
        }
        .roadmap-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }
        .roadmap-select-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 1.5px solid var(--border-strong);
          display: inline-block;
          flex-shrink: 0;
        }
        .roadmap-card.active .roadmap-select-dot {
          background: var(--fill);
          border-color: var(--fill);
          box-shadow: inset 0 0 0 5px var(--surface);
        }
        .roadmap-card-title {
          color: var(--text-1);
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.4px;
          line-height: 1.25;
          margin-bottom: 10px;
        }
        .roadmap-card-desc {
          color: var(--text-2);
          font-size: 13px;
          line-height: 1.6;
        }
        .roadmap-form {
          position: sticky;
          top: 96px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .roadmap-status {
          border-radius: var(--r-sm);
          padding: 10px 12px;
          font-size: 12px;
          line-height: 1.4;
          border: 1px solid var(--border);
          background: var(--fill-subtle);
          color: var(--text-2);
        }
        .roadmap-status.success {
          border-color: var(--text-1);
          color: var(--text-1);
        }
        .roadmap-consent {
          color: var(--text-3);
          font-size: 11px;
          text-align: center;
        }

        @media (max-width: 992px) {
          .roadmap-shell,
          .roadmap-hero {
            grid-template-columns: 1fr;
          }
          .roadmap-form {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .site-header {
            padding: 16px 20px;
          }
          .site-header-inner {
            align-items: flex-start;
            gap: 14px;
            flex-direction: column;
          }
          .nav-links {
            width: 100%;
            flex-wrap: wrap;
          }
          .roadmap-grid {
            grid-template-columns: 1fr;
          }
          .roadmap-title {
            font-size: 32px;
          }
        }
      `}</style>

      <header className="site-header">
        <div className="site-header-inner">
          <Link href="/" className="site-logo">
            <div className="site-logo-mark">B</div>
            <span className="site-logo-text">BuildrStudio</span>
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Optimizer</Link>
            <Link href="/showcase" className="nav-link">Showcase</Link>
            <Link href="/blog" className="nav-link">Blog</Link>
            <Link href="/roadmap" className="nav-link active">Roadmap</Link>
            <Link href="/change-log" className="nav-link">Changelog</Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="page roadmap-page">
        <section className="roadmap-hero">
          <div>
            <div className="roadmap-kicker">
              <span className="badge-pill">Launch and content tools for builders</span>
            </div>
            <h1 className="roadmap-title">Vote on what BuildrStudio should build next.</h1>
            <p className="roadmap-copy">
              BuildrStudio is growing into a toolkit for creators, developers, and indie builders who need polished launch assets, product updates, and social content without opening a full design suite.
            </p>
          </div>
          <Link href="/" className="btn-outline btn-sm">
            Use Screenshot Optimizer
          </Link>
        </section>

        <RoadmapRequestForm />
      </main>
    </>
  );
}

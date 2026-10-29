import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import type { ReactNode } from "react";

export default function ClearStackLayout({ children }: { children: ReactNode }) {
  return (
    <div className="cs-site">
      <Script src="https://gumroad.com/js/gumroad.js" strategy="lazyOnload" />
      <header className="cs-header">
        <Link href="/products/clear-stack" className="cs-brand">
          <Image src="/clear-stack/icon.png" alt="ClearStack icon" width={36} height={36} className="cs-logo" />
          <span>ClearStack</span>
        </Link>
        <nav aria-label="ClearStack navigation" className="cs-nav">
          <Link href="/">BuildrStudio</Link>
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a
            className="cs-nav-button"
            href="https://adityakmr7.gumroad.com/l/clearstack"
            data-gumroad-single-product="true"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Pro — $5 once
          </a>
        </nav>
      </header>
      <main id="cs-content">{children}</main>
      <footer className="cs-footer">
        <div>
          <Link href="/products/clear-stack" className="cs-brand-footer">
            <Image src="/clear-stack/icon.png" alt="" width={24} height={24} />
            <span>ClearStack</span>
          </Link>
          <p>A native macOS utility built by <Link href="/">BuildrStudio</Link>.</p>
        </div>
        <nav aria-label="ClearStack footer links">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <a href="mailto:contact@buildrstudio.in">Support</a>
        </nav>
      </footer>

      <style>{`
        .cs-site {
          background: #090d16;
          color: #f1f5f9;
          min-height: 100dvh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
        }
        .cs-site * { box-sizing: border-box; }
        .cs-site a { color: inherit; text-underline-offset: 4px; }
        .cs-header, .cs-footer, .cs-site main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 28px;
        }
        .cs-header {
          min-height: 80px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .cs-brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-weight: 700;
          font-size: 20px;
          letter-spacing: -0.5px;
          text-decoration: none;
        }
        .cs-logo {
          border-radius: 9px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .cs-nav {
          display: flex;
          align-items: center;
          gap: 24px;
          font-size: 14px;
        }
        .cs-nav a {
          text-decoration: none;
          color: #94a3b8;
          transition: color 0.2s;
        }
        .cs-nav a:hover { color: #ffffff; }
        .cs-site a:focus-visible { outline: 3px solid #93c5fd; outline-offset: 5px; }
        .cs-nav-button {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: #ffffff !important;
          padding: 12px 18px;
          border-radius: 8px;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
          transition: transform 0.2s, opacity 0.2s;
        }
        .cs-nav-button:hover {
          opacity: 0.95;
          transform: translateY(-1px);
        }
        .cs-footer {
          margin-top: 80px;
          padding-top: 40px;
          padding-bottom: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          font-size: 13px;
        }
        .cs-brand-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          text-decoration: none;
        }
        .cs-footer p {
          color: #64748b;
          margin-top: 6px;
        }
        .cs-footer nav {
          display: flex;
          gap: 20px;
          color: #94a3b8;
        }
        .cs-footer nav a { text-decoration: none; }
        .cs-footer nav a:hover { color: #fff; }

        @media (max-width: 768px) {
          .cs-header, .cs-footer, .cs-site main { padding: 0 18px; }
          .cs-nav a:not(.cs-nav-button) { display: none; }
          .cs-footer { flex-direction: column; text-align: center; }
          .cs-footer nav { justify-content: center; }
        }
      `}</style>
    </div>
  );
}

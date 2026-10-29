import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { clearStackMetadata, clearStackJsonLd } from "./metadata";

const title = "ClearStack | Native Mac Storage Cleaner for Developers & Power Users";
const description =
  "Reclaim 50+ GB of hidden developer caches, node_modules, Docker disks, and iOS simulators in seconds. 100% private native Swift utility for macOS.";

export const metadata = clearStackMetadata("", title, description);

export default function ClearStackPage() {
  return (
    <>
      <Script
        id="clearstack-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: clearStackJsonLd("", title, description),
        }}
      />

      {/* Hero Section */}
      <section className="cs-hero">
        <div className="cs-hero-copy">
          <div className="cs-badge">
            <span className="cs-badge-dot"></span>
            macOS 14+ · Native Swift & SwiftUI · Apple Silicon & Intel
          </div>
          <h1>
            Shed the bloat.<br />
            <em>Keep the code.</em>
          </h1>
          <p className="cs-hero-lead">
            The storage cleaner built specifically for developers, AI engineers, and power users.
            Safely reclaim <strong>50+ GB</strong> of hidden package caches, orphaned Docker virtual disks, and dormant <code>node_modules</code> in seconds.
          </p>

          <div className="cs-cta-group">
            <a
              className="cs-primary-button"
              href="https://adityakmr7.gumroad.com/l/clearstack"
              data-gumroad-single-product="true"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get ClearStack for $5
            </a>
            <a className="cs-secondary-button" href="/downloads/ClearStack.dmg" download>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download Free Trial (.dmg)
            </a>
          </div>

          <div className="cs-trust-pills">
            <span>✓ One-time $5 payment (No subscription)</span>
            <span>✓ 100% Offline & Private</span>
            <span>✓ Never touches source code</span>
          </div>
        </div>

        <div className="cs-hero-visual">
          <div className="cs-image-frame">
            <Image
              src="/clear-stack/preview.png"
              alt="ClearStack macOS Storage Optimizer interface"
              width={1200}
              height={780}
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
              className="cs-preview-img"
            />
          </div>
        </div>
      </section>

      {/* Stat Strip */}
      <div className="cs-strip">
        <div className="cs-stat">
          <strong>50+ GB</strong>
          <span>Average space recovered</span>
        </div>
        <div className="cs-stat">
          <strong>842 KB</strong>
          <span>Zero Electron bloat</span>
        </div>
        <div className="cs-stat">
          <strong>100% Local</strong>
          <span>Zero telemetry or cloud tracking</span>
        </div>
        <div className="cs-stat">
          <strong>$5 Lifetime</strong>
          <span>No $39/year subscription</span>
        </div>
      </div>

      {/* Feature Pillars */}
      <section id="features" className="cs-section">
        <div className="cs-section-header">
          <span className="cs-eyebrow">Developer-First Storage Architecture</span>
          <h2>Where your SSD space actually goes.</h2>
          <p>Generic disk cleaners look for browser cookies and language packs. ClearStack targets the modern developer stack.</p>
        </div>

        <div className="cs-grid">
          <div className="cs-card">
            <div className="cs-card-icon blue">⚡</div>
            <h3>One-Click Safe Sweep</h3>
            <p>
              Instantly purge 100% safe, disposable caches: NPM, Bun, Yarn, PNPM package tarballs, Homebrew bottles, and Gradle build artifacts with zero risk.
            </p>
          </div>

          <div className="cs-card">
            <div className="cs-card-icon orange">📦</div>
            <h3>Project Dependencies Hunter</h3>
            <p>
              Deep-scan your repositories for heavy <code>node_modules</code>, <code>.next</code>, and <code>target</code> folders. View last-modified dates and copy 1-click restore commands.
            </p>
          </div>

          <div className="cs-card">
            <div className="cs-card-icon purple">🤖</div>
            <h3>Ghost Virtualization & AI Models</h3>
            <p>
              Exorcise gigabytes of forgotten Docker <code>.raw</code> disks, Claude Desktop VM bundles, Ollama models, and Hugging Face weights sitting silently in <code>~/Library</code>.
            </p>
          </div>

          <div className="cs-card">
            <div className="cs-card-icon cyan">📱</div>
            <h3>Simulator & Xcode Cleaner</h3>
            <p>
              Prune unavailable iOS simulator runtimes, clean Xcode DerivedData, and erase simulator sandboxes that pile up after every test run.
            </p>
          </div>

          <div className="cs-card">
            <div className="cs-card-icon green">🛡️</div>
            <h3>Project Protection & Trash Support</h3>
            <p>
              Protect active client projects with a single click. Choose &quot;Move to Trash&quot; mode for complete undo peace of mind.
            </p>
          </div>

          <div className="cs-card">
            <div className="cs-card-icon yellow">🕒</div>
            <h3>Menu Bar Status Widget</h3>
            <p>
              Keep an eye on available storage right from your macOS status bar (<code>✨ 62 GB</code>). Run a 1-click Safe Sweep without opening the full window.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="cs-section">
        <div className="cs-section-header">
          <span className="cs-eyebrow">Why Developers Switch</span>
          <h2>Built differently from day one.</h2>
        </div>

        <div className="cs-table-container">
          <table className="cs-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th className="cs-highlight">ClearStack</th>
                <th>CleanMyMac</th>
                <th>DaisyDisk</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Understands <code>node_modules</code> & Build Caches</td>
                <td className="cs-highlight">✅ Yes</td>
                <td>❌ No</td>
                <td>❌ No</td>
              </tr>
              <tr>
                <td>Cleans Orphaned Docker Virtual Disks</td>
                <td className="cs-highlight">✅ Yes</td>
                <td>❌ No</td>
                <td>❌ No</td>
              </tr>
              <tr>
                <td>Cleans Claude Desktop VMs & AI Weights</td>
                <td className="cs-highlight">✅ Yes</td>
                <td>❌ No</td>
                <td>❌ No</td>
              </tr>
              <tr>
                <td>App Footprint & Memory</td>
                <td className="cs-highlight">⚡ &lt; 15 MB Native</td>
                <td>🐢 200+ MB</td>
                <td>⚡ 20 MB</td>
              </tr>
              <tr>
                <td>Pricing</td>
                <td className="cs-highlight"><strong>$5 One-Time</strong></td>
                <td>$39.95 / Year</td>
                <td>$9.99</td>
              </tr>
              <tr>
                <td>Privacy</td>
                <td className="cs-highlight">🔒 100% Offline</td>
                <td>Cloud Telemetry</td>
                <td>100% Offline</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="cs-section cs-pricing-section">
        <div className="cs-pricing-box">
          <span className="cs-badge">Launch Special</span>
          <h2>ClearStack Lifetime License</h2>
          <div className="cs-price">
            <span className="cs-currency">$</span>5
            <span className="cs-term">one-time payment</span>
          </div>
          <p className="cs-pricing-desc">
            Pay once, keep your Mac fast and lean forever. Save hundreds on Apple SSD upgrades.
          </p>

          <ul className="cs-pricing-features">
            <li>✓ Full access to all 6 cleaner engines</li>
            <li>✓ Project Dependencies Hunter (<code>node_modules</code>)</li>
            <li>✓ Menu bar widget with live storage meter</li>
            <li>✓ Free updates for all Version 1.x releases</li>
            <li>✓ Valid on all your personal Macs</li>
            <li>✓ 30-day money-back guarantee</li>
          </ul>

          <a
            className="cs-pricing-button"
            href="https://adityakmr7.gumroad.com/l/clearstack"
            data-gumroad-single-product="true"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy on Gumroad for $5
          </a>

          <p className="cs-pricing-subtext">
            Instant download link and license key delivered immediately after checkout.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="cs-section cs-faq">
        <div className="cs-section-header">
          <span className="cs-eyebrow">Frequently Asked Questions</span>
          <h2>Everything you need to know.</h2>
        </div>

        <details className="cs-faq-item">
          <summary>Will ClearStack ever delete my source code or git history?</summary>
          <p>
            <strong>Never.</strong> ClearStack strictly targets temporary caches, build artifacts, package tarballs, and dependency folders. It explicitly ignores source files, git histories, and configurations.
          </p>
        </details>

        <details className="cs-faq-item">
          <summary>What happens when I delete a project’s <code>node_modules</code>?</summary>
          <p>
            The project’s source code and <code>package.json</code> remain completely intact. You save gigabytes immediately. Whenever you return to that project, running <code>npm install</code> or <code>bun install</code> restores the packages. ClearStack even provides a 1-click &quot;Copy Reinstall Command&quot; button.
          </p>
        </details>

        <details className="cs-faq-item">
          <summary>Can I try before I buy?</summary>
          <p>
            Yes! You can download the free trial directly using the <a href="/downloads/ClearStack.dmg">Download Free Trial (.dmg)</a> link on this page.
          </p>
        </details>

        <details className="cs-faq-item">
          <summary>Which macOS versions are supported?</summary>
          <p>
            ClearStack is built with Swift 6 and SwiftUI, and supports macOS 14 Sonoma, Sequoia, and later on both Apple Silicon (M1/M2/M3/M4) and Intel Macs.
          </p>
        </details>
      </section>

      {/* Page CSS */}
      <style>{`
        .cs-hero {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          align-items: center;
          gap: 50px;
          padding: 70px 0 60px;
        }
        .cs-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(59, 130, 246, 0.12);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.25);
          margin-bottom: 24px;
        }
        .cs-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #3b82f6;
          box-shadow: 0 0 8px #3b82f6;
        }
        .cs-hero h1 {
          font-size: clamp(40px, 5.5vw, 68px);
          font-weight: 800;
          letter-spacing: -2px;
          line-height: 1.05;
          margin: 0 0 20px;
          color: #ffffff;
        }
        .cs-hero h1 em {
          font-style: normal;
          background: linear-gradient(135deg, #60a5fa, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .cs-hero-lead {
          font-size: 18px;
          line-height: 1.6;
          color: #94a3b8;
          max-width: 540px;
          margin-bottom: 32px;
        }
        .cs-hero-lead strong { color: #f1f5f9; }
        .cs-hero-lead code {
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
        }
        .cs-cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
          margin-bottom: 28px;
        }
        .cs-primary-button {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: #ffffff !important;
          padding: 14px 28px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cs-primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(59, 130, 246, 0.5);
        }
        .cs-secondary-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.06);
          color: #e2e8f0 !important;
          padding: 14px 22px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.12);
          transition: background 0.2s;
        }
        .cs-secondary-button:hover {
          background: rgba(255, 255, 255, 0.12);
        }
        .cs-trust-pills {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 13px;
          color: #64748b;
        }
        .cs-image-frame {
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .cs-preview-img {
          width: 100%;
          height: auto;
          display: block;
        }

        .cs-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          padding: 30px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          margin: 40px 0 80px;
          text-align: center;
        }
        .cs-stat strong {
          display: block;
          font-size: 28px;
          font-weight: 800;
          color: #60a5fa;
          margin-bottom: 4px;
        }
        .cs-stat span {
          font-size: 13px;
          color: #64748b;
        }

        .cs-section {
          padding: 60px 0;
        }
        .cs-section-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 50px;
        }
        .cs-eyebrow {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #3b82f6;
          display: block;
          margin-bottom: 12px;
        }
        .cs-section-header h2 {
          font-size: clamp(30px, 4vw, 42px);
          font-weight: 750;
          letter-spacing: -1px;
          margin: 0 0 16px;
          color: #ffffff;
        }
        .cs-section-header p {
          color: #94a3b8;
          font-size: 16px;
          line-height: 1.6;
        }

        .cs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }
        .cs-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          padding: 28px;
          transition: transform 0.2s, border-color 0.2s;
        }
        .cs-card:hover {
          transform: translateY(-3px);
          border-color: rgba(59, 130, 246, 0.3);
        }
        .cs-card-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin-bottom: 18px;
        }
        .cs-card-icon.blue { background: rgba(59, 130, 246, 0.15); }
        .cs-card-icon.orange { background: rgba(249, 115, 22, 0.15); }
        .cs-card-icon.purple { background: rgba(168, 85, 247, 0.15); }
        .cs-card-icon.cyan { background: rgba(6, 182, 212, 0.15); }
        .cs-card-icon.green { background: rgba(16, 185, 129, 0.15); }
        .cs-card-icon.yellow { background: rgba(245, 158, 11, 0.15); }
        .cs-card h3 {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 10px;
          color: #ffffff;
        }
        .cs-card p {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
        }

        .cs-table-container {
          overflow-x: auto;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 10px;
        }
        .cs-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 14px;
        }
        .cs-table th, .cs-table td {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .cs-table th {
          color: #94a3b8;
          font-weight: 600;
        }
        .cs-table .cs-highlight {
          color: #60a5fa;
          background: rgba(59, 130, 246, 0.06);
          font-weight: 600;
        }

        .cs-pricing-section {
          display: flex;
          justify-content: center;
        }
        .cs-pricing-box {
          background: radial-gradient(circle at top, rgba(59, 130, 246, 0.15), rgba(255, 255, 255, 0.02) 60%);
          border: 1px solid rgba(59, 130, 246, 0.35);
          border-radius: 24px;
          padding: 50px 40px;
          max-width: 560px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        }
        .cs-price {
          font-size: 64px;
          font-weight: 800;
          color: #ffffff;
          margin: 16px 0 8px;
        }
        .cs-currency { font-size: 32px; vertical-align: top; }
        .cs-term { font-size: 14px; color: #94a3b8; font-weight: 500; margin-left: 6px; }
        .cs-pricing-desc { color: #94a3b8; font-size: 15px; margin-bottom: 30px; }
        .cs-pricing-features {
          list-style: none;
          padding: 0;
          margin: 0 0 36px;
          text-align: left;
          display: inline-block;
          color: #cbd5e1;
          font-size: 14px;
        }
        .cs-pricing-features li { padding: 6px 0; }
        .cs-pricing-button {
          display: block;
          width: 100%;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: #ffffff !important;
          padding: 16px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cs-pricing-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.6);
        }
        .cs-pricing-subtext {
          font-size: 12px;
          color: #64748b;
          margin-top: 14px;
          margin-bottom: 0;
        }

        .cs-faq { max-width: 760px; margin: 0 auto; }
        .cs-faq-item {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 20px 0;
        }
        .cs-faq-item summary {
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          color: #f1f5f9;
        }
        .cs-faq-item p {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.7;
          margin-top: 12px;
          margin-bottom: 0;
        }

        @media (max-width: 900px) {
          .cs-hero { grid-template-columns: 1fr; gap: 40px; padding: 40px 0; text-align: center; }
          .cs-hero-lead { margin-left: auto; margin-right: auto; }
          .cs-cta-group { justify-content: center; }
          .cs-trust-pills { align-items: center; }
          .cs-strip { grid-template-columns: repeat(2, 1fr); gap: 20px; }
        }
      `}</style>
    </>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/app/lib/siteConfig";
import { Envelope, Copy, XLogo, ArrowRight } from "@phosphor-icons/react";

export default function AboutClient() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(siteConfig.author.support);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ab-product">
      <style>{`
        .ab-product {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text-1);
          font-family: var(--font);
        }
        .ab-product-inner {
          max-width: 680px;
          margin: 0 auto;
          padding: 80px 32px 120px;
        }

        /* Hero */
        .abp-headline {
          font-size: clamp(32px, 6vw, 52px);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.05;
          color: var(--text-1);
          margin: 0 0 28px;
        }
        .abp-lead {
          font-size: 18px;
          color: var(--text-2);
          line-height: 1.7;
          margin: 0 0 64px;
          max-width: 560px;
        }

        /* Divider */
        .abp-divider {
          border: none;
          border-top: 1px solid var(--border);
          margin: 56px 0;
        }

        /* Story section */
        .abp-section { margin-bottom: 56px; }
        .abp-section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-3);
          margin-bottom: 16px;
        }
        .abp-body {
          font-size: 15px;
          color: var(--text-2);
          line-height: 1.75;
          margin: 0 0 16px;
        }
        .abp-body:last-child { margin-bottom: 0; }

        /* Values list */
        .abp-values {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .abp-value {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border);
        }
        .abp-value:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .abp-value-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--fill-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--fill);
          margin-top: 1px;
        }
        .abp-value-text {
          font-size: 15px;
          color: var(--text-2);
          line-height: 1.65;
        }
        .abp-value-text strong {
          color: var(--text-1);
          font-weight: 700;
        }

        /* Maker card */
        .abp-maker {
          display: flex;
          gap: 20px;
          align-items: center;
          padding: 28px;
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          background: var(--surface);
          text-decoration: none;
          transition: background 0.15s;
        }
        .abp-maker:hover { background: var(--surface-2, var(--border)); }
        .abp-maker-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          border: 2px solid var(--border);
        }
        .abp-maker-name {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-1);
          letter-spacing: -0.03em;
          margin-bottom: 2px;
        }
        .abp-maker-role {
          font-size: 13px;
          color: var(--text-3);
          line-height: 1.5;
        }
        .abp-maker-arrow {
          margin-left: auto;
          color: var(--text-3);
          flex-shrink: 0;
        }

        /* CTA row */
        .abp-ctas {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 40px;
        }
        .abp-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 700;
          border-radius: var(--r-md);
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.15s;
          font-family: var(--font);
          border: 1.5px solid var(--border-strong);
        }
        .abp-btn:hover { opacity: 0.8; }
        .abp-btn-fill {
          background: var(--fill);
          color: var(--fill-text);
          border-color: var(--fill);
        }
        .abp-btn-outline {
          background: transparent;
          color: var(--text-1);
        }
        .abp-email-helper {
          font-size: 12px;
          color: var(--text-3);
          margin-top: 8px;
          display: block;
        }

        @media (max-width: 640px) {
          .ab-product-inner { padding: 48px 20px 80px; }
          .abp-maker { flex-wrap: wrap; }
          .abp-maker-arrow { display: none; }
        }
      `}</style>

      <div className="ab-product-inner">

        {/* Hero — no eyebrow, headline stands alone */}
        <h1 className="abp-headline">
          Launch-ready visuals,<br />without the design tax.
        </h1>
        <p className="abp-lead">
          BuildrStudio is a suite of free browser-based tools that help indie developers and
          small teams create polished App Store screenshots and social graphics, without
          Figma, Photoshop, or a designer on retainer.
        </p>

        <hr className="abp-divider" />

        {/* Origin story — no eyebrow, section is self-evident */}
        <section className="abp-section">
          <p className="abp-body">
            Every time I shipped a side project, the last mile was the same painful bottleneck:
            making it <em>look</em> good enough to share. App Store screenshots, product launch
            graphics, social cards: all of it required either expensive tools I didn&apos;t want
            to pay for, or hours in Figma templates I had to wrestle with.
          </p>
          <p className="abp-body">
            So I built the tool I kept wishing existed. Paste your app URL, pick a device, tweak
            the copy, export. Done in minutes, not hours. No account required for the basics.
            No design skills assumed.
          </p>
          <p className="abp-body">
            BuildrStudio is what happens when a developer gets tired of the visual asset tax on
            shipping.
          </p>
        </section>

        <hr className="abp-divider" />

        {/* Beliefs */}
        <section className="abp-section">
          <p className="abp-section-label">What we believe</p>
          <ul className="abp-values">
            <li className="abp-value">
              <div className="abp-value-icon">
                <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a28,28,0,0,1-28,28H116v8a8,8,0,0,1-16,0v-8H88a8,8,0,0,1,0-16h12V120H88a8,8,0,0,1,0-16h12V96a28,28,0,0,1,28-28h12a28,28,0,0,1,28,28,8,8,0,0,1-16,0,12,12,0,0,0-12-12H128a12,12,0,0,0-12,12v8h24a8,8,0,0,1,0,16H116v40h24a12,12,0,0,0,12-12,8,8,0,0,1,16,0Z"/></svg>
              </div>
              <span className="abp-value-text">
                <strong>Free first.</strong> The core tools are and will stay free. Pro unlocks
                extras, but you should never be blocked from getting your work out into the world.
              </span>
            </li>
            <li className="abp-value">
              <div className="abp-value-icon">
                <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M208,40H48A16,16,0,0,0,32,56V200a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V56A16,16,0,0,0,208,40Zm0,160H48V56H208V200ZM96,88a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,88Zm0,32a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,120Zm0,32a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,152Z"/></svg>
              </div>
              <span className="abp-value-text">
                <strong>Your files stay yours.</strong> All image processing happens in your browser.
                Nothing you create is uploaded to our servers.
              </span>
            </li>
            <li className="abp-value">
              <div className="abp-value-icon">
                <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg>
              </div>
              <span className="abp-value-text">
                <strong>One tool that does the job well</strong> beats ten that do it
                passably. We ship focused tools, not feature soup.
              </span>
            </li>
            <li className="abp-value">
              <div className="abp-value-icon">
                <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor"><path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8C53.06,194,78.06,176,104,168.68V224a8,8,0,0,0,16,0V168.68C146,176,171,194,185.08,220a8,8,0,1,0,13.84-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/></svg>
              </div>
              <span className="abp-value-text">
                <strong>Built by a developer, for developers.</strong> The defaults are sensible,
                the exports hit exact store specs, and nothing requires a design background to use.
              </span>
            </li>
          </ul>
        </section>

        <hr className="abp-divider" />

        {/* Maker */}
        <section className="abp-section">
          <p className="abp-section-label">Who&apos;s behind it</p>
          <a href="/adityakmr7" className="abp-maker">
            <div className="abp-maker-avatar">
              <Image
                src="/aditya-avatar.png"
                alt="Aditya Kumar"
                width={56}
                height={56}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }}
                priority
              />
            </div>
            <div>
              <div className="abp-maker-name">Aditya Kumar</div>
              <div className="abp-maker-role">
                SDE-2 @ Groww · Bengaluru, India<br />
                Building BuildrStudio on the side.
              </div>
            </div>
            <ArrowRight className="abp-maker-arrow" size={16} />
          </a>
        </section>

        <hr className="abp-divider" />

        {/* Contact */}
        <section>
          <p className="abp-section-label">Get in touch</p>
          <p className="abp-body">
            Found a bug, have a feature idea, or just want to say hi? Every message goes
            directly to me and gets a reply.
          </p>
          <div className="abp-ctas">
            <a href={`mailto:${siteConfig.author.support}`} className="abp-btn abp-btn-fill">
              <Envelope size={14} weight="bold" />
              Email us
            </a>
            <a href={siteConfig.author.twitterUrl} target="_blank" rel="noopener noreferrer" className="abp-btn abp-btn-outline">
              <XLogo size={13} weight="bold" />
              X / Twitter
            </a>
          </div>
          <span className="abp-email-helper">
            Or copy the address:{" "}
            <button
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "var(--fill)", fontWeight: 600, padding: 0, fontFamily: "monospace" }}
              onClick={handleCopyEmail}
            >
              {copied ? "Copied!" : siteConfig.author.support}
            </button>
          </span>
        </section>

      </div>
    </div>
  );
}

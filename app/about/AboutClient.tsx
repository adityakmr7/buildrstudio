"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/app/lib/siteConfig";

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

        /* Eyebrow */
        .abp-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--fill);
          margin-bottom: 16px;
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
          gap: 16px;
        }
        .abp-value {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .abp-value-num {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--fill);
          font-family: monospace;
          padding-top: 2px;
          flex-shrink: 0;
          width: 24px;
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
        }
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

        @media (max-width: 640px) {
          .ab-product-inner { padding: 48px 20px 80px; }
          .abp-maker { flex-wrap: wrap; }
          .abp-maker-arrow { display: none; }
        }
      `}</style>

      <div className="ab-product-inner">

        {/* Hero */}
        <p className="abp-eyebrow">About BuildrStudio</p>
        <h1 className="abp-headline">
          Launch-ready visuals,<br />without the design tax.
        </h1>
        <p className="abp-lead">
          BuildrStudio is a suite of free browser-based tools that help indie developers and
          small teams create polished App Store screenshots and social graphics — without
          Figma, Photoshop, or a designer on retainer.
        </p>

        <hr className="abp-divider" />

        {/* Origin story */}
        <section className="abp-section">
          <p className="abp-section-label">Why it exists</p>
          <p className="abp-body">
            Every time I shipped a side project, the last mile was the same painful bottleneck:
            making it <em>look</em> good enough to share. App Store screenshots, product launch
            graphics, social cards — all of it required either expensive tools I didn&apos;t want
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
              <span className="abp-value-num">01</span>
              <span className="abp-value-text">
                <strong>Free first.</strong> The core tools are and will stay free. Pro unlocks
                extras, but you should never be blocked from getting your work out into the world.
              </span>
            </li>
            <li className="abp-value">
              <span className="abp-value-num">02</span>
              <span className="abp-value-text">
                <strong>Your files stay yours.</strong> All image processing happens in your browser.
                Nothing you create is uploaded to our servers.
              </span>
            </li>
            <li className="abp-value">
              <span className="abp-value-num">03</span>
              <span className="abp-value-text">
                <strong>One tool that does the job well</strong> beats ten that do it
                passably. We ship focused tools, not feature soup.
              </span>
            </li>
            <li className="abp-value">
              <span className="abp-value-num">04</span>
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
          <a
            href="/adityakmr7"
            className="abp-maker"
          >
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
            <svg className="abp-maker-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Email us
            </a>
            <button className="abp-btn abp-btn-outline" onClick={handleCopyEmail}>
              {copied ? "Copied!" : "Copy email"}
            </button>
            <a href={siteConfig.author.twitterUrl} target="_blank" rel="noopener noreferrer" className="abp-btn abp-btn-outline">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.843L1.255 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X / Twitter
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}

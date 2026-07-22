"use client";

import { useState } from "react";
import { siteConfig } from "@/app/lib/siteConfig";

const FAQS = [
  {
    q: "Why isn't my export downloading?",
    a: "Make sure your browser allows downloads from buildrstudio.in. If the button seems to do nothing, try a different browser (Chrome or Firefox work best). Safari occasionally blocks programmatic download links — right-click the export button and choose 'Open Link' if needed.",
  },
  {
    q: "Can I use my own screenshots without an App Store URL?",
    a: "Yes. On the Screenshot Builder, click 'Start from scratch' below the URL input field, or drag-and-drop any image file directly onto the canvas. You can also paste an image from clipboard (Ctrl/Cmd + V).",
  },
  {
    q: "How do I remove the watermark?",
    a: "The watermark can be removed in two ways: (1) share a tweet about BuildrStudio to unlock it free for 24 hours — click the watermark on the canvas to trigger this, or (2) upgrade to Pro for permanent watermark removal and all premium features.",
  },
  {
    q: "What image sizes does the Screenshot Builder export?",
    a: "The builder exports at the exact canonical App Store and Play Store resolutions: iPhone 6.7\" (1290×2796), iPhone 6.5\" (1242×2688), iPhone 5.5\" (1242×2208), iPad 12.9\" (2048×2732), iPad 11\" (1668×2388), Android Phone (1080×1920), and tablet sizes. Use 'Export All Sizes' to get a ZIP with every required size at once.",
  },
  {
    q: "How does billing work?",
    a: "BuildrStudio Pro is $9/month, billed monthly via Lemon Squeezy. You can cancel anytime from your account — your Pro access continues until the end of the billing period. No hidden fees.",
  },
  {
    q: "I paid but my account still shows Free. What do I do?",
    a: `Sign out and sign back in — the Pro status is read fresh on each login. If the problem persists after that, email ${siteConfig.author.support} with your payment email and we'll sort it out within a few hours.`,
  },
  {
    q: "Can I get a refund?",
    a: `Yes — if you're not satisfied within 7 days of purchase, email ${siteConfig.author.support} and we'll process a full refund, no questions asked. See the full refund policy for details.`,
  },
  {
    q: "Is there a team or agency plan?",
    a: "Not yet, but it's planned. Drop your use-case to support@buildrstudio.in — that directly influences what gets built next.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {FAQS.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="faq-item">
            <button
              className="faq-q"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              {faq.q}
              <svg
                className="faq-chevron"
                style={{ transform: isOpen ? "rotate(180deg)" : "none", color: isOpen ? "var(--fill)" : "var(--text-3)" }}
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {isOpen && <div className="faq-a">{faq.a}</div>}
          </div>
        );
      })}
    </div>
  );
}

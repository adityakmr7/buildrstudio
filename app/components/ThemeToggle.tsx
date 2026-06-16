"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ink-theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("ink-theme", next ? "dark" : "light");
  };

  return (
    <button className="theme-toggle-btn" onClick={toggle} aria-label="Toggle theme" suppressHydrationWarning>
      <span className="theme-toggle-icon">{dark ? "☀️" : "🌙"}</span>
      <span className="theme-toggle-text">{dark ? "Light" : "Dark"}</span>
      <style>{`
        .theme-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-2);
          padding: 6px 12px;
          border-radius: var(--r-full);
          border: 1px solid var(--border);
          background: var(--surface-2);
          cursor: pointer;
          transition: all 0.12s ease;
          font-family: var(--font);
        }
        .theme-toggle-btn:hover {
          background: var(--fill-subtle);
          border-color: var(--border-strong);
          color: var(--text-1);
        }
        .theme-toggle-icon {
          font-size: 13px;
        }
        @media (max-width: 640px) {
          .theme-toggle-text {
            display: none;
          }
          .theme-toggle-btn {
            padding: 0;
            width: 32px;
            height: 32px;
            justify-content: center;
            border-radius: 50%;
          }
        }
      `}</style>
    </button>
  );
}

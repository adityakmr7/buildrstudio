"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("ink-theme") === "dark";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(isDark);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
      localStorage.setItem("ink-theme", dark ? "dark" : "light");
    }
  }, [dark, mounted]);

  const toggle = () => {
    setDark((prev) => !prev);
  };

  const activeIcon = mounted && dark ? "☀️" : "🌙";
  const activeText = mounted && dark ? "Light" : "Dark";

  return (
    <button className="theme-toggle-btn" onClick={toggle} aria-label="Toggle theme">
      <span className="theme-toggle-icon">{activeIcon}</span>
      <span className="theme-toggle-text">{activeText}</span>
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

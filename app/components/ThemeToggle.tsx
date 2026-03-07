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
    <button className="btn-ghost btn-sm" onClick={toggle} aria-label="Toggle theme">
      {dark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

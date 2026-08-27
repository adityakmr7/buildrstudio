"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { ArrowRight } from "@phosphor-icons/react";
import { isDevAuthBypassEnabled, DEV_BYPASS_PROVIDER_ID } from "../lib/devAuth";

const NAV_LINKS = [
  { label: "Agents", href: "/agents" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Pricing", href: "/#pricing" },
];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();
  const devBypass = isDevAuthBypassEnabled();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {devBypass && (
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 51,
            padding: "6px 16px",
            textAlign: "center",
            fontSize: 11.5,
            fontWeight: 600,
            fontFamily: "monospace",
            letterSpacing: "0.04em",
            color: "#7C2D12",
            background: "#FEF3C7",
            borderBottom: "1px solid #FDE68A",
          }}
        >
          ⚠ DEV AUTH BYPASS ACTIVE — signing in skips Google entirely. Never enable in production.
        </div>
      )}
      <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: 68,
        display: "flex",
        alignItems: "center",
        background: scrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.6)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text)" }}>
            Buildr<span style={{ color: "var(--accent)" }}>Studio</span>
          </span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 28 }} className="site-nav-links">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="site-nav-link"
              style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)" }}
            >
              {item.label}
            </a>
          ))}
          {status === "authenticated" && (
            <Link href="/dashboard/integrations" className="site-nav-link" style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)" }}>
              Dashboard
            </Link>
          )}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {status === "authenticated" ? (
            <button
              onClick={() => signOut()}
              className="site-nav-signout"
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {session.user?.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt=""
                  width={24}
                  height={24}
                  style={{ borderRadius: "50%" }}
                />
              )}
              Sign out
            </button>
          ) : (
            <button
              onClick={() => signIn(isDevAuthBypassEnabled() ? DEV_BYPASS_PROVIDER_ID : "google")}
              className="site-nav-signin"
              style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)", background: "none", border: "none", cursor: "pointer" }}
            >
              Sign in
            </button>
          )}
          <Link
            href="/agents"
            className="site-nav-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              padding: "10px 20px",
              borderRadius: 9,
              background: "var(--accent)",
              color: "#fff",
            }}
          >
            Find an agent
            <ArrowRight size={13} weight="bold" />
          </Link>
        </div>
      </div>

      <style>{`
        .site-nav-link:hover { color: var(--text) !important; }
        .site-nav-signin:hover, .site-nav-signout:hover { color: var(--text) !important; }
        .site-nav-cta:hover { background: #1D4ED8 !important; }
        @media (max-width: 800px) {
          .site-nav-links { display: none !important; }
        }
      `}</style>
      </header>
    </>
  );
}

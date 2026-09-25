"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { ArrowRight, List, X } from "@phosphor-icons/react";
import { isDevAuthBypassEnabled, DEV_BYPASS_PROVIDER_ID } from "../lib/devAuth";
import Wordmark from "./Wordmark";

const NAV_LINKS = [
  { label: "Agents", href: "/agents" },
  { label: "Solutions", href: "/#jobs" },
  { label: "Pricing", href: "/#pricing" },
];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const devBypass = isDevAuthBypassEnabled();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const handleSignIn = () => signIn(isDevAuthBypassEnabled() ? DEV_BYPASS_PROVIDER_ID : "google");

  return (
    <>
      {devBypass && (
        <div className="sticky top-0 z-[51] border-b border-line bg-raised-2 px-4 py-1 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-brass">
          Dev auth bypass active: signing in skips Google entirely. Never enable in production.
        </div>
      )}
      <header
        className={`sticky top-0 z-50 border-t-2 border-t-brass transition-colors ${
          scrolled ? "border-b border-b-line bg-ink/95" : "border-b border-b-transparent bg-ink/80"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
          <Wordmark />

          <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className="link-quiet rounded-[2px] text-sm font-medium">
                {item.label}
              </Link>
            ))}
            {status === "authenticated" && (
              <Link href="/dashboard/integrations" className="link-quiet rounded-[2px] text-sm font-medium">
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              {status === "authenticated" ? (
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="link-quiet inline-flex items-center gap-2 rounded-[2px] text-sm font-medium"
                >
                  {session.user?.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt="" width={24} height={24} className="rounded-full" />
                  )}
                  Sign out
                </button>
              ) : (
                <button type="button" onClick={handleSignIn} className="link-quiet rounded-[2px] text-sm font-medium">
                  Sign in
                </button>
              )}
            </div>
            <Link href="/agents" className="btn-primary btn-sm">
              Find an agent
              <ArrowRight size={14} weight="bold" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="inline-flex size-10 items-center justify-center rounded-[8px] border border-line text-cream transition-colors hover:bg-raised md:hidden"
            >
              {menuOpen ? <X size={18} aria-hidden="true" /> : <List size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          hidden={!menuOpen}
          className="border-t border-line bg-ink md:hidden"
        >
          <nav aria-label="Mobile" className="mx-auto flex max-w-[1200px] flex-col px-4 py-4 sm:px-6">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="link-quiet border-b border-line py-3 text-base font-medium"
              >
                {item.label}
              </Link>
            ))}
            {status === "authenticated" && (
              <Link
                href="/dashboard/integrations"
                onClick={() => setMenuOpen(false)}
                className="link-quiet border-b border-line py-3 text-base font-medium"
              >
                Dashboard
              </Link>
            )}
            {status === "authenticated" ? (
              <button
                type="button"
                onClick={() => signOut()}
                className="link-quiet border-b border-line py-3 text-left text-base font-medium"
              >
                Sign out
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSignIn}
                className="link-quiet border-b border-line py-3 text-left text-base font-medium"
              >
                Sign in
              </button>
            )}
            <Link href="/agents" onClick={() => setMenuOpen(false)} className="btn-primary mt-4">
              Find an agent
              <ArrowRight size={14} weight="bold" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}

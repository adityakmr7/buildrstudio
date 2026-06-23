"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

interface UserMenuProps {
  onOpenAuth: () => void;
  onOpenPremium: () => void;
}

export default function UserMenu({ onOpenAuth, onOpenPremium }: UserMenuProps) {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "var(--fill-subtle)",
        animation: "pulse 1.5s infinite",
      }} />
    );
  }

  if (!session?.user) {
    return (
      <button
        type="button"
        onClick={onOpenAuth}
        className="hdr-link"
        style={{ fontSize: 13, fontWeight: 600 }}
      >
        Sign in
      </button>
    );
  }

  const isPro = session.user.isPro;

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px",
          borderRadius: "var(--r-full)",
          transition: "opacity 0.15s",
        }}
        aria-label="User menu"
      >
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt=""
            width={32}
            height={32}
            style={{ borderRadius: "50%", border: isPro ? "2px solid #a855f7" : "2px solid var(--border)" }}
          />
        ) : (
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
          }}>
            {(session.user.name?.[0] || session.user.email[0]).toUpperCase()}
          </div>
        )}
        {isPro && (
          <span style={{
            fontSize: 9,
            fontWeight: 800,
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            color: "#fff",
            padding: "2px 6px",
            borderRadius: "var(--r-full)",
            letterSpacing: "0.5px",
          }}>
            PRO
          </span>
        )}
      </button>

      {menuOpen && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          width: 240,
          background: "var(--surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--r-md)",
          boxShadow: "0 15px 35px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.05)",
          padding: 8,
          zIndex: 1100,
          animation: "scaleIn 0.15s ease-out",
        }}>
          <div style={{
            padding: "10px 12px",
            borderBottom: "1px solid var(--border)",
            marginBottom: 4,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>
              {session.user.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>
              {session.user.email}
            </div>
          </div>

          {!isPro && (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onOpenPremium();
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: "none",
                border: "none",
                borderRadius: "var(--r-sm)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                color: "#a855f7",
                fontFamily: "var(--font)",
                transition: "background 0.15s",
                textAlign: "left",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--fill-subtle)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
            >
              <span>👑</span>
              <span>Upgrade to Pro — $4/mo</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              signOut();
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              background: "none",
              border: "none",
              borderRadius: "var(--r-sm)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-2)",
              fontFamily: "var(--font)",
              transition: "background 0.15s",
              textAlign: "left",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--fill-subtle)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
          >
            <span>Sign out</span>
          </button>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

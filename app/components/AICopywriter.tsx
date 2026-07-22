"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

const CATEGORIES = ["General", "Productivity", "Health & Fitness", "Finance", "Social", "Education", "Entertainment", "Travel", "Food & Drink", "Developer Tools"];
const TONES = ["Professional", "Playful", "Bold", "Minimal", "Luxury", "Friendly"];
const LANGUAGES = [
  { code: "en", label: "English" }, { code: "es", label: "Spanish" }, { code: "fr", label: "French" },
  { code: "de", label: "German" }, { code: "pt", label: "Portuguese" }, { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" }, { code: "zh", label: "Chinese" }, { code: "ar", label: "Arabic" },
  { code: "hi", label: "Hindi" }, { code: "it", label: "Italian" }, { code: "nl", label: "Dutch" },
  { code: "ru", label: "Russian" }, { code: "tr", label: "Turkish" }, { code: "th", label: "Thai" },
];

interface AICopywriterProps {
  onApply: (headline: string, subtext: string) => void;
  onUpgrade?: () => void;
}

export default function AICopywriter({ onApply, onUpgrade }: AICopywriterProps) {
  const { data: session, status } = useSession();
  const [appDesc, setAppDesc] = useState("");
  const [category, setCategory] = useState("General");
  const [tone, setTone] = useState("Professional");
  const [language, setLanguage] = useState("en");
  const [keyBenefit, setKeyBenefit] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [avoidWords, setAvoidWords] = useState("");
  const [showBrandVoice, setShowBrandVoice] = useState(false);
  const [suggestions, setSuggestions] = useState<{ headline: string; subtext: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isSignedIn = status === "authenticated" && !!session?.user;

  const generate = async () => {
    if (!appDesc.trim()) return;
    setLoading(true);
    setError("");
    setSuggestions([]);
    const brandVoice = (keyBenefit || targetUser || avoidWords)
      ? { keyBenefit, targetUser, avoidWords }
      : undefined;
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appDescription: appDesc, category, tone, language, brandVoice }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.limitReached) setLimitReached(true);
        throw new Error(data.error || "Failed");
      }
      setSuggestions(data.suggestions);
    } catch (e: unknown) {
      const data = e instanceof Error ? e.message : "Generation failed";
      setError(data);
      if (data.includes("limit") || data.includes("Upgrade")) setLimitReached(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "12px" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 10px",
          background: "var(--surface-2, var(--surface))",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          color: "var(--text-1)",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: "14px" }}>✨</span>
        AI Copywriter
        {!isSignedIn && <span style={{ marginLeft: "4px", fontSize: "10px", color: "var(--text-3)", fontWeight: 400 }}>· Sign in required</span>}
        <span style={{ marginLeft: "auto", fontSize: "10px", opacity: 0.5 }}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && !isSignedIn && (
        <div style={{ marginTop: "8px", padding: "16px", background: "var(--surface-2, var(--surface))", border: "1px solid var(--border)", borderRadius: "8px", textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: "var(--text-2)", margin: "0 0 10px", lineHeight: 1.5 }}>
            Sign in to use AI Copywriter. Free accounts get 5 generations, Pro gets unlimited.
          </p>
          <button
            onClick={() => signIn("google")}
            style={{
              padding: "8px 16px",
              background: "var(--fill)",
              color: "var(--fill-text)",
              border: "none",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign in with Google
          </button>
        </div>
      )}

      {isOpen && isSignedIn && (
        <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <textarea
            className="input-field"
            value={appDesc}
            onChange={(e) => setAppDesc(e.target.value)}
            placeholder="Describe your app in 1-2 sentences..."
            style={{ fontSize: "12px", padding: "8px 10px", minHeight: "50px", resize: "vertical", width: "100%" }}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ fontSize: "11px", padding: "6px 8px" }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="input-field"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              style={{ fontSize: "11px", padding: "6px 8px" }}
            >
              {TONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <select
            className="input-field"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ fontSize: "11px", padding: "6px 8px", width: "100%" }}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
          {/* Brand Voice */}
          <button
            onClick={() => setShowBrandVoice(!showBrandVoice)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: "none",
              padding: "2px 0",
              fontSize: "11px",
              fontWeight: 600,
              color: showBrandVoice ? "var(--fill)" : "var(--text-3)",
              cursor: "pointer",
            }}
          >
            <span>{showBrandVoice ? "▾" : "▸"}</span>
            Brand Voice
            <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span>
          </button>

          {showBrandVoice && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "10px", background: "var(--surface-2, var(--surface))", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <div>
                <label style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "4px" }}>
                  Core benefit — in your words
                </label>
                <input
                  className="input-field"
                  value={keyBenefit}
                  onChange={(e) => setKeyBenefit(e.target.value)}
                  placeholder='e.g. "ship faster without the config hell"'
                  style={{ fontSize: "11px", padding: "6px 8px", width: "100%" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "4px" }}>
                  Who it&apos;s for
                </label>
                <input
                  className="input-field"
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                  placeholder='e.g. "solo devs who hate ops"'
                  style={{ fontSize: "11px", padding: "6px 8px", width: "100%" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "4px" }}>
                  Words to avoid
                </label>
                <input
                  className="input-field"
                  value={avoidWords}
                  onChange={(e) => setAvoidWords(e.target.value)}
                  placeholder='e.g. "seamless, powerful, robust"'
                  style={{ fontSize: "11px", padding: "6px 8px", width: "100%" }}
                />
              </div>
            </div>
          )}

          <button
            onClick={generate}
            disabled={loading || !appDesc.trim()}
            style={{
              padding: "8px",
              background: loading ? "var(--surface-2, var(--surface))" : "var(--fill)",
              color: loading ? "var(--text-2)" : "var(--fill-text)",
              border: "none",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: !appDesc.trim() ? 0.5 : 1,
            }}
          >
            {loading ? "Generating..." : "Generate Copy"}
          </button>
          {error && <p style={{ fontSize: "11px", color: "var(--error, #ef4444)", margin: 0 }}>{error}</p>}
          {limitReached && onUpgrade && (
            <button
              onClick={onUpgrade}
              style={{
                padding: "8px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Upgrade to Pro — Unlimited generations
            </button>
          )}
          {suggestions.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onApply(s.headline, s.subtext)}
                  style={{
                    textAlign: "left",
                    padding: "8px 10px",
                    background: "var(--surface-2, var(--surface))",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                >
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-1)", display: "block" }}>{s.headline}</span>
                  <span style={{ fontSize: "11px", color: "var(--text-2)", display: "block", marginTop: "2px" }}>{s.subtext}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

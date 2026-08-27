"use client";

import { useState, useRef, useEffect } from "react";
import { PaperPlaneRight } from "@phosphor-icons/react";
import type { AgentProduct } from "../../lib/agentCatalog";

interface DemoMessage {
  role: "user" | "assistant";
  content: string;
}

export default function LiveDemoChat({ product }: { product: AgentProduct }) {
  const [messages, setMessages] = useState<DemoMessage[]>([{ role: "assistant", content: greetingFor(product) }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, busy]);

  const send = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || busy) return;
    setInput("");
    setError(null);
    const nextMessages: DemoMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setBusy(true);

    try {
      const res = await fetch("/api/v1/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: product.slug,
          message: text,
          history: nextMessages.slice(0, -1).slice(-6),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid var(--border)",
        background: "var(--surface)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: 420,
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          background: product.accent,
          color: "#fff",
          fontSize: 13,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", opacity: 0.8 }} />
        Live demo — {product.name}
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10, background: "var(--bg)" }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              padding: "9px 13px",
              borderRadius: 12,
              fontSize: 13.5,
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              background: m.role === "user" ? product.accent : "var(--surface)",
              color: m.role === "user" ? "#fff" : "var(--text)",
              border: m.role === "user" ? "none" : "1px solid var(--border)",
            }}
          >
            {m.content}
          </div>
        ))}
        {busy && (
          <div
            style={{
              alignSelf: "flex-start",
              display: "flex",
              gap: 4,
              padding: "10px 13px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
          >
            <span className="demo-typing-dot" />
            <span className="demo-typing-dot" style={{ animationDelay: "0.15s" }} />
            <span className="demo-typing-dot" style={{ animationDelay: "0.3s" }} />
          </div>
        )}
        {error && (
          <div style={{ alignSelf: "flex-start", maxWidth: "80%", padding: "9px 13px", borderRadius: 12, fontSize: 13, background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FCA5A5" }}>
            {error}
          </div>
        )}
      </div>

      {messages.length === 1 && product.suggestedQuestions.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "0 10px 10px", background: "var(--surface)" }}>
          {product.suggestedQuestions.map((question) => (
            <button
              key={question}
              onClick={() => send(question)}
              disabled={busy}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 500,
                cursor: busy ? "default" : "pointer",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--muted)",
              }}
            >
              {question}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, padding: 10, borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="Ask this agent something…"
          style={{ flex: 1, border: "1px solid var(--border)", borderRadius: 10, padding: "9px 12px", fontSize: 13.5, outline: "none", fontFamily: "var(--font)", color: "var(--text)", background: "var(--bg)" }}
        />
        <button
          onClick={() => send()}
          disabled={busy || !input.trim()}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            border: "none",
            background: product.accent,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: busy ? "default" : "pointer",
            opacity: busy || !input.trim() ? 0.6 : 1,
            flexShrink: 0,
          }}
        >
          <PaperPlaneRight size={16} weight="fill" />
        </button>
      </div>

      <style>{`
        .demo-typing-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--muted-2);
          animation: demoBounce 1.2s infinite;
        }
        @keyframes demoBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

function greetingFor(product: AgentProduct): string {
  return `Hi! I'm the ${product.name} demo. ${product.tagline} Try asking me something.`;
}

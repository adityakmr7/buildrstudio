"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "../../components/Toast";

export interface UnansweredItem {
  id: string;
  question: string;
  reply: string | null;
  reason: string;
  status: string;
  agentName: string;
  chatSessionId: string | null;
  createdAt: string;
}

const REASON: Record<string, string> = {
  model_unsure: "Agent said it didn't know",
  low_score: "Nothing close in the knowledge base",
};

function Row({ item, onDone }: { item: UnansweredItem; onDone: (id: string) => void }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);

  const act = async (action: "answer" | "dismiss" | "reopen") => {
    setBusy(true);
    try {
      const res = await fetch(`/api/unanswered/${item.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, answer }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast(action === "answer" ? "Added to the knowledge base." : action === "dismiss" ? "Dismissed." : "Moved back to open.");
      onDone(item.id);
    } catch (err) {
      toast(err instanceof Error && err.message ? err.message : "Something went wrong.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: 16, borderRadius: 2, background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{item.question}</div>
      <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 4 }}>
        {item.agentName} · {REASON[item.reason] ?? item.reason} ·{" "}
        {new Date(item.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
        {item.chatSessionId && (
          <>
            {" · "}
            <Link href={`/dashboard/conversations/${item.chatSessionId}`} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
              View conversation
            </Link>
          </>
        )}
      </div>
      {item.reply && (
        <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 10, paddingLeft: 10, borderLeft: "2px solid var(--border)", whiteSpace: "pre-wrap" }}>
          Agent replied: {item.reply}
        </div>
      )}

      {item.status === "open" ? (
        open ? (
          <div style={{ marginTop: 12 }}>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="Write the answer you'd want the agent to give…"
              style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13.5, fontFamily: "var(--font)", color: "var(--text)", background: "var(--bg)", resize: "vertical" }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={() => act("answer")} disabled={busy || !answer.trim()} style={btn(true)}>
                {busy ? "Adding…" : "Add to knowledge"}
              </button>
              <button onClick={() => setOpen(false)} disabled={busy} style={btn(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={() => setOpen(true)} style={btn(true)}>
              Add answer to knowledge
            </button>
            <button onClick={() => act("dismiss")} disabled={busy} style={btn(false)}>
              Dismiss
            </button>
          </div>
        )
      ) : (
        <div style={{ marginTop: 12 }}>
          <button onClick={() => act("reopen")} disabled={busy} style={btn(false)}>
            Reopen
          </button>
        </div>
      )}
    </div>
  );
}

function btn(solid: boolean): React.CSSProperties {
  return {
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    border: solid ? "none" : "1px solid var(--border)",
    background: solid ? "var(--accent)" : "var(--surface)",
    color: solid ? "var(--accent-ink)" : "var(--text)",
  };
}

export default function UnansweredList({ items: initial }: { items: UnansweredItem[] }) {
  const [items, setItems] = useState(initial);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((item) => (
        <Row key={item.id} item={item} onDone={(id) => setItems((prev) => prev.filter((i) => i.id !== id))} />
      ))}
    </div>
  );
}

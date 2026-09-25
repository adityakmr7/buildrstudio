"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Copy, ArrowsClockwise, Gear, X, CreditCard, Sparkle, BookOpenText, UploadSimple, Trash, CheckCircle, Timer } from "@phosphor-icons/react";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import PaddleCheckoutButton from "../../components/PaddleCheckoutButton";
import { useToast } from "../../components/Toast";
import { TRIAL_DAYS, TRIAL_MESSAGE_LIMIT, type TrialStatus } from "../../lib/trial";

export interface UpgradeTier {
  id: string;
  name: string; // "standard" | "pro"
  paddlePriceId: string | null;
  priceLabel: string | null; // from agentCatalog.ts, e.g. "$19/mo"
}

export interface TrialOption {
  slug: string;
  name: string;
  tagline: string;
}

export interface IntegrationRow {
  id: string;
  apiKey: string;
  isActive: boolean;
  agentSlug: string;
  agentName: string;
  greeting: string;
  color: string;
  position: string;
  messageCount: number;
  monthlyLimit: number;
  tierName: string;
  // null when there's no active paid subscription (trial-only) — the
  // "Manage subscription" button only makes sense once one exists.
  subscriptionId: string | null;
  agentId: string;
  // Set only while on an unconverted no-card free trial.
  trial: TrialStatus | null;
  upgradeTiers: UpgradeTier[];
}

function embedSnippet(row: IntegrationRow) {
  return `<script src="https://buildrstudio.in/widget.js"\n  data-agent-id="${row.agentSlug}"\n  data-key="${row.apiKey}"></script>`;
}

interface KnowledgeStatus {
  chunkCount: number;
  source: string | null;
  updatedAt: string | null;
}

// The feature that makes an agent actually know something about the
// customer's business instead of giving everyone the same generic prompt.
// Deliberately simple: one knowledge base per install (upload/replace, not
// document management), plain text only — paste, or read a .txt/.md file
// client-side and paste its contents in for you. No PDF parsing, no URL
// scraping, no per-document list. See app/lib/knowledge.ts for the "why".
function KnowledgeBaseSection({ apiKeyId }: { apiKeyId: string }) {
  const { toast } = useToast();
  const [status, setStatus] = useState<KnowledgeStatus | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/keys/${apiKeyId}/knowledge`)
      .then((res) => res.json())
      .then(setStatus)
      .catch(() => {});
  }, [apiKeyId]);

  const handleFile = async (file: File) => {
    try {
      const content = await file.text();
      setText((prev) => (prev ? `${prev}\n\n${content}` : content));
    } catch {
      toast("Couldn't read that file.", "error");
    }
  };

  const save = async () => {
    if (!text.trim()) {
      toast("Paste some text or upload a file first.", "info");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/keys/${apiKeyId}/knowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus({ chunkCount: data.chunkCount, source: data.source, updatedAt: new Date().toISOString() });
      setText("");
      toast(`Knowledge base saved — ${data.chunkCount} chunks indexed.`);
    } catch (err) {
      toast(err instanceof Error && err.message ? err.message : "Couldn't save the knowledge base.", "error");
    } finally {
      setBusy(false);
    }
  };

  const clear = async () => {
    if (!confirm("Clear this agent's knowledge base? It'll go back to answering generically.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/keys/${apiKeyId}/knowledge`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setStatus({ chunkCount: 0, source: null, updatedAt: null });
      toast("Knowledge base cleared.");
    } catch {
      toast("Couldn't clear the knowledge base.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: 18, borderRadius: 2, background: "var(--bg)", border: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <BookOpenText size={15} style={{ color: "var(--text)" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Knowledge base</span>
      </div>

      {status && status.chunkCount > 0 ? (
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--muted)", marginBottom: 12 }}>
          <CheckCircle size={13} weight="fill" style={{ color: "var(--success)" }} />
          {status.chunkCount} chunks indexed from &ldquo;{status.source}&rdquo;
        </div>
      ) : (
        <p style={{ fontSize: 12.5, color: "var(--muted-2)", margin: "0 0 12px" }}>
          No knowledge base yet — this agent answers generically until you add one.
        </p>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your FAQ, docs, or product info here…"
        rows={4}
        style={{ ...inputStyle, resize: "vertical", fontFamily: "var(--font)", marginBottom: 10 }}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={() => fileInputRef.current?.click()} className="dash-btn" style={btnStyle("outline")}>
          <UploadSimple size={13} weight="bold" /> Upload .txt/.md
        </button>
        <button onClick={save} disabled={busy} className="dash-btn" style={btnStyle("solid")}>
          Save knowledge base
        </button>
        {status && status.chunkCount > 0 && (
          <button onClick={clear} disabled={busy} className="dash-btn" style={{ ...btnStyle("outline"), color: "#f0a08f" }}>
            <Trash size={13} weight="bold" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Trial status + upgrade. Upgrading goes through the existing Paddle
// checkout; the webhook then keeps this same API key (so the embed that's
// already on the customer's site keeps working) and marks the trial converted.
function TrialPanel({ row }: { row: IntegrationRow }) {
  const trial = row.trial;
  if (!trial) return null;
  const ended = trial.expired;
  const tone = ended ? "rgba(240,128,110," : "rgba(228,177,90,";
  return (
    <div style={{ padding: 18, borderRadius: 2, background: `${tone}0.07)`, border: `1px solid ${tone}0.3)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Timer size={15} weight="bold" style={{ color: ended ? "#f0a08f" : "var(--accent)" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
          {ended
            ? trial.reason === "time"
              ? "Your free trial has ended"
              : "You've used all your trial messages"
            : "Free trial — no card on file"}
        </span>
      </div>
      <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 0 12px" }}>
        {ended
          ? "The widget on your site has stopped replying. Upgrade to switch it back on — your embed code and knowledge base stay exactly as they are."
          : `${trial.messagesLeft} of ${trial.messageLimit} messages left · ${trial.daysLeft} day${trial.daysLeft === 1 ? "" : "s"} left (ends ${new Date(trial.endsAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}). Upgrade any time — same key, same embed code.`}
      </p>
      <div style={{ height: 6, borderRadius: 999, background: "var(--surface-alt)", overflow: "hidden", marginBottom: 14 }}>
        <div
          style={{
            height: "100%",
            width: `${Math.min(100, Math.round((trial.messagesUsed / Math.max(1, trial.messageLimit)) * 100))}%`,
            background: ended ? "#f0a08f" : "var(--accent)",
            borderRadius: 999,
          }}
        />
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {row.upgradeTiers.map((tier) => (
          <PaddleCheckoutButton
            key={tier.id}
            agentId={row.agentId}
            tierId={tier.id}
            paddlePriceId={tier.paddlePriceId}
            label={`Upgrade to ${capitalize(tier.name)}${tier.priceLabel ? ` — ${tier.priceLabel}` : ""}`}
            className="dash-btn"
            style={tier.name === "standard" ? btnStyle("solid") : btnStyle("outline")}
          />
        ))}
      </div>
    </div>
  );
}

// "Start free trial" — lists live agents the user hasn't tried or bought.
function StartTrialCard({ options, autoStartSlug }: { options: TrialOption[]; autoStartSlug: string | null }) {
  const { toast } = useToast();
  const router = useRouter();
  const [busySlug, setBusySlug] = useState<string | null>(null);

  const start = async (slug: string) => {
    setBusySlug(slug);
    try {
      const res = await fetch("/api/trials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentSlug: slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast(data.alreadyHadKey ? "You already have this agent — it's below." : "Trial started. Copy the embed code below to go live.");
      router.replace("/dashboard/integrations");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error && err.message ? err.message : "Couldn't start the trial.", "error");
    } finally {
      setBusySlug(null);
    }
  };

  // Arriving from an agent page's "Start free trial" button (?trial=<slug>)
  // after sign-in — start it straight away instead of making them click twice.
  // Deferred via setTimeout (cleared on cleanup) so StrictMode's double
  // effect run still only fires one request.
  useEffect(() => {
    if (!autoStartSlug) return;
    const slug = autoStartSlug;
    // Always ask the server, even if this agent isn't in `options`: it
    // explains why (already used / another trial active / already owned).
    const t = setTimeout(() => {
      start(slug).finally(() => router.replace("/dashboard/integrations"));
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStartSlug]);

  if (options.length === 0) return null;

  return (
    <div style={{ padding: 24, borderRadius: 2, background: "var(--surface)", border: "1px solid var(--border)", marginBottom: 16 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", margin: "0 0 4px" }}>Start a free trial</h2>
      <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 0 16px" }}>
        {TRIAL_DAYS} days, {TRIAL_MESSAGE_LIMIT} messages, no card. You get a real API key and embed code — put it on your
        site and see how it does with your actual visitors. One trial per agent, one at a time.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map((o) => (
          <div
            key={o.slug}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: 14, borderRadius: 2, background: "var(--bg)", border: "1px solid var(--border)" }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{o.name}</div>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{o.tagline}</div>
            </div>
            <button onClick={() => start(o.slug)} disabled={busySlug !== null} className="dash-btn" style={btnStyle("solid")}>
              {busySlug === o.slug ? "Starting…" : "Start free trial"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentRow({ row, onUpdated }: { row: IntegrationRow; onUpdated: (row: IntegrationRow) => void }) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [greeting, setGreeting] = useState(row.greeting);
  const [color, setColor] = useState(row.color);
  const [position, setPosition] = useState(row.position);

  const copyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedSnippet(row));
      toast("Embed code copied to clipboard.");
    } catch {
      toast("Couldn't copy — select and copy manually.", "error");
    }
  };

  const regenerate = async () => {
    if (!confirm("Regenerating replaces the API key — any embed code using the old key will stop working. Continue?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/keys/${row.id}/regenerate`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onUpdated({ ...row, apiKey: data.key });
      toast("API key regenerated. Update your embed code with the new key.");
    } catch {
      toast("Couldn't regenerate the key. Try again.", "error");
    } finally {
      setBusy(false);
    }
  };

  const manageSubscription = async () => {
    if (!row.subscriptionId) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/portal?subscriptionId=${row.subscriptionId}`);
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error();
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch {
      toast("Couldn't open the billing portal. Try again.", "error");
    } finally {
      setBusy(false);
    }
  };

  const saveConfig = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/keys/${row.id}/config`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ greeting, color, position }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onUpdated({ ...row, ...data });
      toast("Widget config updated.");
      setModalOpen(false);
    } catch {
      toast("Couldn't save changes. Try again.", "error");
    } finally {
      setBusy(false);
    }
  };

  const pct = Math.min(100, Math.round((row.messageCount / Math.max(1, row.monthlyLimit)) * 100));

  return (
    <div style={{ padding: 24, borderRadius: 2, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", margin: "0 0 4px" }}>{row.agentName}</h3>
          <Link href={`/agents/${row.agentSlug}`} style={{ fontSize: 12.5, color: "var(--muted)", textDecoration: "underline", textUnderlineOffset: 3 }}>
            View agent page
          </Link>
        </div>
        <span
          style={{
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            padding: "4px 10px",
            borderRadius: 2,
            color: "var(--text)",
            background: "var(--surface-alt)",
          }}
        >
          {row.trial ? "Free trial" : `${row.tierName} tier`}
        </span>
      </div>

      <TrialPanel row={row} />

      {!row.trial && (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--muted)", marginBottom: 6 }}>
          <span>Messages this month</span>
          <span>
            {row.messageCount} / {row.monthlyLimit}
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: "var(--surface-alt)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "var(--text)", borderRadius: 999 }} />
        </div>
      </div>
      )}

      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 8 }}>Embed code</div>
        <pre
          style={{
            margin: 0,
            padding: 14,
            borderRadius: 8,
            background: "var(--bg)",
            border: "1px solid var(--border)",
            fontSize: 12,
            lineHeight: 1.6,
            color: "var(--text)",
            overflowX: "auto",
            fontFamily: "var(--font-mono)",
          }}
        >
          {embedSnippet(row)}
        </pre>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={copyEmbed} className="dash-btn" style={btnStyle("solid")}>
          <Copy size={14} weight="bold" /> Copy embed code
        </button>
        <button onClick={() => setModalOpen(true)} className="dash-btn" style={btnStyle("outline")}>
          <Gear size={14} weight="bold" /> Edit config
        </button>
        <button onClick={regenerate} disabled={busy} className="dash-btn" style={btnStyle("outline")}>
          <ArrowsClockwise size={14} weight="bold" /> Regenerate API key
        </button>
        {row.subscriptionId && (
          <button onClick={manageSubscription} disabled={busy} className="dash-btn" style={btnStyle("outline")}>
            <CreditCard size={14} weight="bold" /> Manage subscription
          </button>
        )}
      </div>

      <KnowledgeBaseSection apiKeyId={row.id} />

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(12,11,9,0.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "var(--surface)", borderRadius: 2, padding: 24, width: "100%", maxWidth: 380, border: "1px solid var(--border)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h4 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", margin: 0 }}>Widget config</h4>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                <X size={16} />
              </button>
            </div>

            <label style={labelStyle}>Greeting</label>
            <input value={greeting} onChange={(e) => setGreeting(e.target.value)} style={inputStyle} maxLength={200} />

            <label style={labelStyle}>Brand color</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ ...inputStyle, padding: 4, height: 40 }} />

            <label style={labelStyle}>Position</label>
            <select value={position} onChange={(e) => setPosition(e.target.value)} style={inputStyle}>
              <option value="bottom-right">Bottom right</option>
              <option value="bottom-left">Bottom left</option>
            </select>

            <button onClick={saveConfig} disabled={busy} className="dash-btn" style={{ ...btnStyle("solid"), width: "100%", justifyContent: "center", marginTop: 16 }}>
              Save changes
            </button>
          </div>
        </div>
      )}

      <style>{`.dash-btn:hover { filter: brightness(0.97); }`}</style>
    </div>
  );
}

function btnStyle(variant: "solid" | "outline"): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "9px 16px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    border: variant === "solid" ? "none" : "1px solid var(--border)",
    background: variant === "solid" ? "var(--accent)" : "var(--surface)",
    color: variant === "solid" ? "var(--accent-ink)" : "var(--text)",
  };
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "var(--muted)", margin: "12px 0 6px" };
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  fontSize: 13.5,
  fontFamily: "var(--font)",
  color: "var(--text)",
  background: "var(--bg)",
};

export default function IntegrationsHub({
  rows: initialRows,
  trialOptions,
  loadError,
  userName,
}: {
  rows: IntegrationRow[];
  trialOptions: TrialOption[];
  loadError: boolean;
  userName: string | null;
}) {
  const [rows, setRows] = useState(initialRows);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showWelcome, setShowWelcome] = useState(searchParams.get("welcome") === "1");
  const autoTrialSlug = searchParams.get("trial");
  // Server data changes after a trial starts (router.refresh()) — keep local
  // edits (config/regenerate) but pick up newly created rows.
  const [prevInitial, setPrevInitial] = useState(initialRows);
  if (prevInitial !== initialRows) {
    setPrevInitial(initialRows);
    setRows(initialRows);
  }

  useEffect(() => {
    if (searchParams.get("welcome") === "1") {
      // Strip the query param so a refresh/share of this URL doesn't keep
      // showing the banner — the checkout's successUrl put it there once.
      router.replace("/dashboard/integrations");
    }
  }, [searchParams, router]);

  const updateRow = (updated: IntegrationRow) => {
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100svh" }}>
      <SiteNav />
      <section style={{ padding: "48px 24px 80px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--text)", margin: "0 0 8px" }}>
            {userName ? `${userName.split(" ")[0]}'s agents` : "Your agents"}
          </h1>
          <p style={{ fontSize: 14.5, color: "var(--muted)", margin: "0 0 32px" }}>
            Embed codes, usage, and widget config for everything you&apos;ve subscribed to.
          </p>

          {showWelcome && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: 18,
                borderRadius: 2,
                background: "rgba(125,206,160,0.08)",
                border: "1px solid rgba(125,206,160,0.28)",
                marginBottom: 24,
              }}
            >
              <Sparkle size={18} weight="fill" style={{ color: "var(--success)", flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: "0 0 2px" }}>
                  You&apos;re all set!
                </p>
                <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
                  Your subscription is active and your embed code is ready below — copy it into your site to go live.
                </p>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                aria-label="Dismiss"
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", flexShrink: 0 }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {loadError && (
            <div style={{ padding: 20, borderRadius: 2, background: "rgba(240,128,110,0.08)", border: "1px solid rgba(240,128,110,0.32)", color: "#f0a08f", fontSize: 13.5, marginBottom: 24 }}>
              Couldn&apos;t load your dashboard data right now. Try refreshing the page.
            </div>
          )}

          {!loadError && <StartTrialCard options={trialOptions} autoStartSlug={autoTrialSlug} />}

          {!loadError && rows.length === 0 && trialOptions.length === 0 && (
            <div style={{ padding: 32, borderRadius: 2, background: "var(--surface)", border: "1px solid var(--border)", textAlign: "center" }}>
              <p style={{ fontSize: 14.5, color: "var(--muted)", margin: "0 0 16px" }}>
                You haven&apos;t subscribed to any agents yet.
              </p>
              <Link
                href="/agents"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 8, background: "var(--accent)", color: "var(--accent-ink)", fontSize: 14, fontWeight: 600 }}
              >
                Browse the catalog
              </Link>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {rows.map((row) => (
              <AgentRow key={row.id} row={row} onUpdated={updateRow} />
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

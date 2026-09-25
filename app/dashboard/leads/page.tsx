import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "../../../auth";
import { db } from "../../lib/db";
import DashboardShell, { ErrorBox, formatIst } from "../DashboardShell";

export const metadata: Metadata = {
  title: "Leads — Buildr Studio",
  robots: { index: false, follow: false },
};

const TRIGGER_LABEL: Record<string, string> = {
  no_answer: "Agent couldn't answer",
  asked_human: "Asked for a person",
  manual: "Talk to a person",
};

const PAGE_SIZE = 200;

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ agent?: string }> }) {
  const session = await auth();
  const { agent: agentSlug } = await searchParams;
  if (!session?.user?.id) {
    return <div style={{ padding: "80px 24px", textAlign: "center", color: "var(--muted)" }}>Please sign in to view your leads.</div>;
  }

  let leads: Awaited<ReturnType<typeof loadLeads>>["leads"] = [];
  let agents: { slug: string; name: string }[] = [];
  let total = 0;
  let loadError = false;
  try {
    ({ leads, agents, total } = await loadLeads(session.user.id, agentSlug));
  } catch (err) {
    console.error("[dashboard/leads] could not load:", err);
    loadError = true;
  }

  const exportHref = `/api/leads/export${agentSlug ? `?agent=${encodeURIComponent(agentSlug)}` : ""}`;

  return (
    <DashboardShell title="Leads" intro="Visitors who left their details when your agent couldn't help, or when they asked for a person.">
          {loadError && <ErrorBox>Couldn&apos;t load your leads right now. Try refreshing the page.</ErrorBox>}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[{ slug: "", name: "All agents" }, ...agents].map((a) => {
                const active = (agentSlug ?? "") === a.slug;
                return (
                  <Link
                    key={a.slug || "all"}
                    href={a.slug ? `/dashboard/leads?agent=${encodeURIComponent(a.slug)}` : "/dashboard/leads"}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontSize: 12.5,
                      fontWeight: 600,
                      border: "1px solid var(--border)",
                      background: active ? "var(--surface-alt)" : "transparent",
                      color: active ? "var(--text)" : "var(--muted)",
                    }}
                  >
                    {a.name}
                  </Link>
                );
              })}
            </div>
            <a
              href={exportHref}
              style={{ padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: "var(--accent)", color: "var(--accent-ink)" }}
            >
              Export CSV
            </a>
          </div>

          {!loadError && leads.length === 0 ? (
            <div style={{ padding: 32, borderRadius: 2, background: "var(--surface)", border: "1px solid var(--border)", textAlign: "center", fontSize: 14, color: "var(--muted)" }}>
              No leads yet. When a visitor asks for a person, or your agent can&apos;t answer, the widget asks for their name,
              email and phone. Those show up here.
            </div>
          ) : (
            <div style={{ borderRadius: 2, border: "1px solid var(--border)", background: "var(--surface)", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "var(--muted-2)", fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {["When", "Name", "Contact", "Message", "Why", "Agent"].map((h) => (
                      <th key={h} style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)", fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id} style={{ verticalAlign: "top" }}>
                      <td style={cell}>
                        <span style={{ whiteSpace: "nowrap" }}>
                          {formatIst(l.createdAt)}
                        </span>
                      </td>
                      <td style={{ ...cell, color: "var(--text)", fontWeight: 600 }}>
                        {l.name}
                        {l.chatSessionId && (
                          <div style={{ marginTop: 2, fontWeight: 400 }}>
                            <Link href={`/dashboard/conversations/${l.chatSessionId}`} style={{ fontSize: 11.5, color: "var(--muted)", textDecoration: "underline", textUnderlineOffset: 3 }}>
                              Conversation
                            </Link>
                          </div>
                        )}
                      </td>
                      <td style={cell}>
                        <a href={`mailto:${l.email}`} style={{ color: "var(--text)", textDecoration: "underline", textUnderlineOffset: 3 }}>{l.email}</a>
                        {l.phone && <div style={{ marginTop: 2 }}><a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} style={{ color: "var(--muted)" }}>{l.phone}</a></div>}
                      </td>
                      <td style={{ ...cell, maxWidth: 280, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{l.message ?? "—"}</td>
                      <td style={cell}>
                        {TRIGGER_LABEL[l.trigger] ?? l.trigger}
                        {l.pageUrl && (
                          <div style={{ marginTop: 2, fontSize: 11.5, color: "var(--muted-2)", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={l.pageUrl}>
                            {l.pageUrl.replace(/^https?:\/\//, "")}
                          </div>
                        )}
                      </td>
                      <td style={cell}>{l.agent.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {total > leads.length && (
            <p style={{ fontSize: 12.5, color: "var(--muted-2)", marginTop: 12 }}>
              Showing the latest {leads.length} of {total}. Export CSV for all of them.
            </p>
          )}
    </DashboardShell>
  );
}

const cell: React.CSSProperties = { padding: "12px 14px", borderBottom: "1px solid var(--border)", color: "var(--muted)" };

async function loadLeads(userId: string, agentSlug: string | undefined) {
  const where = { userId, ...(agentSlug ? { agent: { slug: agentSlug } } : {}) };
  const [leads, total, keys] = await Promise.all([
    db.lead.findMany({ where, include: { agent: { select: { name: true, slug: true } } }, orderBy: { createdAt: "desc" }, take: PAGE_SIZE }),
    db.lead.count({ where }),
    db.apiKey.findMany({ where: { userId }, select: { agent: { select: { slug: true, name: true } } } }),
  ]);
  const agents = [...new Map(keys.map((k) => [k.agent.slug, k.agent])).values()];
  return { leads, total, agents };
}

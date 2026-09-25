import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "../../../auth";
import { db } from "../../lib/db";
import DashboardShell, { EmptyBox, ErrorBox, formatIst } from "../DashboardShell";

export const metadata: Metadata = {
  title: "Conversations — Buildr Studio",
  robots: { index: false, follow: false },
};

const PAGE_SIZE = 30;

async function loadStats(userId: string) {
  const windows = [7, 30] as const;
  return Promise.all(
    windows.map(async (days) => {
      const since = new Date(Date.now() - days * 86_400_000);
      const [conversations, messages, leads, unanswered] = await Promise.all([
        db.chatSession.count({ where: { apiKey: { userId }, createdAt: { gte: since }, messageCount: { gt: 0 } } }),
        db.message.count({ where: { role: "user", createdAt: { gte: since }, chatSession: { apiKey: { userId } } } }),
        db.lead.count({ where: { userId, createdAt: { gte: since } } }),
        db.unansweredQuestion.count({ where: { apiKey: { userId }, createdAt: { gte: since } } }),
      ]);
      return { days, conversations, messages, leads, unanswered };
    }),
  );
}

async function loadConversations(userId: string, agentSlug: string | undefined, page: number) {
  const where = {
    apiKey: { userId },
    messageCount: { gt: 0 },
    ...(agentSlug ? { agent: { slug: agentSlug } } : {}),
  };
  const [sessions, total, keys] = await Promise.all([
    db.chatSession.findMany({
      where,
      orderBy: [{ lastMessageAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        agent: { select: { name: true } },
        messages: { where: { role: "user" }, orderBy: { createdAt: "asc" }, take: 1, select: { content: true } },
        _count: { select: { leads: true, unanswered: true } },
      },
    }),
    db.chatSession.count({ where }),
    db.apiKey.findMany({ where: { userId }, select: { agent: { select: { slug: true, name: true } } } }),
  ]);
  const agents = [...new Map(keys.map((k) => [k.agent.slug, k.agent])).values()];
  return { sessions, total, agents };
}

export default async function ConversationsPage({ searchParams }: { searchParams: Promise<{ agent?: string; page?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return <div style={{ padding: "80px 24px", textAlign: "center", color: "var(--muted)" }}>Please sign in.</div>;
  }
  const { agent: agentSlug, page: pageParam } = await searchParams;
  const page = Math.max(0, Number.parseInt(pageParam ?? "0", 10) || 0);

  let stats: Awaited<ReturnType<typeof loadStats>> = [];
  let data: Awaited<ReturnType<typeof loadConversations>> = { sessions: [], total: 0, agents: [] };
  let loadError = false;
  try {
    [stats, data] = await Promise.all([loadStats(session.user.id), loadConversations(session.user.id, agentSlug, page)]);
  } catch (err) {
    console.error("[dashboard/conversations] could not load:", err);
    loadError = true;
  }

  const qs = (p: number) => {
    const params = new URLSearchParams();
    if (agentSlug) params.set("agent", agentSlug);
    if (p) params.set("page", String(p));
    const s = params.toString();
    return `/dashboard/conversations${s ? `?${s}` : ""}`;
  };

  return (
    <DashboardShell title="Conversations" intro="What visitors asked your agents, and what they said back.">
      {loadError && <ErrorBox>Couldn&apos;t load conversations right now. Try refreshing the page.</ErrorBox>}

      {stats.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Conversations", key: "conversations" as const },
            { label: "Visitor messages", key: "messages" as const },
            { label: "Leads", key: "leads" as const },
            { label: "Unanswered", key: "unanswered" as const },
          ].map((m) => (
            <div key={m.key} style={{ padding: 16, borderRadius: 2, background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-2)", marginBottom: 8 }}>{m.label}</div>
              <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
                {stats.map((s) => (
                  <div key={s.days}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}>{s[m.key]}</span>
                    <span style={{ fontSize: 11.5, color: "var(--muted-2)", marginLeft: 5 }}>{s.days}d</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {data.agents.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {[{ slug: "", name: "All agents" }, ...data.agents].map((a) => {
            const active = (agentSlug ?? "") === a.slug;
            return (
              <Link
                key={a.slug || "all"}
                href={a.slug ? `/dashboard/conversations?agent=${encodeURIComponent(a.slug)}` : "/dashboard/conversations"}
                style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, border: "1px solid var(--border)", background: active ? "var(--surface-alt)" : "transparent", color: active ? "var(--text)" : "var(--muted)" }}
              >
                {a.name}
              </Link>
            );
          })}
        </div>
      )}

      {!loadError && data.sessions.length === 0 ? (
        <EmptyBox>No conversations yet. They show up here once visitors start chatting with your widget.</EmptyBox>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", border: "1px solid var(--border)", borderRadius: 2, background: "var(--surface)" }}>
          {data.sessions.map((s, i) => (
            <Link
              key={s.id}
              href={`/dashboard/conversations/${s.id}`}
              className="conv-row"
              style={{ display: "flex", gap: 16, justifyContent: "space-between", alignItems: "flex-start", padding: "14px 16px", borderTop: i ? "1px solid var(--border)" : "none" }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.messages[0]?.content ?? "(no visitor message)"}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 3 }}>
                  {s.agent.name} · {Math.ceil(s.messageCount / 2)} question{s.messageCount > 2 ? "s" : ""}
                  {s.pageUrl && ` · ${s.pageUrl.replace(/^https?:\/\//, "").slice(0, 60)}`}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                {s._count.leads > 0 && <span style={chip("rgba(125,206,160,")}>Lead</span>}
                {s._count.unanswered > 0 && <span style={chip("rgba(228,177,90,")}>Unanswered</span>}
                <span style={{ fontSize: 12, color: "var(--muted)", whiteSpace: "nowrap" }}>{formatIst(s.lastMessageAt ?? s.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {data.total > PAGE_SIZE && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 13 }}>
          {page > 0 ? <Link href={qs(page - 1)} style={{ color: "var(--text)" }}>← Newer</Link> : <span />}
          <span style={{ color: "var(--muted-2)" }}>
            {page * PAGE_SIZE + 1}–{Math.min(data.total, (page + 1) * PAGE_SIZE)} of {data.total}
          </span>
          {(page + 1) * PAGE_SIZE < data.total ? <Link href={qs(page + 1)} style={{ color: "var(--text)" }}>Older →</Link> : <span />}
        </div>
      )}
      <style>{`.conv-row:hover { background: var(--surface-alt); }`}</style>
    </DashboardShell>
  );
}

function chip(rgba: string): React.CSSProperties {
  return { fontSize: 10.5, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 2, color: "var(--text)", background: `${rgba}0.12)`, border: `1px solid ${rgba}0.3)` };
}

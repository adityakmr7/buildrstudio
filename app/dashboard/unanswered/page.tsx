import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "../../../auth";
import { db } from "../../lib/db";
import DashboardShell, { EmptyBox, ErrorBox } from "../DashboardShell";
import UnansweredList, { type UnansweredItem } from "./UnansweredList";

export const metadata: Metadata = {
  title: "Unanswered questions — Buildr Studio",
  robots: { index: false, follow: false },
};

const STATUSES = ["open", "answered", "dismissed"] as const;

export default async function UnansweredPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return <div style={{ padding: "80px 24px", textAlign: "center", color: "var(--muted)" }}>Please sign in.</div>;
  }
  const { status: statusParam } = await searchParams;
  const status = STATUSES.includes(statusParam as (typeof STATUSES)[number]) ? (statusParam as (typeof STATUSES)[number]) : "open";

  let items: UnansweredItem[] = [];
  let loadError = false;
  try {
    const rows = await db.unansweredQuestion.findMany({
      where: { apiKey: { userId: session.user.id }, status },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { apiKey: { select: { agent: { select: { name: true } } } } },
    });
    items = rows.map((r) => ({
      id: r.id,
      question: r.question,
      reply: r.reply,
      reason: r.reason,
      status: r.status,
      agentName: r.apiKey.agent.name,
      chatSessionId: r.chatSessionId,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch (err) {
    console.error("[dashboard/unanswered] could not load:", err);
    loadError = true;
  }

  return (
    <DashboardShell
      title="Unanswered questions"
      intro="Questions your agent couldn't answer from what it knows. Add an answer and it goes into that agent's knowledge base for next time."
    >
      {loadError && <ErrorBox>Couldn&apos;t load these right now. Try refreshing the page.</ErrorBox>}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "open" ? "/dashboard/unanswered" : `/dashboard/unanswered?status=${s}`}
            style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, border: "1px solid var(--border)", background: status === s ? "var(--surface-alt)" : "transparent", color: status === s ? "var(--text)" : "var(--muted)", textTransform: "capitalize" }}
          >
            {s}
          </Link>
        ))}
      </div>
      {!loadError && items.length === 0 ? (
        <EmptyBox>{status === "open" ? "Nothing here. Your agent has answered everything it's been asked so far." : `No ${status} questions.`}</EmptyBox>
      ) : (
        <UnansweredList items={items} />
      )}
    </DashboardShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "../../../../auth";
import { db } from "../../../lib/db";
import DashboardShell, { formatIst } from "../../DashboardShell";

export const metadata: Metadata = {
  title: "Conversation — Buildr Studio",
  robots: { index: false, follow: false },
};

export default async function ConversationDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return <div style={{ padding: "80px 24px", textAlign: "center", color: "var(--muted)" }}>Please sign in.</div>;
  }
  const { id } = await params;
  const conv = await db.chatSession.findUnique({
    where: { id },
    include: {
      apiKey: { select: { userId: true } },
      agent: { select: { name: true } },
      messages: { orderBy: [{ createdAt: "asc" }, { id: "asc" }] },
      leads: { orderBy: { createdAt: "asc" } },
      unanswered: { select: { question: true } },
    },
  });
  if (!conv || conv.apiKey.userId !== session.user.id) notFound();
  const flagged = new Set(conv.unanswered.map((u) => u.question));

  return (
    <DashboardShell title="Conversation" intro={<>{conv.agent.name} · started {formatIst(conv.createdAt, true)}</>} maxWidth={760}>
      <Link href="/dashboard/conversations" style={{ fontSize: 13, color: "var(--muted)", display: "inline-block", marginBottom: 16 }}>
        ← All conversations
      </Link>
      {conv.pageUrl && (
        <p style={{ fontSize: 12.5, color: "var(--muted-2)", margin: "0 0 16px", wordBreak: "break-all" }}>Started on {conv.pageUrl}</p>
      )}

      {conv.leads.map((l) => (
        <div key={l.id} style={{ padding: 14, borderRadius: 2, background: "rgba(125,206,160,0.07)", border: "1px solid rgba(125,206,160,0.28)", marginBottom: 16, fontSize: 13, color: "var(--text)" }}>
          <strong>Lead:</strong> {l.name} · <a href={`mailto:${l.email}`} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>{l.email}</a>
          {l.phone && <> · {l.phone}</>}
          {l.message && <div style={{ color: "var(--muted)", marginTop: 4, whiteSpace: "pre-wrap" }}>{l.message}</div>}
        </div>
      ))}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {conv.messages.map((m) => {
          const visitor = m.role === "user";
          return (
            <div key={m.id} style={{ alignSelf: visitor ? "flex-end" : "flex-start", maxWidth: "82%" }}>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 2,
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  color: "var(--text)",
                  background: visitor ? "var(--surface-alt)" : "var(--surface)",
                  border: `1px solid ${visitor && flagged.has(m.content) ? "rgba(228,177,90,0.5)" : "var(--border)"}`,
                }}
              >
                {m.content}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 4, textAlign: visitor ? "right" : "left" }}>
                {visitor ? "Visitor" : "Agent"} · {formatIst(m.createdAt)}
                {visitor && flagged.has(m.content) && " · unanswered"}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}

import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { db } from "../../../lib/db";
import { addAnswerToKnowledge, MAX_ANSWER_CHARS } from "../../../lib/qaKnowledge";

export const runtime = "nodejs";

// POST { action: "answer", answer } — add a Q&A to the install's knowledge and mark answered
// POST { action: "dismiss" }        — hide it from the open list
// POST { action: "reopen" }
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await params;
  const q = await db.unansweredQuestion.findUnique({ where: { id }, include: { apiKey: true } });
  if (!q || q.apiKey.userId !== session.user.id) return NextResponse.json({ error: "Not found." }, { status: 404 });

  let body: { action?: string; answer?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (body.action === "dismiss" || body.action === "reopen") {
    const updated = await db.unansweredQuestion.update({
      where: { id },
      data: body.action === "dismiss" ? { status: "dismissed", resolvedAt: new Date() } : { status: "open", resolvedAt: null },
    });
    return NextResponse.json({ status: updated.status });
  }

  if (body.action === "answer") {
    const answer = (body.answer ?? "").trim();
    if (!answer) return NextResponse.json({ error: "Write an answer first." }, { status: 400 });
    if (answer.length > MAX_ANSWER_CHARS) {
      return NextResponse.json({ error: `Keep answers under ${MAX_ANSWER_CHARS} characters.` }, { status: 400 });
    }
    try {
      await addAnswerToKnowledge(q.apiKeyId, q.question, answer);
    } catch (err) {
      console.error("[api/unanswered] add answer failed:", err);
      const msg = err instanceof Error && err.message.includes("chunks") ? err.message : "Couldn't add that to the knowledge base. Try again.";
      return NextResponse.json({ error: msg }, { status: 500 });
    }
    await db.unansweredQuestion.update({ where: { id }, data: { status: "answered", resolvedAt: new Date() } });
    return NextResponse.json({ status: "answered" });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}

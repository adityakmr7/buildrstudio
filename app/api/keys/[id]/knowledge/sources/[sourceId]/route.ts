import { NextResponse } from "next/server";
import { auth } from "../../../../../../../auth";
import { db } from "../../../../../../lib/db";
import { rateLimit } from "../../../../../../lib/rateLimit";
import { isSyncInProgress, serializeSource, syncWebsiteSource } from "../../../../../../lib/websiteKnowledge";

export const runtime = "nodejs";
export const maxDuration = 60;

async function getOwnedSource(keyId: string, sourceId: string, userId: string) {
  const source = await db.knowledgeSource.findUnique({ where: { id: sourceId }, include: { apiKey: true } });
  if (!source || source.kind !== "website" || source.apiKeyId !== keyId || source.apiKey.userId !== userId) return null;
  return source;
}

// POST — Re-sync: re-crawl and replace this website's chunks.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string; sourceId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id, sourceId } = await params;
  const source = await getOwnedSource(id, sourceId, session.user.id);
  if (!source) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (isSyncInProgress(source)) return NextResponse.json({ error: "This website is already syncing." }, { status: 409 });
  if (!rateLimit(`crawl:${id}`, 3).allowed) {
    return NextResponse.json({ error: "Too many crawls in a minute — wait a moment." }, { status: 429 });
  }

  try {
    const outcome = await syncWebsiteSource(source.id);
    const fresh = await db.knowledgeSource.findUniqueOrThrow({ where: { id: source.id } });
    return NextResponse.json({ source: serializeSource(fresh), outcome });
  } catch (err) {
    console.error("[api/keys/knowledge/sources/:id] sync error:", err);
    await db.knowledgeSource.update({ where: { id: source.id }, data: { status: "failed" } }).catch(() => {});
    return NextResponse.json({ error: "Couldn't sync that website. Try again." }, { status: 500 });
  }
}

// DELETE — remove the website and its chunks (cascade).
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; sourceId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id, sourceId } = await params;
  const source = await getOwnedSource(id, sourceId, session.user.id);
  if (!source) return NextResponse.json({ error: "Not found." }, { status: 404 });
  await db.knowledgeSource.delete({ where: { id: source.id } });
  return NextResponse.json({ ok: true });
}

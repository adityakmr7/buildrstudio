import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { db } from "../../../../lib/db";
import { chunkText, embedText, MAX_CHARS_PER_UPLOAD, MAX_CHUNKS_PER_KEY } from "../../../../lib/knowledge";

async function getOwnedKey(id: string, userId: string) {
  const key = await db.apiKey.findUnique({ where: { id } });
  if (!key || key.userId !== userId) return null;
  return key;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  const key = await getOwnedKey(id, session.user.id);
  if (!key) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const [chunkCount, latest] = await Promise.all([
    db.documentChunk.count({ where: { apiKeyId: id } }),
    db.documentChunk.findFirst({
      where: { apiKeyId: id },
      orderBy: { createdAt: "desc" },
      select: { source: true, createdAt: true },
    }),
  ]);

  return NextResponse.json({
    chunkCount,
    source: latest?.source ?? null,
    updatedAt: latest?.createdAt ?? null,
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  const key = await getOwnedKey(id, session.user.id);
  if (!key) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let body: { text?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = (body.text ?? "").trim();
  if (!text) {
    return NextResponse.json({ error: "text is required." }, { status: 400 });
  }
  if (text.length > MAX_CHARS_PER_UPLOAD) {
    return NextResponse.json(
      { error: `Keep your knowledge base under ${MAX_CHARS_PER_UPLOAD.toLocaleString()} characters for now.` },
      { status: 400 },
    );
  }

  const chunks = chunkText(text).slice(0, MAX_CHUNKS_PER_KEY);
  if (chunks.length === 0) {
    return NextResponse.json({ error: "No usable text found." }, { status: 400 });
  }

  const source = (body.source ?? "Pasted text").slice(0, 200);

  try {
    // Sequential, not Promise.all — deliberately avoids firing dozens of
    // parallel embedding requests at once for a single upload.
    const embeddings: number[][] = [];
    for (const chunk of chunks) {
      embeddings.push(await embedText(chunk));
    }

    await db.$transaction([
      db.documentChunk.deleteMany({ where: { apiKeyId: id } }),
      ...chunks.map((content, i) =>
        db.documentChunk.create({
          data: { apiKeyId: id, source, content, embedding: embeddings[i] },
        }),
      ),
    ]);
  } catch (err) {
    console.error("[api/keys/knowledge] error:", err);
    return NextResponse.json({ error: "Couldn't process the knowledge base. Try again." }, { status: 500 });
  }

  return NextResponse.json({ chunkCount: chunks.length, source });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  const key = await getOwnedKey(id, session.user.id);
  if (!key) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await db.documentChunk.deleteMany({ where: { apiKeyId: id } });
  return NextResponse.json({ ok: true });
}

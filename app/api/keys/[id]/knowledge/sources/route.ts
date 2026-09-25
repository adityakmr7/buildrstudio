import { NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import { db } from "../../../../../lib/db";
import { rateLimit } from "../../../../../lib/rateLimit";
import { assertSafeUrl, UnsafeUrlError } from "../../../../../lib/safeFetch";
import { isSyncInProgress, MAX_WEBSITE_SOURCES_PER_KEY, serializeSource, syncWebsiteSource } from "../../../../../lib/websiteKnowledge";

export const runtime = "nodejs";
// Crawling + embedding runs inside this request (no job queue). The crawler
// caps itself at ~35s; this leaves headroom for embedding + DB writes.
export const maxDuration = 60;

async function getOwnedKey(id: string, userId: string) {
  const key = await db.apiKey.findUnique({ where: { id } });
  if (!key || key.userId !== userId) return null;
  return key;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await params;
  const key = await getOwnedKey(id, session.user.id);
  if (!key) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const sources = await db.knowledgeSource.findMany({ where: { apiKeyId: id }, orderBy: { createdAt: "asc" } });
  return NextResponse.json({ sources: sources.map(serializeSource), maxSources: MAX_WEBSITE_SOURCES_PER_KEY });
}

// POST { url } — add a website (page URL or sitemap.xml) and crawl it now.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await params;
  const key = await getOwnedKey(id, session.user.id);
  if (!key) return NextResponse.json({ error: "Not found." }, { status: 404 });

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  let raw = (body.url ?? "").trim();
  if (!raw) return NextResponse.json({ error: "url is required." }, { status: 400 });
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)) raw = `https://${raw}`;

  let url: URL;
  try {
    url = assertSafeUrl(raw);
  } catch (err) {
    return NextResponse.json({ error: err instanceof UnsafeUrlError ? err.message : "Invalid URL." }, { status: 400 });
  }
  url.hash = "";
  const normalized = url.toString().slice(0, 1000);

  if (!rateLimit(`crawl:${id}`, 3).allowed) {
    return NextResponse.json({ error: "Too many crawls in a minute — wait a moment." }, { status: 429 });
  }

  let source = await db.knowledgeSource.findUnique({ where: { apiKeyId_url: { apiKeyId: id, url: normalized } } });
  if (!source) {
    const count = await db.knowledgeSource.count({ where: { apiKeyId: id } });
    if (count >= MAX_WEBSITE_SOURCES_PER_KEY) {
      return NextResponse.json(
        { error: `You can add up to ${MAX_WEBSITE_SOURCES_PER_KEY} websites per agent. Remove one first.` },
        { status: 400 },
      );
    }
    source = await db.knowledgeSource.create({ data: { apiKeyId: id, url: normalized, kind: "website" } });
  } else if (isSyncInProgress(source)) {
    return NextResponse.json({ error: "This website is already syncing." }, { status: 409 });
  }

  try {
    const outcome = await syncWebsiteSource(source.id);
    const fresh = await db.knowledgeSource.findUniqueOrThrow({ where: { id: source.id } });
    return NextResponse.json({ source: serializeSource(fresh), outcome });
  } catch (err) {
    console.error("[api/keys/knowledge/sources] sync error:", err);
    await db.knowledgeSource.update({ where: { id: source.id }, data: { status: "failed" } }).catch(() => {});
    return NextResponse.json({ error: "Couldn't sync that website. Try again." }, { status: 500 });
  }
}

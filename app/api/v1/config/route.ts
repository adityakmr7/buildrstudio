import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";

export const runtime = "nodejs";

// Public widget config (greeting / brand color / position saved in the
// dashboard), fetched by public/widget.js. Keyed by the install's public key
// — the same value that's already visible in the site's <script> tag — so
// this exposes nothing new. Cache-friendly: CDN caches for 5 minutes and
// serves stale for a day while revalidating, so dashboard edits show up
// within ~5 minutes without every page view hitting the database.
const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: HEADERS });
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key") ?? "";
  const agentSlug = req.nextUrl.searchParams.get("agent");
  if (!/^pk_live_[a-f0-9]{8,64}$/.test(key)) {
    return NextResponse.json({ error: "Missing or malformed key." }, { status: 400, headers: HEADERS });
  }
  try {
    const apiKey = await db.apiKey.findUnique({
      where: { key },
      select: { isActive: true, greeting: true, color: true, position: true, agent: { select: { slug: true } } },
    });
    if (!apiKey || !apiKey.isActive || (agentSlug && apiKey.agent.slug !== agentSlug)) {
      return NextResponse.json(
        { error: "Unknown key." },
        { status: 404, headers: { ...HEADERS, "Cache-Control": "public, max-age=60, s-maxage=60" } },
      );
    }
    return NextResponse.json(
      { greeting: apiKey.greeting, color: apiKey.color, position: apiKey.position },
      { headers: HEADERS },
    );
  } catch (err) {
    console.error("[api/v1/config] error:", err);
    return NextResponse.json({ error: "Unavailable." }, { status: 503, headers: { ...HEADERS, "Cache-Control": "no-store" } });
  }
}

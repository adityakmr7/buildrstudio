import { NextRequest, NextResponse, after } from "next/server";
import { db } from "../../../lib/db";
import { rateLimit } from "../../../lib/rateLimit";
import { notifyLead, parseLeadInput } from "../../../lib/leads";
import { whatsappLink } from "../../../lib/handoff";

export const runtime = "nodejs";

// Called by public/widget.js's lead form. CORS-open like /api/v1/chat — the
// widget runs on customers' own domains; auth is the (public) install key.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: CORS_HEADERS });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const match = (req.headers.get("authorization") ?? "").match(/^Bearer\s+(.+)$/i);
    if (!match) return json({ error: "Missing or malformed Authorization header." }, 401);

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body." }, 400);
    }

    const apiKey = await db.apiKey.findUnique({ where: { key: match[1] }, include: { agent: true } });
    if (!apiKey || !apiKey.isActive) return json({ error: "Invalid or inactive API key." }, 401);
    if (typeof body.agent_id === "string" && body.agent_id !== apiKey.agent.slug) {
      return json({ error: "This API key is not authorized for this agent." }, 404);
    }

    // Spam guards: per visitor IP and per install.
    if (!rateLimit(`lead:${apiKey.id}:${clientIp(req)}`, 3).allowed || !rateLimit(`lead:${apiKey.id}`, 30).allowed) {
      return json({ error: "Too many requests — try again in a minute." }, 429);
    }

    const parsed = parseLeadInput(body);
    // Honeypot: a hidden field real visitors never fill. Pretend success.
    const honeypot = typeof body.website === "string" && body.website.trim() !== "";
    if (typeof parsed === "string") return json({ error: parsed }, 400);

    const whatsappUrl = whatsappLink(
      apiKey.whatsappNumber,
      `Hi, I'm ${parsed.name}. ${parsed.message ?? "I had a question on your website."}`,
    );
    if (honeypot) return json({ ok: true, whatsapp_url: whatsappUrl });

    let chatSessionId: string | null = null;
    if (typeof body.session_id === "string" && body.session_id) {
      const session = await db.chatSession.findUnique({ where: { id: body.session_id } });
      if (session && session.apiKeyId === apiKey.id) chatSessionId = session.id;
    }

    const lead = await db.lead.create({
      data: {
        apiKeyId: apiKey.id,
        agentId: apiKey.agentId,
        userId: apiKey.userId,
        chatSessionId,
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        message: parsed.message,
        trigger: parsed.trigger,
        pageUrl: parsed.pageUrl,
      },
    });

    // Notify after the response is sent — the visitor shouldn't wait on
    // email/webhook latency, and a failure there never loses the lead.
    after(async () => {
      try {
        await notifyLead(lead.id);
      } catch (err) {
        console.error("[api/v1/leads] notify failed:", err);
      }
    });

    return json({ ok: true, whatsapp_url: whatsappUrl });
  } catch (err) {
    console.error("[api/v1/leads] error:", err);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
}

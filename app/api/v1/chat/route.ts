import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { generateReply } from "../../../lib/gemini";
import { rateLimit } from "../../../lib/rateLimit";
import { retrieveRelevantChunks } from "../../../lib/knowledge";

export const runtime = "nodejs";

// The widget embeds on arbitrary third-party sites, so this endpoint is
// intentionally open to cross-origin requests — auth is the API key, not
// same-origin cookies.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

function json(body: unknown, init?: { status?: number }) {
  return NextResponse.json(body, { status: init?.status ?? 200, headers: CORS_HEADERS });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// Fallback quota for an ApiKey with no active paid subscription yet — lets
// the widget be test-driven before purchase. Real per-tier limits come from
// AgentTier.monthlyLimit once a subscription exists (plan Section 9, #2 is
// still open, so this number is ours to set — packaging, not pricing).
const TRIAL_MONTHLY_LIMIT = 20;

// req/min per tier — mirrors the plan's "30 for starter, 120 for pro" intent,
// applied per API key rather than per user account.
const RATE_LIMITS: Record<string, number> = {
  standard: 30,
  pro: 120,
  trial: 10,
};

function currentMonth() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") ?? "";
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match) {
      return json({ error: "Missing or malformed Authorization header." }, { status: 401 });
    }
    const key = match[1];

    let body: { agent_id?: string; message?: string; session_id?: string };
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const { agent_id: agentSlug, message, session_id: sessionId } = body;
    if (!agentSlug || !message || typeof message !== "string") {
      return json({ error: "agent_id and message are required." }, { status: 400 });
    }
    if (message.length > 4000) {
      return json({ error: "message is too long (max 4000 characters)." }, { status: 400 });
    }

    // ── Validate API key ──────────────────────────────────────────────
    const apiKey = await db.apiKey.findUnique({
      where: { key },
      include: { user: true },
    });
    if (!apiKey || !apiKey.isActive) {
      return json({ error: "Invalid or inactive API key." }, { status: 401 });
    }

    // ── Fetch agent, confirm this key is allowed to use it ────────────
    const agent = await db.agent.findUnique({
      where: { slug: agentSlug },
      include: { tiers: true },
    });
    if (!agent || (!agent.isPublic && apiKey.agentId !== agent.id)) {
      return json({ error: "Agent not found or not accessible." }, { status: 404 });
    }
    if (apiKey.agentId !== agent.id) {
      return json({ error: "This API key is not authorized for this agent." }, { status: 404 });
    }

    // ── Look up active subscription → tier → quota ────────────────────
    const subscription = await db.agentSubscription.findFirst({
      where: { userId: apiKey.userId, agentId: agent.id, status: "active" },
      include: { tier: true },
      orderBy: { createdAt: "desc" },
    });
    const tierName = subscription?.tier.name ?? "trial";
    const monthlyLimit = subscription?.tier.monthlyLimit ?? TRIAL_MONTHLY_LIMIT;

    // ── Rate limit (per API key) ──────────────────────────────────────
    const { allowed } = rateLimit(apiKey.id, RATE_LIMITS[tierName] ?? RATE_LIMITS.trial);
    if (!allowed) {
      return json({ error: "Rate limit exceeded. Slow down and try again shortly." }, { status: 429 });
    }

    // ── Monthly quota ─────────────────────────────────────────────────
    const month = currentMonth();
    const usage = await db.usage.findUnique({
      where: { userId_agentId_month: { userId: apiKey.userId, agentId: agent.id, month } },
    });
    if (usage && usage.messageCount >= monthlyLimit) {
      return json(
        { error: "Monthly message quota exceeded for this agent. Upgrade your plan to continue." },
        { status: 403 },
      );
    }

    // ── Resolve / create the chat session ─────────────────────────────
    let chatSession = sessionId
      ? await db.chatSession.findUnique({ where: { id: sessionId } })
      : null;
    if (!chatSession) {
      chatSession = await db.chatSession.create({
        data: { agentId: agent.id, apiKeyId: apiKey.id },
      });
    }

    // ── Build conversation history (last 10 messages) ─────────────────
    const history = await db.message.findMany({
      where: { chatSessionId: chatSession.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    history.reverse();

    // ── Retrieval-augmented context, if this customer has a knowledge base ──
    // Empty for anyone who hasn't uploaded one yet — agent just answers
    // generically in that case, same as before this existed.
    const relevantChunks = await retrieveRelevantChunks(apiKey.id, message);
    const systemPrompt = relevantChunks.length
      ? `${agent.systemPrompt}\n\nUse the following context from the business's knowledge base to answer, where relevant:\n\n${relevantChunks.join("\n\n---\n\n")}`
      : agent.systemPrompt;

    const { reply, totalTokens } = await generateReply({
      systemPrompt,
      model: agent.model,
      maxTokens: agent.maxTokens,
      temperature: agent.temperature,
      history: history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      message,
    });

    // ── Persist messages + usage ───────────────────────────────────────
    await db.$transaction([
      db.message.create({
        data: { chatSessionId: chatSession.id, agentId: agent.id, role: "user", content: message },
      }),
      db.message.create({
        data: {
          chatSessionId: chatSession.id,
          agentId: agent.id,
          role: "assistant",
          content: reply,
          tokens: totalTokens,
        },
      }),
      db.usage.upsert({
        where: { userId_agentId_month: { userId: apiKey.userId, agentId: agent.id, month } },
        update: { messageCount: { increment: 1 }, tokenCount: { increment: totalTokens } },
        create: { userId: apiKey.userId, agentId: agent.id, month, messageCount: 1, tokenCount: totalTokens },
      }),
      db.apiKey.update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } }),
    ]);

    return json({ reply, session_id: chatSession.id });
  } catch (err) {
    console.error("[api/v1/chat] error:", err);
    return json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

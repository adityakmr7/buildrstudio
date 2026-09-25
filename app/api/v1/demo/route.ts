import { NextRequest, NextResponse } from "next/server";
import { getAgentRuntimeConfig } from "../../../lib/agentRuntime";
import { getAgentProduct } from "../../../lib/agentCatalog";
import { generateReply, isGeminiConfigured } from "../../../lib/gemini";
import { rateLimit } from "../../../lib/rateLimit";

export const runtime = "nodejs";

// The on-site "try it live" demo — deliberately independent of the database.
// It exists so the marketplace's core value ("does this agent actually
// work?") can be verified with nothing configured but GEMINI_API_KEY, no
// Neon/Paddle/auth required. Not authenticated (no API key) — rate-limited
// by IP instead, and capped hard so a public, keyless endpoint can't run up
// the Gemini bill.
const DEMO_RATE_LIMIT_PER_MINUTE = 8;
const MAX_HISTORY_TURNS = 6;
const MAX_MESSAGE_LENGTH = 600;

interface DemoTurn {
  role: "user" | "assistant";
  content: string;
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function mockReply(message: string): string {
  return (
    "(Demo mode — GEMINI_API_KEY isn't configured yet, so this is a canned response rather " +
    `than a real model call.) You said: "${message.slice(0, 140)}". Once a real Gemini key is ` +
    "set, this will be an actual generated reply from the agent's system prompt."
  );
}

export async function POST(req: NextRequest) {
  try {
    let body: { slug?: string; message?: string; history?: DemoTurn[] };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const { slug, message, history } = body;
    if (!slug || !message || typeof message !== "string") {
      return NextResponse.json({ error: "slug and message are required." }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Keep demo messages under ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 },
      );
    }

    const product = getAgentProduct(slug);
    const runtimeConfig = getAgentRuntimeConfig(slug);
    if (!product || product.status !== "live" || !runtimeConfig) {
      return NextResponse.json({ error: "No live demo available for this agent yet." }, { status: 404 });
    }

    const { allowed } = rateLimit(`demo:${clientIp(req)}:${slug}`, DEMO_RATE_LIMIT_PER_MINUTE);
    if (!allowed) {
      return NextResponse.json(
        { error: "Demo is rate-limited — wait a moment before sending another message." },
        { status: 429 },
      );
    }

    const trimmedHistory = Array.isArray(history) ? history.slice(-MAX_HISTORY_TURNS) : [];

    const { reply } = isGeminiConfigured()
      ? await generateReply({
          systemPrompt: runtimeConfig.systemPrompt,
          model: runtimeConfig.model,
          maxTokens: runtimeConfig.maxTokens,
          temperature: runtimeConfig.temperature,
          history: trimmedHistory,
          message,
        })
      : { reply: mockReply(message) };

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[api/v1/demo] error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

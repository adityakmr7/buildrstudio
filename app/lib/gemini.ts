import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface GenerateReplyOptions {
  systemPrompt: string;
  model: string;
  maxTokens: number;
  temperature: number;
  history: ChatTurn[];
  message: string;
}

// Lazily constructed, same reasoning as app/lib/paddle.ts / app/lib/db.ts —
// a missing GEMINI_API_KEY shouldn't crash the build.
let cached: GoogleGenerativeAI | undefined;

export function getGemini(): GoogleGenerativeAI {
  if (cached) return cached;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set (see .env.example).");
  }
  cached = new GoogleGenerativeAI(apiKey);
  return cached;
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

// Shared by the paid embed widget's /api/v1/chat and the DB-free on-site
// /api/v1/demo — same model call, different callers, different persistence.
export async function generateReply(opts: GenerateReplyOptions): Promise<{ reply: string; totalTokens: number }> {
  const model = getGemini().getGenerativeModel({
    model: opts.model,
    systemInstruction: opts.systemPrompt,
    generationConfig: {
      maxOutputTokens: opts.maxTokens,
      temperature: opts.temperature,
    },
  });

  const chat = model.startChat({
    history: opts.history.map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.content }],
    })),
  });

  const result = await chat.sendMessage(opts.message);
  const reply = result.response.text().trim();
  const totalTokens = result.response.usageMetadata?.totalTokenCount ?? 0;

  if (!reply) {
    throw new Error("Gemini returned an empty response.");
  }

  return { reply, totalTokens };
}

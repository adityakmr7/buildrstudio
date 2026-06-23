import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";
import { getAiUsageToday, recordAiUsage } from "@/app/lib/db";

const FREE_DAILY_LIMIT = 1;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function POST(req: NextRequest) {
  const { appName, appDescription, category, tone, language } = await req.json();

  if (!appDescription || typeof appDescription !== "string") {
    return NextResponse.json({ error: "appDescription is required" }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 });
  }

  const session = await auth();
  const plan = session?.user?.plan ?? "free";

  if (plan !== "ai_pro") {
    const identifier = session?.user?.id ?? req.headers.get("x-forwarded-for") ?? "anon";
    const usageToday = await getAiUsageToday(identifier);
    if (usageToday >= FREE_DAILY_LIMIT) {
      return NextResponse.json(
        { error: "Daily AI limit reached. Upgrade to AI Pro for unlimited generations.", limitReached: true },
        { status: 429 },
      );
    }
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const langInstruction = language && language !== "en"
    ? `Write ALL output in language code "${language}". Do not include English translations.`
    : "Write in English.";

  const prompt = `You are an expert App Store / Play Store marketing copywriter.

Given this app info:
- Name: ${appName || "Unknown"}
- Description: ${appDescription}
- Category: ${category || "General"}
- Tone: ${tone || "Professional"}

Generate exactly 5 screenshot copy variations. Each variation has a headline (max 6 words, punchy, benefit-driven) and a subtext (max 12 words, supporting detail).

${langInstruction}

Respond ONLY with valid JSON — no markdown, no code fences:
[{"headline":"...","subtext":"..."},...]`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
    const suggestions = JSON.parse(cleaned);

    if (plan !== "ai_pro") {
      const identifier = session?.user?.id ?? req.headers.get("x-forwarded-for") ?? "anon";
      await recordAiUsage(identifier);
    }

    return NextResponse.json({ suggestions });
  } catch (e) {
    console.error("Gemini error:", e);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}

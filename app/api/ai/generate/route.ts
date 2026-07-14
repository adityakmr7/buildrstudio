import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";
import { getAiUsageTotal, recordAiUsage } from "@/app/lib/db";

const FREE_LIFETIME_LIMIT = 5;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function POST(req: NextRequest) {
  const { appName, appDescription, category, tone, language, brandVoice } = await req.json();

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
    const usageTotal = await getAiUsageTotal(identifier);
    if (usageTotal >= FREE_LIFETIME_LIMIT) {
      return NextResponse.json(
        { error: "Free AI generation used. Upgrade to AI Pro for unlimited generations.", limitReached: true },
        { status: 429 },
      );
    }
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const langInstruction = language && language !== "en"
    ? `Write ALL output in language code "${language}". Do not include English translations.`
    : "Write in English.";

  const hasBrandVoice = brandVoice?.keyBenefit || brandVoice?.targetUser || brandVoice?.avoidWords;

  const prompt = `You are an expert App Store / Play Store marketing copywriter.

## Step 1 — Understand the product
From the description below, derive what the app does and what problem it solves. Do not use this step to write copy yet.

- Name: ${appName || "Unknown"}
- Description: ${appDescription}
- Category: ${category || "General"}
- Tone: ${tone || "Professional"}

## Step 2 — Generate copy
Write exactly 5 screenshot copy variations. Each has a headline (max 6 words, punchy, benefit-driven) and a subtext (max 12 words, supporting detail).
${hasBrandVoice ? `
## Step 3 — Apply brand constraints (these are hard rules, applied after generation)
Rewrite any copy that violates these constraints. The brief corrects vocabulary and claims — it does not change what the product does.
${brandVoice.keyBenefit ? `- Use this exact framing for the core benefit: "${brandVoice.keyBenefit}"` : ""}
${brandVoice.targetUser ? `- Written for this specific audience: "${brandVoice.targetUser}" — no broader claims` : ""}
${brandVoice.avoidWords ? `- Never use these words or phrases: "${brandVoice.avoidWords}"` : ""}
` : ""}
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

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

  // Any paid plan (Pro subscription, Launch Pack lifetime, or AI Pro) gets unlimited generations.
  if (plan === "free") {
    const identifier = session?.user?.id ?? req.headers.get("x-forwarded-for") ?? "anon";
    const usageTotal = await getAiUsageTotal(identifier);
    if (usageTotal >= FREE_LIFETIME_LIMIT) {
      return NextResponse.json(
        { error: "Free AI generations used. Upgrade to Pro for unlimited generations.", limitReached: true },
        { status: 429 },
      );
    }
  }

  // Try models in order — Google retires model versions regularly, so a
  // single hard-coded name is a time bomb. "gemini-flash-latest" is the
  // rolling alias; explicit versions are fallbacks.
  const MODEL_CANDIDATES = [
    "gemini-flash-latest",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
  ];

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

  let lastError: unknown = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleaned = text.replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
      const suggestions = JSON.parse(cleaned);

      if (plan === "free") {
        const identifier = session?.user?.id ?? req.headers.get("x-forwarded-for") ?? "anon";
        await recordAiUsage(identifier);
      }

      return NextResponse.json({ suggestions });
    } catch (e) {
      lastError = e;
      console.error(`Gemini error (model: ${modelName}):`, e);
      // Try the next model on 404/unsupported-model style failures;
      // the loop simply continues for any error since a retry is cheap.
    }
  }

  console.error("All Gemini models failed. Last error:", lastError);
  return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
}

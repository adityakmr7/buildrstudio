import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 });
  }

  const formData = await req.formData();
  const file = formData.get("screenshot") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No screenshot provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mimeType = file.type || "image/png";

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Analyze this app screenshot and suggest App Store marketing copy and styling.

Return ONLY valid JSON (no markdown, no code fences):
{
  "headline": "max 6 words, punchy benefit headline",
  "subtext": "max 12 words, supporting detail",
  "suggestedGradient": "one of: Indigo Dusk, Ocean Breeze, Sunset Blaze, Forest Mist, Night City, Bubblegum, Coral Reef, Mint Fresh, Berry Crush, Deep Space, Rose Gold",
  "textPosition": "top or bottom",
  "category": "the app category you detect"
}`;

  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64, mimeType } },
    ]);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
    const suggestion = JSON.parse(cleaned);
    return NextResponse.json({ suggestion });
  } catch (e) {
    console.error("Auto-layout error:", e);
    return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
  }
}

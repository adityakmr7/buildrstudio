import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

function extractAppStoreId(url: string): { platform: "ios" | "android"; id: string } | null {
  const iosMatch = url.match(/apps\.apple\.com.*?\/id(\d+)/);
  if (iosMatch) return { platform: "ios", id: iosMatch[1] };

  const androidMatch = url.match(/play\.google\.com\/store\/apps\/details\?id=([\w.]+)/);
  if (androidMatch) return { platform: "android", id: androidMatch[1] };

  return null;
}

async function fetchAppStoreInfo(appId: string) {
  const res = await fetch(`https://itunes.apple.com/lookup?id=${appId}&country=us`);
  const data = await res.json();
  const result = data.results?.[0];
  if (!result) return null;
  return {
    name: result.trackName,
    description: result.description,
    category: result.primaryGenreName,
    icon: result.artworkUrl512,
    screenshots: result.screenshotUrls?.slice(0, 5) || [],
    developer: result.artistName,
  };
}

async function fetchPlayStoreInfo(packageId: string) {
  return {
    name: packageId.split(".").pop() || packageId,
    description: `Android app: ${packageId}`,
    category: "General",
    icon: null,
    screenshots: [],
    developer: "",
  };
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const parsed = extractAppStoreId(url);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid App Store or Play Store URL" }, { status: 400 });
  }

  const appInfo = parsed.platform === "ios"
    ? await fetchAppStoreInfo(parsed.id)
    : await fetchPlayStoreInfo(parsed.id);

  if (!appInfo) {
    return NextResponse.json({ error: "App not found" }, { status: 404 });
  }

  let aiSuggestions = null;
  if (process.env.GEMINI_API_KEY && appInfo.description) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `You are an App Store marketing copywriter. Given this app:
- Name: ${appInfo.name}
- Category: ${appInfo.category}
- Description: ${appInfo.description.slice(0, 500)}

Generate exactly 3 screenshot slides. Each has a headline (max 5 words, punchy) and subtext (max 10 words).
Also suggest a gradient from this list: Indigo Dusk, Ocean Breeze, Sunset Blaze, Forest Mist, Night City, Bubblegum, Coral Reef, Mint Fresh, Berry Crush, Deep Space, Rose Gold.

Respond ONLY with valid JSON (no markdown):
{"screens":[{"headline":"...","subtext":"..."}],"gradient":"..."}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "");
      aiSuggestions = JSON.parse(text);
    } catch {
      // AI failed, we'll use fallback copy
    }
  }

  const screens = aiSuggestions?.screens || [
    { headline: appInfo.name, subtext: `Download ${appInfo.name} today.` },
    { headline: "Key Features", subtext: "Everything you need in one app." },
    { headline: "Get Started", subtext: `Available on the ${parsed.platform === "ios" ? "App Store" : "Play Store"}.` },
  ];

  const gradient = aiSuggestions?.gradient || "Indigo Dusk";

  return NextResponse.json({
    appInfo: {
      name: appInfo.name,
      category: appInfo.category,
      icon: appInfo.icon,
      developer: appInfo.developer,
      screenshots: appInfo.screenshots,
    },
    screens,
    gradient,
    platform: parsed.platform,
  });
}

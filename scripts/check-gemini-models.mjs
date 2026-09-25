// Lists which Gemini models your GEMINI_API_KEY can actually call right now.
// Gemini model availability changes over time (old ones get retired, new
// ones ship) — run this before changing DEFAULT_GEMINI_MODEL in
// app/lib/agentRuntime.ts rather than guessing a model name.
//
// Usage: bun scripts/check-gemini-models.mjs
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set (check .env.local).");
  process.exit(1);
}

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
const data = await res.json();

if (!res.ok) {
  console.error("Error", res.status, JSON.stringify(data));
  process.exit(1);
}

console.log("Models that support generateContent for this key:\n");
for (const m of data.models ?? []) {
  if (m.supportedGenerationMethods?.includes("generateContent")) {
    console.log(m.name.replace(/^models\//, ""));
  }
}

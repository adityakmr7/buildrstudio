// Static operational config for the "live" catalog products — system
// prompt, model, and generation params. This is the single source of truth
// for both:
//   1. prisma/seed.ts — seeds the DB-backed Agent/AgentTier rows used by the
//      paid, embeddable widget path (/api/v1/chat).
//   2. app/api/v1/demo/route.ts — the on-site "try it live" demo, which is
//      deliberately DB-free so it works with nothing but GEMINI_API_KEY
//      configured (no Neon/Paddle/auth needed to see an agent respond).
//
// Keep in sync with app/lib/agentCatalog.ts by `slug`. Marketing copy lives
// there; this file is the "how it actually behaves" counterpart.

export interface AgentRuntimeConfig {
  slug: string;
  systemPrompt: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

// Verified working against a real key on 2026-08-22 — gemini-1.5-flash has
// since been retired (404s), and the "-latest" alias was transiently
// overloaded (503) at the time. gemini-2.5-flash is the stable, GA, cheap
// flash-tier model that actually responded. Run
// `bun scripts/check-gemini-models.mjs` before bumping this — Gemini model
// availability changes over time, don't guess a name.
export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

export const AGENT_RUNTIME_CONFIG: Record<string, AgentRuntimeConfig> = {
  "support-agent-starter": {
    slug: "support-agent-starter",
    systemPrompt:
      "You are a helpful, concise customer support agent embedded on a company's website. " +
      "Answer questions using only the context provided to you. If you don't know the answer " +
      "or the question needs a human, say so clearly and suggest the visitor contact support " +
      "directly rather than guessing. Keep replies short — a few sentences at most.",
    model: DEFAULT_GEMINI_MODEL,
    maxTokens: 500,
    temperature: 0.6,
  },
  "rag-knowledge-assistant": {
    slug: "rag-knowledge-assistant",
    systemPrompt:
      "You are an internal knowledge assistant. Answer questions using only the provided " +
      "document context, and cite which source each answer came from where possible. If the " +
      "context doesn't contain the answer, say you don't have that information rather than " +
      "guessing. Keep replies short — a few sentences at most.",
    model: DEFAULT_GEMINI_MODEL,
    maxTokens: 600,
    temperature: 0.4,
  },
};

export function getAgentRuntimeConfig(slug: string): AgentRuntimeConfig | undefined {
  return AGENT_RUNTIME_CONFIG[slug];
}

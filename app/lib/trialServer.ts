// Server-only trial issuance. See app/lib/trial.ts for the limits and
// prisma/schema.prisma's Trial model for the data shape.

import { db } from "./db";
import { generateApiKey } from "./apiKeys";
import { getAgentProduct } from "./agentCatalog";
import { TRIAL_DAYS, TRIAL_MESSAGE_LIMIT } from "./trial";

export type StartTrialResult =
  | { ok: true; apiKeyId: string; alreadyHadKey: boolean }
  | { ok: false; status: number; error: string };

/**
 * Starts a no-card trial of one live agent for a signed-in user.
 *
 * Abuse guards (deliberately basic — this is a Google-sign-in-gated flow):
 *   - one trial per user per agent, ever (DB unique constraint)
 *   - one *active* trial per account at a time
 *   - the existing per-key rate limit in /api/v1/chat still applies
 * If the user already has a key for this agent (e.g. they already paid), no
 * trial is created and their existing key is returned instead.
 */
export async function startTrial(userId: string, agentSlug: string): Promise<StartTrialResult> {
  const product = getAgentProduct(agentSlug);
  if (!product || product.status !== "live") {
    return { ok: false, status: 404, error: "Free trials are only available for live agents." };
  }

  const agent = await db.agent.findUnique({ where: { slug: agentSlug } });
  if (!agent || !agent.isPublic) {
    return { ok: false, status: 404, error: "This agent isn't available yet." };
  }

  // The JWT callback falls back to the email as the id when the DB was
  // unreachable at sign-in; there's no User row to hang a trial on then.
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { ok: false, status: 409, error: "Please sign out and sign in again, then retry." };
  }

  const existingKey = await db.apiKey.findFirst({ where: { userId, agentId: agent.id } });
  if (existingKey) {
    return { ok: true, apiKeyId: existingKey.id, alreadyHadKey: true };
  }

  const previousTrial = await db.trial.findUnique({ where: { userId_agentId: { userId, agentId: agent.id } } });
  if (previousTrial) {
    return { ok: false, status: 409, error: "You've already used the free trial for this agent." };
  }

  const now = new Date();
  const otherActive = await db.trial.findFirst({
    where: { userId, convertedAt: null, endsAt: { gt: now } },
    include: { agent: true },
  });
  if (otherActive && otherActive.messagesUsed < otherActive.messageLimit) {
    return {
      ok: false,
      status: 409,
      error: `You already have an active trial (${otherActive.agent.name}). Finish or upgrade that one first.`,
    };
  }

  const endsAt = new Date(now.getTime() + TRIAL_DAYS * 86_400_000);
  try {
    const key = await db.$transaction(async (tx) => {
      const created = await tx.apiKey.create({
        data: { key: generateApiKey(), userId, agentId: agent.id, name: "Free trial" },
      });
      await tx.trial.create({
        data: { userId, agentId: agent.id, apiKeyId: created.id, messageLimit: TRIAL_MESSAGE_LIMIT, endsAt },
      });
      return created;
    });
    return { ok: true, apiKeyId: key.id, alreadyHadKey: false };
  } catch (err) {
    // Unique-constraint race (double click) — the other request won.
    const code = (err as { code?: string }).code;
    if (code === "P2002") {
      return { ok: false, status: 409, error: "You've already used the free trial for this agent." };
    }
    throw err;
  }
}

/**
 * Called when a paid subscription activates (Paddle webhook). Marks any open
 * trial for this user+agent as converted so the dashboard stops showing
 * trial status. The key itself is kept — the webhook reuses it — so the
 * customer's live embed keeps working without a code change.
 */
export async function markTrialConverted(userId: string, agentId: string) {
  await db.trial.updateMany({
    where: { userId, agentId, convertedAt: null },
    data: { convertedAt: new Date() },
  });
}

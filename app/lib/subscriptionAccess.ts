// What happens when a paid subscription becomes active, shared by every
// payment provider (Paddle webhook, Razorpay webhook + checkout verify), so
// both paths issue access exactly the same way.

import { db } from "./db";
import { generateApiKey } from "./apiKeys";
import { markTrialConverted } from "./trialServer";

/**
 * Makes sure the user has an API key for this agent and marks any free
 * trial for it as converted. Idempotent.
 *
 * If the user has no key for the agent yet, one is created so the dashboard
 * has something to show straight away. A free-trial key counts as "already
 * have one" and is kept as-is, so an embed installed during the trial keeps
 * working after payment.
 */
export async function grantAgentAccess(userId: string, agentId: string) {
  const existingKey = await db.apiKey.findFirst({ where: { userId, agentId } });
  if (!existingKey) {
    await db.apiKey.create({
      data: { key: generateApiKey(), userId, agentId },
    });
  }
  await markTrialConverted(userId, agentId);
}

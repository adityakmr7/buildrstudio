// DB side of the Razorpay path: turn a Razorpay subscription snapshot into
// our AgentSubscription row, and grant access exactly like Paddle does.

import { db } from "./db";
import { AGENT_CATALOG } from "./agentCatalog";
import { grantAgentAccess } from "./subscriptionAccess";
import {
  fetchPlan,
  formatPlanPrice,
  getPlanId,
  isRazorpayEnabled,
  mapSubscriptionStatus,
  periodEnd,
  type RazorpaySubscription,
} from "./razorpay";

function notesOf(sub: RazorpaySubscription): Record<string, string> {
  return sub.notes && !Array.isArray(sub.notes) ? (sub.notes as Record<string, string>) : {};
}

/**
 * Upserts the AgentSubscription for a Razorpay subscription and, when it's
 * active, grants access (API key + trial conversion). Idempotent: safe to
 * call from both the checkout verify route and every webhook delivery.
 *
 * The row is normally created by /api/razorpay/subscribe. If it's missing
 * (e.g. subscription created from the Razorpay dashboard), it's created from
 * the notes { userId, agentId, tierId }, after checking they're real and
 * consistent.
 */
export async function applyRazorpaySubscription(sub: RazorpaySubscription) {
  const status = mapSubscriptionStatus(sub.status);
  const currentPeriodEnd = periodEnd(sub);

  let row = await db.agentSubscription.findUnique({ where: { razorpaySubscriptionId: sub.id } });
  if (!row) {
    const { userId, agentId, tierId } = notesOf(sub);
    if (!userId || !agentId || !tierId) {
      console.error("[razorpay] subscription without a local row or notes:", sub.id);
      return null;
    }
    const tier = await db.agentTier.findUnique({ where: { id: tierId } });
    const user = await db.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!tier || tier.agentId !== agentId || !user) {
      console.error("[razorpay] subscription notes don't match our records:", sub.id);
      return null;
    }
    row = await db.agentSubscription.upsert({
      where: { razorpaySubscriptionId: sub.id },
      update: {},
      create: { userId, agentId, tierId, provider: "razorpay", razorpaySubscriptionId: sub.id, status: "created" },
    });
  }

  const updated = await db.agentSubscription.update({
    where: { id: row.id },
    data: {
      status,
      currentPeriodEnd: currentPeriodEnd ?? undefined,
      razorpayCustomerId: sub.customer_id ?? undefined,
      ...(status === "canceled" ? { cancelAtPeriodEnd: false } : {}),
    },
  });

  if (status === "active") {
    await grantAgentAccess(updated.userId, updated.agentId);
  }
  return updated;
}

export interface InrTierOption {
  tierId: string;
  tierName: string; // "standard" | "pro"
  priceLabel: string; // from the Razorpay plan, e.g. "₹1,499/month"
}

/**
 * INR options for an agent's tiers: only tiers with a configured plan id
 * whose plan could be fetched and is billed in INR. Empty when Razorpay is
 * off. Never throws; a broken plan just hides that tier's INR option.
 */
export async function getInrTierOptions(agentSlug: string): Promise<InrTierOption[]> {
  if (!isRazorpayEnabled()) return [];
  const product = AGENT_CATALOG.find((p) => p.slug === agentSlug);
  if (!product || product.status !== "live") return [];
  const agent = await db.agent.findUnique({ where: { slug: agentSlug }, include: { tiers: true } });
  if (!agent) return [];

  const results = await Promise.all(
    agent.tiers.map(async (tier): Promise<InrTierOption | null> => {
      const planId = getPlanId(agentSlug, tier.name);
      if (!planId) return null;
      try {
        const plan = await fetchPlan(planId);
        if (plan.item.currency !== "INR") {
          console.error(`[razorpay] plan ${planId} is not INR; ignoring.`);
          return null;
        }
        return { tierId: tier.id, tierName: tier.name, priceLabel: formatPlanPrice(plan) };
      } catch (err) {
        console.error(`[razorpay] couldn't load plan ${planId}:`, err);
        return null;
      }
    }),
  );
  return results.filter((r): r is InrTierOption => r !== null);
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { auth } from "../../../auth";
import { db } from "../../lib/db";
import { AGENT_CATALOG } from "../../lib/agentCatalog";
import { computeTrialStatus } from "../../lib/trial";
import { getInrTierOptions, type InrTierOption } from "../../lib/razorpayServer";
import IntegrationsHub, { type IntegrationRow, type TrialOption, type UpgradeTier } from "./IntegrationsHub";

export const metadata: Metadata = {
  title: "Your agents — Buildr Studio",
  robots: { index: false, follow: false },
};

function currentMonth() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

async function getIntegrations(userId: string): Promise<IntegrationRow[]> {
  const month = currentMonth();

  const keys = await db.apiKey.findMany({
    where: { userId },
    include: { agent: { include: { tiers: true } }, trial: true },
    orderBy: { createdAt: "asc" },
  });

  // INR (Razorpay) prices per agent, read from the Razorpay plans. Empty
  // when Razorpay isn't configured.
  const inrBySlug = new Map<string, InrTierOption[]>();
  await Promise.all(
    [...new Set(keys.map((k) => k.agent.slug))].map(async (slug) => {
      inrBySlug.set(slug, await getInrTierOptions(slug).catch(() => []));
    }),
  );

  return Promise.all(
    keys.map(async (key) => {
      const [usage, subscription] = await Promise.all([
        db.usage.findUnique({
          where: { userId_agentId_month: { userId, agentId: key.agentId, month } },
        }),
        db.agentSubscription.findFirst({
          where: { userId, agentId: key.agentId, status: "active" },
          include: { tier: true },
          orderBy: { createdAt: "desc" },
        }),
      ]);

      const product = AGENT_CATALOG.find((p) => p.slug === key.agent.slug);
      const upgradeTiers: UpgradeTier[] = key.agent.tiers
        .map((t) => ({
          id: t.id,
          name: t.name,
          paddlePriceId: t.paddlePriceId,
          priceLabel: product?.tiers.find((pt) => pt.name.toLowerCase() === t.name)?.price ?? null,
          inrPriceLabel: inrBySlug.get(key.agent.slug)?.find((o) => o.tierId === t.id)?.priceLabel ?? null,
        }))
        .sort((a, b) => (a.name === "standard" ? -1 : b.name === "standard" ? 1 : 0));
      const trial = key.trial ? computeTrialStatus(key.trial) : null;
      const onTrial = !!trial && !trial.converted && !subscription;

      return {
        id: key.id,
        agentId: key.agentId,
        apiKey: key.key,
        isActive: key.isActive,
        agentSlug: key.agent.slug,
        agentName: key.agent.name,
        greeting: key.greeting,
        color: key.color,
        position: key.position,
        messageCount: usage?.messageCount ?? 0,
        monthlyLimit: subscription?.tier.monthlyLimit ?? 20,
        tierName: subscription?.tier.name ?? (onTrial ? "trial" : "no plan"),
        subscriptionId: subscription?.id ?? null,
        subscriptionProvider: subscription ? (subscription.provider === "razorpay" ? "razorpay" : "paddle") : null,
        cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd ?? false,
        currentPeriodEnd: subscription?.currentPeriodEnd?.toISOString() ?? null,
        trial: onTrial ? trial : null,
        upgradeTiers,
      };
    }),
  );
}

// Live agents the user can still start a free trial for. Returns an empty
// list while they have an active trial (one at a time).
async function getTrialOptions(userId: string): Promise<TrialOption[]> {
  const liveSlugs = AGENT_CATALOG.filter((p) => p.status === "live").map((p) => p.slug);
  const [agents, keys, trials] = await Promise.all([
    db.agent.findMany({ where: { slug: { in: liveSlugs }, isPublic: true }, select: { id: true, slug: true, name: true } }),
    db.apiKey.findMany({ where: { userId }, select: { agentId: true } }),
    db.trial.findMany({ where: { userId } }),
  ]);
  const hasActiveTrial = trials.some((t) => t.convertedAt === null && !computeTrialStatus(t).expired);
  if (hasActiveTrial) return [];
  const taken = new Set([...keys.map((k) => k.agentId), ...trials.map((t) => t.agentId)]);
  return agents
    .filter((a) => !taken.has(a.id))
    .map((a) => ({ slug: a.slug, name: a.name, tagline: AGENT_CATALOG.find((p) => p.slug === a.slug)?.tagline ?? "" }));
}

export default async function IntegrationsPage() {
  const session = await auth();
  // Belt-and-suspenders — middleware already protects /dashboard/*.
  if (!session?.user?.id) {
    return (
      <div style={{ padding: "80px 24px", textAlign: "center", color: "var(--muted)" }}>
        Please sign in to view your agents.
      </div>
    );
  }

  let rows: IntegrationRow[] = [];
  let trialOptions: TrialOption[] = [];
  let loadError = false;
  try {
    [rows, trialOptions] = await Promise.all([getIntegrations(session.user.id), getTrialOptions(session.user.id)]);
  } catch (err) {
    console.error("[dashboard/integrations] could not load data:", err);
    loadError = true;
  }

  return (
    <Suspense>
      <IntegrationsHub rows={rows} trialOptions={trialOptions} loadError={loadError} userName={session.user.name ?? null} />
    </Suspense>
  );
}

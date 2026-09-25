import type { Metadata } from "next";
import { Suspense } from "react";
import { auth } from "../../../auth";
import { db } from "../../lib/db";
import IntegrationsHub, { type IntegrationRow } from "./IntegrationsHub";

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
    include: { agent: true },
    orderBy: { createdAt: "asc" },
  });

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

      return {
        id: key.id,
        apiKey: key.key,
        isActive: key.isActive,
        agentSlug: key.agent.slug,
        agentName: key.agent.name,
        greeting: key.greeting,
        color: key.color,
        position: key.position,
        messageCount: usage?.messageCount ?? 0,
        monthlyLimit: subscription?.tier.monthlyLimit ?? 20,
        tierName: subscription?.tier.name ?? "trial",
        subscriptionId: subscription?.id ?? null,
      };
    }),
  );
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
  let loadError = false;
  try {
    rows = await getIntegrations(session.user.id);
  } catch (err) {
    console.error("[dashboard/integrations] could not load data:", err);
    loadError = true;
  }

  return (
    <Suspense>
      <IntegrationsHub rows={rows} loadError={loadError} userName={session.user.name ?? null} />
    </Suspense>
  );
}

// Seeds the operational config for each catalog product (system prompt,
// model, tiers). Marketing copy lives in app/lib/agentCatalog.ts; runtime
// config (system prompt, model) lives in app/lib/agentRuntime.ts — this file
// just applies the latter to the database, matched by `slug`. Run via:
//   bunx prisma db seed
//
// Idempotent: safe to re-run (upserts by slug / [agentId, name]).

import { db } from "../app/lib/db";
import { AGENT_CATALOG } from "../app/lib/agentCatalog";
import { getAgentRuntimeConfig } from "../app/lib/agentRuntime";

async function main() {
  for (const product of AGENT_CATALOG) {
    const config = getAgentRuntimeConfig(product.slug);

    const agent = await db.agent.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        category: product.category,
        isPublic: product.status === "live",
        ...(config
          ? {
              systemPrompt: config.systemPrompt,
              model: config.model,
              maxTokens: config.maxTokens,
              temperature: config.temperature,
            }
          : {}),
      },
      create: {
        slug: product.slug,
        name: product.name,
        category: product.category,
        isPublic: product.status === "live",
        systemPrompt:
          config?.systemPrompt ?? "You are a helpful assistant. (System prompt not yet configured.)",
        model: config?.model ?? "gemini-2.5-flash",
        maxTokens: config?.maxTokens ?? 500,
        temperature: config?.temperature ?? 0.7,
      },
    });

    for (const tier of product.tiers) {
      const tierName = tier.name.toLowerCase();
      // Rough default quotas so the product functions before real pricing is
      // locked in — see app/lib/agentCatalog.ts header comment.
      const monthlyLimit = tierName === "pro" ? 2500 : 500;

      await db.agentTier.upsert({
        where: { agentId_name: { agentId: agent.id, name: tierName } },
        update: { monthlyLimit },
        create: { agentId: agent.id, name: tierName, monthlyLimit },
      });
    }

    console.log(`Seeded: ${product.name} (${product.slug})`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

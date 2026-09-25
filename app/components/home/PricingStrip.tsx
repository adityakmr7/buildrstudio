import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { LIVE_AGENTS, COMING_SOON_AGENTS } from "./homeData";
import SectionHeading from "./SectionHeading";

// Prices come straight from app/lib/agentCatalog.ts — nothing is restated here.
export default function PricingStrip() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="border-b border-line bg-raised">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-6 md:py-24 grid-cols-1 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeading index="04" kicker="Pricing" id="pricing-title" title="Priced per agent.">
            <p>Monthly, per agent, billed through Paddle. Full tier details live on each agent&apos;s page.</p>
          </SectionHeading>
        </div>

        <div className="flex flex-col lg:col-span-8">
          <ul className="flex flex-col border-t border-line">
            {LIVE_AGENTS.map((agent) => (
              <li key={agent.slug} className="border-b border-line">
                <Link
                  href={`/agents/${agent.slug}#pricing`}
                  className="group flex flex-col gap-4 rounded-[2px] py-6 transition-colors hover:bg-ink sm:flex-row sm:items-center sm:justify-between sm:px-3"
                >
                  <div>
                    <p className="flex items-center gap-2 text-lg font-semibold tracking-[-0.02em] text-cream">
                      {agent.name}
                      <span className="size-2 rounded-full bg-live" aria-hidden="true" />
                      <span className="sr-only">(available)</span>
                    </p>
                    <p className="mt-1 text-sm text-muted">{agent.category}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                    {agent.tiers.map((tier) => (
                      <div key={tier.name} className="min-w-[120px]">
                        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-faint">{tier.name}</p>
                        <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-cream">{tier.price}</p>
                        <p className="text-[12px] text-faint">{tier.messagesIncluded}</p>
                      </div>
                    ))}
                    <ArrowRight
                      size={16}
                      weight="bold"
                      aria-hidden="true"
                      className="text-faint transition-all group-hover:translate-x-1 group-hover:text-cream"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {COMING_SOON_AGENTS.length > 0 && (
            <p className="mt-6 text-sm text-muted">
              {COMING_SOON_AGENTS.map((a) => a.name).join(" and ")}{" "}
              {COMING_SOON_AGENTS.length > 1 ? "are" : "is"} coming soon, with no pricing set yet.{" "}
              <Link href="/agents" className="link-underline">
                See all agents
              </Link>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight, Play } from "@phosphor-icons/react/dist/ssr";
import ProductFrame from "./ProductFrame";
import { DEMO_AGENT } from "./homeData";
import { TRIAL_DAYS } from "../../lib/trial";

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="border-b border-line">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 pb-16 pt-16 sm:px-6 md:pt-24 grid-cols-1 lg:grid-cols-12 lg:gap-x-16 lg:pb-24">
        <div className="lg:col-span-12">
          <p className="eyebrow flex items-center gap-2">
            <span className="size-2 rounded-full bg-live" aria-hidden="true" />
            AI employees. Ready to hire.
          </p>
          <h1 id="hero-title" className="display mt-6 text-hero">
            Skip the build.
            <br />
            Keep the <span className="brass-underline">control.</span>
          </h1>
        </div>

        <div className="flex flex-col gap-10 lg:col-span-5 lg:pt-6">
          <p className="body-copy text-[17px] leading-[1.6] sm:text-lg">
            Deploy a pre-built agent for customer support or internal knowledge in minutes. One script tag.
            No AI team required. Try any live agent free for {TRIAL_DAYS} days, no card.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/agents" className="btn-primary">
              Browse agents
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </Link>
            <Link href={`/agents/${DEMO_AGENT.slug}#demo`} className="btn-secondary">
              <Play size={14} weight="fill" aria-hidden="true" />
              See it live
            </Link>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 text-sm">
            <div>
              <dt className="text-faint">Install</dt>
              <dd className="mt-1 text-cream">One script tag</dd>
            </div>
            <div>
              <dt className="text-faint">Works on</dt>
              <dd className="mt-1 text-cream">HTML, WordPress, React, Vue</dd>
            </div>
            <div>
              <dt className="text-faint">You set</dt>
              <dd className="mt-1 text-cream">Knowledge, greeting, color, position</dd>
            </div>
            <div>
              <dt className="text-faint">You skip</dt>
              <dd className="mt-1 text-cream">SDKs and build steps</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          <ProductFrame />
        </div>
      </div>
    </section>
  );
}

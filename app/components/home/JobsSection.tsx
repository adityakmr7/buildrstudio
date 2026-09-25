import Link from "next/link";
import {
  Headset,
  Browser,
  Database,
  GearSix,
  Target,
  Megaphone,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import type { Outcome } from "../../lib/agentCatalog";
import { JOBS, type JobStatus } from "./homeData";
import SectionHeading from "./SectionHeading";

const ICONS: Record<Outcome, Icon> = {
  "customer-support": Headset,
  "website-assistant": Browser,
  knowledge: Database,
  operations: GearSix,
  sales: Target,
  marketing: Megaphone,
};

function Status({ status }: { status: JobStatus }) {
  if (status === "available") {
    return (
      <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-live">
        <span className="size-2 rounded-full bg-live" aria-hidden="true" />
        Available
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-faint">
      <span className="size-2 rounded-full border border-faint" aria-hidden="true" />
      {status === "coming-soon" ? "Coming soon" : "Not built yet"}
    </span>
  );
}

export default function JobsSection() {
  const [lead, ...rest] = JOBS;
  const LeadIcon = ICONS[lead.outcome];

  return (
    <section id="jobs" aria-labelledby="jobs-title" className="border-b border-line">
      {/* Keeps older /#solutions links landing here. */}
      <span id="solutions" aria-hidden="true" />
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-6 md:py-24 grid-cols-1 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-10 lg:col-span-5">
          <SectionHeading index="01" kicker="Jobs" id="jobs-title" title="What do you need AI to do?">
            <p>
              Pick the job first. Each row links to the agent that does it today, or tells you straight that we
              haven&apos;t built it yet.
            </p>
          </SectionHeading>

          {/* Lead job gets the editorial treatment */}
          <Link
            href={lead.href}
            className="card group flex flex-col gap-6 p-6 transition-colors hover:border-line-strong"
          >
            <div className="flex items-center justify-between">
              <LeadIcon size={28} weight="light" className="text-cream" aria-hidden="true" />
              <Status status={lead.status} />
            </div>
            <div>
              <p className="font-mono text-[12px] text-faint">01 · {lead.label}</p>
              <p className="mt-2 text-[22px] font-semibold leading-[1.2] tracking-[-0.03em] text-cream">{lead.job}</p>
              <p className="mt-3 text-[15px] text-muted">{lead.outcomeLine}</p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-cream">
              {lead.agentName}
              <ArrowUpRight
                size={14}
                weight="bold"
                aria-hidden="true"
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        </div>

        <ol className="flex flex-col border-t border-line lg:col-span-7 lg:mt-16">
          {rest.map((job, i) => {
            const JobIcon = ICONS[job.outcome];
            return (
              <li key={job.outcome} className="border-b border-line">
                <Link
                  href={job.href}
                  className="group grid grid-cols-[40px_1fr_auto] items-start gap-x-4 gap-y-2 rounded-[2px] py-6 transition-colors hover:bg-raised sm:grid-cols-[40px_24px_1fr_auto] sm:px-3"
                >
                  <span className="font-mono text-[12px] leading-6 text-faint">{String(i + 2).padStart(2, "0")}</span>
                  <JobIcon size={22} weight="light" className="hidden text-cream sm:block" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-lg font-semibold tracking-[-0.02em] text-cream">{job.label}</span>
                      <span className="text-[15px] text-muted">{job.job}</span>
                    </p>
                    <p className="mt-2 text-sm text-faint">
                      {job.agentName ? (
                        <>
                          <span className="text-muted">{job.agentName}.</span> {job.outcomeLine}
                        </>
                      ) : (
                        job.outcomeLine
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <Status status={job.status} />
                    <ArrowUpRight
                      size={16}
                      weight="bold"
                      aria-hidden="true"
                      className="text-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cream"
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

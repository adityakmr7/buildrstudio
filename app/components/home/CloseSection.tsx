import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export default function CloseSection() {
  return (
    <section aria-labelledby="close-title">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-16 sm:px-6 md:py-24 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-6">
          <h2 id="close-title" className="display text-[clamp(40px,6vw,80px)] leading-[0.98]">
            Pick an agent.
            <br />
            Ship it today.
          </h2>
          <p className="body-copy text-base">
            Questions, or need a job we haven&apos;t built yet? Write to{" "}
            <a href="mailto:hello@buildrstudio.in" className="link-underline">
              hello@buildrstudio.in
            </a>
            .
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/agents" className="btn-primary">
            Browse agents
            <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </Link>
          <a href="mailto:hello@buildrstudio.in" className="btn-secondary">
            Email us
          </a>
        </div>
      </div>
    </section>
  );
}

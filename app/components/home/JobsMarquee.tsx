import { MARQUEE_JOBS } from "./homeData";

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {MARQUEE_JOBS.map((job) => (
        <li key={job} className="flex items-center">
          <span className="px-6 text-[clamp(28px,4vw,48px)] font-semibold tracking-[-0.04em] text-cream/85">{job}</span>
          <span className="text-faint" aria-hidden="true">
            ·
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Jobs, not logos. Slow CSS scroll; static under prefers-reduced-motion. */
export default function JobsMarquee() {
  return (
    <section aria-label="Jobs an agent can do" className="overflow-hidden border-b border-line bg-raised py-6">
      <div className="flex w-max animate-marquee">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}

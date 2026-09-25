import { Check, Minus } from "@phosphor-icons/react/dist/ssr";
import SectionHeading from "./SectionHeading";

const BUILD = [
  "Weeks of RAG plumbing: chunking, embeddings, retrieval",
  "Prompt tuning until answers stop drifting",
  "A chat widget that survives someone else's CSS",
  "Rate limits, usage caps, hosting, and on-call",
];

const BUY = [
  "Pick an agent from the catalog",
  "Add your knowledge: paste text or upload .txt / .md",
  "Set your greeting, brand color, and widget position",
  "Paste one script tag and ship today",
];

export default function BuyVsBuild() {
  return (
    <section aria-labelledby="compare-title" className="border-b border-line">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-16 sm:px-6 md:py-24">
        <SectionHeading index="03" kicker="Trade-off" id="compare-title" title="Buy it vs build it." />

        <div className="grid gap-px overflow-hidden rounded-[2px] border border-line bg-line md:grid-cols-2">
          <div className="bg-ink p-6 md:p-10">
            <p className="eyebrow">Build it yourself</p>
            <ul className="mt-6 flex flex-col gap-4">
              {BUILD.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-[1.5] text-muted">
                  <Minus size={16} className="mt-1 shrink-0 text-faint" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-raised p-6 md:p-10">
            <p className="eyebrow text-cream">Buy it from BuildrStudio</p>
            <ul className="mt-6 flex flex-col gap-4">
              {BUY.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-[1.5] text-cream">
                  <Check size={16} weight="bold" className="mt-1 shrink-0 text-cream" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

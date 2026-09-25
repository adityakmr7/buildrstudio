import { Plus } from "@phosphor-icons/react/dist/ssr";
import SectionHeading from "./SectionHeading";

// Only answers that can be verified against the code in this repo:
//   - agents only run inside the embed widget (public/widget.js, /api/v1/chat)
//   - knowledge: app/lib/knowledge.ts + /api/keys/[id]/knowledge (plain text,
//     .txt/.md, chunked + embedded, stored per API key in the app database)
//   - brand color / greeting / position: window.BuildrAgentConfig in
//     public/widget.js (also editable in the dashboard's Widget config)
//   - stacks: plain <script> tag appended to <body>, Shadow DOM isolated
export const FAQS: { q: string; a: string }[] = [
  {
    q: "Does it post or send anything for me?",
    a: "No. The live agents answer questions inside the chat widget on your own site. They don't post to social media, send email, or publish anything on your behalf.",
  },
  {
    q: "Where does my knowledge live?",
    a: "You add it from your dashboard by pasting text or uploading .txt or .md files. We split it into chunks, create embeddings, and store them in the BuildrStudio database against your API key. The agent pulls the most relevant chunks when it answers. PDFs and website crawling aren't supported yet.",
  },
  {
    q: "Can I match my brand color?",
    a: "Yes. The widget takes a brand color, a greeting, and a position (bottom-right or bottom-left). Set them with a small window.BuildrAgentConfig object placed before the script tag.",
  },
  {
    q: "What stacks does it work on?",
    a: "Anything that can render a script tag: plain HTML, WordPress, React, Vue, and the rest. There's no SDK and no build step, and the widget runs in a Shadow DOM so your styles and ours stay separate.",
  },
];

export default function FaqSection() {
  return (
    <section aria-labelledby="faq-title" className="border-b border-line">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-6 md:py-24 grid-cols-1 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeading index="05" kicker="FAQ" id="faq-title" title="Straight answers." />
        </div>
        <div className="border-t border-line lg:col-span-8">
          {FAQS.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-[2px] py-6 text-lg font-semibold tracking-[-0.02em] text-cream transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus
                  size={16}
                  weight="bold"
                  aria-hidden="true"
                  className="shrink-0 text-faint transition-transform group-open:rotate-45"
                />
              </summary>
              <p className="body-copy pb-6 text-[15px] leading-[1.7]">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

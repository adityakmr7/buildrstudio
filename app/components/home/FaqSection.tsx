import { Plus } from "@phosphor-icons/react/dist/ssr";
import SectionHeading from "./SectionHeading";
import { TRIAL_DAYS, TRIAL_MESSAGE_LIMIT } from "../../lib/trial";

// Only answers that can be verified against the code in this repo:
//   - agents only run inside the embed widget (public/widget.js, /api/v1/chat)
//   - knowledge: app/lib/knowledge.ts + /api/keys/[id]/knowledge (plain text,
//     .txt/.md, chunked + embedded, stored per API key in the app database)
//     and app/lib/websiteKnowledge.ts (crawl a URL/sitemap, up to 50 pages)
//   - brand color / greeting / position: dashboard Widget config, served by
//     /api/v1/config to public/widget.js; window.BuildrAgentConfig overrides
//   - stacks: plain <script> tag appended to <body>, Shadow DOM isolated
//   - free trial: app/lib/trial.ts limits, enforced in /api/v1/chat
//   - leads: app/lib/leads.ts (dashboard, optional email via Resend, webhook)
export const FAQS: { q: string; a: string }[] = [
  {
    q: "Can I try it before paying?",
    a: `Yes. Every live agent has a ${TRIAL_DAYS}-day free trial with ${TRIAL_MESSAGE_LIMIT} messages, and you don't need a card. Sign in with Google, start the trial from the agent's page or your dashboard, and put the embed code on your real site. When it ends, the widget stops replying until you choose a plan. Upgrading keeps the same key, so you don't have to touch your site again.`,
  },
  {
    q: "Does it post or send anything for me?",
    a: "No. The live agents answer questions inside the chat widget on your own site. They don't post to social media, email your customers, or publish anything on your behalf. The one thing they send is to you: when a visitor leaves their details for a callback, you get the lead in your dashboard, and optionally at your own webhook.",
  },
  {
    q: "Where does my knowledge live?",
    a: "You add it from your dashboard: paste text, upload .txt or .md files, or give us your website URL or sitemap.xml and we'll read up to 50 pages from it (respecting robots.txt). We split it into chunks, create embeddings, and store them in the BuildrStudio database against your API key. The agent pulls the most relevant chunks when it answers. Hit Re-sync when your site changes. PDFs aren't supported yet.",
  },
  {
    q: "Can I match my brand color?",
    a: "Yes. The widget takes a brand color, a greeting, and a position (bottom-right or bottom-left). Set them in your dashboard and the widget picks them up, no code change. You can also override them per page with a small window.BuildrAgentConfig object placed before the script tag.",
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

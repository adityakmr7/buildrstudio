import { EMBED_SNIPPET } from "./homeData";
import SectionHeading from "./SectionHeading";

export const WORDPRESS_PLUGIN_ZIP = "/downloads/buildrstudio-wordpress.zip";

const STACKS: { name: string; how: string; link?: { href: string; label: string } }[] = [
  { name: "Plain HTML", how: "Paste it before the closing </body> tag." },
  {
    name: "WordPress",
    how: "Install our free plugin and paste your agent ID and key in Settings. Or put the tag in your theme footer.",
    link: { href: WORDPRESS_PLUGIN_ZIP, label: "Download plugin (.zip)" },
  },
  { name: "React", how: "Drop it into index.html or your root layout. No package to install." },
  { name: "Vue", how: "Same as React: one line in index.html." },
];

export default function EmbedSection() {
  return (
    <section aria-labelledby="embed-title" className="border-b border-line bg-raised">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-6 md:py-24 grid-cols-1 lg:grid-cols-12 lg:gap-16">
        <div className="min-w-0 lg:col-span-5">
          <SectionHeading index="02" kicker="Install" id="embed-title" title="One script tag. Any stack.">
            <p>
              No SDK, no build step, no npm install. The widget renders in its own Shadow DOM, so your site&apos;s CSS
              and ours never collide.
            </p>
          </SectionHeading>
        </div>

        <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
          <div className="overflow-hidden rounded-[2px] border border-line bg-ink">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="font-mono text-[12px] text-faint">index.html</span>
              <span className="font-mono text-[12px] text-faint">1 tag</span>
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-[1.7] text-cream sm:p-6 sm:text-sm">
              <code>{EMBED_SNIPPET}</code>
            </pre>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-[2px] border border-line bg-line sm:grid-cols-2">
            {STACKS.map((stack) => (
              <li key={stack.name} className="bg-raised p-4">
                <p className="text-[15px] font-semibold tracking-[-0.01em] text-cream">{stack.name}</p>
                <p className="mt-1 text-sm text-muted">{stack.how}</p>
                {stack.link && (
                  <a
                    href={stack.link.href}
                    download
                    className="mt-2 inline-block text-sm font-medium text-brass underline underline-offset-4 hover:text-cream"
                  >
                    {stack.link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

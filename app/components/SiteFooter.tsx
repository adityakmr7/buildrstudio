import Link from "next/link";
import Wordmark from "./Wordmark";

const FOOTER_LINKS = [
  { label: "Agents", href: "/agents" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "hello@buildrstudio.in", href: "mailto:hello@buildrstudio.in" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <Wordmark />
          <p className="text-[13px] text-faint">AI employees for your business. A BuildrStudio product.</p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-quiet rounded-[2px] text-[13px]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-[13px] text-faint">© {new Date().getFullYear()} BuildrStudio</p>
      </div>
    </footer>
  );
}

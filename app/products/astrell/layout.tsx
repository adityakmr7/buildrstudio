import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "../../lib/siteConfig";
import "./astrell.css";

export default function AstrellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="astrell-site">
      <a className="astrell-skip" href="#astrell-main">Skip to content</a>
      <header className="astrell-nav astrell-wrap">
        <Link className="astrell-wordmark" href="/products/astrell">
          <Image src="/astrell/icon.png" width={36} height={36} alt="" />
          Astrell
        </Link>
        <nav aria-label="Astrell navigation">
          <Link href="/products/astrell#features">Features</Link>
          <Link href="/products/astrell/help">Help</Link>
          <Link href="/">BuildrStudio ↗</Link>
        </nav>
      </header>
      {children}
      <footer className="astrell-footer astrell-wrap">
        <div><Link className="astrell-wordmark" href="/products/astrell">Astrell</Link><p>Make space for focus.</p></div>
        <nav aria-label="Astrell information">
          <Link href="/products/astrell/privacy">Privacy</Link>
          <Link href="/products/astrell/help">Help & support</Link>
          <a href={`mailto:${siteConfig.contact.email}?subject=Astrell%20support`}>Contact</a>
          <Link href="/">By BuildrStudio ↗</Link>
        </nav>
      </footer>
    </div>
  );
}

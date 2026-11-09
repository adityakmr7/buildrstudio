import Link from "next/link";
import Image from "next/image";
import "./bothside.css";
export default function BothSideLayout({ children }: { children: React.ReactNode }) {
 return <div className="bs-site"><a className="bs-skip" href="#bothside-main">Skip to content</a><header className="bs-nav bs-wrap"><Link className="bs-logo" href="/products/both-side"><Image src="/both-side/icon.png" width={32} height={32} alt="" />BothSide</Link><nav aria-label="BothSide navigation"><Link href="/products/both-side#features">Features</Link><Link href="/products/both-side/help">Help</Link><Link className="bs-studio" href="/">By BuildrStudio ↗</Link></nav></header>{children}<footer className="bs-footer bs-wrap"><div><Link className="bs-logo" href="/products/both-side">BothSide<span className="bs-dot" /></Link><p>A product by <Link href="/">BuildrStudio</Link>.</p></div><nav aria-label="Product information"><Link href="/products/both-side/privacy">Privacy</Link><Link href="/products/both-side/help">Help & support</Link><a href="mailto:hello@buildrstudio.in?subject=BothSide">Contact ↗</a></nav></footer></div>;
}

import Link from "next/link";
import Wordmark from "../../components/Wordmark";
import "./pulse.css";
export default function PulseLayout({ children }: { children: React.ReactNode }) {
 return <div className="pulse-site"><header className="pulse-nav"><Wordmark /><nav aria-label="Pulseflip navigation"><Link href="/products/pulse-flip">Pulseflip</Link><Link href="/products/pulse-flip/support">Support</Link></nav></header>{children}<footer className="pulse-footer"><span>Pulseflip · By BuildrStudio</span><nav aria-label="Product information"><Link href="/products/pulse-flip/privacy">Privacy</Link><Link href="/products/pulse-flip/terms">Terms</Link><Link href="/products/pulse-flip/support">Support</Link></nav></footer></div>;
}

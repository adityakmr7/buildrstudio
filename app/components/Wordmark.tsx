import Link from "next/link";
import Image from "next/image";

export default function Wordmark({ className = "" }: { className?: string }) {
  return <Link href="/" aria-label="BuildrStudio home" className={className} style={{ display: "inline-flex", alignItems: "center", gap: 9, color: "var(--text)", fontSize: 21, fontWeight: 650, letterSpacing: -0.8 }}><Image src="/brand/assets/buildrstudio-mark.svg" alt="" width={30} height={30} />buildrstudio</Link>;
}

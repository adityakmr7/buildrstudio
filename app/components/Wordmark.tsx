import Link from "next/link";

/** Square brass "B" mark + BuildrStudio lockup. */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="BuildrStudio home"
      className={`group inline-flex items-center gap-2 rounded-[2px] text-cream ${className}`}
    >
      <span
        aria-hidden="true"
        className="grid size-6 place-items-center rounded-[2px] bg-brass font-mono text-[13px] font-bold leading-none text-ink"
      >
        B
      </span>
      <span className="text-[15px] font-semibold tracking-[-0.02em] transition-colors group-hover:text-white">
        BuildrStudio
      </span>
    </Link>
  );
}

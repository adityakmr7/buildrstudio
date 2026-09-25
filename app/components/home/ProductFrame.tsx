import { PaperPlaneRight, X, LockSimple } from "@phosphor-icons/react/dist/ssr";

/**
 * Pure HTML/CSS illustration of the embed widget open on a small-business
 * site. Decorative: the real, working demo lives on each live agent page.
 * Fixed aspect ratio so it never causes layout shift.
 */
export default function ProductFrame() {
  return (
    <figure
      aria-label="Illustration: the BuildrStudio chat widget open on a small business website"
      className="relative w-full select-none"
    >
      <div className="overflow-hidden rounded-[2px] border border-line bg-raised shadow-[0_24px_64px_-24px_rgba(0,0,0,0.8)]">
        {/* Browser chrome */}
        <div className="flex h-10 items-center gap-3 border-b border-line bg-raised-2 px-3" aria-hidden="true">
          <div className="flex gap-2">
            <span className="size-2 rounded-full bg-[#3a352b]" />
            <span className="size-2 rounded-full bg-[#3a352b]" />
            <span className="size-2 rounded-full bg-[#3a352b]" />
          </div>
          <div className="flex h-6 flex-1 items-center gap-2 rounded-[2px] bg-ink px-3 font-mono text-[11px] text-faint">
            <LockSimple size={10} weight="bold" />
            yourstore.in
          </div>
        </div>

        {/* Small-business page behind the widget */}
        <div className="relative aspect-[4/3.4] overflow-hidden bg-[#f1ebdf] text-[#2a261f] sm:aspect-[4/3]" aria-hidden="true">
          <div className="flex items-center justify-between border-b border-[#2a261f]/10 px-4 py-3">
            <span className="text-[13px] font-semibold tracking-[-0.02em]">Your Store</span>
            <div className="hidden gap-4 text-[11px] text-[#2a261f]/70 sm:flex">
              <span>Shop</span>
              <span>Shipping</span>
              <span>Contact</span>
            </div>
          </div>
          <div className="px-4 pt-6 sm:px-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#2a261f]/60">Handmade, shipped across India</p>
            <p className="mt-2 max-w-[16ch] text-[22px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[28px]">
              Everyday ceramics, made in small batches.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="rounded-[4px] bg-[#2a261f] px-3 py-2 text-[11px] font-medium text-[#f1ebdf]">Shop now</span>
              <span className="rounded-[4px] border border-[#2a261f]/20 px-3 py-2 text-[11px] font-medium">Our story</span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 opacity-80">
              <span className="aspect-square rounded-[2px] bg-[#e2d8c4]" />
              <span className="aspect-square rounded-[2px] bg-[#d9ccb3]" />
              <span className="aspect-square rounded-[2px] bg-[#e7dfcf]" />
            </div>
          </div>

          {/* The widget */}
          <div className="absolute bottom-3 right-3 flex w-[min(78%,300px)] flex-col overflow-hidden rounded-[12px] border border-black/10 bg-white text-[#1a1a1a] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)] sm:bottom-4 sm:right-4">
            <div className="flex items-center justify-between bg-[#1f1c16] px-3 py-2 text-white">
              <span className="flex items-center gap-2 text-[12px] font-semibold">
                <span className="size-2 rounded-full bg-live" />
                Support
              </span>
              <X size={12} weight="bold" className="opacity-80" />
            </div>
            <div className="flex flex-col gap-2 bg-[#faf8f4] p-3 text-[11.5px] leading-[1.45]">
              <p className="max-w-[88%] self-start rounded-[10px] rounded-bl-[3px] border border-[#eaeaea] bg-white px-3 py-2">
                Hi! How can I help you today?
              </p>
              <p className="max-w-[88%] self-end rounded-[10px] rounded-br-[3px] bg-[#1f1c16] px-3 py-2 text-white">
                Do you ship to Pune? How long does it take?
              </p>
              <p className="max-w-[88%] self-start rounded-[10px] rounded-bl-[3px] border border-[#eaeaea] bg-white px-3 py-2">
                Yes, we ship across India. Pune orders usually arrive in 3 to 5 working days. Want me to check your pin code?
              </p>
            </div>
            <div className="flex items-center gap-2 border-t border-[#eee] bg-white p-2">
              <span className="flex-1 rounded-[8px] border border-[#e5e5e5] px-2 py-1 text-[11px] text-[#8a8a8a]">Type a message…</span>
              <span className="grid size-6 place-items-center rounded-[6px] bg-[#1f1c16] text-white">
                <PaperPlaneRight size={11} weight="fill" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 font-mono text-[11px] text-faint">
        Illustration. The widget takes your greeting, brand color, and position.
      </figcaption>
    </figure>
  );
}

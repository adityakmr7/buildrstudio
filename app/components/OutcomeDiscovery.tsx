import Link from "next/link";
import { Headset, Target, Browser, Database, GearSix, Megaphone } from "@phosphor-icons/react";
import type { Outcome } from "../lib/agentCatalog";

// "What do you need AI to do?" — problem-first discovery, shown right after
// the hero. Every card routes into /agents?outcome=<slug>, which filters the
// real catalog (see AgentsCatalogHub.tsx). Two of these six outcomes (Sales,
// Marketing) currently match zero real products — that lands on an honest
// "not built yet" empty state there rather than a fake product card. Do not
// add fabricated agents here; extend app/lib/agentCatalog.ts instead once a
// real product exists for a gap.
const OUTCOMES: { slug: Outcome; icon: typeof Headset; title: string; description: string }[] = [
  { slug: "customer-support", icon: Headset, title: "Customer Support", description: "Answer customer questions 24/7." },
  { slug: "sales", icon: Target, title: "Sales", description: "Qualify leads and help visitors find the right product." },
  { slug: "website-assistant", icon: Browser, title: "Website Assistant", description: "Explain your product and guide visitors." },
  { slug: "knowledge", icon: Database, title: "Knowledge", description: "Search documents, FAQs, and internal information." },
  { slug: "operations", icon: GearSix, title: "Operations", description: "Automate repetitive business workflows." },
  { slug: "marketing", icon: Megaphone, title: "Marketing", description: "Research, write, repurpose, and assist with marketing." },
];

export default function OutcomeDiscovery() {
  return (
    <section id="solutions" style={{ padding: "24px 24px 72px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontSize: "clamp(24px, 3.2vw, 36px)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)", margin: "0 0 10px" }}>
            What do you need AI to do?
          </h2>
          <p style={{ fontSize: 14.5, color: "var(--muted)", maxWidth: "46ch", margin: "0 auto" }}>
            Tell us the problem — we&apos;ll point you at the agent that solves it.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="outcome-grid">
          {OUTCOMES.map((outcome) => (
            <Link
              key={outcome.slug}
              href={`/agents?outcome=${outcome.slug}`}
              className="outcome-card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: 22,
                borderRadius: 14,
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                }}
              >
                <outcome.icon size={20} weight="duotone" />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", margin: "0 0 4px" }}>{outcome.title}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--muted)", margin: 0 }}>{outcome.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .outcome-card:hover { border-color: var(--border-strong) !important; box-shadow: 0 8px 24px rgba(15,23,42,0.06); }
        @media (max-width: 900px) {
          .outcome-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .outcome-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

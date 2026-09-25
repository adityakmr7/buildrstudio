import { AGENT_CATALOG, type AgentProduct, type Outcome } from "../../lib/agentCatalog";

// Homepage-only presentation data. Everything about which agents exist,
// whether they are live, and what they cost is DERIVED from
// app/lib/agentCatalog.ts — nothing here restates catalog facts.

export type JobStatus = "available" | "coming-soon" | "not-built";

export interface Job {
  outcome: Outcome;
  label: string;
  job: string;
  outcomeLine: string;
  status: JobStatus;
  href: string;
  agentName: string | null;
}

const JOB_COPY: { outcome: Outcome; label: string; job: string; outcomeLine: string }[] = [
  {
    outcome: "customer-support",
    label: "Support",
    job: "Answer customer questions on your site, any hour.",
    outcomeLine: "Repeat questions stop landing in your inbox.",
  },
  {
    outcome: "website-assistant",
    label: "Website",
    job: "Explain your product and guide visitors to the right page.",
    outcomeLine: "Visitors get answers without digging through menus.",
  },
  {
    outcome: "knowledge",
    label: "Knowledge",
    job: "Answer from your internal docs, with sources.",
    outcomeLine: "Your team stops asking the same thing twice.",
  },
  {
    outcome: "operations",
    label: "Ops",
    job: "Run a repetitive workflow like lead routing or invoice processing.",
    outcomeLine: "Fewer manual hand-offs between tools.",
  },
  {
    outcome: "sales",
    label: "Sales",
    job: "Qualify leads and help visitors pick the right product.",
    outcomeLine: "Not built yet. Tell us what you need.",
  },
  {
    outcome: "marketing",
    label: "Marketing",
    job: "Research, write, and repurpose marketing content.",
    outcomeLine: "Not built yet. Tell us what you need.",
  },
];

function agentsFor(outcome: Outcome): AgentProduct[] {
  return AGENT_CATALOG.filter((p) => p.outcomes.includes(outcome));
}

export const JOBS: Job[] = JOB_COPY.map((copy) => {
  const matches = agentsFor(copy.outcome);
  const live = matches.find((p) => p.status === "live");
  const target = live ?? matches[0];
  const status: JobStatus = live ? "available" : matches.length > 0 ? "coming-soon" : "not-built";
  return {
    ...copy,
    status,
    // Real routes only: the matching agent's page, or the catalog filtered
    // to this outcome (which shows an honest "not built yet" state).
    href: target ? `/agents/${target.slug}` : `/agents?outcome=${copy.outcome}`,
    agentName: target ? target.name : null,
  };
});

export const MARQUEE_JOBS = ["Support", "Sales", "Website", "Knowledge", "Ops", "Marketing"];

export const LIVE_AGENTS = AGENT_CATALOG.filter((p) => p.status === "live");
export const COMING_SOON_AGENTS = AGENT_CATALOG.filter((p) => p.status === "coming-soon");

/** First live agent with an on-page demo — used for "See it live". */
export const DEMO_AGENT = LIVE_AGENTS[0] ?? AGENT_CATALOG[0];

// Same snippet format the dashboard hands out (IntegrationsHub.tsx) and
// public/widget.js documents. The key is a placeholder you get after
// subscribing.
export const EMBED_SNIPPET = `<script src="https://buildrstudio.in/widget.js"
  data-agent-id="${DEMO_AGENT.slug}"
  data-key="pk_live_xxxxxxxx"></script>`;

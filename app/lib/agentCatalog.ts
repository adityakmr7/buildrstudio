// ─────────────────────────────────────────────────────────────────────────
// Marketplace agent catalog — see docs/buildr-studio-agent-storefront-plan.md
// (Section 10, decisions log) for how this evolved.
//
// This is the marketing/display layer only — name, copy, tiers shown on
// /agents and /agents/[slug]. The operational config each agent actually
// runs on (systemPrompt, model, token limits) lives in the database
// (see prisma/schema.prisma `Agent` model + prisma/seed.ts), seeded with
// matching `slug` values. Keep the two in sync when adding a product.
//
// Phase 1 launch picks (2026-08-20): Support Agent Starter and RAG Knowledge
// Assistant are `status: "live"` — the two most in-demand categories, a
// judgment call rather than SOW-backed data (still worth verifying). The
// other two stay `"coming-soon"`.
//
// Pricing for the two live agents ($19/mo Standard, $49/mo Pro) was set
// 2026-08-26 and provisioned in Paddle *sandbox* via the Paddle MCP — see
// docs/buildr-studio-agent-storefront-plan.md Section 10 for the product/
// price IDs. Still not live in production Paddle (that needs authenticating
// `paddle-live` and deciding these numbers are final, not just sandbox-
// tested). The two "coming-soon" products still have no pricing at all.
// Message-count limits shown here are product packaging, wired to real
// enforcement via AgentTier.monthlyLimit in the database.
// ─────────────────────────────────────────────────────────────────────────

export type CatalogStatus = "live" | "coming-soon";
export type CatalogCategory = "Support" | "Knowledge" | "Automation" | "Multi-Agent";

// The 6 "what do you need AI to do?" outcomes shown on the homepage discovery
// section (see app/components/OutcomeDiscovery.tsx). Not every outcome has a
// real product behind it yet — "sales" and "marketing" currently match zero
// catalog entries, and that's shown honestly (a "not built yet" state, not a
// fake product) rather than inventing agents that don't exist.
export type Outcome =
  | "customer-support"
  | "sales"
  | "website-assistant"
  | "knowledge"
  | "operations"
  | "marketing";

// The 9 business types shown as filter chips on /agents (see
// app/components/BusinessTypeSelector.tsx). With only 4 general-purpose
// products in the catalog, this re-sorts rather than hard-filters — see
// AgentsCatalogHub.tsx.
export type BusinessType =
  | "SaaS"
  | "E-commerce"
  | "Agency"
  | "Freelancer"
  | "Local business"
  | "Startup"
  | "Creator"
  | "Developer tool"
  | "Other";

export interface PricingTier {
  name: string;
  price: string; // "Pricing TBD" until plan Section 9 decision #2 is resolved
  messagesIncluded: string; // e.g. "500 messages / month" — packaging, not $ pricing
  features: string[];
}

export interface AgentProduct {
  slug: string;
  name: string;
  tagline: string;
  category: CatalogCategory;
  icon: "Robot" | "FlowArrow" | "Brain" | "Database";
  accent: string;
  accentBg: string;
  status: CatalogStatus;
  precedent: string;
  whoFor: string;
  prebuilt: string; // what comes ready out of the box
  configurable: string; // what you set up yourself post-purchase
  description: string;
  whatsIncluded: string[];
  installTime: string;
  tiers: PricingTier[];
  faq: { question: string; answer: string }[];
  // Which "what do you need AI to do?" outcomes this product genuinely
  // serves — used by OutcomeDiscovery + the /agents ?outcome= filter.
  outcomes: Outcome[];
  // Which business types this suits — used by BusinessTypeSelector to
  // re-rank (not filter out) the catalog. Tagged honestly: these are
  // general-purpose agents, not vertical-specific builds.
  businessTypes: BusinessType[];
  // Real, currently-supported knowledge sources only — see
  // app/lib/knowledge.ts. Do not list PDF/Notion/website-crawl; none of
  // those exist yet.
  connectsTo: string[];
  // Realistic prompts shown as clickable chips in the live demo.
  suggestedQuestions: string[];
}

export const AGENT_CATALOG: AgentProduct[] = [
  {
    slug: "support-agent-starter",
    name: "Support Agent Starter",
    tagline: "A context-aware support agent that deflects tickets before they reach your team.",
    category: "Support",
    icon: "Robot",
    accent: "#2563EB",
    accentBg: "rgba(37,99,235,0.07)",
    status: "live",
    precedent: "Distilled from our highest-performing support-deflection build.",
    whoFor: "Support/CX teams drowning in repetitive tickets.",
    prebuilt: "Conversational engine, escalation logic, retrieval pipeline, embeddable widget.",
    configurable: "Your knowledge base, tone/greeting, brand color, and helpdesk handoff.",
    description:
      "A conversational agent trained on your docs and tuned to your product's tone, with clear escalation rules — subscribe, drop in a script tag, and it starts handling repeatable questions immediately.",
    whatsIncluded: [
      "Embeddable chat widget — one script tag, works on any website",
      "Retrieval pipeline over documents you upload",
      "Configurable greeting, brand color, and widget position",
      "Escalation logic to flag conversations for a human",
      "Usage dashboard with message counts and conversation history",
    ],
    installTime: "Live in minutes — copy one script tag, no code required",
    tiers: [
      {
        name: "Standard",
        price: "$19/mo",
        messagesIncluded: "500 messages / month",
        features: ["One knowledge source", "Standard widget customization", "Email support"],
      },
      {
        name: "Pro",
        price: "$49/mo",
        messagesIncluded: "2,500 messages / month",
        features: ["Multiple knowledge sources", "Full brand customization", "Priority support"],
      },
    ],
    faq: [
      {
        question: "Do I need a developer to install this?",
        answer:
          "No — copy the embed snippet from your dashboard and paste it before the closing </body> tag on your site. It works on plain HTML, WordPress, React, or any other stack.",
      },
      {
        question: "What happens if I need something this doesn't cover?",
        answer:
          "For deeper integrations or bespoke requirements, we also offer custom-built agent engagements — reach out and we'll scope it.",
      },
    ],
    outcomes: ["customer-support", "website-assistant"],
    businessTypes: ["SaaS", "E-commerce", "Agency", "Startup", "Local business"],
    connectsTo: ["Pasted text", ".txt files", ".md files"],
    suggestedQuestions: [
      "What does this product do?",
      "How much does it cost?",
      "Can I cancel my subscription?",
      "How do I get started?",
    ],
  },
  {
    slug: "rag-knowledge-assistant",
    name: "RAG Knowledge Assistant",
    tagline: "Ask questions across your scattered internal docs and get grounded answers.",
    category: "Knowledge",
    icon: "Database",
    accent: "#10B981",
    accentBg: "rgba(16,185,129,0.07)",
    status: "live",
    precedent: "Distilled from a client's internal-docs Q&A bot.",
    whoFor: "Ops/RevOps teams with scattered internal documentation.",
    prebuilt: "Ingestion pipeline, retrieval-augmented Q&A engine, source citations.",
    configurable: "Which documents/sources feed it, and who can access it.",
    description:
      "A retrieval-augmented assistant that indexes your internal docs so your team gets accurate, source-grounded answers instead of digging through folders — embeddable in your internal tools or intranet.",
    whatsIncluded: [
      "Document ingestion for uploaded files or a connected source",
      "Retrieval-augmented Q&A with source citations on every answer",
      "Embeddable widget for internal tools or your intranet",
      "Usage dashboard with message counts and conversation history",
    ],
    installTime: "Live in minutes — copy one script tag, no code required",
    tiers: [
      {
        name: "Standard",
        price: "$19/mo",
        messagesIncluded: "500 messages / month",
        features: ["One source connector", "Standard widget customization", "Email support"],
      },
      {
        name: "Pro",
        price: "$49/mo",
        messagesIncluded: "2,500 messages / month",
        features: ["Multiple source connectors", "Access control", "Priority support"],
      },
    ],
    faq: [
      {
        question: "Do I need a developer to install this?",
        answer:
          "No — copy the embed snippet from your dashboard and paste it into your internal tool or intranet page.",
      },
      {
        question: "What happens if I need something this doesn't cover?",
        answer:
          "For deeper integrations or bespoke requirements, we also offer custom-built agent engagements — reach out and we'll scope it.",
      },
    ],
    outcomes: ["knowledge"],
    businessTypes: ["SaaS", "Startup", "Agency", "Developer tool"],
    connectsTo: ["Pasted text", ".txt files", ".md files"],
    suggestedQuestions: [
      "What documentation do you have access to?",
      "Summarize the key points from our docs",
      "Where can I find our onboarding guide?",
      "How do I get started?",
    ],
  },
  {
    slug: "workflow-automation-pack",
    name: "Workflow Automation Pack",
    tagline: "A proven automation template, mapped to your stack.",
    category: "Automation",
    icon: "FlowArrow",
    accent: "#0EA5E9",
    accentBg: "rgba(14,165,233,0.07)",
    status: "coming-soon",
    precedent: "An automation template we've shipped more than once.",
    whoFor: "Ops teams with a specific repetitive workflow (e.g. lead routing, invoice processing).",
    prebuilt: "The workflow template and error handling.",
    configurable: "Field mapping to your specific tools.",
    description:
      "A repeatable workflow automation — lead routing, invoice processing, and similar patterns we've templated from real client builds — mapped to your specific tools and fields.",
    whatsIncluded: [
      "Templated workflow, configured for your use case",
      "Field mapping to your existing tools",
      "Error handling and monitoring",
      "Usage dashboard",
    ],
    installTime: "Coming soon",
    tiers: [
      {
        name: "Standard",
        price: "Pricing TBD",
        messagesIncluded: "TBD",
        features: ["One workflow template", "Standard support"],
      },
      {
        name: "Pro",
        price: "Pricing TBD",
        messagesIncluded: "TBD",
        features: ["Multiple workflows", "Priority support"],
      },
    ],
    faq: [
      {
        question: "When does this launch?",
        answer: "Not yet — join the waitlist by reaching out and we'll notify you.",
      },
    ],
    outcomes: ["operations"],
    businessTypes: ["SaaS", "Agency", "Startup", "E-commerce"],
    connectsTo: [],
    suggestedQuestions: [],
  },
  {
    slug: "multi-agent-system-lite",
    name: "Multi-Agent System — Lite",
    tagline: "A scoped-down, coordinated multi-agent setup for teams ready for more than one agent.",
    category: "Multi-Agent",
    icon: "Brain",
    accent: "#6366F1",
    accentBg: "rgba(99,102,241,0.07)",
    status: "coming-soon",
    precedent: "A coordinated-agent build, scoped down from a larger client engagement.",
    whoFor: "Series B+ teams ready for more than one agent working together.",
    prebuilt: "The orchestration layer.",
    configurable: "Which sub-agents are included and what they hand off to each other.",
    description:
      "A coordinated set of agents that research, decide, and act together — a scoped-down version of the orchestration patterns we've built for larger multi-agent engagements.",
    whatsIncluded: [
      "Orchestration layer connecting your sub-agents",
      "Defined hand-off logic between agents",
      "Monitoring across the whole pipeline",
      "Usage dashboard",
    ],
    installTime: "Coming soon",
    tiers: [
      {
        name: "Standard",
        price: "Pricing TBD",
        messagesIncluded: "TBD",
        features: ["Two coordinated agents", "Standard support"],
      },
      {
        name: "Pro",
        price: "Pricing TBD",
        messagesIncluded: "TBD",
        features: ["Additional sub-agents", "Priority support"],
      },
    ],
    faq: [
      {
        question: "When does this launch?",
        answer: "Not yet — join the waitlist by reaching out and we'll notify you.",
      },
    ],
    outcomes: ["operations"],
    businessTypes: ["SaaS", "Agency", "Startup"],
    connectsTo: [],
    suggestedQuestions: [],
  },
];

export function getAgentProduct(slug: string): AgentProduct | undefined {
  return AGENT_CATALOG.find((p) => p.slug === slug);
}

export const BUSINESS_TYPES: BusinessType[] = [
  "SaaS",
  "E-commerce",
  "Agency",
  "Freelancer",
  "Local business",
  "Startup",
  "Creator",
  "Developer tool",
  "Other",
];

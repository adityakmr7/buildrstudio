# Buildr Studio — Productized AI Agent Storefront: Launch Plan

**Goal:** Turn buildrstudio.in from "book a 6-week custom engagement" into "browse, buy, and get a managed AI agent deployed" — using agents you've already validated with clients, sold with a light-touch managed setup instead of self-serve.

This is the plan for **Option 1**: your own catalog, your own delivery team, no third-party sellers.
(Superseded in practice — see Section 10's 2026-08-21 entry: this became a fully self-serve
marketplace, not a managed-delivery storefront. The sections below are kept for historical context;
Section 10 is what actually happened.)

---

## 0. Current status (read this first — updated 2026-08-26)

Positioning is settled: a **small, indie/small-business-scale version of Kore.ai's core loop**
(browse → subscribe → deploy a working agent), explicitly *not* matching Kore.ai's enterprise depth
(no visual builder, no 300+ integrations, no omnichannel, no compliance program — see the
2026-08-26 "positioning settled" entry in Section 10 for the full comparison).

**What's actually working right now, verified end-to-end (not just build/lint):**
- Browse catalog → product page → on-site live demo, calling real Gemini
- Sign-in via a dev-only bypass (`DEV_BYPASS_AUTH=true` in `.env.local`) — real Google OAuth
  credentials exist too but haven't been re-verified after the redirect-URI fix propagated
- A real, dedicated Neon database (`buildrstudio` project) with real migration history
- **Retrieval-augmented knowledge base** — a customer can upload text, and their agent answers from
  it instead of a generic script. Proven with a real test API key: uploaded content, got precise
  answers back, cleared it, got "I don't know" back for the same question. This was the single
  biggest gap versus every real competitor and it's closed.
- Dashboard: embed code, API key regen, widget config, knowledge base upload, Paddle customer
  portal link — all ownership-checked, all working against the real DB
- **Real pricing exists and checkout is live in Paddle sandbox** — $19/mo Standard, $49/mo Pro on
  both live agents. Product pages now show "Get this agent" (a real Paddle sandbox checkout) instead
  of "Notify me when priced." Verified via the Paddle API directly and by confirming the rendered
  page state, not yet via an actual click-through purchase.
- **A real server-side `PADDLE_API_KEY` exists** (sandbox) — created by hand in the Paddle dashboard
  via browser automation (Paddle's API genuinely has no endpoint to create this one), then verified
  by calling Paddle's API directly through the app's own SDK setup. The webhook route and
  customer-portal route can now actually authenticate to Paddle server-side.

**What's NOT done — in rough priority order:**
1. **Authenticate `paddle-live` and decide the sandbox pricing is final** — right now $19/$49 only
   exists in Paddle *sandbox* (fake money, safe to test). Going live for real needs the OAuth flow
   for the `paddle-live` MCP tool, and a deliberate decision that these numbers (not just sandbox
   placeholders) are what you're actually charging. **Explicitly deferred, 2026-08-26 — site owner
   said stay sandbox-only for now.** Don't push toward `paddle-live` authentication or production
   Paddle as an urgent task on your own initiative; wait for the site owner to say they're ready.
2. **Actual deployment** — everything built this whole conversation is uncommitted locally. Nothing
   is live on buildrstudio.in yet. Needs: commit/push/merge, real production env vars on Vercel
   (separate from local `.env.local`), `prisma migrate deploy` against production.
3. **A real end-to-end purchase test** — checkout → Paddle webhook → auto-provisioned API key has
   never actually run; only simulated by hand-creating an `ApiKey` row for testing. No longer blocked
   on pricing or the API key — both exist now, at least in sandbox.
4. **Decide dev/prod database separation** — right now local dev points at the same Neon project
   that would become production if deployed as-is. Neon branching is the easy fix; nobody's decided
   to do it yet.
5. Product depth gaps: no conversation/transcript viewing in the dashboard (just a usage count), no
   PDF/URL support in the knowledge base (text/`.txt`/`.md` only), the two "coming-soon" catalog
   products have zero real implementation, no email notifications (`resend` is installed, unused).
6. Turn off `DEV_BYPASS_AUTH` before any real testing/launch — hard-gated against production builds,
   but shouldn't be left on even locally past the point it's needed.
7. A security review hasn't been done — worth doing before real payments/user data are involved.

Full blow-by-blow of how we got here is in Section 10 below, in date order.

---

## 1. How this fits your existing business

Right now Buildr Studio has one motion: 6-week custom engagement (audit → build → deploy) sold via sales conversations. The storefront adds a second, faster motion sitting *in front of* that one:

- **Storefront tier** — a defined agent, a fixed(ish) price, a 1–2 week managed setup. Low-friction entry point.
- **Custom tier** (existing) — the 6-week bespoke engagement for anything storefront products don't cover, or for storefront buyers who outgrow the template.

The storefront becomes a lead-qualification and upsell engine for the agency business, not a replacement for it. Buyers who need something the catalog doesn't cover get routed into your existing sales process.

---

## 2. Starting catalog

You already have four service lines (AI Support Agents, Workflow Automation, Multi-Agent Systems, RAG Knowledge Base Integration). Each maps to a productized offer. Fill in the bracketed specifics with your actual best-performing client builds — the framework below is what needs to be true of each one regardless of which client work it's drawn from.

| # | Product | Best client precedent to draw from | Who it's for | What's fixed vs. custom |
|---|---|---|---|---|
| 1 | **Support Agent Starter** | Your highest-performing support-deflection build | Support/CX teams drowning in tickets | Fixed: platform (e.g. Intercom/Zendesk + your RAG pipeline), tone-tuning, escalation logic. Custom: knowledge base ingestion, integrations |
| 2 | **RAG Knowledge Assistant** | A client's internal-docs Q&A bot | Ops/RevOps teams with scattered internal docs | Fixed: ingestion pipeline, retrieval architecture. Custom: source connectors, access control |
| 3 | **Workflow Automation Pack** | An n8n/Make automation you've shipped more than once | Ops teams with a specific repetitive workflow (e.g. lead routing, invoice processing) | Fixed: the workflow template itself. Custom: field mapping to their stack |
| 4 | **Multi-Agent System — Lite** | A coordinated-agent build, scoped down | Series B+ teams ready for more than one agent working together | Fixed: orchestration pattern. Custom: which sub-agents, what they hand off to each other |

**Selection rule for what goes in the initial catalog:** pick the 2 offers you've now built for 3+ clients with the least per-client variation — those compress into a fixed-scope product fastest. The other 2 stay as "coming soon" or custom-quote until you've productized their delivery internally.

**Task 1 recommendation:** Before writing storefront copy, go through your last 8–10 client SOWs and tag which ones took the least customization relative to a "standard" build. Those are your real MVP catalog — not necessarily the four above.

---

## 3. Pricing & packaging

Managed setup means you're still doing real delivery work per sale, so pricing needs to cover that labor while staying meaningfully cheaper/faster than a full custom engagement (or the storefront just cannibalizes your higher-margin service).

**Recommended structure — setup fee + subscription:**

- **One-time setup fee** — covers your team's configuration/integration time. Priced below a custom engagement (rough anchor: 10–20% of what an equivalent custom build costs you, since scope is templated).
- **Monthly subscription** — covers hosting, model/API usage, monitoring, and minor updates. This is also your recurring revenue line, which a pure project-based agency doesn't have.

**Tiering within each product:**
- *Standard* — the templated build, one integration, standard SLA.
- *Pro* — additional integrations, custom branding/tone, priority support.
- *Anything beyond Pro* — routes to a custom quote (your existing sales motion).

Publish Standard pricing on the site (removes friction — buyers can self-qualify). Keep Pro/custom as "starting at" or quote-on-request, since scope varies more.

**Open decision for you:** what's your fully-loaded internal cost to deliver one storefront-tier setup (engineer hours × rate + API costs)? That number should anchor the setup fee — I don't have your delivery cost data, so I've left pricing as a structure rather than dollar figures. Happy to build out an actual pricing model once you share rough numbers.

---

## 4. Buyer journey & fulfillment workflow

```
Browse catalog → Select product & tier → Pay setup fee (Stripe checkout)
     → Intake questionnaire (auto-triggered on payment)
     → Ops team reviews intake, kicks off build (internal Kanban/board)
     → Build & configure (target: 5–10 business days for Standard tier)
     → Client review call / async Loom walkthrough
     → Go-live + subscription billing starts
     → 30-day check-in → ongoing monitoring/support per subscription
```

Key design decisions this implies:

- **Intake questionnaire, not a sales call, is the default path.** Keeps the funnel self-serve up to the point where your team actually needs client-specific info (their tools, data sources, credentials). A sales call is offered as an option for Pro-tier or anyone who wants it, not required for Standard.
- **A visible delivery SLA is a selling point.** "Live in 10 business days" is a concrete, comparison-friendly claim your 6-week custom engagement can't make — lean into that distinction in the copy.
- **Someone owns fulfillment ops.** Even at small volume, you need a lightweight internal tracker (a Trello/Linear/Notion board is enough at first) so purchases don't sit unactioned. This is the piece most storefronts underbuild before launch.

---

## 5. Storefront structure on buildrstudio.in

Since the site is custom Next.js, this can be built natively rather than bolted on with a no-code embed.

**New pages/routes:**
- `/agents` — catalog/grid page (4 product cards, one-line value prop each)
- `/agents/[slug]` — product detail page: what it does, who it's for, what's included, tier comparison, FAQ, "Buy now"
- `/agents/[slug]/checkout` — Stripe Checkout (hosted, don't build custom payment UI) or embedded Stripe Elements
- `/agents/[slug]/intake` — post-purchase questionnaire (Typeform embed is the fastest path to ship; a native form is a fast-follow)
- `/dashboard` (later, not MVP) — logged-in view where subscribers see their agent's status/usage

**Backend/integration needs:**
- Stripe for payments + subscription billing (Checkout + Billing covers setup fee + recurring in one flow)
- Form tool (Typeform/Tally to start) wired to your CRM or a simple database, triggering a notification to your ops board on submission
- Internal fulfillment tracker (Linear/Notion/Trello — doesn't need to be custom-built for launch)

**What NOT to build for v1:** self-serve deploy, usage dashboards, in-app agent configuration. All of that is Option 2 (self-serve) territory — building it now would blow your timeline for a managed-delivery model where a human is doing the setup anyway.

---

## 6. Trust & de-risking

Buyers are handing over data-source access and trusting an agent with their support/ops. For a new storefront with no independent reviews yet:

- **Show, don't just tell:** a 60–90 second demo video per product (screen recording of the agent actually working) on each product page beats any amount of descriptive copy.
- **Named or anonymized case studies** from the client work each product is drawn from — "reduced first-response time by X%" type outcomes, pulled from real engagements.
- **A delivery guarantee** — e.g., "live in 10 business days or your setup fee back" — is a strong trust signal for a managed-delivery model and costs you little if your fulfillment ops are solid.
- **Clear data-handling language** on what access you need and how it's used — especially relevant given your SOC-2-aware positioning; put that credential on the storefront pages too, not just the agency site.

---

## 7. Phased rollout

**Phase 0 — Internal pilot (2–3 weeks):** Package just 1 product (your strongest candidate from Section 2) end-to-end, including fulfillment ops. Sell it manually to 1–2 warm contacts or existing clients before it's even on the public site, to pressure-test the intake → build → handoff flow.

**Phase 1 — Soft launch (weeks 4–6):** Publish `/agents` with 2 products live, 2 marked "coming soon." Drive traffic from your existing channels (agency site visitors, past client outreach, LinkedIn) rather than paid acquisition yet.

**Phase 2 — Full catalog + demand gen (month 2+):** All 4 products live, start content/SEO aimed at the specific pain points each product solves, consider listing lightweight versions on external distribution (a free Claude Skill or GPT tied back to the paid product, per the "hybrid" model discussed earlier) to drive top-of-funnel.

---

## 8. Success metrics to track from day one

- Purchases per product (which one actually sells — don't assume it's the one you expect)
- Time from purchase → live (are you hitting the SLA you're advertising?)
- Setup-fee sale → subscription retention after month 1 and month 3
- % of storefront buyers who upsell into a custom engagement (this is the metric that proves the funnel thesis)

---

## 9. Open decisions needing your input before build starts

1. Which 2 products actually go in the Phase 0/1 catalog (needs your SOW review from Section 2)
2. Real pricing numbers (needs your delivery cost data from Section 3)
3. Who owns fulfillment ops day-to-day — you, or someone on the team
4. Stripe account / billing setup — do you already have Stripe wired up anywhere, or starting fresh

---

## 10. Decisions log

Running record of answers to Section 9, and what they unlocked in the codebase. Update this section as decisions firm up — don't let it drift from `app/lib/agentCatalog.ts`.

**2026-08-20:**

1. **Catalog picks:** Support Agent Starter and RAG Knowledge Assistant are marked `live` in `app/lib/agentCatalog.ts` as the two most in-demand products. This was a judgment call made without the SOW review Section 2 recommends — **still worth doing** to confirm or overturn this pick. Workflow Automation Pack and Multi-Agent System — Lite remain `coming-soon`.
2. **Pricing:** Not decided. Product pages show "Pricing TBD" / "starting at — contact us" and route to a booked call instead of checkout. Revisit before promoting either live product harder.
3. **Fulfillment ops owner:** Not decided. No internal tracker has been set up. This needs an answer before volume — even one sale sitting unactioned defeats the SLA claim in Section 4.
4. **Billing provider:** **Paddle**, not Stripe (the plan text above assumes Stripe; the codebase already has `@paddle/paddle-js` / `@paddle/paddle-node-sdk` as dependencies from the pre-existing agency site). Checkout/intake routes are not yet built — blocked on decision #2, not on the provider choice.

**2026-08-21 — Self-serve pivot, agency positioning removed:**

The site owner brought a second, much larger prompt asking for a full "AI Agent Marketplace" —
embeddable widget, self-serve checkout, usage-based quotas — plus an explicit instruction to stop
portraying Buildr Studio as an agency at all. This superseded the "managed setup, no self-serve"
posture from Section 5 above. Reconciliation, confirmed with the site owner before building:

- **Scope:** merged, not replaced — the same 4 catalog products from Section 2 stayed, but delivery
  changed from "our team configures it in 5–10 business days" to fully self-serve: subscribe, get
  an API key + a one-line embed script, done. No sales call in the primary path.
- **Billing:** Paddle confirmed (not Stripe, which the original marketplace prompt assumed).
- **Database:** Prisma added on top of the existing Neon instance — not a new Supabase project.
- **Auth:** next-auth (already installed, unused) — not Clerk.
- **Agency removal:** `AgencyLandingPage.tsx`, `CalBookingButton.tsx`, and `@calcom/embed-react`
  deleted/removed. Whole site re-themed from dark-tech agency aesthetic to a light SaaS theme
  (no dark mode, no toggle). Privacy/Terms rewritten for a subscription+embed product instead of a
  services engagement.
- **What actually shipped:** `prisma/schema.prisma` + `seed.ts`, `public/widget.js` (Shadow DOM
  embed), `/api/v1/chat` (the endpoint the widget calls), `/api/webhooks/paddle`, next-auth wiring
  (`auth.ts` / `auth.config.ts` / `proxy.ts`), `/dashboard/integrations` (embed code, API key
  regeneration, widget config), and Paddle checkout on the product detail pages.
- **Still open:** real pricing (Section 9 #2) and fulfillment/support ownership (#3) — checkout
  intentionally refuses to open for any tier without a real Paddle price ID rather than guessing a
  number. See `CLAUDE.md` for the fuller technical rundown (Prisma 7's driver-adapter/lazy-client
  requirements, the Edge-vs-Node auth split, etc.).

**2026-08-22 — Gemini instead of OpenAI, on-site live demo, local dev unblocked with dummy env:**

- **Model provider:** switched from OpenAI to Gemini (`@google/generative-ai`) for all agent
  responses — both the paid embed widget's `/api/v1/chat` and the new demo endpoint.
  `app/lib/gemini.ts` centralizes the client + a shared `generateReply()` helper. Default model
  went through `gemini-1.5-flash` (retired, 404s) before landing on `gemini-2.5-flash`, verified
  against a real key — see `scripts/check-gemini-models.mjs`.
- **On-site live demo added** (this wasn't in the original storefront plan, came from the
  marketplace prompt's "Try live demo" idea): `/agents/[slug]` now embeds a real chat widget
  (`LiveDemoChat.tsx` → `/api/v1/demo`) for `"live"` products. Deliberately DB-free and unauthenticated
  (rate-limited by IP instead) so the core "does this actually work" question is answerable with
  only `GEMINI_API_KEY` configured — no Neon/Paddle/auth needed. Falls back to a clearly-labeled
  mock reply if that key is unset, rather than erroring.
- **Local dev unblocked:** `.env.local` (gitignored) now holds dummy values for every var so the
  site owner can develop against the full app without real Neon/Google OAuth/Paddle accounts yet.
  Real credentials are still required for sign-in, checkout, and the paid embed widget to actually
  function — only the live demo works meaningfully with just one real key (Gemini) added.

**2026-08-25 — Closed two buyer-flow gaps (post-checkout confirmation, subscription management):**

Walked the site owner through the full buy → install flow as actually built, which surfaced four
gaps. Two were code-fixable and got closed; two are inherent to still-missing real credentials/decisions:

- **Closed — post-checkout confirmation:** `PaddleCheckoutButton` now sets `successUrl` to
  `/dashboard/integrations?welcome=1`; the dashboard shows a one-time "you're all set" banner off
  that param, then strips it. Known small gap: no retry/polling if the buyer lands before the
  webhook finishes — acceptable for now.
- **Closed — manage/cancel subscription:** new `app/api/portal/route.ts` + a "Manage subscription"
  button in the dashboard, both routing to Paddle's own hosted customer portal
  (`paddle.customerPortalSessions.create()`) rather than building custom cancel/billing UI.
- **Still open — real pricing:** unchanged from Section 9 #2. No code gap here; needs the site
  owner to create real Paddle prices and set `AgentTier.paddlePriceId`.
- **Still open — real Paddle/Neon credentials to test any of this live:** everything above is
  implemented but unexercised against real infra (`.env.local` still holds dummy `DATABASE_URL`/
  Paddle values) — verified via `bun run build`/`lint` only, not an actual purchase.

**2026-08-25 — Real Google OAuth client set up, then auth deprioritized in favor of the core agent:**

- Walked through creating a real Google OAuth client (redirect URIs vs. JS origins was the trip-up
  — Google's newer console UI puts them in separate, easy-to-confuse sections). Real credentials
  now sit in `.env.local`.
- Considered and rejected switching to Firebase Auth — it doesn't remove the OAuth-client-setup step
  (Firebase's Google provider is the same underlying mechanism), and would mean rewriting a working,
  tested next-auth integration (Edge/Node split, session→Prisma-user correlation, all the call
  sites) for no functional gain given this app doesn't need Firebase's other services.
- Site owner asked to defer further auth polish and focus on the core agent instead. Added a
  **dev-only auth bypass** (`DEV_BYPASS_AUTH` in `.env.local`) rather than leaving auth as a hard
  blocker — verified end-to-end (signed in via the bypass, reached `/dashboard/integrations`, saw
  the fixed dev user rendered) without needing Google or a real database. Also fixed a related gap
  the bypass surfaced: the `jwt` callback's DB upsert now degrades gracefully instead of failing
  sign-in outright when the database is unreachable — meaning even real Google sign-in doesn't
  actually need a working database to complete, just to fully populate dashboard data afterward.
  See `CLAUDE.md`'s Auth section for the mechanics.

**2026-08-26 — Connected the real database (with a near-miss worth recording):**

- Found the site owner already has a Neon project literally named "BuildrStudio" — reused it
  rather than creating a new one, per the standing "don't add new infra" pattern.
- That project's `public` schema turned out to have real, non-empty tables from an earlier product
  iteration (`users`, `subscriptions`, `waitlist_requests`, `paddle_*`, `projects`, `ai_usage`).
  Both `prisma migrate dev` and `prisma db push`, pointed at `public`, wanted to **drop all of
  them** to make the schema match `schema.prisma` exactly — confirmed via `db push`'s own preview
  (real row counts shown, not zeros). Neither command was allowed to proceed (no
  `--accept-data-loss`, no confirmation given) — verified directly against Neon afterward that
  every row count was unchanged.
- Fix: created a separate Postgres schema, `marketplace`, in the same database, and pointed
  `DATABASE_URL` at that instead (`&schema=marketplace`). This schema's tables now live there,
  completely isolated from the pre-existing `public` tables. Also had to fix
  `@prisma/adapter-neon`'s runtime client, which — unlike the Prisma CLI — doesn't parse `?schema=`
  out of the connection string on its own; it needs the schema passed as an explicit adapter option
  (`app/lib/db.ts`).
- Also fixed `prisma.config.ts` to load `.env.local` explicitly (it only auto-loaded a bare `.env`,
  which doesn't exist in this project) — otherwise `prisma migrate`/`db push`/`db seed` run via the
  CLI silently couldn't see `DATABASE_URL` at all, even though `bun run dev` worked fine.
- End-to-end verified against the real database: seeded the two live agents, confirmed via direct
  SQL query; signed in through the dev-auth-bypass and confirmed a real `User` row got created.
  See `CLAUDE.md`'s Database section for the full "don't run migrate reset against this URL"
  warning — worth reading before touching this again.

**2026-08-26 (later same day) — Replaced the shared Neon project with a dedicated one:**

Asked to drop the existing Neon DB and start fresh with one named "buildrstudio". Before acting,
laid out plainly what "the existing Neon DB" actually contained — the old project wasn't just
yesterday's `marketplace` schema, its `public` schema held real historical data (3 users, 3
subscriptions, 1 waitlist signup, and what looked like real Paddle billing history: 4
`paddle_customers`, 2 `paddle_subscriptions`, 2 `paddle_transactions`) from a product iteration
that predates this whole conversation. Given the explicit choice between "new project, old one
untouched" and "actually delete the old data," the site owner chose deletion, informed of exactly
what that meant.

Executed: deleted the old "BuildrStudio" Neon project entirely (`muddy-snow-96574021` — including
both the old `public` data and the `marketplace` schema created earlier that day), created a new
dedicated project named `buildrstudio` (`wispy-butterfly-59371469`), and ran a clean
`prisma migrate dev --name init` against it — no drift, no schema-isolation tricks needed this
time, since nothing pre-existing is sharing the project anymore. Real migration history now exists
in `prisma/migrations/` for the first time (the earlier `db push` approach didn't produce one).
Re-seeded the two live agents and re-verified the same checks as before (product page pricing
state, live demo, dev-bypass sign-in creating a real `User` row) all still pass against the new
project.

**2026-08-26 (later still) — Positioning settled: indie/small-business scale, not enterprise. Built the knowledge base (the biggest functional gap).**

Researched the competitive landscape at the site owner's request — two categories exist: curated
catalogs (GPT Store, Poe, Salesforce AgentExchange, Kore.ai) and "train a bot on your own data"
tools (Chatbase, Dante AI, CustomGPT). Kore.ai specifically is a mature enterprise platform (10+
years, deals into six figures, 300+ integrations, a visual no-code builder, omnichannel deployment)
— matching its breadth was explicitly ruled out as a goal. The site owner confirmed the target is
Kore.ai's *core loop* (browse, subscribe, deploy a working agent) at indie/small-business scale, not
its enterprise depth.

Against that target, the one gap that actually mattered: **every agent gave every subscriber the
identical generic response — nothing let a buyer's agent know anything about their actual
business**, despite the catalog copy promising exactly that ("trained on your docs"). This is the
same category of feature that's the entire point of Chatbase/Dante/CustomGPT. Built it:

- `app/lib/knowledge.ts` — chunking (naive fixed-size, 800 chars/100 overlap), Gemini embeddings
  (`gemini-embedding-001`, verified against a real key the same way the chat model was), and
  retrieval via in-app cosine similarity over plain `Float[]` columns — deliberately not pgvector,
  since a few hundred chunks per customer doesn't need it and it avoids managing a Postgres
  extension. Revisit only if real usage outgrows this.
- `app/api/keys/[id]/knowledge/route.ts` (GET/POST/DELETE, ownership-checked) + a "Knowledge base"
  section in the dashboard — paste text or read a `.txt`/`.md` file client-side, replaces the
  previous knowledge base entirely (one KB per install, not a document CMS).
- Wired into `/api/v1/chat` (the paid, embedded-widget path) — retrieves relevant chunks before
  calling Gemini, injects them into the system prompt. **Explicitly not wired into `/api/v1/demo`**
  — the on-site demo stays DB-free/anonymous by design, so it has no per-customer identity to scope
  a knowledge base to.

**Verified for real, not just build/lint:** created a test `ApiKey` directly (simulating what a real
Paddle purchase's webhook would provision, since no real purchase exists yet), uploaded a knowledge
base describing a fictional refund policy, asked the live `/api/v1/chat` endpoint a question
answerable only from that content, and got the specific uploaded details back correctly. Then
cleared the knowledge base and asked the identical question again — got a generic "I don't have that
information" response, proving the specific answer really did come from retrieval, not
coincidence/hallucination. Also confirmed the agent doesn't fabricate answers for questions outside
the knowledge base (asked about student discounts — correctly said it didn't know rather than
guessing).

**2026-08-26 (new session) — Paddle MCP connected; real pricing set and wired up in sandbox.**

A Paddle MCP integration (two parts — `paddle-sandbox`, usable immediately, and `paddle-live`,
installed but not yet authenticated) wasn't detected in the previous session; a fresh session picked
it up correctly. Confirmed `paddle-sandbox` actually works by listing the account's existing
products live (turned out to be shared with other unrelated projects — same pattern as the Neon
account).

Asked directly for pricing rather than continuing to defer it. Proposed **$19/mo Standard, $49/mo
Pro** for both live agents (500 / 2,500 messages respectively — matches the message-quota packaging
already in the catalog), reasoning from the earlier competitive research (Chatbase $0–500, Dante
$29–600, CustomGPT $99–499) — positioned as an indie-friendly undercut, not a race to the bottom.
Framed clearly as a sandbox-test proposal, not a final live commitment.

Built entirely through the Paddle MCP's `search`/`execute` tools (discover-the-exact-call-shape,
then execute — never guessed a parameter name):
- 2 Paddle products (Support Agent Starter, RAG Knowledge Assistant), 4 prices (Standard/Pro × 2,
  monthly recurring, USD)
- A client-side token for the checkout overlay (`NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`)
- A webhook notification destination subscribed to the subscription lifecycle events
  `app/api/webhooks/paddle/route.ts` actually handles, pointed at the eventual production URL
  (won't receive anything until the app is deployed there) — captured its `endpoint_secret_key` for
  `PADDLE_WEBHOOK_SECRET`

Wired the resulting price IDs onto the `AgentTier` rows in the real database, and updated
`app/lib/agentCatalog.ts`'s displayed prices from "Pricing TBD" to the real numbers. **Verified by
re-reading the live product pages**: both now render "Get this agent" (a real Paddle sandbox
checkout button) instead of "Notify me when priced," confirming the whole chain — DB → catalog
display → checkout eligibility — actually works, not just that the Paddle-side objects exist.

**One gap Paddle's own API can't close:** there's no programmatic way to create a server-side
`PADDLE_API_KEY` — confirmed by searching the MCP's 99 available methods and finding nothing, then
filing a missing-tool report. That one credential still has to be created by hand in the Paddle
dashboard before the webhook route or customer-portal route can call Paddle server-side; client-side
checkout doesn't need it and already works.

**Still sandbox only — no real money has moved, and nothing here is a production commitment yet.**
Going live for real needs: authenticating `paddle-live`, deciding $19/$49 (or different numbers) are
final rather than just sandbox-tested, and the manual `PADDLE_API_KEY` step above.

**2026-08-26 (same session, continued) — Created the real `PADDLE_API_KEY` via browser automation.**

Asked directly to create it. Since Paddle's API has no endpoint for this (confirmed the session
before), drove the actual Paddle sandbox dashboard through browser control instead — two Chrome
browsers were connected to the account, asked which one to use before touching anything. Found an
existing active "buildrstudio" key already in the dashboard from some earlier setup, but its
plaintext wasn't retrievable (Paddle only shows a key once, same as the Google OAuth client secret
earlier) — created a new one instead (`buildrstudio-app-server`, All resources/Read+Write, expires
Nov 24, 2026) rather than trying to reuse it.

**Verified for real:** called Paddle's API directly through `@paddle/paddle-node-sdk` (the app's own
dependency) using the new key — it listed the actual products, including the two created earlier
that session, proving the key authenticates correctly and has working permissions, not just that
the dashboard accepted it.

The webhook route and customer-portal route can now genuinely authenticate to Paddle server-side.
Still open: nobody has actually clicked through a live checkout yet, and everything remains sandbox
until `paddle-live` is authenticated and the pricing is deliberately made final.

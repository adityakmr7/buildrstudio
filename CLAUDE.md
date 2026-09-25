# CLAUDE.md — BuildrStudio

## What is this project?

BuildrStudio is **the AI Agent Marketplace** — buy, and embed AI agents on any website. A visitor
picks a product (a support agent, a knowledge assistant, etc.), subscribes, and gets an API key +
a single `<script>` embed snippet that drops a working chat widget onto their own site. There is no
"book a call" step in the primary flow and no agency framing anywhere on the site — it reads as a
self-serve SaaS product, not a services business.

This is a pivot from an earlier "AI automation agency" positioning (dark-tech theme, Cal.com
booking, 6-week custom engagements) — all of that was removed 2026-08-21. Positioning is now
settled as a **small, indie/small-business-scale version of Kore.ai's core loop** (browse →
subscribe → deploy a working agent) — explicitly not matching Kore.ai's enterprise depth.

**Before doing any storefront/marketplace work, read
[`docs/buildr-studio-agent-storefront-plan.md`](docs/buildr-studio-agent-storefront-plan.md),
Section 0 first** — it's a short "what's actually working / what's not done yet" snapshot kept
current, meant to be read before the long chronological decisions log in Section 10. Don't rely on
this CLAUDE.md file alone to know current state — it documents architecture and *why* things are
built the way they are, which doesn't change often; Section 0 of the plan doc is where fast-moving
status (what's real vs. dummy in `.env.local`, what's blocking launch) actually lives.

**Live site:** https://buildrstudio.in
**Author:** Aditya Kumar (@adityakmr7)

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack) with React 19
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 is imported, but components don't use Tailwind utility classes — see "Styling approach" below. **Light theme only** — no dark mode, no toggle.
- **Package manager:** Bun (bun.lock)
- **Database:** Neon Postgres via **Prisma 7** — `@prisma/adapter-neon` driver adapter (not a bare connection string; Prisma 7 requires an adapter). See "Database" below — this is *not* a new Supabase project, it's the same Neon instance.
- **Auth:** NextAuth.js v5 (Auth.js), Google OAuth only, JWT sessions, no Prisma adapter (we upsert our own `User` row manually — see `auth.ts`).
- **Payments:** **Paddle** (`@paddle/paddle-js` client-side, `@paddle/paddle-node-sdk` server-side) — merchant of record. Not Stripe, despite older docs/templates assuming Stripe.
- **AI:** Gemini (`@google/generative-ai`), `gemini-2.5-flash` by default per agent (see `app/lib/agentRuntime.ts`). Not OpenAI — swapped 2026-08-22. Gemini model names get retired/replaced over time; run `bun scripts/check-gemini-models.mjs` before changing the default rather than guessing one.
- **Icons:** `@phosphor-icons/react`
- **Analytics:** Vercel Analytics, Vercel Speed Insights, Umami
- **Deployment:** Vercel
- **Linting:** ESLint 9 with `eslint-config-next`
- **Font:** DM Sans via `next/font/google`

## Commands

```bash
bun run dev          # Start dev server on port 3005
bun run build        # Production build
bun run start        # Start production server
bun run lint         # Run ESLint

bunx prisma generate # Regenerate the Prisma client after schema changes
bunx prisma migrate dev --name <name>   # Apply schema changes to the DB (needs DATABASE_URL)
bunx prisma db seed  # Seed operational agent config (prisma/seed.ts)
```

There are no tests configured. Type checking uses `tsc --noEmit` implicitly via the Next.js build.

**The app builds and runs with zero environment variables configured** — every integration
(database, Gemini, Paddle) is constructed lazily and fails at the point of use, not at module load,
specifically so an unconfigured integration never crashes the build or an unrelated page. Keep new
integrations following that pattern (see `app/lib/db.ts`, `app/lib/gemini.ts`, `app/lib/paddle.ts`
for the shape) rather than constructing a client eagerly at module scope.

For local dev, `.env.local` is checked out with dummy values for everything (gitignored, never
committed) — the app runs and every page renders, but sign-in/checkout/the paid embed widget won't
functionally work against fake credentials. The one thing worth pasting a *real* key in for is
`GEMINI_API_KEY` (free tier at https://aistudio.google.com/apikey) — that alone makes the on-site
live demo on `/agents/[slug]` produce real generated replies instead of a labeled mock response.

## Project structure

```
app/
  layout.tsx                    # Root layout — DM Sans font, AuthProvider, ToastProvider, analytics
  page.tsx                      # Homepage (server) — renders MarketplaceLandingPage
  globals.css                   # Light theme tokens (--bg, --surface, --accent, --text, --muted, …), reset, a11y, animations
  components/
    MarketplaceLandingPage.tsx  # Homepage content — hero/search, value props, catalog preview, comparison, testimonials, FAQ, CTA
    SiteNav.tsx                 # Shared nav — session-aware (Sign in / Dashboard link), used on every page
    SiteFooter.tsx              # Shared footer
    AuthProvider.tsx            # next-auth SessionProvider wrapper (client)
    PaddleCheckoutButton.tsx    # Opens Paddle's overlay checkout for a given agent+tier
    Toast.tsx                   # ToastProvider/toast primitives (uses --fill/--fill-text/--text-1 token aliases)
  lib/
    siteConfig.ts                # Site name, tagline, contact/author info
    track.ts                     # Umami event tracking helper
    agentCatalog.ts               # Marketing/display data for the 4 catalog products (static TS, no DB) — see below
    db.ts                         # Prisma client (lazy singleton behind a Proxy)
    gemini.ts                     # Gemini client (lazy singleton) + generateReply() shared by the paid chat route and the demo route
    agentRuntime.ts               # Static system-prompt/model config for "live" products — shared by prisma/seed.ts and the DB-free demo route
    paddle.ts                     # Paddle Node SDK client (lazy singleton)
    rateLimit.ts                  # In-memory fixed-window rate limiter, used for both the paid chat API (per API key) and the public demo (per IP)
    devAuth.ts                     # Client-safe check for the dev-only auth bypass (mirrors the server-side gate in auth.ts)
    knowledge.ts                    # Retrieval-augmented generation: chunking, Gemini embeddings, in-app cosine similarity
  agents/
    page.tsx                     # /agents — catalog grid, search, category filter tabs
    AgentsCatalogHub.tsx
    [slug]/
      page.tsx                   # /agents/[slug] — fetches operational DB data (agent id, tier ids, Paddle price ids) alongside static marketing data; tolerates DB being unreachable
      AgentDetailHub.tsx          # Product detail — live demo, info grid, what's included, pricing/checkout, FAQ
      LiveDemoChat.tsx             # On-site "try it live" chat, calls /api/v1/demo — no login/API key/DB needed
  dashboard/
    page.tsx                     # Redirects to /dashboard/integrations
    integrations/
      page.tsx                   # Server component — auth-gated (middleware), fetches user's API keys/usage/subscriptions
      IntegrationsHub.tsx         # Client — embed code, copy button, regenerate key, edit-config modal
  api/
    v1/chat/route.ts             # THE endpoint the embedded widget calls — validates API key, rate-limits, checks quota, calls Gemini, persists messages, CORS-open (embeds on arbitrary origins)
    v1/demo/route.ts              # Public, unauthenticated, DB-free — powers the on-site live demo. Rate-limited by IP, falls back to a labeled mock reply if GEMINI_API_KEY isn't set
    webhooks/paddle/route.ts     # Verifies Paddle webhook signature, upserts AgentSubscription, auto-provisions an ApiKey on first activation
    keys/[id]/regenerate/route.ts # POST — rotates an API key (ownership-checked)
    keys/[id]/config/route.ts     # PATCH — updates widget greeting/color/position (ownership-checked)
    keys/[id]/knowledge/route.ts  # GET/POST/DELETE — a customer's knowledge base for one install (ownership-checked)
    portal/route.ts               # GET — creates a Paddle customer portal session for one subscription (cancel/update payment method), ownership-checked
    auth/[...nextauth]/route.ts   # next-auth route handlers
  privacy/page.tsx, terms/page.tsx  # Legal pages — marketplace-specific (billing via Paddle, chat data sent to Gemini, etc.)
  sitemap.ts, robots.ts

public/
  widget.js                     # The embeddable chat widget — vanilla JS IIFE, Shadow DOM (no iframe), ~18KB unminified. This is what site owners paste as a <script> tag.

prisma/
  schema.prisma                 # Operational data model — see "Database" below
  seed.ts                       # Seeds Agent/AgentTier rows to match app/lib/agentCatalog.ts slugs

auth.config.ts                  # Edge-safe auth config (providers only, no DB) — used by proxy.ts
auth.ts                         # Full auth config (DB callbacks) — used everywhere else
proxy.ts                        # Next.js 16 middleware (renamed from middleware.ts) — protects /dashboard/*
prisma.config.ts                # Prisma 7 CLI config (schema path, migrations, DATABASE_URL for the CLI)
types/next-auth.d.ts            # Module augmentation for session.user.id

docs/
  buildr-studio-agent-storefront-plan.md   # The plan — read before storefront/marketplace work
```

## Architecture patterns

### Routing

Next.js App Router. Each route's `page.tsx` is a **server component** exporting `metadata` (and
JSON-LD via a `<Script>` tag), rendering a `"use client"` hub/view component that holds the actual
UI and interactivity.

### Styling approach

**No Tailwind utility classes in components.** Inline `style` props are the default; a trailing
scoped `<style>{`...`}`}</style>` tag handles `:hover`/`:media`/`@keyframes` that inline styles
can't express. CSS custom properties from `globals.css` are used directly in inline styles
(`background: "var(--accent)"`, not a hardcoded hex) — this is a change from the pre-pivot agency
code, which hardcoded hex values. Prefer the token.

**Palette:** `--bg: #F5F8FC`, `--surface: #FFFFFF`, `--accent: #2563EB`, `--text: #0F172A`,
`--muted: rgba(15,23,42,0.58)`. Full token list in `globals.css`.

### Database

Prisma 7 against the existing Neon Postgres instance — **not** a new Supabase project (see the
plan's decisions log for why). Prisma 7 changed how connections work:

- `prisma/schema.prisma`'s `datasource` block has **no `url`** — Prisma 7 removed inline connection
  strings entirely. The CLI gets its connection from `prisma.config.ts` (`datasource.url`); the
  app gets it via a **driver adapter** passed to `new PrismaClient({ adapter })` — see `app/lib/db.ts`.
- The adapter is `@prisma/adapter-neon` (Neon's serverless/websocket driver), which needs the `ws`
  package and `neonConfig.webSocketConstructor = ws` in Node runtimes (edge/browser don't need it).
- The generated client lives at `generated/prisma/` (gitignored, regenerate with `prisma generate`)
  and is imported from `generated/prisma/client` — **not** `generated/prisma` (there's no index
  file at that path in Prisma 7's new output shape; `client.ts` is the documented entry point).
- `db` in `app/lib/db.ts` is a **lazy Proxy**, not an eagerly-constructed singleton. This is
  deliberate: Next.js evaluates route/page modules during build-time "collect page data" even for
  code that never runs in a given request, so an eager `new PrismaClient()` throws and crashes the
  *entire build* the moment `DATABASE_URL` is unset. The Proxy defers construction until the first
  real property access, which only happens inside a request/render — where callers already handle
  the failure (see `getOperationalData` in `app/agents/[slug]/page.tsx` for the pattern: try/catch,
  return null, page still renders with checkout disabled).

**`Agent` is a fixed catalog entry, not user-owned** — there are exactly 4 rows, matching the slugs
in `app/lib/agentCatalog.ts`. This is not an open marketplace where anyone can list an agent.

**Two layers of "agent" data, kept in sync by `slug`:**
1. `app/lib/agentCatalog.ts` — static marketing copy (name, tagline, tiers, FAQ) for the `/agents` pages. No DB access, renders instantly.
2. `prisma/schema.prisma`'s `Agent`/`AgentTier` models — operational config (system prompt, model, token limits, Paddle price IDs) that the chat API and checkout actually use.

When adding a product: add it to `agentCatalog.ts`, add its operational config to `prisma/seed.ts`, re-run `bunx prisma db seed`.

**Dedicated Neon project.** `DATABASE_URL` points at a Neon project named `buildrstudio`
(`wispy-butterfly-59371469`, created 2026-08-26), used exclusively by this app — plain `public`
schema, real migration history (`prisma/migrations/`), no isolation tricks needed. This replaced an
earlier setup that reused a pre-existing "BuildrStudio" project shared with an unrelated older
product; that project's real data (old users/subscriptions/waitlist/paddle-billing tables) was
**permanently deleted** at the site owner's explicit, informed request (see the plan's decisions
log, 2026-08-26) rather than migrated — don't go looking for it, it's gone.

**A lesson from that episode, worth keeping in mind on any future database work:** both
`prisma migrate dev` and `prisma db push` compare the *entire* target schema against what's
declared in `schema.prisma` and will offer to **drop anything not declared as a model** — they
don't just additively sync what's missing. If either command ever reports it wants to drop tables
you don't recognize from `schema.prisma`'s models, **stop and ask before proceeding** — never pass
`--accept-data-loss` or run `prisma migrate reset` to make the warning go away without confirming
first what's actually in those tables.

`prisma.config.ts` explicitly loads `.env.local` (not the `dotenv/config` default of bare `.env`,
which doesn't exist in this project) — needed for `prisma migrate`/`db push`/`db seed` run via the
CLI directly (outside `bun run dev`) to see the right `DATABASE_URL` at all.

### Auth

next-auth v5, Google OAuth only, JWT sessions (no Prisma adapter, no next-auth-managed
Account/Session tables). Split into two files for Edge compatibility:
- `auth.config.ts` — providers only, **must stay free of any DB import**. Used by `proxy.ts`.
- `auth.ts` — full config including the `jwt`/`session` callbacks that upsert our own `User` row via Prisma. Used by API routes, server components, `app/api/auth/[...nextauth]/route.ts`.

`proxy.ts` (Next.js 16's renamed `middleware.ts`) builds its own lightweight `NextAuth(authConfig)`
instance rather than importing `auth` from `auth.ts` — importing the full config into Edge
middleware would pull in Prisma/Neon/`ws`, none of which run on the Edge runtime. Don't collapse
these two files back into one without re-checking that constraint.

`session.user.id` is populated via `types/next-auth.d.ts` module augmentation — it's not on
next-auth's default `Session` type.

The `jwt` callback's `db.user.upsert()` is wrapped in try/catch — if the DB is unreachable (dummy
`DATABASE_URL` during local dev), sign-in falls back to using the email as `token.userId` rather
than failing outright. Auth itself and a broken database are deliberately decoupled failure modes.

**Dev-only auth bypass** (`auth.ts`, gated by `DEV_BYPASS_AUTH` + `NEXT_PUBLIC_DEV_BYPASS_AUTH` in
`.env.local`, hard-disabled whenever `NODE_ENV === "production"` regardless of the env var): adds a
`Credentials` provider (`id: "dev-bypass"`) that signs you in as a fixed `dev@buildrstudio.local`
user with zero fields, no Google round-trip. `SiteNav.tsx` and `PaddleCheckoutButton.tsx` both check
`isDevAuthBypassEnabled()` (`app/lib/devAuth.ts`) and call `signIn("dev-bypass")` instead of
`signIn("google")` when it's on. `SiteNav` also renders a persistent amber "DEV AUTH BYPASS ACTIVE"
banner site-wide whenever it's enabled, specifically so it's never silently forgotten. Turn it off
in `.env.local` (both vars) once testing the real Google flow again — it exists to unblock building
the rest of the app while Google OAuth setup was still in progress, not as a permanent feature.

### The embed/delivery layer

`public/widget.js` is what a customer pastes onto their own site:
```html
<script src="https://buildrstudio.in/widget.js" data-agent-id="support-agent-starter" data-key="pk_live_..."></script>
```
It's a vanilla-JS IIFE (no build step, no framework) that renders into a **Shadow DOM** (not an
iframe) so host-page CSS can't leak in or out, persists a session id in `localStorage`, and POSTs to
`/api/v1/chat`. Keep it dependency-free and small — there's no bundler step for this file, it ships
as-is from `public/`.

Appearance (greeting / brand color / position) resolves as `window.BuildrAgentConfig` (per-page
override) > the install's saved dashboard config from `GET /api/v1/config?key=&agent=` (public,
CORS-open, CDN-cached 5 min + stale-while-revalidate) > built-in defaults. The last fetched config is
cached in `localStorage` (`buildr_agent_config_<agent>`) so repeat views render instantly; on a
first view the widget waits up to 1.5s for the config before rendering with defaults. It sends the
host `page_url` on a session's first message.

`app/api/v1/chat/route.ts` is what it talks to: validates the `Authorization: Bearer pk_live_...`
key against `ApiKey`, rate-limits per key (in-memory — see `app/lib/rateLimit.ts`, acceptable for
MVP per the plan's constraints), checks the caller's monthly quota (falls back to a small
`TRIAL_MONTHLY_LIMIT` if there's no active subscription, so the widget is testable pre-purchase),
retrieves relevant knowledge-base chunks (see below) if the customer has any, calls Gemini (via
`generateReply()` in `app/lib/gemini.ts`) with the agent's DB-configured system prompt + retrieved
context + last 10 messages, and persists the exchange. It's deliberately CORS-open
(`Access-Control-Allow-Origin: *`) — the widget embeds on arbitrary third-party origins, so auth is
the API key, not same-origin cookies.

### Free trial (no card)

`app/lib/trial.ts` holds the limits (`TRIAL_MESSAGE_LIMIT = 100`, `TRIAL_DAYS = 14`) and is
client-safe so copy and the dashboard read the same numbers. `app/lib/trialServer.ts#startTrial`
(called by `POST /api/trials`, which the dashboard calls — agent pages link to
`/dashboard/integrations?trial=<slug>`) creates an `ApiKey` + `Trial` row without Paddle. Rules:
one trial per user per agent (DB unique), one active trial per account, live agents only. The chat
route enforces the trial window + message count when there's no active subscription. On payment
the Paddle webhook reuses the trial key (its existing "reuse a key for user+agent" behaviour) and
calls `markTrialConverted()`, so the customer's embed keeps working after upgrading.

### Website knowledge sources ("Train from a website URL")

`app/lib/crawler.ts` crawls a start URL (BFS over same-site links) or a sitemap.xml (one level of
sitemap index): max 50 pages, 8s per page, ~35s total budget, 4 concurrent fetches, robots.txt
honoured (`BuildrStudioBot` group, else `*`), nav/header/footer/script/style stripped with
`node-html-parser`, content-hash dedupe. All network access goes through `app/lib/safeFetch.ts`
(SSRF guard: http/https + ports 80/443 only, private/loopback/link-local/CGNAT/metadata IPs refused
at *connect time* via a custom DNS lookup, redirects re-validated). `app/lib/websiteKnowledge.ts`
chunks per page, embeds with `batchEmbedContents`, and replaces only that `KnowledgeSource`'s chunks
(`DocumentChunk.sourceId`). Pasted text is `sourceId = null` and is still replaced as a whole on save.
All sources share `MAX_CHUNKS_PER_KEY`. Runs synchronously in the request (`maxDuration = 60`).

### Lead capture + handoff

`app/lib/handoff.ts` decides when the chat API returns `handoff: { reason }`: the visitor asked for a
person / callback / pricing (regex), the model ended its reply with `[[HANDOFF]]` (instruction
appended to every system prompt, token stripped before returning), or the install has knowledge
but the best chunk scored under `LOW_CONFIDENCE_SCORE`. `public/widget.js` then shows a lead form
(also reachable via "Talk to a person" in the header) that posts to `POST /api/v1/leads`
(CORS-open, key-authenticated, honeypot + per-IP/per-key rate limits). Leads are stored in `Lead`
(tied to ApiKey/Agent/User and the ChatSession). `app/lib/leads.ts#notifyLead` runs in `after()`:
email via Resend only when `RESEND_API_KEY` + `LEADS_FROM_EMAIL` are set, and a per-install webhook
(`ApiKey.leadWebhookUrl`, https only, sent via `safePost` for SSRF safety, signed
`X-BuildrStudio-Signature: sha256=HMAC(secret, "<timestamp>.<body>")`). WhatsApp is a wa.me
click-to-chat link returned to the visitor when the owner set `ApiKey.whatsappNumber`. Dashboard:
`/dashboard/leads` + CSV export (`/api/leads/export`), settings modal "Lead handoff".

### INR payments (Razorpay), alongside Paddle

Feature-flagged. Everything is off (Paddle only) unless `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
and `RAZORPAY_WEBHOOK_SECRET` are set. Each tier also needs `RAZORPAY_PLAN_<AGENT_SLUG>_<TIER>`,
e.g. `RAZORPAY_PLAN_SUPPORT_AGENT_STARTER_STANDARD`. INR prices are never in code: they're read
from the Razorpay plan (`GET /v1/plans/:id`, cached 10 min), and non-INR plans are ignored.

- `app/lib/razorpay.ts`: fetch-based API client, signature checks, status mapping.
- `app/lib/razorpayServer.ts`: `applyRazorpaySubscription` (upserts AgentSubscription with
  `provider = "razorpay"`) and `getInrTierOptions`.
- Flow:
  - `/api/razorpay/plans?agent=` (public; enabled flag, INR labels, `suggestInr` from
    `x-vercel-ip-country` / Accept-Language)
  - `POST /api/razorpay/subscribe` (creates the subscription and a `status: "created"` row)
  - checkout.js (`RazorpayCheckoutButton`)
  - `POST /api/razorpay/verify` (HMAC of `payment_id|subscription_id`, then re-reads the status
    from Razorpay)
  - `POST /api/webhooks/razorpay` (HMAC of the raw body; idempotent via `ProcessedWebhookEvent`
    keyed on `x-razorpay-event-id`; the entity's status is the source of truth)
  - `POST /api/razorpay/cancel` (cancel at cycle end; Razorpay has no customer portal)
- Access is granted by `app/lib/subscriptionAccess.ts#grantAgentAccess`, which is shared with the
  Paddle webhook: create a key if the user has none for the agent (trial keys are kept), then mark
  the trial converted.
- Only `status: "active"` grants access anywhere.
- `bun run test:razorpay` checks signatures with fake secrets.

### WordPress plugin

`integrations/wordpress/buildrstudio/` is a standalone GPL WordPress plugin: a settings page and a
footer enqueue of `widget.js`, with `data-*` attributes added via `script_loader_tag`. It isn't
part of the Next build. `npm run zip:wordpress` builds `public/downloads/buildrstudio-wordpress.zip`
(committed, deterministic). Re-run it after any plugin edit. `npm run check:wordpress-zip` detects
drift. See `integrations/wordpress/README.md`.

### Conversation log + unanswered questions

The chat route stores every exchange (`ChatSession` with `pageUrl`, `messageCount`,
`lastMessageAt`; `Message` rows). When an answer is flagged by `app/lib/handoff.ts#unansweredReason`
(model emitted the handoff token, or best RAG score under `LOW_CONFIDENCE_SCORE`) it also writes an
`UnansweredQuestion`. Dashboard: `/dashboard/conversations` (7d/30d counts, list, detail at
`/dashboard/conversations/[id]`) and `/dashboard/unanswered`, where "Add answer to knowledge"
(`POST /api/unanswered/[id]`) embeds a Q&A chunk into a per-install `KnowledgeSource` of kind `qa`
(`app/lib/qaKnowledge.ts`). Pasted-text saves only replace `sourceId = null` chunks, so Q&A and
website chunks survive.

### Knowledge base / retrieval-augmented generation

**This is what makes an agent actually useful, not just a demo** — without it, every subscriber to
an agent got the identical generic system prompt with zero knowledge of their actual business (that
was true of every "live" agent until 2026-08-26). `app/lib/knowledge.ts` + the dashboard's
"Knowledge base" section in `IntegrationsHub.tsx` + `app/api/keys/[id]/knowledge/route.ts` close
that gap, deliberately kept simple for indie/small-business scale rather than enterprise-grade:

- **One knowledge base per `ApiKey`** (one install = one knowledge base), not a multi-document CMS.
  Uploading replaces the previous one entirely (`DocumentChunk.deleteMany` then re-create in a
  `$transaction`) — there's no per-document add/remove.
- **Plain text + websites.** Paste text directly, or pick a `.txt`/`.md` file — the browser reads it with
  `file.text()` client-side and appends it into the same textarea; there's no server-side file
  upload endpoint and no PDF parsing. Websites are crawled separately (see above). Deliberately deferred, not forgotten — see the
  plan doc if reviving this decision.
- **Chunking is naive**: fixed-size character windows (800 chars, 100 overlap) in `chunkText()` —
  no sentence-aware or semantic chunking. Fine at this scale; revisit only if quality actually
  suffers for real customers.
- **Embeddings are `gemini-embedding-001`** (3072-dim, verified against a real key — see
  `scripts/check-gemini-models.mjs` for how to re-check if it's ever retired like `gemini-1.5-flash`
  was), stored as plain `Float[]` columns on `DocumentChunk`, **not pgvector.** Retrieval
  (`retrieveRelevantChunks()`) fetches all of one customer's chunks and computes cosine similarity
  in application code. This is a deliberate simplicity trade-off: at a few hundred chunks per
  customer (indie/small-business scale, capped at `MAX_CHUNKS_PER_KEY = 300`), an in-app scan is
  fast enough and avoids managing a Postgres extension entirely. Don't reach for pgvector unless a
  real customer's usage actually demands it.
- **The on-site demo does NOT use this** — `/api/v1/demo` is deliberately DB-free (see below) and
  has no per-customer identity to scope a knowledge base to. Retrieval only happens on the paid,
  API-key-authenticated `/api/v1/chat` path.
- Embedding calls in the upload route run **sequentially, not in parallel** (`for` loop, not
  `Promise.all`) — deliberately avoids bursting dozens of concurrent requests at Gemini for one
  upload.

### The on-site live demo

`/agents/[slug]` (for `status: "live"` products) also embeds `LiveDemoChat.tsx`, a first-party chat
UI (plain React, not Shadow DOM — no host-page isolation needed since it's not embedding on a
third-party site) that calls `app/api/v1/demo/route.ts`. This is a deliberately separate, simpler
path from the paid widget: **no API key, no login, no database at all** — it reads system
prompt/model straight from the static `app/lib/agentRuntime.ts` (the same config `prisma/seed.ts`
uses to seed the DB), rate-limits by IP instead of by key, and never persists anything. The point is
that the marketplace's core claim ("this agent actually works") is demonstrable with nothing
configured except `GEMINI_API_KEY`. Without that key set, it returns a reply clearly prefixed
`"(Demo mode — ...)"` rather than erroring — don't remove that label or make the mock reply
indistinguishable from a real one.

### Payments (Paddle)

`app/components/PaddleCheckoutButton.tsx` opens Paddle's client-side overlay checkout
(`@paddle/paddle-js`) with `customData: { userId, agentId, tierId }` — that gets echoed back on
webhook events, which is how `app/api/webhooks/paddle/route.ts` correlates a
`subscription.created`/`.updated`/`.canceled` event back to our own `AgentSubscription` row without
needing to guess from Paddle's own IDs. The webhook also auto-provisions an `ApiKey` on first
activation so the dashboard has something to show immediately after purchase.

Checkout also sets `settings.successUrl` to `/dashboard/integrations?welcome=1` — the dashboard
(`IntegrationsHub.tsx`) reads that query param to show a one-time "you're all set" banner, then
strips it via `router.replace`. There's a small unhandled race here: if the buyer lands on the
dashboard before Paddle's webhook has finished processing, their new subscription/API key won't be
there yet on first paint. No retry/polling was added for this — acceptable for now, revisit if it
turns out to matter in practice.

**Managing/canceling a subscription** happens through Paddle's own hosted customer portal, not a
page we built — `app/api/portal/route.ts` calls `paddle.customerPortalSessions.create()` for one
`AgentSubscription` at a time (ownership-checked) and returns the portal URL; the dashboard's
"Manage subscription" button (only shown when `IntegrationRow.subscriptionId` is set — i.e. not for
trial-only users) opens it in a new tab. Don't build custom cancel/payment-method UI — Paddle's
portal already does this correctly and is the merchant of record's responsibility, not ours.

**Pricing exists now, but only in Paddle *sandbox*** (set 2026-08-26: $19/mo Standard, $49/mo Pro on
both live agents — see the plan's decisions log for the reasoning and the actual product/price IDs).
`AgentTier.paddlePriceId` is set for both live agents' tiers, so checkout shows a real "Get this
agent" button — but this is sandbox money, not a production commitment. `AgentTier.paddlePriceId`
stays nullable by design: checkout refuses to open (shows "Notify me when priced" instead) for any
tier with no price ID, which is still true for the two `coming-soon` products. Going live for real
needs authenticating the `paddle-live` MCP tool and a deliberate decision that these numbers are
final, not just sandbox-tested — don't treat the sandbox IDs as production-ready without that step.

**`PADDLE_API_KEY` is real (sandbox).** Paddle has no API to create one — it was created by hand in
the Paddle dashboard via browser automation, then verified by calling Paddle directly through
`@paddle/paddle-node-sdk`. If it's ever lost or revoked, it has to be recreated the same way
(dashboard → Developer Tools → Authentication), not through the Paddle MCP — that gap is confirmed,
not just unexplored.

## Key conventions

- **All pages include SEO metadata** — `export const metadata` (or `generateMetadata` for dynamic routes), Open Graph, Twitter cards, JSON-LD. Maintain this when adding routes.
- **`"use client"` is explicit** — hub/interactive components are client components; route `page.tsx` files are server components.
- **Path alias:** `@/*` maps to the project root (mostly unused in favor of relative imports so far — follow whichever a file already uses).
- **No test files exist.** Validate changes with `bun run build` (catches TS errors across the whole app) and `bun run lint`.
- **`/dashboard/*` is auth-gated** by `proxy.ts` and carries `robots: { index: false }` — don't add it to `sitemap.ts`.
- **Never build a real checkout price into code** while plan Section 9's pricing decision is open — see "Payments" above.

## Environment variables

See `.env.example` for the full list with comments. Summary: `DATABASE_URL` (Neon), `AUTH_SECRET` +
`GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (auth), `GEMINI_API_KEY`, `PADDLE_API_KEY` +
`PADDLE_WEBHOOK_SECRET` + `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` (billing). All are optional at build
time (see "The app builds and runs with zero environment variables configured" above) but required
for the corresponding feature to actually work at runtime. `.env.local` (gitignored) currently holds
dummy values for local dev — see that file's header comment for exactly what does/doesn't work with
dummy values.

## Common tasks

### Adding a new marketplace product

1. Add an entry to `app/lib/agentCatalog.ts` (marketing copy) with `status: "coming-soon"` until it's ready.
2. Add its operational config (system prompt, model) to `prisma/seed.ts`, run `bunx prisma db seed`.
3. It automatically appears on `/agents` and gets a `/agents/[slug]` page.
4. Add the slug to `sitemap.ts`.
5. Flip `status` to `"live"` once pricing exists and a real Paddle price ID is set on its `AgentTier` rows.

### Changing the Prisma schema

1. Edit `prisma/schema.prisma`.
2. `bunx prisma generate` (regenerates `generated/prisma/`, needed for TS types — doesn't need a live DB connection).
3. `bunx prisma migrate dev --name <description>` to apply against a real database (needs `DATABASE_URL`).

### Modifying the design system

Edit `app/globals.css` directly — tokens, reset, a11y, keyframes. There's no separate design-system
source directory. Keep the light-only, no-toggle approach unless explicitly asked to add dark mode.

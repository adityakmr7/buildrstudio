# CLAUDE.md — BuildrStudio

## What is this project?

BuildrStudio is a suite of free browser-based developer tools for creating polished visual assets — App Store screenshot mockups, social media graphics, and changelog cards. It targets indie hackers, solo developers, and small teams who need launch-ready visuals without Figma or Photoshop.

**Live site:** https://buildrstudio.in
**Author:** Aditya Kumar (@adityakmr7)

## Tech stack

- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + custom "Ink Design System" (CSS custom properties, no component library)
- **Package manager:** Bun (bun.lock)
- **Database:** Neon Postgres (serverless driver `@neondatabase/serverless`) — users, subscriptions, waitlist
- **Auth:** NextAuth.js v5 (Auth.js) with Google OAuth, JWT sessions
- **Payments:** Lemon Squeezy (subscription billing, webhook-driven)
- **Screenshot capture:** `html-to-image` and `modern-screenshot` for client-side PNG export
- **Analytics:** Vercel Analytics, Vercel Speed Insights, Umami
- **Deployment:** Vercel
- **Linting:** ESLint 9 with `eslint-config-next` (core-web-vitals + typescript)
- **Font:** DM Sans via `next/font/google`

## Commands

```bash
bun run dev          # Start dev server on port 3005
bun run build        # Production build
bun run start        # Start production server
bun run lint         # Run ESLint
```

There are no tests configured. Type checking uses `tsc --noEmit` implicitly via the Next.js build.

## Project structure

```
app/
  layout.tsx                    # Root layout — DM Sans font, Vercel analytics, Umami script
  page.tsx                      # Landing page (SaaSLandingPage component)
  globals.css                   # Ink Design System (all-in-one, flattened from ink-design-system/)
  api/interest/route.ts         # POST endpoint — saves waitlist/interest emails to Neon
  lib/
    interest.ts                 # Neon DB helper for waitlist_requests table
  components/
    AppHeader.tsx               # Shared sticky header with nav dropdown, mobile drawer, theme toggle
    SaaSLandingPage.tsx         # Marketing landing page (hero, tools grid, pricing, FAQs)
    WorkspaceHub.tsx            # Social Optimizer workspace — sidebar + canvas
    TabbedSidebar.tsx           # Sidebar with tabbed controls for the social optimizer
    LivePreviewCanvas.tsx       # Live canvas renderer for social optimizer
    ControlSidebar.tsx          # Legacy sidebar (superseded by TabbedSidebar)
    QuickPresets.tsx             # Preset gradient/style quick-apply buttons
    ThemeToggle.tsx             # Light/dark theme toggle (localStorage-backed)
    PremiumModal.tsx            # "Go Pro" waitlist modal — posts to /api/interest
    UnlockWatermarkModal.tsx    # Tweet-to-unlock watermark removal (24h localStorage)
    ChangeLogCard.tsx           # Changelog card renderer
    RoadmapRequestForm.tsx      # Roadmap vote form — posts to /api/interest
  social-optimizer/page.tsx     # Route: /social-optimizer — wraps WorkspaceHub
  screenshot-builder/
    page.tsx                    # Route: /screenshot-builder
    ScreenshotBuilderHub.tsx    # Multi-screen deck manager with canvas + sidebar
    components/
      BuilderSidebar.tsx        # Config sidebar for screenshot builder
      BuilderCanvas.tsx         # Canvas renderer with device frames
      DeviceFrame.tsx           # SVG/CSS device frame overlays
    lib/deviceSpecs.ts          # Device dimensions (Apple/Google canonical sizes), BuilderConfig type
  change-log/
    page.tsx                    # Route: /change-log
    ChangelogGenerator.tsx      # Changelog card editor
  roadmap/page.tsx              # Route: /roadmap — feature voting page
  app-store-screenshot-sizes/
    page.tsx                    # Route: /app-store-screenshot-sizes — SEO guide built from deviceSpecs
  lib/track.ts                  # Umami event tracking helper (client-safe no-op)
  anchor/                       # Privacy policy & support pages for Anchor app
  flowzy/                       # Privacy, support, terms pages for Flowzy app
  sitemap.ts                    # Dynamic sitemap generation
  robots.ts                     # Robots.txt generation

ink-design-system/              # Modular CSS source files for the Ink Design System
  index.css                     # Entry point (imports all modules)
  tokens.css, base.css, typography.css, buttons.css, cards.css,
  inputs.css, chips.css, list.css, selection.css, progress.css,
  navigation.css, feedback.css

docs/                           # Internal specs and documentation
public/                         # Static assets (SVGs, OG image)
```

## Architecture patterns

### Routing

Next.js App Router with file-based routing. Each route page is a **server component** that exports `metadata` and structured data (`JSON-LD`), then renders a `"use client"` hub component.

### Styling approach

**No Tailwind utility classes in components.** The project uses a custom CSS design system called "Ink" via CSS custom properties (`--bg`, `--surface`, `--text-1`, `--fill`, etc.). Components use a mix of:

1. **Ink Design System classes** defined in `globals.css` (e.g., `.btn-fill`, `.card-default`, `.chip-subtle`, `.ink-body`)
2. **Inline `<style>` tags** inside client components for component-scoped styles
3. **Inline `style` props** for one-off layout adjustments

When adding new UI, follow the existing pattern: use Ink classes where available, add scoped `<style>` blocks for component-specific styles.

### Theme system

Light/dark theming via `data-theme` attribute on `<html>`. CSS custom properties switch values between themes. `ThemeToggle` component manages the toggle and persists to `localStorage` under key `ink-theme`.

### State management

No global state library. Each workspace hub component (`WorkspaceHub`, `ScreenshotBuilderHub`) manages its own state with `useState`. Configuration objects (e.g., `BuilderConfig`, `OptimizationConfig`) are passed down as props.

### Export/capture

Client-side screenshot export uses `html-to-image` / `modern-screenshot`. The canvas wrapper uses `ref` + `useImperativeHandle` to expose `exportPng()` and `copyToClipboard()` methods.

## Key conventions

- **All pages include SEO metadata** — `export const metadata`, Open Graph tags, Twitter cards, and JSON-LD structured data. Maintain this when adding new routes.
- **`"use client"` is explicit** — hub/interactive components are client components; route pages are server components.
- **Path alias:** `@/*` maps to the project root.
- **No test files exist.** Validate changes by running `bun run build` and checking the dev server.
- **CSS classes use the Ink naming convention** — lowercase with hyphens (`.btn-fill`, `.card-default`, `.ctrl-label`).
- **Component file naming:** PascalCase for `.tsx` files, camelCase for `.ts` utility files.
- **The `AppHeader` component is shared across all routes** — it accepts `activeRoute` and `onOpenPremium` props.

### Authentication & payments

- **Auth:** NextAuth.js v5 with Google OAuth, JWT session strategy. Config in root `auth.ts`.
- **Session:** `AuthProvider` (SessionProvider) wraps the app in `layout.tsx`. Use `useSession()` in client components.
- **Pro gating:** `session.user.isPro` boolean is set in the JWT callback by checking the `subscriptions` table.
- **Checkout flow:** User clicks "Go Pro" → PremiumModal (plan selector: $29 one-time Launch Pack or $9/mo Pro) → if signed in, POST `/api/checkout` with `{plan}` → redirect to Lemon Squeezy hosted checkout → webhook updates subscription status.
- **Webhooks:** `/api/webhooks/lemonsqueezy` verifies HMAC signature and upserts subscription records. Subscription events cover the $9/mo plan; `order_created` events for the lifetime variant are stored as status `lifetime` (never expires). The `order_created` event must be enabled in the Lemon Squeezy webhook config.
- **Pricing:** Launch Pack $29 one-time (primary offer) and Pro $9/mo. Any paid plan grants unlimited AI generations; free users get 5 lifetime.
- **Analytics:** Umami events via `app/lib/track.ts` — `export_single`, `export_batch`, `watermark_modal_open`, `watermark_unlocked`, `premium_modal_open`, `checkout_start`.

## Environment variables

```bash
# Required for database
NEON_DATABASE_URL=postgresql://...   # or DATABASE_URL

# Required for auth
AUTH_SECRET=<random-32-char-string>       # NextAuth.js secret (run: openssl rand -base64 32)
GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-client-secret>

# Required for payments
LEMONSQUEEZY_API_KEY=<ls-api-key>
LEMONSQUEEZY_STORE_ID=<ls-store-id>
LEMONSQUEEZY_VARIANT_ID=<ls-variant-id>                  # The $9/mo Pro subscription variant
LEMONSQUEEZY_LIFETIME_VARIANT_ID=<ls-lifetime-variant>   # The $29 one-time "Launch Pack" variant
LEMONSQUEEZY_AI_VARIANT_ID=<ls-ai-variant-id>            # The $20/mo AI Pro plan variant (legacy)
LEMONSQUEEZY_WEBHOOK_SECRET=<ls-webhook-signing-secret>

# App URL (for checkout redirects)
NEXT_PUBLIC_APP_URL=https://buildrstudio.in

# AI copywriting (Gemini free tier)
GEMINI_API_KEY=<google-ai-studio-api-key>
```

## Database

Tables in Neon Postgres, auto-created on first write:

- **`users`** — id, email, name, image, email_verified, created_at
- **`subscriptions`** — user_id, ls_subscription_id, status, current_period_end, cancel_at_period_end
- **`waitlist_requests`** — email collection for interest/roadmap forms

## Common tasks

### Adding a new tool/route

1. Create `app/<tool-name>/page.tsx` as a server component with metadata + JSON-LD
2. Create the client hub component (e.g., `<ToolNameHub />`)
3. Add the route to `AppHeader.tsx` dropdown and mobile drawer
4. Add to `sitemap.ts`
5. Add a tool card to `SaaSLandingPage.tsx` tools grid
6. Add footer link in `SaaSLandingPage.tsx`

### Modifying the design system

Edit `app/globals.css` directly. The `ink-design-system/` directory contains the modular source but `globals.css` is the consumed version. Keep both in sync if modifying tokens or adding new component classes.

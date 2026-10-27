# AGENTS.md — BuildrStudio

## What is this project?

BuildrStudio is an **independent digital product company** founded by Aditya Kumar (@adityakmr7). We build thoughtful digital products that make everyday life a little clearer, easier, and more meaningful.

Featured products:
- **Numa**: A gentle pregnancy and baby companion designed to bring clarity, comfort, and room for reflections (in Android internal testing on Google Play). Routes: `/products/numa`, `/products/numa/privacy`, `/products/numa/help`.
- **ArrowOut (Clear & Escape)**: A puzzle game with 90 original puzzles, coming to iPhone and iPad. Routes: `/products/arrow-out`, `/products/arrow-out/privacy`, `/products/arrow-out/help`, `/products/arrow-out/terms` (with legacy `/arrow-out/*` routes permanently redirecting to `/products/arrow-out/*`).
- **Pulseflip**: Mobile game with missions, cosmetic unlocks, and run scoring. Routes: `/products/pulse-flip`, `/products/pulse-flip/privacy`, `/products/pulse-flip/terms`, `/products/pulse-flip/support`.

**Live site:** https://buildrstudio.in  
**Author:** Aditya Kumar (@adityakmr7)

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack) with React 19
- **Language:** TypeScript (strict mode)
- **Styling:** CSS variables (`globals.css`) and scoped styles, light theme design system (`--bg: #F5F8FC`, `--surface: #FFFFFF`, `--text: #0F172A`, `--muted`, `--border`). No Tailwind utility classes in components.
- **Package manager:** Bun (`bun.lock`)
- **Analytics:** Vercel Analytics, Vercel Speed Insights, Umami
- **Deployment:** Vercel
- **Linting:** ESLint 9 with `eslint-config-next`

## Commands

```bash
bun run dev          # Start dev server on port 3005
bun run build        # Production build
bun run start        # Start production server
bun run lint         # Run ESLint
```

## Project structure

```
app/
  layout.tsx                    # Root layout — Geist font, analytics (Speed Insights, Analytics, Umami)
  page.tsx                      # Homepage (server) — renders CompanySite
  globals.css                   # Theme tokens, font variables, resets
  components/
    CompanySite.tsx             # Main company presentation & product portfolio
    Wordmark.tsx                # Shared BuildrStudio SVG mark & typography
  lib/
    siteConfig.ts               # Site title, description, URLs, contact/author info
    products.ts                 # Product portfolio metadata (Numa, ArrowOut, Pulseflip)
    track.ts                    # Umami event tracking helper
  privacy/page.tsx              # /privacy — Company privacy policy
  terms/page.tsx                # /terms — Company terms & conditions
  products/
    numa/                       # /products/numa detail, privacy, and help pages
    arrow-out/                  # /products/arrow-out detail, privacy, help, and terms pages
    pulse-flip/                 # /products/pulse-flip detail, privacy, terms, and support pages
  arrow-out/                    # Legacy 308 permanent redirects to /products/arrow-out/*
  sitemap.ts, robots.ts
```

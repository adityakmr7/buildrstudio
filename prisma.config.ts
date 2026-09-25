import { config as loadEnv } from "dotenv";

// Bare `dotenv/config` only auto-loads `.env`, but this project's real
// values live in `.env.local` (Next.js's own convention, which the rest of
// the app already relies on) — there is no `.env` file. Without this, the
// Prisma CLI (migrate/db seed/studio) silently sees no DATABASE_URL even
// though `bun run dev` works fine, since Next.js loads `.env.local` itself
// but the standalone Prisma CLI process doesn't.
loadEnv({ path: ".env.local" });

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Points at the existing Neon Postgres instance — no new database
    // provider. Set DATABASE_URL in .env.local to your Neon connection
    // string (the "BuildrStudio" project, reused rather than creating a
    // new one — see .env.local's own comment for details).
    url: env("DATABASE_URL"),
  },
});

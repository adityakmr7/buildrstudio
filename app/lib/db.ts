// Prisma client singleton — points at the existing Neon Postgres instance via
// Neon's serverless driver (matches @neondatabase/serverless already used
// elsewhere in this project), not a new database provider.
//
// Prisma 7 requires a driver adapter rather than a bare connection string —
// see prisma/schema.prisma for why the datasource block has no `url`.
//
// The client is constructed lazily, behind a Proxy, rather than eagerly at
// module load. Next.js evaluates route/page modules during its build-time
// "collect page data" step even for code paths that never run in a given
// request — an eager `new PrismaClient()` would throw the moment
// DATABASE_URL is unset and crash the entire build, rather than failing
// only where the database is actually touched (which callers already
// handle — see the try/catch around DB calls in app/agents/[slug]/page.tsx).

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { PrismaClient } from "../../generated/prisma/client";

neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Point it at your Neon connection string (see .env.example).",
    );
  }

  // The `?schema=` query param in a Postgres connection string is honored
  // natively by the Prisma CLI (migrate/db push), but @prisma/adapter-neon's
  // runtime client does NOT parse it out of the connection string itself —
  // it has to be passed explicitly as a separate option, or every query
  // silently falls back to the `public` schema. Not currently in use
  // (DATABASE_URL has no `schema=` param — this project has its own
  // dedicated Neon database, plain `public` schema, no isolation needed),
  // but kept so a `?schema=` param just works if one's ever added back —
  // see CLAUDE.md's Database section for why that mattered once before.
  const schema = new URL(connectionString).searchParams.get("schema") ?? undefined;

  const adapter = new PrismaNeon({ connectionString }, schema ? { schema } : undefined);
  return new PrismaClient({ adapter });
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient() as object, prop, receiver);
  },
});

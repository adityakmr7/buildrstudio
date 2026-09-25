import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { db } from "./app/lib/db";

// The full config, used everywhere except proxy.ts (Edge runtime only — see
// auth.config.ts for why). JWT sessions, no Prisma adapter — this project
// deliberately doesn't use next-auth's own Account/Session/VerificationToken
// tables (see prisma/schema.prisma). We upsert our own lightweight `User`
// row on sign-in and stash its id on the token so `session.user.id` is
// available wherever the app needs to look up subscriptions/API keys/usage.

// ── Dev-only auth bypass ────────────────────────────────────────────────
// Lets you sign in as a fixed local user without a working Google OAuth
// client or a reachable database — for building/testing everything *except*
// auth itself. Gated two ways: an explicit opt-in env var AND a hard
// NODE_ENV check, so this can never end up reachable in a production build
// even if the env var leaked into a prod environment by mistake.
// Toggle via DEV_BYPASS_AUTH in .env.local — see .env.example.
const devBypassEnabled = process.env.NODE_ENV !== "production" && process.env.DEV_BYPASS_AUTH === "true";

const DEV_USER = { id: "dev-user", email: "dev@buildrstudio.local", name: "Dev User" };

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    ...(devBypassEnabled
      ? [
          Credentials({
            id: "dev-bypass",
            name: "Dev bypass (local only)",
            credentials: {},
            async authorize() {
              return DEV_USER;
            },
          }),
        ]
      : []),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, profile, user }) {
      // `profile` comes from Google; `user` is what Credentials' authorize()
      // returned — same handling either way, just a different source.
      const email = profile?.email ?? user?.email;
      if (!email) return token;

      try {
        const dbUser = await db.user.upsert({
          where: { email },
          update: {
            name: profile?.name ?? user?.name ?? undefined,
            image: (profile as { picture?: string } | undefined)?.picture,
          },
          create: {
            email,
            name: profile?.name ?? user?.name ?? undefined,
            image: (profile as { picture?: string } | undefined)?.picture,
          },
        });
        token.userId = dbUser.id;
      } catch (err) {
        // DB unreachable (e.g. dummy DATABASE_URL during local dev) — don't
        // fail sign-in over it. Downstream Prisma calls will fail on their
        // own terms (and already handle that gracefully); this just makes
        // sure a broken DB doesn't also break auth itself.
        console.error("[auth] could not upsert user, DB may be unreachable — using email as a fallback id:", err);
        token.userId = email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
});

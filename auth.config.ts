import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Split out from auth.ts so middleware.ts (which runs on the Edge runtime)
// can do session checks without pulling in the Prisma/Neon/`ws` stack from
// app/lib/db.ts — Edge doesn't support those Node APIs. This file must stay
// free of any database imports.
//
// clientId/clientSecret are passed explicitly rather than left for
// next-auth's env-var auto-inference — that inference looks for
// AUTH_GOOGLE_ID/AUTH_GOOGLE_SECRET, but this project's env vars (matching
// .env.example everywhere) are named GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET.
// A bare `Google` provider silently sends client_id=undefined to Google's
// OAuth endpoint instead of erroring — this only surfaced in production
// (2026-08-27) because every local test used DEV_BYPASS_AUTH, which never
// exercises the real Google flow at all.
export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

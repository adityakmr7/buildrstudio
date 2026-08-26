import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Split out from auth.ts so middleware.ts (which runs on the Edge runtime)
// can do session checks without pulling in the Prisma/Neon/`ws` stack from
// app/lib/db.ts — Edge doesn't support those Node APIs. This file must stay
// free of any database imports.
export const authConfig: NextAuthConfig = {
  providers: [Google],
};

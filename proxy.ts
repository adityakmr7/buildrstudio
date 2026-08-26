import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Deliberately built from the lightweight authConfig, not the full ./auth —
// see auth.config.ts. Middleware runs on the Edge runtime, which can't load
// the Prisma/Neon/`ws` stack that the full config's callbacks pull in.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (!req.auth) {
    const signInUrl = new URL("/api/auth/signin", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};

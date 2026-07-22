import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PROTECTED_ROUTES = [
  "/screenshot-builder",
  "/social-optimizer",
  "/change-log",
  "/roadmap",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));

  if (isProtected && !req.auth) {
    const signInUrl = new URL("/", req.url);
    signInUrl.searchParams.set("signin", "1");
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }
});

export const config = {
  matcher: [
    "/screenshot-builder/:path*",
    "/social-optimizer/:path*",
    "/change-log/:path*",
    "/roadmap/:path*",
  ],
};

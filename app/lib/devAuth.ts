// Client-safe mirror of the server-side check in auth.ts. Next.js inlines
// NEXT_PUBLIC_* vars at build time, so this is safe to call from client
// components. Keep the two env var names in sync (DEV_BYPASS_AUTH /
// NEXT_PUBLIC_DEV_BYPASS_AUTH) — see .env.example.
export function isDevAuthBypassEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true";
}

export const DEV_BYPASS_PROVIDER_ID = "dev-bypass";

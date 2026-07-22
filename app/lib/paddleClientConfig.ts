// Client-safe Paddle.js configuration for the pricing-preview page.
//
// IMPORTANT: this file must never import or reference a server-side Paddle API key
// (PADDLE_API_KEY). Only NEXT_PUBLIC_ vars belong here, since they're inlined into
// client bundles at build time and are visible in browser JS.

export type PaddleClientEnvironment = "sandbox" | "production";

export interface PaddleClientConfig {
  environment: PaddleClientEnvironment;
  token: string;
}

/**
 * Reads and validates the Paddle.js client config from env vars.
 *
 * Throws if NEXT_PUBLIC_PADDLE_ENVIRONMENT is unset or isn't exactly "sandbox" or
 * "production" — we never silently default this, since guessing wrong means running
 * checkout against the wrong Paddle account.
 */
export function getPaddleClientConfig(): PaddleClientConfig {
  const rawEnvironment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT;

  if (rawEnvironment !== "sandbox" && rawEnvironment !== "production") {
    throw new Error(
      `NEXT_PUBLIC_PADDLE_ENVIRONMENT must be set to "sandbox" or "production" (got ${JSON.stringify(
        rawEnvironment ?? null,
      )}). Set it explicitly in .env — this is never defaulted, so a misconfigured ` +
        `deploy fails loudly instead of silently talking to the wrong Paddle account.`,
    );
  }

  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!token) {
    throw new Error(
      "NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set. Add a client-side token for the " +
        `${rawEnvironment} environment (see .env.example).`,
    );
  }

  return { environment: rawEnvironment, token };
}

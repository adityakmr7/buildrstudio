import { Paddle, Environment } from "@paddle/paddle-node-sdk";

const paddle = new Paddle(process.env.PADDLE_API_KEY ?? "", {
  environment: Environment.production,
});

export { paddle };

// ── Environment-aware client for the fulfillment layer ──────────────────────
//
// `paddle` above is intentionally hardcoded to the live account — it's the
// client the original checkout/webhook migration was built and tested
// against, and nothing about that should change silently.
//
// Some newer server-side calls (currently: minting a customer portal
// session) need to hit whichever Paddle account actually owns the
// customer/subscription ID in question. While the site is still sandbox-only
// pre-launch, that's the sandbox account; once verification passes and
// checkout starts running for real, it's the live account. Rather than
// guess, this reads PADDLE_ENVIRONMENT explicitly and fails loudly if it's
// missing or invalid — same policy as NEXT_PUBLIC_PADDLE_ENVIRONMENT on the
// client side, for the same reason (silently talking to the wrong Paddle
// account is worse than crashing).
let sandboxClient: Paddle | null = null;

export function getServerPaddleClient(): Paddle {
  const env = process.env.PADDLE_ENVIRONMENT;

  if (env !== "sandbox" && env !== "production") {
    throw new Error(
      `PADDLE_ENVIRONMENT must be set to "sandbox" or "production" (got ${JSON.stringify(
        env ?? null,
      )}). Set it explicitly in .env — this is never defaulted, so a misconfigured deploy ` +
        `fails loudly instead of silently calling the wrong Paddle account's API.`,
    );
  }

  if (env === "production") {
    return paddle;
  }

  if (!sandboxClient) {
    const sandboxKey = process.env.PADDLE_SANDBOX_API_KEY;
    if (!sandboxKey) {
      throw new Error(
        "PADDLE_SANDBOX_API_KEY is not set. Add the sandbox server-side API key from " +
          "Paddle Dashboard > Developer Tools > Authentication > API keys (see .env.example).",
      );
    }
    sandboxClient = new Paddle(sandboxKey, { environment: Environment.sandbox });
  }

  return sandboxClient;
}

// ── Webhook signature verification ───────────────────────────────────────────
//
// paddle.webhooks.unmarshal() only checks a request against ONE secret, but
// this app now needs to accept deliveries from two different Paddle
// accounts/secrets at the same endpoint: PADDLE_WEBHOOK_SECRET (the live
// notification destination, created during the original migration) and
// PADDLE_SANDBOX_WEBHOOK_SECRET (created for this fulfillment build, so
// sandbox test checkouts can be verified end-to-end against the real,
// deployed route before the site goes live). Signature verification itself
// is environment-agnostic — it's pure HMAC over the raw body — so trying
// each configured secret in turn is safe and doesn't require guessing which
// account a delivery came from.
export class PaddleWebhookVerificationError extends Error {}

export async function verifyPaddleWebhook(rawBody: string, signature: string) {
  const secrets = [process.env.PADDLE_WEBHOOK_SECRET, process.env.PADDLE_SANDBOX_WEBHOOK_SECRET].filter(
    (s): s is string => Boolean(s),
  );

  if (secrets.length === 0) {
    throw new PaddleWebhookVerificationError(
      "Neither PADDLE_WEBHOOK_SECRET nor PADDLE_SANDBOX_WEBHOOK_SECRET is configured — " +
        "at least one notification destination's signing secret is required.",
    );
  }

  for (const secret of secrets) {
    try {
      return await paddle.webhooks.unmarshal(rawBody, secret, signature);
    } catch {
      // Try the next configured secret before giving up.
    }
  }

  throw new PaddleWebhookVerificationError("Signature did not verify against any configured secret.");
}

export async function createCheckoutUrl({
  userId,
  userEmail,
  plan,
}: {
  userId: string;
  userEmail?: string | null;
  plan: "pro" | "lifetime";
}): Promise<string> {
  const priceId =
    plan === "lifetime"
      ? process.env.PADDLE_LIFETIME_PRICE_ID!
      : process.env.PADDLE_PRO_PRICE_ID!;

  const transaction = await paddle.transactions.create({
    items: [{ priceId, quantity: 1 }],
    customData: { user_id: userId },
    ...(userEmail ? { customer: { email: userEmail } } : {}),
    checkout: {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/?checkout=success`,
    },
  });

  const checkoutUrl = (transaction as { checkout?: { url?: string } }).checkout?.url;
  if (!checkoutUrl) throw new Error("Paddle did not return a checkout URL");
  return checkoutUrl;
}

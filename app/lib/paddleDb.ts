// Fulfillment-layer mirror of Paddle state, keyed on Paddle's own IDs.
//
// This is deliberately separate from the `users` / `subscriptions` tables in
// `app/lib/db.ts`, which are keyed on our internal NextAuth `user_id` and
// already drive `session.user.isPro` (see auth.ts). That existing gate stays
// untouched here so nothing regresses. These tables are the new source of
// truth for raw Paddle state — every customer, subscription, and completed
// transaction we've ever seen a verified webhook for — independent of
// whether we've been able to match a Paddle customer to one of our accounts.
// That decoupling matters: Paddle events must never be dropped just because
// we can't (yet) resolve an internal user for them.
//
// Table names: `paddle_customers` / `paddle_subscriptions` / `paddle_transactions`
// (prefixed, rather than the bare `customers` / `subscriptions` from the
// original spec) specifically to avoid colliding with the pre-existing
// `subscriptions` table, which is live infrastructure for a different
// purpose. Same Postgres conventions as the rest of app/lib/db.ts: raw SQL
// via the Neon serverless driver, snake_case columns, `now()` defaults.

import { getDb } from "./db";

export async function initPaddleTables() {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS paddle_customers (
      customer_id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS paddle_subscriptions (
      subscription_id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL REFERENCES paddle_customers(customer_id),
      status TEXT NOT NULL,
      price_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      scheduled_change_action TEXT,
      scheduled_change_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  // Not in the original spec's example, but needed to fulfill one-time
  // purchases (Launch Pack): those never create a subscription entity in
  // Paddle at all, so transaction.completed is the ONLY event that ever
  // fires for them. Mirroring transactions as their own table (rather than
  // faking a subscription row for a one-time purchase) keeps this faithful
  // to Paddle's actual object model and keeps `hasActiveAccess` simple.
  await sql`
    CREATE TABLE IF NOT EXISTS paddle_transactions (
      transaction_id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL REFERENCES paddle_customers(customer_id),
      subscription_id TEXT,
      status TEXT NOT NULL,
      price_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

export interface UpsertPaddleCustomerInput {
  customerId: string;
  email: string;
}

/** Idempotent upsert keyed on Paddle's customer_id. Safe to replay. */
export async function upsertPaddleCustomer(input: UpsertPaddleCustomerInput) {
  const sql = getDb();
  await sql`
    INSERT INTO paddle_customers (customer_id, email)
    VALUES (${input.customerId}, ${input.email})
    ON CONFLICT (customer_id) DO UPDATE SET
      email = EXCLUDED.email,
      updated_at = now()
  `;
}

/**
 * Ensures a placeholder customer row exists so a subscription/transaction
 * upsert never fails its FK constraint if events arrive out of order (e.g.
 * subscription.created delivered before customer.created — Paddle sends
 * at-least-once and doesn't guarantee ordering). Never overwrites a real
 * email that's already there.
 */
async function ensurePaddleCustomerStub(customerId: string) {
  const sql = getDb();
  await sql`
    INSERT INTO paddle_customers (customer_id, email)
    VALUES (${customerId}, '')
    ON CONFLICT (customer_id) DO NOTHING
  `;
}

export interface UpsertPaddleSubscriptionInput {
  subscriptionId: string;
  customerId: string;
  status: string;
  priceId: string;
  productId: string;
  scheduledChangeAction: string | null;
  scheduledChangeAt: string | null;
}

/** Idempotent upsert keyed on Paddle's subscription_id. Safe to replay. */
export async function upsertPaddleSubscription(input: UpsertPaddleSubscriptionInput) {
  await ensurePaddleCustomerStub(input.customerId);

  const sql = getDb();
  await sql`
    INSERT INTO paddle_subscriptions (
      subscription_id, customer_id, status, price_id, product_id,
      scheduled_change_action, scheduled_change_at
    ) VALUES (
      ${input.subscriptionId}, ${input.customerId}, ${input.status}, ${input.priceId}, ${input.productId},
      ${input.scheduledChangeAction}, ${input.scheduledChangeAt}
    )
    ON CONFLICT (subscription_id) DO UPDATE SET
      status = EXCLUDED.status,
      price_id = EXCLUDED.price_id,
      product_id = EXCLUDED.product_id,
      scheduled_change_action = EXCLUDED.scheduled_change_action,
      scheduled_change_at = EXCLUDED.scheduled_change_at,
      updated_at = now()
  `;
}

export interface UpsertPaddleTransactionInput {
  transactionId: string;
  customerId: string;
  subscriptionId: string | null;
  status: string;
  priceId: string;
  productId: string;
}

/** Idempotent upsert keyed on Paddle's transaction_id. Safe to replay. */
export async function upsertPaddleTransaction(input: UpsertPaddleTransactionInput) {
  await ensurePaddleCustomerStub(input.customerId);

  const sql = getDb();
  await sql`
    INSERT INTO paddle_transactions (
      transaction_id, customer_id, subscription_id, status, price_id, product_id
    ) VALUES (
      ${input.transactionId}, ${input.customerId}, ${input.subscriptionId}, ${input.status}, ${input.priceId}, ${input.productId}
    )
    ON CONFLICT (transaction_id) DO UPDATE SET
      status = EXCLUDED.status,
      subscription_id = EXCLUDED.subscription_id,
      price_id = EXCLUDED.price_id,
      product_id = EXCLUDED.product_id,
      updated_at = now()
  `;
}

/** Resolves a Paddle customer_id from an email — used to link a signed-in
 * NextAuth session (which only knows an email) to Paddle state (which is
 * keyed on customer_id) without storing a customer_id on the users table. */
export async function getPaddleCustomerByEmail(email: string): Promise<{ customerId: string } | null> {
  // Defensive: these tables are normally created by the first webhook write,
  // but a read can legitimately happen before any webhook ever fires (e.g. a
  // brand-new deployment, or a signed-in user visiting /account who's never
  // subscribed) — CREATE TABLE IF NOT EXISTS is idempotent and cheap, so we
  // don't assume the writer path has already run.
  await initPaddleTables();

  const sql = getDb();
  const rows = await sql`
    SELECT customer_id FROM paddle_customers WHERE lower(email) = lower(${email}) LIMIT 1
  `;
  return rows.length > 0 ? { customerId: rows[0].customer_id as string } : null;
}

/** Reverse lookup of getPaddleCustomerByEmail — used by the webhook handlers
 * to resolve an internal user from a subscription/transaction event, which
 * only carries a Paddle customer_id, not an email. */
export async function getPaddleCustomerEmail(customerId: string): Promise<string | null> {
  const sql = getDb();
  const rows = await sql`
    SELECT email FROM paddle_customers WHERE customer_id = ${customerId} LIMIT 1
  `;
  const email = rows[0]?.email as string | undefined;
  return email && email !== "" ? email : null;
}

export interface PaddleSubscriptionRow {
  subscriptionId: string;
  status: string;
  priceId: string;
  productId: string;
  scheduledChangeAction: string | null;
  scheduledChangeAt: string | null;
}

export async function getPaddleSubscriptionsForCustomer(
  customerId: string,
): Promise<PaddleSubscriptionRow[]> {
  await initPaddleTables();
  const sql = getDb();
  const rows = await sql`
    SELECT subscription_id, status, price_id, product_id, scheduled_change_action, scheduled_change_at
    FROM paddle_subscriptions
    WHERE customer_id = ${customerId}
    ORDER BY created_at DESC
  `;
  return rows.map((r) => ({
    subscriptionId: r.subscription_id as string,
    status: r.status as string,
    priceId: r.price_id as string,
    productId: r.product_id as string,
    scheduledChangeAction: r.scheduled_change_action as string | null,
    scheduledChangeAt: r.scheduled_change_at as string | null,
  }));
}

/**
 * Decides whether a Paddle customer currently has paid access.
 *
 * Rules (per spec):
 * - `active` and `trialing` subscriptions grant access.
 * - A `scheduled_change` to cancel/pause does NOT revoke access on its own —
 *   the subscription still grants access right up until its `status`
 *   actually flips (to `canceled`, etc.). We simply never look at
 *   scheduled_change_action here; only `status` matters.
 * - `paused` and `past_due` do not grant access (payment isn't currently
 *   collecting, or the subscription is dormant) — this is a judgment call
 *   the user should confirm matches their intended rules.
 * - A completed transaction for a one-time (non-subscription) price grants
 *   permanent access — this is how the Launch Pack works, since Paddle never
 *   creates a subscription entity for one-time purchases.
 */
export async function hasActiveAccess(customerId: string): Promise<boolean> {
  await initPaddleTables();
  const sql = getDb();

  const activeSub = await sql`
    SELECT 1 FROM paddle_subscriptions
    WHERE customer_id = ${customerId} AND status IN ('active', 'trialing')
    LIMIT 1
  `;
  if (activeSub.length > 0) return true;

  const completedOneTime = await sql`
    SELECT 1 FROM paddle_transactions
    WHERE customer_id = ${customerId}
      AND status = 'completed'
      AND subscription_id IS NULL
    LIMIT 1
  `;
  return completedOneTime.length > 0;
}

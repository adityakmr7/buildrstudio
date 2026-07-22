// Typed handlers for verified Paddle webhook events. Each function assumes
// the caller (app/api/webhooks/paddle/route.ts) has ALREADY verified the
// request's signature — nothing here re-checks authenticity.
//
// Each handler does two things:
//   1. Mirrors the raw Paddle state into the new customer_id-keyed tables
//      (app/lib/paddleDb.ts) — the new fulfillment source of truth.
//   2. Dual-writes into the pre-existing internal-user-linked `subscriptions`
//      table (app/lib/db.ts) IF we can resolve an internal user for the
//      event, so `session.user.isPro` (auth.ts) keeps working exactly as it
//      does today. This is best-effort and never blocks step 1 — a Paddle
//      customer who hasn't signed in with Google yet (or used a different
//      email at checkout) still gets mirrored correctly; we just can't grant
//      them the `isPro` session flag until we can match them to an account.

import {
  type CustomerNotification,
  type SubscriptionNotification,
  type TransactionNotification,
} from "@paddle/paddle-node-sdk";
import {
  upsertPaddleCustomer,
  upsertPaddleSubscription,
  upsertPaddleTransaction,
  getPaddleCustomerEmail,
} from "./paddleDb";
import { upsertSubscription, findUserByEmail } from "./db";

function mapStatusForLegacyTable(status: string): string {
  // The legacy `subscriptions` table (see app/lib/db.ts / auth.ts) expects
  // "on_trial" and "cancelled" rather than Paddle's "trialing"/"canceled".
  const map: Record<string, string> = {
    active: "active",
    trialing: "on_trial",
    paused: "paused",
    past_due: "past_due",
    canceled: "cancelled",
  };
  return map[status] ?? status;
}

export async function handleCustomerUpsert(customer: CustomerNotification): Promise<void> {
  await upsertPaddleCustomer({
    customerId: customer.id,
    email: customer.email,
  });
}

export async function handleSubscriptionUpsert(subscription: SubscriptionNotification): Promise<void> {
  const item = subscription.items[0];
  const priceId = item?.price?.id ?? "";
  const productId = item?.price?.productId ?? "";

  await upsertPaddleSubscription({
    subscriptionId: subscription.id,
    customerId: subscription.customerId,
    status: subscription.status,
    priceId,
    productId,
    scheduledChangeAction: subscription.scheduledChange?.action ?? null,
    scheduledChangeAt: subscription.scheduledChange?.effectiveAt ?? null,
  });

  // Best-effort dual-write into the legacy internal-user-linked table so
  // existing Pro gating doesn't regress. customData.user_id is set by
  // createCheckoutUrl() in app/lib/paddle.ts for checkouts started while
  // signed in; fall back to matching the Paddle customer's email against
  // our NextAuth users table (also by email) for anything else, e.g. the
  // Paddle.js overlay checkout on /pricing-preview, which doesn't set
  // customData today.
  const userId = (subscription.customData as { user_id?: string } | null)?.user_id;
  const resolvedUserId = userId ?? (await resolveUserIdFromMirroredCustomer(subscription.customerId));

  if (resolvedUserId) {
    await upsertSubscription({
      userId: resolvedUserId,
      paddleSubscriptionId: subscription.id,
      paddleCustomerId: subscription.customerId,
      paddlePriceId: priceId,
      status: mapStatusForLegacyTable(subscription.status),
      currentPeriodEnd: subscription.currentBillingPeriod?.endsAt ?? null,
      cancelAtPeriodEnd: subscription.scheduledChange?.action === "cancel",
    });
  } else {
    console.warn(
      `Paddle webhook: subscription ${subscription.id} mirrored, but no internal user could be ` +
        `resolved yet (no customData.user_id and no matching customer.created/updated seen) — ` +
        `isPro gating won't reflect this until a customer.created/updated event or a future ` +
        `checkout with customData.user_id resolves it.`,
    );
  }
}

// SubscriptionNotification/TransactionNotification only carry customerId, not
// email — resolve the internal user via whatever email we already mirrored
// from a prior customer.created/updated event for that same customer_id.
async function resolveUserIdFromMirroredCustomer(customerId: string): Promise<string | undefined> {
  const email = await getPaddleCustomerEmail(customerId);
  if (!email) return undefined;
  const user = await findUserByEmail(email);
  return user ? (user.id as string) : undefined;
}

export async function handleTransactionCompleted(transaction: TransactionNotification): Promise<void> {
  if (!transaction.customerId) {
    console.warn(
      `Paddle webhook: transaction.completed ${transaction.id} has no customerId — skipping ` +
        `(paddle_transactions.customer_id is NOT NULL, and a transaction with no customer isn't ` +
        `attributable to anyone's access).`,
    );
    return;
  }

  const item = transaction.items[0];
  const priceId = item?.price?.id ?? "";
  const productId = item?.price?.productId ?? "";

  await upsertPaddleTransaction({
    transactionId: transaction.id,
    customerId: transaction.customerId,
    subscriptionId: transaction.subscriptionId,
    status: transaction.status,
    priceId,
    productId,
  });

  // Only one-time purchases need the legacy dual-write here — recurring
  // subscription transactions (renewals etc.) are already reflected via
  // subscription.created/updated, and duplicating them into the legacy
  // table by transaction id would create a second, parallel "subscription"
  // row for the same underlying plan.
  if (transaction.subscriptionId) return;

  const lifetimePriceId = process.env.PADDLE_LIFETIME_PRICE_ID;
  if (!lifetimePriceId || priceId !== lifetimePriceId) return;

  const userId = (transaction.customData as { user_id?: string } | null)?.user_id;
  const resolvedUserId = userId ?? (await resolveUserIdFromMirroredCustomer(transaction.customerId));

  if (!resolvedUserId) {
    console.warn(
      `Paddle webhook: one-time transaction ${transaction.id} mirrored, but no internal user ` +
        `could be resolved yet — isPro/lifetime gating won't reflect this until resolvable.`,
    );
    return;
  }

  await upsertSubscription({
    userId: resolvedUserId,
    paddleSubscriptionId: `txn_${transaction.id}`,
    paddleCustomerId: transaction.customerId,
    paddlePriceId: priceId,
    status: "lifetime",
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  });
}

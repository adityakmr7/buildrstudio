// Razorpay (INR, UPI / cards / netbanking) as a second payment path for
// India, alongside Paddle. Plain fetch + node:crypto, no SDK.
//
// Feature flag: the whole path is off unless RAZORPAY_KEY_ID,
// RAZORPAY_KEY_SECRET and RAZORPAY_WEBHOOK_SECRET are all set. Each tier also
// needs its own plan id in RAZORPAY_PLAN_<AGENT_SLUG>_<TIER> (see
// planEnvName). A tier without a plan simply doesn't offer INR.
//
// Prices are never hard-coded here: the INR amount shown to buyers is read
// from the Razorpay plan itself (GET /v1/plans/:id), so what we display is
// exactly what Razorpay will charge.

import { createHmac, timingSafeEqual } from "node:crypto";

const API_BASE = "https://api.razorpay.com/v1";

export function isRazorpayEnabled(): boolean {
  return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_WEBHOOK_SECRET);
}

/** RAZORPAY_PLAN_SUPPORT_AGENT_STARTER_STANDARD, etc. */
export function planEnvName(agentSlug: string, tierName: string): string {
  return `RAZORPAY_PLAN_${agentSlug}_${tierName}`.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
}

export function getPlanId(agentSlug: string, tierName: string): string | null {
  const id = process.env[planEnvName(agentSlug, tierName)]?.trim();
  return id ? id : null;
}

/**
 * How many billing cycles a subscription runs for. Razorpay requires a
 * finite total_count; 60 monthly cycles = 5 years. Override with
 * RAZORPAY_SUBSCRIPTION_TOTAL_COUNT if your plans use another period.
 */
export function subscriptionTotalCount(): number {
  const n = Number(process.env.RAZORPAY_SUBSCRIPTION_TOTAL_COUNT);
  return Number.isInteger(n) && n > 0 ? n : 60;
}

// ── Signatures ──────────────────────────────────────────────────────────

function safeEqualHex(expected: string, received: string): boolean {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Webhook: HMAC-SHA256 of the raw request body with the webhook secret, hex, in X-Razorpay-Signature. */
export function verifyWebhookSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  return safeEqualHex(expected, signature.trim());
}

/** Checkout handler (subscriptions): HMAC-SHA256 of "<payment_id>|<subscription_id>" with the key secret. */
export function verifySubscriptionPaymentSignature(
  paymentId: string,
  subscriptionId: string,
  signature: string,
  keySecret: string,
): boolean {
  if (!paymentId || !subscriptionId || !signature || !keySecret) return false;
  const expected = createHmac("sha256", keySecret).update(`${paymentId}|${subscriptionId}`, "utf8").digest("hex");
  return safeEqualHex(expected, signature.trim());
}

// ── API ─────────────────────────────────────────────────────────────────

export class RazorpayError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function rzp<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const id = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!id || !secret) throw new RazorpayError("Razorpay is not configured.", 500);
  const res = await fetch(`${API_BASE}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: { description?: string } };
  if (!res.ok) {
    throw new RazorpayError(data?.error?.description || `Razorpay request failed (${res.status}).`, res.status);
  }
  return data;
}

export interface RazorpayPlan {
  id: string;
  period: string; // daily | weekly | monthly | yearly
  interval: number;
  item: { name?: string; amount: number; currency: string }; // amount in paise
}

export interface RazorpaySubscription {
  id: string;
  plan_id: string;
  customer_id?: string | null;
  status: string; // created | authenticated | active | pending | halted | cancelled | completed | expired | paused
  current_start?: number | null;
  current_end?: number | null;
  short_url?: string;
  notes?: Record<string, string> | unknown[];
}

const planCache = new Map<string, { plan: RazorpayPlan; at: number }>();
const PLAN_TTL_MS = 10 * 60 * 1000;

export async function fetchPlan(planId: string): Promise<RazorpayPlan> {
  const hit = planCache.get(planId);
  if (hit && Date.now() - hit.at < PLAN_TTL_MS) return hit.plan;
  const plan = await rzp<RazorpayPlan>(`/plans/${encodeURIComponent(planId)}`);
  planCache.set(planId, { plan, at: Date.now() });
  return plan;
}

export function createSubscription(input: {
  planId: string;
  notes: Record<string, string>;
  totalCount?: number;
}): Promise<RazorpaySubscription> {
  return rzp<RazorpaySubscription>("/subscriptions", {
    method: "POST",
    body: {
      plan_id: input.planId,
      total_count: input.totalCount ?? subscriptionTotalCount(),
      quantity: 1,
      customer_notify: 1,
      notes: input.notes,
    },
  });
}

export function fetchSubscription(id: string): Promise<RazorpaySubscription> {
  return rzp<RazorpaySubscription>(`/subscriptions/${encodeURIComponent(id)}`);
}

/** Cancels at the end of the current billing cycle (access continues until then). */
export function cancelSubscriptionAtCycleEnd(id: string): Promise<RazorpaySubscription> {
  return rzp<RazorpaySubscription>(`/subscriptions/${encodeURIComponent(id)}/cancel`, {
    method: "POST",
    body: { cancel_at_cycle_end: 1 },
  });
}

// ── Mapping ─────────────────────────────────────────────────────────────

/** Razorpay subscription status → our AgentSubscription.status vocabulary. Only "active" grants access. */
export function mapSubscriptionStatus(status: string): string {
  switch (status) {
    case "active":
      return "active";
    case "pending": // a charge failed, Razorpay is retrying
    case "halted": // all retries failed
      return "past_due";
    case "paused":
      return "paused";
    case "cancelled":
    case "completed":
    case "expired":
      return "canceled";
    default: // created | authenticated: checkout not finished / first charge not captured yet
      return "created";
  }
}

export function periodEnd(sub: Pick<RazorpaySubscription, "current_end">): Date | null {
  return sub.current_end ? new Date(sub.current_end * 1000) : null;
}

/** "₹1,499/month" style label from a plan — amounts come from Razorpay, never from our code. */
export function formatPlanPrice(plan: RazorpayPlan): string {
  const amount = plan.item.amount / 100;
  const money = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: plan.item.currency || "INR",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
  const unit = { daily: "day", weekly: "week", monthly: "month", yearly: "year" }[plan.period] ?? plan.period;
  return plan.interval > 1 ? `${money} every ${plan.interval} ${unit}s` : `${money}/${unit}`;
}

/**
 * Should we lead with INR for this visitor? Vercel's geo header when present,
 * else an Indian locale in Accept-Language. Only a default; the buyer can
 * always switch.
 */
export function suggestInr(headers: Headers): boolean {
  const country = headers.get("x-vercel-ip-country");
  if (country) return country.toUpperCase() === "IN";
  const lang = headers.get("accept-language") ?? "";
  return /(^|[,\s])([a-z]{2,3})-IN\b/i.test(lang) || /(^|[,\s])hi\b/i.test(lang);
}

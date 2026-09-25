// Unit-style checks for the Razorpay path: webhook + checkout signature
// verification (with a fake secret), status mapping, plan env names, price
// formatting and the INR suggestion. No network, no DB.
// Run: bun run test:razorpay
import { createHmac } from "node:crypto";
import {
  formatPlanPrice,
  mapSubscriptionStatus,
  planEnvName,
  suggestInr,
  verifySubscriptionPaymentSignature,
  verifyWebhookSignature,
} from "../app/lib/razorpay";

let failed = 0;
const check = (cond: boolean, msg: string) => {
  console.log(`${cond ? "PASS" : "FAIL"} ${msg}`);
  if (!cond) failed++;
};

// ── Webhook signature: hex HMAC-SHA256 of the raw body ──────────────────
const WEBHOOK_SECRET = "test_webhook_secret_not_real";
const body = JSON.stringify({
  entity: "event",
  event: "subscription.activated",
  payload: { subscription: { entity: { id: "sub_TEST123", status: "active", plan_id: "plan_TEST" } } },
});
const goodSig = createHmac("sha256", WEBHOOK_SECRET).update(body).digest("hex");
check(verifyWebhookSignature(body, goodSig, WEBHOOK_SECRET), "webhook: valid signature accepted");
check(verifyWebhookSignature(body, ` ${goodSig} `, WEBHOOK_SECRET), "webhook: surrounding whitespace tolerated");
check(!verifyWebhookSignature(body + " ", goodSig, WEBHOOK_SECRET), "webhook: tampered body rejected");
check(!verifyWebhookSignature(body, goodSig, "other_secret"), "webhook: wrong secret rejected");
check(!verifyWebhookSignature(body, goodSig.slice(0, -2), WEBHOOK_SECRET), "webhook: truncated signature rejected");
check(!verifyWebhookSignature(body, goodSig.toUpperCase(), WEBHOOK_SECRET), "webhook: case-changed signature rejected");
check(!verifyWebhookSignature(body, null, WEBHOOK_SECRET), "webhook: missing signature rejected");
check(!verifyWebhookSignature(body, goodSig, ""), "webhook: empty secret rejected");

// ── Checkout signature: HMAC-SHA256("<payment_id>|<subscription_id>", key secret) ──
const KEY_SECRET = "test_key_secret_not_real";
const paymentId = "pay_TEST456";
const subId = "sub_TEST123";
const checkoutSig = createHmac("sha256", KEY_SECRET).update(`${paymentId}|${subId}`).digest("hex");
check(verifySubscriptionPaymentSignature(paymentId, subId, checkoutSig, KEY_SECRET), "checkout: valid signature accepted");
check(!verifySubscriptionPaymentSignature(paymentId, "sub_OTHER", checkoutSig, KEY_SECRET), "checkout: other subscription rejected");
check(!verifySubscriptionPaymentSignature("pay_OTHER", subId, checkoutSig, KEY_SECRET), "checkout: other payment rejected");
const swappedSig = createHmac("sha256", KEY_SECRET).update(`${subId}|${paymentId}`).digest("hex");
check(!verifySubscriptionPaymentSignature(paymentId, subId, swappedSig, KEY_SECRET), "checkout: signature over swapped order rejected");
check(!verifySubscriptionPaymentSignature(paymentId, subId, checkoutSig, "wrong"), "checkout: wrong key secret rejected");
check(!verifySubscriptionPaymentSignature("", subId, checkoutSig, KEY_SECRET), "checkout: empty payment id rejected");

// ── Status mapping: only "active" grants access ─────────────────────────
const map: Record<string, string> = {
  created: "created",
  authenticated: "created",
  active: "active",
  pending: "past_due",
  halted: "past_due",
  paused: "paused",
  cancelled: "canceled",
  completed: "canceled",
  expired: "canceled",
};
for (const [rzp, ours] of Object.entries(map)) check(mapSubscriptionStatus(rzp) === ours, `status ${rzp} → ${ours}`);

// ── Plan env names ──────────────────────────────────────────────────────
check(planEnvName("support-agent-starter", "standard") === "RAZORPAY_PLAN_SUPPORT_AGENT_STARTER_STANDARD", "plan env name (support/standard)");
check(planEnvName("rag-knowledge-assistant", "pro") === "RAZORPAY_PLAN_RAG_KNOWLEDGE_ASSISTANT_PRO", "plan env name (rag/pro)");

// ── Price label comes from the plan (made-up test amounts, not real prices) ──
const plan = (amount: number, period = "monthly", interval = 1) => ({ id: "plan_x", period, interval, item: { amount, currency: "INR" } });
const label = formatPlanPrice(plan(123400));
check(label.includes("1,234") && label.endsWith("/month") && label.includes("₹"), `price label: ${label}`);
check(formatPlanPrice(plan(99950)).includes("999.50"), `paise kept: ${formatPlanPrice(plan(99950))}`);
check(formatPlanPrice(plan(500000, "monthly", 3)).includes("every 3 months"), "interval > 1 label");

// ── INR suggestion ──────────────────────────────────────────────────────
const h = (o: Record<string, string>) => new Headers(o);
check(suggestInr(h({ "x-vercel-ip-country": "IN" })), "geo IN → INR");
check(!suggestInr(h({ "x-vercel-ip-country": "US", "accept-language": "en-IN" })), "geo header wins over language");
check(suggestInr(h({ "accept-language": "en-IN,en;q=0.9" })), "en-IN → INR");
check(suggestInr(h({ "accept-language": "hi" })), "hi → INR");
check(!suggestInr(h({ "accept-language": "en-US,en;q=0.9" })), "en-US → USD");
check(!suggestInr(h({})), "no headers → USD");

console.log(failed ? `\n${failed} check(s) failed` : "\nAll Razorpay checks passed");
process.exit(failed ? 1 : 0);

import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { verifyWebhookSignature, type RazorpaySubscription } from "../../../lib/razorpay";
import { applyRazorpaySubscription } from "../../../lib/razorpayServer";

export const runtime = "nodejs";

// Razorpay webhook. Configure in Razorpay Dashboard → Webhooks with URL
// https://buildrstudio.in/api/webhooks/razorpay, the RAZORPAY_WEBHOOK_SECRET,
// and the subscription.* events (activated, charged, pending, halted,
// cancelled, completed, paused, resumed, updated).
//
// - Signature: HMAC-SHA256(raw body, webhook secret) must equal X-Razorpay-Signature.
// - Idempotent: X-Razorpay-Event-Id is recorded in ProcessedWebhookEvent
//   after a successful run; a redelivery is acknowledged without work. The
//   handler itself is also idempotent (it applies the subscription's current
//   status), so a race between two deliveries is harmless.
// - The subscription entity's own `status` is the source of truth rather
//   than the event name, so out-of-order deliveries settle correctly.
interface RazorpayEvent {
  event?: string;
  payload?: { subscription?: { entity?: RazorpaySubscription } };
}

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 404 });
  }

  const rawBody = await req.text();
  if (!verifyWebhookSignature(rawBody, req.headers.get("x-razorpay-signature"), secret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let event: RazorpayEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const eventType = event.event ?? "unknown";
  const eventId = req.headers.get("x-razorpay-event-id");
  const dedupeId = eventId ? `razorpay:${eventId}` : null;

  if (dedupeId && (await db.processedWebhookEvent.findUnique({ where: { id: dedupeId } }))) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    const sub = event.payload?.subscription?.entity;
    if (eventType.startsWith("subscription.") && sub?.id) {
      await applyRazorpaySubscription(sub);
    }
    // Other events (payment.*, invoice.*, order.*) aren't needed: every
    // subscription state change also arrives as a subscription.* event.
  } catch (err) {
    console.error("[webhooks/razorpay] handler error:", err);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }

  if (dedupeId) {
    try {
      await db.processedWebhookEvent.create({ data: { id: dedupeId, provider: "razorpay", eventType } });
    } catch (err) {
      // P2002 = a concurrent delivery already recorded it; fine.
      if ((err as { code?: string })?.code !== "P2002") throw err;
    }
  }
  return NextResponse.json({ received: true });
}

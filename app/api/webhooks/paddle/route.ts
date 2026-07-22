import { NextRequest, NextResponse } from "next/server";
import { verifyPaddleWebhook, PaddleWebhookVerificationError } from "@/app/lib/paddle";
import { initPaddleTables } from "@/app/lib/paddleDb";
import {
  handleCustomerUpsert,
  handleSubscriptionUpsert,
  handleTransactionCompleted,
} from "@/app/lib/paddleWebhookHandlers";
import { getRequestIp, isPaddleWebhookIp } from "@/app/lib/paddleIps";
import { EventName } from "@paddle/paddle-node-sdk";

export async function POST(request: NextRequest) {
  // 1. Verify the signature FIRST — before touching the DB, before any
  // business logic. Read the body as raw text; paddle.webhooks.unmarshal
  // computes the HMAC over the exact bytes Paddle sent, so JSON.parse'ing
  // first (which normalizes whitespace/key order on re-serialization) would
  // make verification fail even for a genuine delivery.
  const rawBody = await request.text();
  const signature = request.headers.get("paddle-signature") ?? "";

  let event;
  try {
    event = await verifyPaddleWebhook(rawBody, signature);
  } catch (err) {
    if (err instanceof PaddleWebhookVerificationError) {
      console.error("Paddle webhook: configuration error", err.message);
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }
    console.error("Paddle webhook: signature verification failed", err);
    // Deliberately non-2xx: a 2xx here tells Paddle the delivery succeeded
    // and it stops retrying, which is wrong for a request we couldn't verify.
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // 2. Defense-in-depth only, and only AFTER signature verification: log
  // (don't reject) if the source IP isn't on Paddle's published webhook
  // allowlist. The signature check above is the authoritative gate; this is
  // just an anomaly signal, since a stale/unfetchable allowlist should never
  // cause us to drop an otherwise-valid, signed delivery.
  try {
    const clientIp = getRequestIp(request.headers);
    const allowed = await isPaddleWebhookIp(clientIp);
    if (!allowed) {
      console.warn("Paddle webhook: signature valid but source IP not on Paddle's published allowlist", clientIp);
    }
  } catch (err) {
    console.error("Paddle webhook: IP allowlist check unavailable", err);
  }

  await initPaddleTables();

  try {
    // Switching directly on event.eventType (rather than a copy) is what
    // lets TypeScript narrow event.data to the right notification type in
    // each branch below — EventEntity is a discriminated union keyed on
    // this exact field.
    switch (event.eventType) {
      case EventName.CustomerCreated:
      case EventName.CustomerUpdated:
        await handleCustomerUpsert(event.data);
        break;

      case EventName.SubscriptionCreated:
      case EventName.SubscriptionUpdated:
      case EventName.SubscriptionCanceled:
        await handleSubscriptionUpsert(event.data);
        break;

      case EventName.TransactionCompleted:
        await handleTransactionCompleted(event.data);
        break;

      default:
        // Safely ignore everything else (address.*, business.*, price.*,
        // subscription.paused/resumed/past_due/trialing/activated, etc.) —
        // subscription.updated already carries the current status for all
        // of those state transitions, so there's nothing to additionally
        // mirror from the more granular events.
        console.log(`Paddle webhook: ignoring unhandled event type ${event.eventType}`);
    }
  } catch (err) {
    // A handler failure (e.g. a transient DB error) should look like a
    // failed delivery to Paddle so it retries — swallowing this into a 200
    // would silently drop the event forever.
    console.error(`Paddle webhook: handler failed for ${event.eventType}`, err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

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
  // 1. IP allowlist check — cheap, header-only, so it runs before we even read the
  // body. Paddle publishes its current webhook-sending IPs at https://api.paddle.com/ips
  // and we fetch that dynamically (see paddleIps.ts) rather than hardcoding a list,
  // since Paddle can change it. Reject outright if we have a successfully-fetched
  // allowlist and the source isn't on it.
  //
  // This is NOT the authoritative check on its own — x-forwarded-for is, in principle,
  // a header a caller could try to spoof depending on how the platform proxy sanitizes
  // it — which is exactly why signature verification below still runs unconditionally
  // and is what actually gates any state change. Think of this as a cheap first filter.
  //
  // If the allowlist itself can't be obtained at all (fetch failed AND no cached list
  // exists yet — e.g. a cold start while Paddle's IP endpoint happens to be down), we
  // deliberately don't fail closed on that alone: that failure says nothing about
  // whether THIS request is legitimate, and rejecting here would make webhook delivery
  // depend on the uptime of an unrelated Paddle endpoint. We log loudly and fall
  // through to signature verification, which remains mandatory either way.
  const clientIp = getRequestIp(request.headers);
  if (clientIp) {
    try {
      const allowed = await isPaddleWebhookIp(clientIp);
      if (!allowed) {
        console.error("Paddle webhook: rejected — source IP not on Paddle's published allowlist", clientIp);
        return NextResponse.json({ error: "Source not allowed" }, { status: 403 });
      }
    } catch (err) {
      console.error("Paddle webhook: IP allowlist unavailable, proceeding to signature check only", err);
    }
  } else {
    console.warn("Paddle webhook: no client IP found in request headers; skipping IP allowlist check");
  }

  // 2. Verify the signature — before touching the DB, before any business logic. Read
  // the body as raw text; paddle.webhooks.unmarshal computes the HMAC over the exact
  // bytes Paddle sent, so JSON.parse'ing first (which normalizes whitespace/key order
  // on re-serialization) would make verification fail even for a genuine delivery.
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

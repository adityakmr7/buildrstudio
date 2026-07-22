import { NextRequest, NextResponse } from "next/server";
import { paddle } from "@/app/lib/paddle";
import { upsertSubscription, findUserByEmail, initAuthTables } from "@/app/lib/db";
import type { EventName } from "@paddle/paddle-node-sdk";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("paddle-signature") ?? "";
  const secret = process.env.PADDLE_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event;
  try {
    event = await paddle.webhooks.unmarshal(rawBody, secret, signature);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  await initAuthTables();

  const eventName = event.eventType as EventName;

  // Subscription lifecycle events
  if (
    eventName === "subscription.created" ||
    eventName === "subscription.activated" ||
    eventName === "subscription.updated" ||
    eventName === "subscription.canceled" ||
    eventName === "subscription.paused" ||
    eventName === "subscription.resumed" ||
    eventName === "subscription.past_due"
  ) {
    const sub = event.data as {
      id: string;
      customerId: string;
      items?: Array<{ price?: { id: string } }>;
      status: string;
      currentBillingPeriod?: { endsAt?: string } | null;
      scheduledChange?: { action?: string } | null;
      customData?: { user_id?: string } | null;
      customer?: { email?: string };
    };

    let userId: string | undefined = sub.customData?.user_id;

    if (!userId) {
      const email = (sub as { customer?: { email?: string } }).customer?.email;
      if (email) {
        const user = await findUserByEmail(email);
        if (user) userId = user.id as string;
      }
    }

    if (!userId) {
      console.error("Paddle webhook: could not resolve user for subscription", sub.id);
      return NextResponse.json({ received: true });
    }

    const status = mapPaddleSubStatus(sub.status);
    const priceId = sub.items?.[0]?.price?.id ?? "";
    const periodEnd = sub.currentBillingPeriod?.endsAt ?? null;
    const cancelAtPeriodEnd = sub.scheduledChange?.action === "cancel";

    await upsertSubscription({
      userId,
      paddleSubscriptionId: sub.id,
      paddleCustomerId: sub.customerId,
      paddlePriceId: priceId,
      status,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd,
    });
  }

  // One-time purchase (Launch Pack lifetime) — transaction.completed
  if (eventName === "transaction.completed") {
    const txn = event.data as {
      id: string;
      customerId: string;
      items?: Array<{ price?: { id: string } }>;
      status: string;
      customData?: { user_id?: string } | null;
      customer?: { email?: string };
    };

    const lifetimePriceId = process.env.PADDLE_LIFETIME_PRICE_ID;
    const txnPriceId = txn.items?.[0]?.price?.id ?? "";

    if (!lifetimePriceId || txnPriceId !== lifetimePriceId) {
      return NextResponse.json({ received: true });
    }

    let userId: string | undefined = txn.customData?.user_id;

    if (!userId) {
      const email = txn.customer?.email;
      if (email) {
        const user = await findUserByEmail(email);
        if (user) userId = user.id as string;
      }
    }

    if (!userId) {
      console.error("Paddle webhook: could not resolve user for transaction", txn.id);
      return NextResponse.json({ received: true });
    }

    await upsertSubscription({
      userId,
      paddleSubscriptionId: `txn_${txn.id}`,
      paddleCustomerId: txn.customerId,
      paddlePriceId: txnPriceId,
      status: "lifetime",
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    });
  }

  return NextResponse.json({ received: true });
}

function mapPaddleSubStatus(status: string): string {
  const map: Record<string, string> = {
    active: "active",
    trialing: "on_trial",
    paused: "paused",
    past_due: "past_due",
    canceled: "cancelled",
  };
  return map[status] ?? status;
}

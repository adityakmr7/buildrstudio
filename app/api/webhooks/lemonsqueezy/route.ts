import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { upsertSubscription, findUserByEmail, initAuthTables } from "@/app/lib/db";

function verifySignature(rawBody: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody);
  const digest = hmac.digest("hex");

  // timingSafeEqual requires equal-length buffers; mismatched lengths would throw
  const digestBuf = Buffer.from(digest);
  const sigBuf = Buffer.from(signature);
  if (digestBuf.length !== sigBuf.length) return false;

  return crypto.timingSafeEqual(digestBuf, sigBuf);
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature") ?? "";

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventName: string = payload.meta?.event_name;
  const attrs = payload.data?.attributes;
  const customData = payload.meta?.custom_data;

  if (!attrs) {
    return NextResponse.json({ received: true });
  }

  await initAuthTables();

  const relevantEvents = [
    "subscription_created",
    "subscription_updated",
    "subscription_cancelled",
    "subscription_resumed",
    "subscription_expired",
    "subscription_payment_success",
    "order_created",
  ];

  if (!relevantEvents.includes(eventName)) {
    return NextResponse.json({ received: true });
  }

  let userId = customData?.user_id;

  if (!userId && attrs.user_email) {
    const user = await findUserByEmail(attrs.user_email);
    if (user) userId = user.id;
  }

  if (!userId) {
    console.error("Webhook: could not resolve user for subscription", payload.data?.id);
    return NextResponse.json({ received: true });
  }

  // One-time purchases (Launch Pack lifetime) arrive as order_created, not
  // subscription events. Record them as a never-expiring "lifetime" entry.
  if (eventName === "order_created") {
    const orderVariantId = String(attrs.first_order_item?.variant_id ?? "");
    const lifetimeVariantId = process.env.LEMONSQUEEZY_LIFETIME_VARIANT_ID;

    // Ignore orders for subscription products — those are handled by
    // subscription_* events. Only lifetime variant orders grant access here.
    if (!lifetimeVariantId || orderVariantId !== lifetimeVariantId) {
      return NextResponse.json({ received: true });
    }

    if (attrs.status !== "paid") {
      return NextResponse.json({ received: true });
    }

    await upsertSubscription({
      userId,
      lsSubscriptionId: `order_${payload.data.id}`,
      lsCustomerId: String(attrs.customer_id),
      lsVariantId: orderVariantId,
      status: "lifetime",
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    });

    return NextResponse.json({ received: true });
  }

  const status = mapLsStatus(attrs.status);

  await upsertSubscription({
    userId,
    lsSubscriptionId: String(payload.data.id),
    lsCustomerId: String(attrs.customer_id),
    lsVariantId: String(attrs.variant_id),
    status,
    currentPeriodEnd: attrs.renews_at || attrs.ends_at || null,
    cancelAtPeriodEnd: attrs.cancelled ?? false,
  });

  return NextResponse.json({ received: true });
}

function mapLsStatus(lsStatus: string): string {
  const map: Record<string, string> = {
    active: "active",
    on_trial: "on_trial",
    paused: "paused",
    past_due: "past_due",
    cancelled: "cancelled",
    expired: "expired",
    unpaid: "past_due",
  };
  return map[lsStatus] || lsStatus;
}

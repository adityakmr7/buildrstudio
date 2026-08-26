import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getPaddle } from "../../../lib/paddle";
import { db } from "../../../lib/db";

export const runtime = "nodejs";

// customData is set when the checkout is opened (see
// app/components/PaddleCheckoutButton.tsx) so events here can be correlated
// back to our own records without guessing from Paddle's IDs alone.
interface CheckoutCustomData {
  userId?: string;
  agentId?: string;
  tierId?: string;
}

function generateApiKey() {
  return `pk_live_${randomBytes(18).toString("hex")}`;
}

export async function POST(req: NextRequest) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhooks/paddle] PADDLE_WEBHOOK_SECRET is not set.");
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const signature = req.headers.get("paddle-signature") ?? "";
  const rawBody = await req.text();

  let event;
  try {
    event = await getPaddle().webhooks.unmarshal(rawBody, secret, signature);
  } catch (err) {
    console.error("[webhooks/paddle] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  if (!event) {
    return NextResponse.json({ error: "Unrecognized event." }, { status: 400 });
  }

  try {
    switch (event.eventType) {
      case "subscription.created":
      case "subscription.activated":
      case "subscription.resumed": {
        const data = event.data;
        const customData = (data.customData ?? {}) as CheckoutCustomData;
        if (!customData.userId || !customData.agentId || !customData.tierId) {
          console.error("[webhooks/paddle] subscription event missing customData", data.id);
          break;
        }

        await db.agentSubscription.upsert({
          where: { paddleSubscriptionId: data.id },
          update: {
            status: "active",
            currentPeriodEnd: data.currentBillingPeriod?.endsAt
              ? new Date(data.currentBillingPeriod.endsAt)
              : null,
          },
          create: {
            userId: customData.userId,
            agentId: customData.agentId,
            tierId: customData.tierId,
            paddleCustomerId: data.customerId,
            paddleSubscriptionId: data.id,
            status: "active",
            currentPeriodEnd: data.currentBillingPeriod?.endsAt
              ? new Date(data.currentBillingPeriod.endsAt)
              : null,
          },
        });

        // Auto-provision an API key for this user+agent if they don't have
        // one yet, so the dashboard has something to show immediately.
        const existingKey = await db.apiKey.findFirst({
          where: { userId: customData.userId, agentId: customData.agentId },
        });
        if (!existingKey) {
          await db.apiKey.create({
            data: {
              key: generateApiKey(),
              userId: customData.userId,
              agentId: customData.agentId,
            },
          });
        }
        break;
      }

      case "subscription.updated": {
        const data = event.data;
        await db.agentSubscription.updateMany({
          where: { paddleSubscriptionId: data.id },
          data: {
            status: data.status === "active" ? "active" : data.status,
            currentPeriodEnd: data.currentBillingPeriod?.endsAt
              ? new Date(data.currentBillingPeriod.endsAt)
              : undefined,
          },
        });
        break;
      }

      case "subscription.canceled":
      case "subscription.paused": {
        const data = event.data;
        await db.agentSubscription.updateMany({
          where: { paddleSubscriptionId: data.id },
          data: { status: event.eventType === "subscription.paused" ? "paused" : "canceled" },
        });
        break;
      }

      case "subscription.past_due": {
        const data = event.data;
        await db.agentSubscription.updateMany({
          where: { paddleSubscriptionId: data.id },
          data: { status: "past_due" },
        });
        break;
      }

      default:
        // Ignore events we don't act on (transaction.*, customer.*, etc.)
        break;
    }
  } catch (err) {
    console.error("[webhooks/paddle] handler error:", err);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

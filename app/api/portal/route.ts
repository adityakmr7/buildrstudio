import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../auth";
import { db } from "../../lib/db";
import { getPaddle } from "../../lib/paddle";

// Generates a Paddle-hosted customer portal link scoped to one subscription
// — this is where a buyer actually cancels or updates their payment method.
// We don't build cancel/payment-method UI ourselves; Paddle's portal already
// does this well and correctly, and it's the merchant-of-record's job to
// handle billing UI, not ours.
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const subscriptionId = req.nextUrl.searchParams.get("subscriptionId");
  if (!subscriptionId) {
    return NextResponse.json({ error: "subscriptionId is required." }, { status: 400 });
  }

  const subscription = await db.agentSubscription.findUnique({ where: { id: subscriptionId } });
  if (!subscription || subscription.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (!subscription.paddleCustomerId || !subscription.paddleSubscriptionId) {
    return NextResponse.json({ error: "This subscription has no billing record yet." }, { status: 400 });
  }

  try {
    const portalSession = await getPaddle().customerPortalSessions.create(subscription.paddleCustomerId, [
      subscription.paddleSubscriptionId,
    ]);
    return NextResponse.json({ url: portalSession.urls.general.overview });
  } catch (err) {
    console.error("[api/portal] error:", err);
    return NextResponse.json({ error: "Couldn't open the billing portal. Try again." }, { status: 500 });
  }
}

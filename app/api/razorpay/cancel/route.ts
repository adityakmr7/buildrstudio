import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { db } from "../../../lib/db";
import { cancelSubscriptionAtCycleEnd, isRazorpayEnabled, periodEnd } from "../../../lib/razorpay";

export const runtime = "nodejs";

// Razorpay has no hosted customer portal like Paddle's, so the dashboard
// offers "Cancel renewal" for INR subscriptions. Cancels at the end of the
// current billing cycle; the webhook flips the status when it ends.
export async function POST(req: NextRequest) {
  if (!isRazorpayEnabled()) {
    return NextResponse.json({ error: "INR payments aren't available." }, { status: 404 });
  }
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  let body: { subscriptionId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const id = typeof body.subscriptionId === "string" ? body.subscriptionId : "";
  const row = id ? await db.agentSubscription.findUnique({ where: { id } }) : null;
  if (!row || row.userId !== session.user.id || row.provider !== "razorpay" || !row.razorpaySubscriptionId) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (row.status !== "active") {
    return NextResponse.json({ error: "This subscription isn't active." }, { status: 409 });
  }
  try {
    const sub = await cancelSubscriptionAtCycleEnd(row.razorpaySubscriptionId);
    const end = periodEnd(sub) ?? row.currentPeriodEnd;
    await db.agentSubscription.update({
      where: { id: row.id },
      data: { cancelAtPeriodEnd: true, currentPeriodEnd: end ?? undefined },
    });
    return NextResponse.json({ cancelAtPeriodEnd: true, currentPeriodEnd: end });
  } catch (err) {
    console.error("[api/razorpay/cancel] error:", err);
    return NextResponse.json({ error: "Couldn't cancel with Razorpay. Try again, or email us." }, { status: 502 });
  }
}

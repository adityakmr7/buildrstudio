import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { db } from "../../../lib/db";
import { fetchSubscription, isRazorpayEnabled, verifySubscriptionPaymentSignature } from "../../../lib/razorpay";
import { applyRazorpaySubscription } from "../../../lib/razorpayServer";

export const runtime = "nodejs";

// Called by checkout.js's success handler. Verifies Razorpay's signature
// (HMAC of "<payment_id>|<subscription_id>" with the key secret), then reads
// the subscription's real status from Razorpay's API before granting
// anything. The webhook does the same thing independently, so access still
// arrives if the buyer closes the tab before this runs.
export async function POST(req: NextRequest) {
  if (!isRazorpayEnabled()) {
    return NextResponse.json({ error: "INR payments aren't available." }, { status: 404 });
  }
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const paymentId = typeof body.razorpay_payment_id === "string" ? body.razorpay_payment_id : "";
  const subscriptionId = typeof body.razorpay_subscription_id === "string" ? body.razorpay_subscription_id : "";
  const signature = typeof body.razorpay_signature === "string" ? body.razorpay_signature : "";

  if (!verifySubscriptionPaymentSignature(paymentId, subscriptionId, signature, process.env.RAZORPAY_KEY_SECRET!)) {
    return NextResponse.json({ error: "Payment signature didn't verify." }, { status: 400 });
  }

  const row = await db.agentSubscription.findUnique({ where: { razorpaySubscriptionId: subscriptionId } });
  if (!row || row.userId !== session.user.id) {
    return NextResponse.json({ error: "Subscription not found." }, { status: 404 });
  }

  try {
    const sub = await fetchSubscription(subscriptionId);
    const updated = await applyRazorpaySubscription(sub);
    return NextResponse.json({ status: updated?.status ?? row.status });
  } catch (err) {
    console.error("[api/razorpay/verify] error:", err);
    // Payment is verified; the webhook will finish activation.
    return NextResponse.json({ status: "processing" });
  }
}

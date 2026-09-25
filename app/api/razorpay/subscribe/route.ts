import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { db } from "../../../lib/db";
import { AGENT_CATALOG } from "../../../lib/agentCatalog";
import { createSubscription, fetchPlan, getPlanId, isRazorpayEnabled, RazorpayError } from "../../../lib/razorpay";

export const runtime = "nodejs";

// Creates a Razorpay subscription for one agent tier and returns what
// checkout.js needs. Access is granted only after payment, by
// /api/razorpay/verify and/or the webhook, never here.
export async function POST(req: NextRequest) {
  if (!isRazorpayEnabled()) {
    return NextResponse.json({ error: "INR payments aren't available." }, { status: 404 });
  }
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }
  const userId = session.user.id;

  let body: { tierId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const tierId = typeof body.tierId === "string" ? body.tierId : "";
  const tier = tierId ? await db.agentTier.findUnique({ where: { id: tierId }, include: { agent: true } }) : null;
  const product = tier ? AGENT_CATALOG.find((p) => p.slug === tier.agent.slug) : null;
  if (!tier || !product || product.status !== "live" || !tier.agent.isPublic) {
    return NextResponse.json({ error: "This plan isn't available." }, { status: 404 });
  }
  const planId = getPlanId(tier.agent.slug, tier.name);
  if (!planId) {
    return NextResponse.json({ error: "INR pricing isn't set up for this plan yet." }, { status: 404 });
  }

  const user = await db.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
  if (!user) {
    return NextResponse.json({ error: "Please sign out and sign in again, then retry." }, { status: 409 });
  }
  const active = await db.agentSubscription.findFirst({
    where: { userId, agentId: tier.agentId, status: "active" },
  });
  if (active) {
    return NextResponse.json({ error: "You already have an active plan for this agent. See your dashboard." }, { status: 409 });
  }

  try {
    const plan = await fetchPlan(planId);
    if (plan.item.currency !== "INR") {
      return NextResponse.json({ error: "INR pricing isn't set up for this plan yet." }, { status: 404 });
    }
    const sub = await createSubscription({
      planId,
      notes: { userId, agentId: tier.agentId, tierId: tier.id },
    });
    await db.agentSubscription.create({
      data: {
        userId,
        agentId: tier.agentId,
        tierId: tier.id,
        provider: "razorpay",
        razorpaySubscriptionId: sub.id,
        status: "created",
      },
    });
    return NextResponse.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      subscriptionId: sub.id,
      name: "BuildrStudio",
      description: `${tier.agent.name} (${tier.name.charAt(0).toUpperCase()}${tier.name.slice(1)})`,
      prefill: { name: user.name ?? undefined, email: user.email ?? undefined },
    });
  } catch (err) {
    console.error("[api/razorpay/subscribe] error:", err);
    const msg = err instanceof RazorpayError ? "Couldn't start the Razorpay checkout. Try again, or pay in USD." : "Something went wrong. Try again.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

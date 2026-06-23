import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createCheckoutUrl } from "@/app/lib/lemonsqueezy";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const plan = body.plan === "ai_pro" ? "ai_pro" : "pro";

  try {
    const url = await createCheckoutUrl({
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name,
      plan,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}

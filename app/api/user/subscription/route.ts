import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getActiveSubscription } from "@/app/lib/db";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ isPro: false });
  }

  try {
    const sub = await getActiveSubscription(session.user.id);
    return NextResponse.json({
      isPro: !!sub,
      status: sub?.status ?? null,
      currentPeriodEnd: sub?.current_period_end ?? null,
      cancelAtPeriodEnd: sub?.cancel_at_period_end ?? false,
    });
  } catch {
    return NextResponse.json({ isPro: false });
  }
}

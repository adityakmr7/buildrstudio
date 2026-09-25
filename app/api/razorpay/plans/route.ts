import { NextRequest, NextResponse } from "next/server";
import { isRazorpayEnabled, suggestInr } from "../../../lib/razorpay";
import { getInrTierOptions } from "../../../lib/razorpayServer";

export const runtime = "nodejs";

// Public: which tiers of an agent can be paid in INR via Razorpay, with the
// price read from the Razorpay plan. Fetched client-side so agent pages stay
// statically generated. `suggestInr` (geo / Accept-Language) only picks the
// default tab; buyers can always switch.
export async function GET(req: NextRequest) {
  const agent = req.nextUrl.searchParams.get("agent") ?? "";
  const headers = { "Cache-Control": "private, max-age=300" };
  if (!isRazorpayEnabled() || !/^[a-z0-9-]{1,64}$/.test(agent)) {
    return NextResponse.json({ enabled: false, suggestInr: false, tiers: [] }, { headers });
  }
  try {
    const tiers = await getInrTierOptions(agent);
    return NextResponse.json({ enabled: tiers.length > 0, suggestInr: suggestInr(req.headers), tiers }, { headers });
  } catch (err) {
    console.error("[api/razorpay/plans] error:", err);
    return NextResponse.json({ enabled: false, suggestInr: false, tiers: [] }, { headers: { "Cache-Control": "no-store" } });
  }
}

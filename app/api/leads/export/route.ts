import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { db } from "../../../lib/db";
import { leadsToCsv } from "../../../lib/leads";

export const runtime = "nodejs";

// GET /api/leads/export[?agent=<slug>] — CSV of the signed-in user's leads.
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const agentSlug = req.nextUrl.searchParams.get("agent");
  const leads = await db.lead.findMany({
    where: { userId: session.user.id, ...(agentSlug ? { agent: { slug: agentSlug } } : {}) },
    include: { agent: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 10_000,
  });

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(leadsToCsv(leads), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="buildrstudio-leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { startTrial } from "../../lib/trialServer";

export const runtime = "nodejs";

// POST { agentSlug } — starts a no-card free trial for the signed-in user.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to start a free trial." }, { status: 401 });
  }

  let body: { agentSlug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body.agentSlug || typeof body.agentSlug !== "string") {
    return NextResponse.json({ error: "agentSlug is required." }, { status: 400 });
  }

  try {
    const result = await startTrial(session.user.id, body.agentSlug);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ apiKeyId: result.apiKeyId, alreadyHadKey: result.alreadyHadKey });
  } catch (err) {
    console.error("[api/trials] error:", err);
    return NextResponse.json({ error: "Couldn't start the trial. Try again." }, { status: 500 });
  }
}

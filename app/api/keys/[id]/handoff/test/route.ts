import { NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import { db } from "../../../../../lib/db";
import { rateLimit } from "../../../../../lib/rateLimit";
import { leadPayload, sendWebhook } from "../../../../../lib/leads";

export const runtime = "nodejs";

// POST — sends a sample, clearly-labelled test lead to the install's webhook.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { id } = await params;
  const key = await db.apiKey.findUnique({ where: { id }, include: { agent: true } });
  if (!key || key.userId !== session.user.id) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (!key.leadWebhookUrl || !key.leadWebhookSecret) {
    return NextResponse.json({ error: "Save a webhook URL first." }, { status: 400 });
  }
  if (!rateLimit(`webhook-test:${id}`, 5).allowed) {
    return NextResponse.json({ error: "Too many test sends — wait a minute." }, { status: 429 });
  }

  const payload = {
    ...leadPayload(
      {
        id: "lead_test",
        name: "Test Lead",
        email: "test@example.com",
        phone: "+91 90000 00000",
        message: "This is a test lead from your BuildrStudio dashboard.",
        trigger: "manual",
        pageUrl: null,
        chatSessionId: null,
        createdAt: new Date(),
      },
      key.agent,
    ),
    event: "lead.test",
  };
  const res = await sendWebhook(key.leadWebhookUrl, key.leadWebhookSecret, payload);
  return NextResponse.json(res, { status: res.ok ? 200 : 502 });
}

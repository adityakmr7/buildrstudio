import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { db } from "../../../../lib/db";
import { assertSafeUrl, UnsafeUrlError } from "../../../../lib/safeFetch";
import { generateWebhookSecret, isLeadEmailConfigured } from "../../../../lib/leads";
import { normalizeWhatsappNumber } from "../../../../lib/handoff";

async function getOwnedKey(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  const key = await db.apiKey.findUnique({ where: { id } });
  if (!key || key.userId !== session.user.id) return { error: NextResponse.json({ error: "Not found." }, { status: 404 }) };
  return { key };
}

function serialize(key: { leadEmailEnabled: boolean; leadWebhookUrl: string | null; leadWebhookSecret: string | null; whatsappNumber: string | null }) {
  return {
    emailEnabled: key.leadEmailEnabled,
    emailConfigured: isLeadEmailConfigured(),
    webhookUrl: key.leadWebhookUrl,
    webhookSecret: key.leadWebhookSecret,
    whatsappNumber: key.whatsappNumber,
  };
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { key, error } = await getOwnedKey(id);
  if (error) return error;
  return NextResponse.json(serialize(key));
}

// PATCH { emailEnabled?, webhookUrl? ("" clears), whatsappNumber? ("" clears), rotateSecret? }
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { key, error } = await getOwnedKey(id);
  if (error) return error;

  let body: { emailEnabled?: boolean; webhookUrl?: string; whatsappNumber?: string; rotateSecret?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const data: { leadEmailEnabled?: boolean; leadWebhookUrl?: string | null; leadWebhookSecret?: string; whatsappNumber?: string | null } = {};
  if (typeof body.emailEnabled === "boolean") data.leadEmailEnabled = body.emailEnabled;

  if (typeof body.webhookUrl === "string") {
    const raw = body.webhookUrl.trim();
    if (!raw) {
      data.leadWebhookUrl = null;
    } else {
      try {
        const u = assertSafeUrl(raw);
        if (u.protocol !== "https:") throw new UnsafeUrlError("Webhook URLs must use https://.");
        data.leadWebhookUrl = u.toString().slice(0, 1000);
      } catch (err) {
        return NextResponse.json({ error: err instanceof UnsafeUrlError ? err.message : "Invalid webhook URL." }, { status: 400 });
      }
      if (!key.leadWebhookSecret) data.leadWebhookSecret = generateWebhookSecret();
    }
  }
  if (body.rotateSecret) data.leadWebhookSecret = generateWebhookSecret();

  if (typeof body.whatsappNumber === "string") {
    try {
      data.whatsappNumber = normalizeWhatsappNumber(body.whatsappNumber);
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 400 });
    }
  }

  const updated = await db.apiKey.update({ where: { id }, data });
  return NextResponse.json(serialize(updated));
}

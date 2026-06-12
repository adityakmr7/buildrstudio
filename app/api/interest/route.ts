import { NextResponse } from "next/server";
import { saveInterestRequest } from "@/app/lib/interest";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type InterestRequestBody = {
  email?: unknown;
  source?: unknown;
  featureKey?: unknown;
  message?: unknown;
  pathname?: unknown;
};

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export async function POST(request: Request) {
  let body: InterestRequestBody;

  try {
    body = (await request.json()) as InterestRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = optionalString(body.email)?.toLowerCase();
  const source = optionalString(body.source);

  if (!email || !emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (!source) {
    return NextResponse.json({ error: "Missing request source." }, { status: 400 });
  }

  try {
    await saveInterestRequest({
      email,
      source,
      featureKey: optionalString(body.featureKey),
      message: optionalString(body.message),
      pathname: optionalString(body.pathname),
      referrer: request.headers.get("referer") ?? undefined,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Interest request save failed:", error);
    return NextResponse.json({ error: "Unable to save your request right now." }, { status: 500 });
  }
}

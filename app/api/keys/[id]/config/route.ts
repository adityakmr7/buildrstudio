import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { db } from "../../../../lib/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const key = await db.apiKey.findUnique({ where: { id } });
  if (!key || key.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let body: { greeting?: string; color?: string; position?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const data: { greeting?: string; color?: string; position?: string } = {};
  if (typeof body.greeting === "string" && body.greeting.trim()) data.greeting = body.greeting.trim().slice(0, 200);
  if (typeof body.color === "string" && /^#[0-9a-fA-F]{6}$/.test(body.color)) data.color = body.color;
  if (body.position === "bottom-right" || body.position === "bottom-left") data.position = body.position;

  const updated = await db.apiKey.update({ where: { id }, data });
  return NextResponse.json({
    greeting: updated.greeting,
    color: updated.color,
    position: updated.position,
  });
}

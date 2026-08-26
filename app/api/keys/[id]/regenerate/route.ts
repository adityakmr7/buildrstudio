import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { auth } from "../../../../../auth";
import { db } from "../../../../lib/db";

function generateApiKey() {
  return `pk_live_${randomBytes(18).toString("hex")}`;
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const key = await db.apiKey.findUnique({ where: { id } });
  if (!key || key.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const updated = await db.apiKey.update({
    where: { id },
    data: { key: generateApiKey() },
  });

  return NextResponse.json({ key: updated.key });
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserProjects, createProject } from "@/app/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const projects = await getUserProjects(session.user.id);
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { name, tool, config } = await req.json();
  if (!name || !config) {
    return NextResponse.json({ error: "name and config required" }, { status: 400 });
  }

  const project = await createProject(session.user.id, name, tool || "screenshot-builder", config);
  return NextResponse.json({ project }, { status: 201 });
}

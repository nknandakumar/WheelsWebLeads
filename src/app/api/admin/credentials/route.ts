import { NextResponse } from "next/server";
import { getAllCredentials, updateCredential } from "@/lib/credentials";
import { requireSession } from "@/lib/auth-server";

export async function GET() {
  const session = await requireSession("admin");
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const creds = await getAllCredentials();
  const full = creds.map(c => ({ id: c.id, role: c.role, username: c.username, password: c.password }));
  return NextResponse.json({ credentials: full });
}

export async function PUT(req: Request) {
  const session = await requireSession("admin");
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const { role, username, password } = body || {};
  if (!role) {
    return NextResponse.json({ error: "Missing role" }, { status: 400 });
  }
  if (role !== "admin" && role !== "user") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  if (username === undefined && password === undefined) {
    return NextResponse.json({ error: "Provide username or password to update" }, { status: 400 });
  }
  await updateCredential(role, { username, password });
  return NextResponse.json({ ok: true });
}

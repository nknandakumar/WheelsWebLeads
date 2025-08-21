import { NextResponse } from "next/server";
import { DEFAULT_EXP_SECONDS, JWT_NAME, signSessionToken } from "@/lib/auth-server";
import { findCredentialByUsername, verifyPassword, getAllCredentials, upsertCredential } from "@/lib/credentials";

// Cache seeding so we don't query on every login
let seededOnce: boolean | undefined;

export async function POST(req: Request) {
  try {
    // ensure at least one admin exists on first run (only once per process)
    if (!seededOnce) {
      const existing = await getAllCredentials();
      if (existing.length === 0) {
        await upsertCredential("admin", process.env.DEFAULT_ADMIN_USERNAME || "admin", process.env.DEFAULT_ADMIN_PASSWORD || "admin123");
      }
      seededOnce = true;
    }
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }
    const cred = await findCredentialByUsername(username);
    if (!cred) return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    const ok = await verifyPassword(cred.password, password);
    if (!ok) return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });

    // Sign token and set cookie on response explicitly for reliability on Vercel
    const token = await signSessionToken(cred.username, cred.role, DEFAULT_EXP_SECONDS);
    const res = NextResponse.json({ ok: true, role: cred.role }, { headers: { "Cache-Control": "no-store" } });
    res.cookies.set(JWT_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: DEFAULT_EXP_SECONDS,
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

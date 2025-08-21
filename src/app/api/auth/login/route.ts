import { NextResponse } from "next/server";
import { DEFAULT_EXP_SECONDS, JWT_NAME, signSessionToken } from "@/lib/auth-server";
import { verifyPassword, getCredentialByRole } from "@/lib/credentials";

export async function POST(req: Request) {
  try {
    const { username, password, role } = await req.json();
    if (!username || !password || (role !== "admin" && role !== "user")) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }
    // Validate against the selected role to avoid username collisions across roles
    const cred = await getCredentialByRole(role);
    if (!cred) return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    if (cred.username !== username) return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    const ok = await verifyPassword(cred.password, password);
    if (!ok) return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });

    // Sign token and set cookie on response explicitly for reliability on Vercel
    const token = await signSessionToken(cred.username, role, DEFAULT_EXP_SECONDS);
    const res = NextResponse.json({ ok: true, role }, { headers: { "Cache-Control": "no-store" } });
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

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "jose";

export type AppRole = "admin" | "user";

const JWT_NAME = "app_session";
const JWT_ISSUER = "wheelsweb";
const JWT_AUDIENCE = "wheelsweb_app";
const DEFAULT_EXP_SECONDS = 60 * 60 * 8; // 8 hours

function getSecret() {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "dev-insecure-secret-change";
  return new TextEncoder().encode(secret);
}

export interface SessionPayload extends JWTPayload {
  sub: string; // username
  role: AppRole;
}

export async function createSession(username: string, role: AppRole, maxAgeSec = DEFAULT_EXP_SECONDS) {
  const token = await new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + maxAgeSec)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(JWT_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSec,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(JWT_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(JWT_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    const role = (payload as any).role as AppRole | undefined;
    const sub = payload.sub as string | undefined;
    if (!role || !sub) return null;
    return { ...(payload as any), role, sub } as SessionPayload;
  } catch {
    return null;
  }
}

export async function requireSession(requiredRole?: AppRole): Promise<SessionPayload | null> {
  const sess = await getSession();
  if (!sess) return null;
  if (requiredRole && sess.role !== requiredRole) return null;
  return sess;
}

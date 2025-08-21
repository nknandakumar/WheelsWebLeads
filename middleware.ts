import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_NAME = "app_session";
const JWT_ISSUER = "wheelsweb";
const JWT_AUDIENCE = "wheelsweb_app";

function getSecret() {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "dev-insecure-secret-change";
  return new TextEncoder().encode(secret);
}

async function getRoleFromReq(req: NextRequest): Promise<"admin" | "user" | null> {
  try {
    const token = req.cookies.get(JWT_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    const role = (payload as any).role as "admin" | "user" | undefined;
    return role ?? null;
  } catch {
    return null;
  }
}

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/me",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static, next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const role = await getRoleFromReq(req);

  // Protect dashboard and nested paths
  if (pathname.startsWith("/dashboard")) {
    if (!role) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    // Admin-only gate
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Protect top-level admin area
  if (pathname.startsWith("/admin")) {
    if (!role) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // For any other protected route, require authentication
  if (!role && !PUBLIC_PATHS.includes(pathname) && pathname !== "/") {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets).*)",
  ],
};

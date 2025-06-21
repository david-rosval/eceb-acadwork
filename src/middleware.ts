import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken } from "./lib/auth/jwt";
import { cookies } from "next/headers";

const PROTECTED_ROUTES = ["/dashboard", "/profile", "/services/new"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) return NextResponse.next();

  // ⚠️ cookies() es async en middleware
  const cookieStore = await cookies();
  const token = cookieStore.get("refreshToken")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    verifyRefreshToken(token); // throws si no es válido
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/services/new"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for session cookies
  const hasAuthToken =
    request.cookies.has("orvixa_demo_session") ||
    request.cookies.has("sb-qrrhqbtnxhumoopeqeud-auth-token") ||
    request.cookies.has("supabase-auth-token");

  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding");

  if (isProtectedRoute && !hasAuthToken) {
    return NextResponse.redirect(new URL("/auth?mode=login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};

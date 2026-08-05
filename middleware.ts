import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user has Supabase auth token
  const hasAuthToken =
    request.cookies.has("sb-qrrhqbtnxhumoopeqeud-auth-token") ||
    request.cookies.has("supabase-auth-token");

  // Protect Dashboard & Onboarding Routes
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding");

  if (isProtectedRoute && !hasAuthToken) {
    // Redirect unauthenticated user to /auth
    return NextResponse.redirect(new URL("/auth?mode=login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};

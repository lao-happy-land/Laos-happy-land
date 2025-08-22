import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getTokenPayload(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1] ?? "")) as {
      exp?: number;
      role?: string;
      sub?: string;
      email?: string;
      fullName?: string;
    };

    // Check if token is expired
    const now = Date.now() / 1000;
    if (payload.exp && payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;
  const payload = token ? getTokenPayload(token) : null;
  const isAuthenticated = !!payload;
  const isAdmin = payload?.role?.toLowerCase() === "admin";

  // Middleware handles authentication validation

  // Handle admin routes
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
  }

  // Handle auth routes (login/register) - redirect if already authenticated
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (isAuthenticated) {
      const redirectUrl = request.nextUrl.searchParams.get("redirect");
      if (redirectUrl) {
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
      // Redirect based on role
      const destination = isAdmin ? "/admin" : "/";
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
};

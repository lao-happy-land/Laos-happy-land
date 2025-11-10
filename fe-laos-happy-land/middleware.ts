import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

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

// Create i18n middleware
const intlMiddleware = createMiddleware({
  locales: ["en", "vn", "la"],
  defaultLocale: "la",
  localePrefix: "always",
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;
  const payload = token ? getTokenPayload(token) : null;
  const isAuthenticated = !!payload;
  const isAdmin = payload?.role?.toLowerCase() === "admin";

  // Get user's preferred locale from cookie
  const localeCookie = request.cookies.get("locale-preference")?.value;
  const preferredLocale = localeCookie ?? "la";

  // Check if pathname already has locale prefix
  const hasLocalePrefix =
    /^\/(en|vn|la)\//.test(pathname) ||
    pathname === "/en" ||
    pathname === "/vn" ||
    pathname === "/la";

  // Only redirect if it's a non-locale route that's not the root
  if (!hasLocalePrefix && pathname !== "/" && !pathname.startsWith("/api")) {
    const redirectUrl = new URL(`/${preferredLocale}${pathname}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Handle i18n routing
  const intlResponse = intlMiddleware(request);
  if (intlResponse) {
    // Apply authentication logic to i18n response
    const intlPathname = request.nextUrl.pathname;

    // Handle admin routes
    if (intlPathname.includes(`/${preferredLocale}/admin`)) {
      if (!isAuthenticated) {
        const loginUrl = new URL(`/${preferredLocale}/login`, request.url);
        loginUrl.searchParams.set("redirect", intlPathname);
        return NextResponse.redirect(loginUrl);
      }

      if (!isAdmin) {
        return NextResponse.redirect(
          new URL(`/${preferredLocale}/unauthorized`, request.url),
        );
      }
    }

    // Handle auth routes (login/register) - redirect if already authenticated
    if (intlPathname.includes("/login") || intlPathname.includes("/register")) {
      if (isAuthenticated) {
        const redirectUrl = request.nextUrl.searchParams.get("redirect");
        if (redirectUrl) {
          return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
        // Redirect based on role
        const destination = isAdmin
          ? `/${preferredLocale}/admin`
          : `/${preferredLocale}/`;
        return NextResponse.redirect(new URL(destination, request.url));
      }
    }

    return intlResponse;
  }

  // Fallback for non-i18n routes - redirect to locale-prefixed version
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL(`/${preferredLocale}/login`, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!isAdmin) {
      return NextResponse.redirect(
        new URL(`/${preferredLocale}/unauthorized`, request.url),
      );
    }

    // Redirect admin routes to locale-prefixed version
    const adminPath = pathname.replace("/admin", `/${preferredLocale}/admin`);
    return NextResponse.redirect(new URL(adminPath, request.url));
  }

  // Handle auth routes (login/register) - redirect if already authenticated
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (isAuthenticated) {
      const redirectUrl = request.nextUrl.searchParams.get("redirect");
      if (redirectUrl) {
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
      // Redirect based on role
      const destination = isAdmin
        ? `/${preferredLocale}/admin`
        : `/${preferredLocale}/`;
      return NextResponse.redirect(new URL(destination, request.url));
    }

    // Redirect auth routes to locale-prefixed version
    const authPath = pathname.replace("/", `/${preferredLocale}/`);
    return NextResponse.redirect(new URL(authPath, request.url));
  }

  // For any other non-locale routes, redirect to user's preferred locale
  if (pathname !== "/") {
    const redirectUrl = new URL(`/${preferredLocale}${pathname}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};

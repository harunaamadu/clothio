import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;
  const pathname = nextUrl.pathname;

  // ─── Admin routes — ADMIN only ────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const url = new URL("/login", nextUrl.origin);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/access-denied", nextUrl.origin));
    }
  }

  // ─── Protected user routes ────────────────────────────────────────────────
  const protectedPaths = ["/dashboard", "/checkout", "/orders", "/wishlist"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !isLoggedIn) {
    const url = new URL("/login", nextUrl.origin);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // ─── Redirect logged-in users away from auth pages ────────────────────────
  const authPaths = ["/login", "/register"];
  if (authPaths.includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({ request: { headers } });
}
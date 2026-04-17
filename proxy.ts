import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isAuth = !!session;
  const protectedPaths = ["/checkout", "/dashboard", "/orders", "/wishlist"];
  const isProtected = protectedPaths.some(p => nextUrl.pathname.startsWith(p));

  if (isProtected && !isAuth) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${nextUrl.pathname}`, req.url));
  }
  return NextResponse.next();
});

export const config = { matcher: ["/((?!_next|api|.*\\..*).*)"] };
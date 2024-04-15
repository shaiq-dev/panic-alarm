import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { isSessionValid } from "./lib/auth";

const AUTH_GROUP = ["/signup", "/signin", "/confirm"];
const PROTECTED_GROUP = ["/dashboard", "/onboarding"];

export async function middleware(req: NextRequest) {
  const reqPath = req.nextUrl.pathname;
  const validSession = await isSessionValid(cookies().get("__sat"));

  if (
    PROTECTED_GROUP.some((route) => reqPath.startsWith(route)) &&
    !validSession
  ) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (AUTH_GROUP.some((route) => reqPath.startsWith(route)) && validSession) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|fonts|favicon.ico).*)"],
};

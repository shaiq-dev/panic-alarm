import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_SECURE_AUTH_TOKEN } from "@/constants/app-strings";
import { getSession } from "./lib/auth";

const ONBOARDING_ROUTE = "/onboarding";
const AUTH_GROUP = ["/signup", "/signin", "/confirm"];
const PROTECTED_GROUP = ["/dashboard", ONBOARDING_ROUTE];

export async function middleware(req: NextRequest) {
  const reqPath = req.nextUrl.pathname;
  const [validSession, user] = await getSession(cookies().get(COOKIE_SECURE_AUTH_TOKEN));

  if (validSession && user.initiateOnboarding) {
    if (reqPath.startsWith(ONBOARDING_ROUTE)) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (AUTH_GROUP.some(route => reqPath.startsWith(route)) && validSession) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (PROTECTED_GROUP.some(route => reqPath.startsWith(route)) && !validSession) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|fonts|favicon.ico).*)"],
};

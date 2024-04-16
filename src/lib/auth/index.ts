import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_SECURE_AUTH_TOKEN } from "@/constants/app-strings";
import prisma from "@/lib/db";
import { JWTPayload } from "jose";
import { decode, encode } from "./jwt";
import { isUserRegistered } from "./utils";

export interface AuthorizationOptions<P extends JWTPayload> {
  cookieName?: string;

  /* Uses cookie name by default */
  salt?: string;

  /* Cookie and jwt expiry in minutes, default 2 days  */
  expiry?: number;

  /* Jwt signing secret, `env.JWT_EXPIRY` by default */
  secret?: string;

  payload: P;
}

export const setAuthorizationCookie = async <P extends JWTPayload>(
  options: AuthorizationOptions<P>
) => {
  const {
    cookieName = COOKIE_SECURE_AUTH_TOKEN,
    salt = cookieName,
    expiry = 2880,
    secret = process.env.JWT_SECRET,
    payload,
  } = options;

  if (!secret) {
    throw new Error("A valid jwt secret is required");
  }

  const expiryInSeconds = expiry * 60;
  const expiryInMilliSeconds = expiryInSeconds * 1000;

  const token = await encode({
    salt,
    secret,
    maxAge: expiryInSeconds,
    payload: payload,
  });

  cookies().set(cookieName, token, {
    httpOnly: true,
    expires: Date.now() + expiryInMilliSeconds,
    sameSite: "strict",
    secure: true,
    path: "/",
  });
};

export type IsSessionValidResponse = [false, null] | [true, string];

export const isSessionValid = async (
  cookie: RequestCookie | undefined
): Promise<IsSessionValidResponse> => {
  try {
    if (!cookie || !cookie.name || !cookie.value) {
      return [false, null];
    }

    const payload = await decode({
      salt: cookie.name,
      secret: process.env.JWT_SECRET!,
      token: cookie.value,
    });

    if (!payload.exp || payload.exp < Date.now() / 1000) {
      return [false, null];
    }

    if (!payload.identifier || (!payload.identifier as unknown as string) === "email") {
      return [false, null];
    }

    if (!payload.identity) {
      return [false, null];
    }

    const isUser = await isUserRegistered(payload.identity as unknown as string);

    if (isUser) {
      return [true, payload.identifier as unknown as string];
    }
  } catch (error) {}

  return [false, null];
};

/* Returns currently logged in user or redirects to signin */
export const getUser = async () => {
  const [validSession, userId] = await isSessionValid(cookies().get(COOKIE_SECURE_AUTH_TOKEN));

  if (!validSession) {
    redirect("/signin");
  }

  const user = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      email: true,
    },
    where: {
      id: userId,
    },
  });

  // This case will never occur
  if (!user) {
    redirect("/signin");
  }

  return user;
};

export * from "./create-validation-context";
export * from "./jwt";
export * from "./utils";
export * from "./verify-validation-context";

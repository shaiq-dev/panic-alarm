import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@prisma/client/edge";
import { COOKIE_SECURE_AUTH_TOKEN } from "@/constants/app-strings";
import prisma from "@/lib/db";
import { JWTPayload } from "jose";
import logger from "../../logging";
import { decode, encode } from "./jwt";

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

export type SessionResponse =
  /* Invalid session and null user */
  | [false, null]
  /* Valid session with logged in user */
  | [true, User];

export const getSession = async (
  secureAuthCookie: RequestCookie | undefined
): Promise<SessionResponse> => {
  try {
    if (!secureAuthCookie || !secureAuthCookie.name || !secureAuthCookie.value) {
      return [false, null];
    }

    const payload = await decode({
      salt: secureAuthCookie.name,
      secret: process.env.JWT_SECRET!,
      token: secureAuthCookie.value,
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

    const user = await prisma.user.findFirst({
      where: {
        email: payload.identity as unknown as string,
      },
    });

    if (user) {
      return [true, user];
    }
  } catch (error) {
    logger.error("getSession exception while retreiving user");
    logger.error(error);
  }

  return [false, null];
};

/* Returns currently logged in user or redirects to signin */
export const getUserGuarded = async () => {
  const [validSession, user] = await getSession(cookies().get(COOKIE_SECURE_AUTH_TOKEN));

  if (!validSession) {
    redirect("/signin");
  }

  return user;
};

export * from "./validation-context";
export * from "./jwt";
export * from "./utils";

import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
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
    cookieName = "__sat",
    salt,
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
    salt: salt ? salt : cookieName,
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

export const isSessionValid = async (cookie: RequestCookie | undefined) => {
  try {
    if (!cookie || !cookie.name || !cookie.value) {
      return false;
    }

    const payload = await decode({
      salt: cookie.name,
      secret: process.env.JWT_SECRET!,
      token: cookie.value,
    });

    if (!payload.exp || payload.exp < Date.now() / 1000) {
      return false;
    }

    if (
      !payload.identifier ||
      (!payload.identifier as unknown as string) === "email"
    ) {
      return false;
    }

    if (!payload.identity) {
      return false;
    }

    const isUser = await isUserRegistered(
      payload.identity as unknown as string
    );

    return isUser;
  } catch (error) {
    console.log(error);
  }

  return false;
};

export * from "./create-validation-context";
export * from "./jwt";
export * from "./utils";
export * from "./verify-validation-context";

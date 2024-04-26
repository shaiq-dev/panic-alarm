"use server";

import { redirect } from "next/navigation";
import { setAuthorizationCookie, verifyValidationContext } from "@/lib/auth";
import prisma from "@/lib/db";
import { type ActionResponse } from "@/types";
import { type SigninInput } from "./signin";

export type VerifySigninInput = {
  otp: string;
  validationId: string;
};

const OTP_EXPIRY_IN_MINS = Number(process.env.OTP_EXPIRY_IN_MINS || 3);

export const verfiySignin = async (input: VerifySigninInput): Promise<ActionResponse | void> => {
  const { otp, validationId } = input;

  const validationPayload = await verifyValidationContext<SigninInput>({
    validationId: validationId,
    otpValue: otp,
    otpExpiry: OTP_EXPIRY_IN_MINS,
  });

  if (!validationPayload) {
    return {
      ok: false,
      error: "invalid_otp",
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      email: validationPayload.email,
    },
  });

  if (!user) {
    return {
      ok: false,
      error: "invalid_request",
    };
  }

  setAuthorizationCookie({
    payload: {
      identifier: "email",
      identity: validationPayload.email,
    },
  });

  if (user.initiateOnboarding) {
    redirect("/onboarding");
  }

  if (user) redirect("/dashboard");
};

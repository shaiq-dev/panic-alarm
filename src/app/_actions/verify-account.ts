"use server";

import { redirect } from "next/navigation";
import { setAuthorizationCookie, verifyValidationContext } from "@/lib/auth";
import prisma from "@/lib/db";
import { ActionResponse } from "@/types";
import { type CreateAccountInput } from "./create-account";

export type VerifyAccountInput = {
  otp: string;
  validationId: string;
};

const OTP_EXPIRY_IN_MINS = Number(process.env.OTP_EXPIRY_IN_MINS || 3);

export const verfiyAccount = async (input: VerifyAccountInput): Promise<ActionResponse | void> => {
  const { otp, validationId } = input;

  const validationPayload = await verifyValidationContext<CreateAccountInput>({
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

  const user = await prisma.user.create({
    data: {
      ...validationPayload,
    },
  });

  setAuthorizationCookie({
    payload: {
      identifier: "email",
      identity: user.email,
    },
  });

  redirect("/onboarding");
};

"use server";

import { createValidationContext } from "@/lib/auth";
import { isUserRegistered } from "@/lib/auth/utils";
import { ActionResponse } from "@/types";

export interface SigninInput {
  email: string;
}

export const signin = async (
  input: SigninInput
): Promise<ActionResponse<{ validationId: string }>> => {
  const { email } = input;
  const isUser = await isUserRegistered(email);

  if (!isUser) {
    return {
      ok: false,
      error: "no_user_found",
    };
  }

  const validationId = await createValidationContext({
    validationEmail: email,
    validationEmailTemplate: "signin",
    validationPayload: input,
  });

  if (!validationId) {
    return {
      ok: false,
      error: "server_failure",
    };
  }

  return {
    ok: true,
    validationId,
  };
};

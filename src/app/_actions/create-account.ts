"use server";

import { createValidationContext } from "@/lib/auth";
import prisma from "@/lib/db";
import { ActionResponse } from "@/types";

export type CreateAccountInput = {
  name: string;
  email: string;
};

export const createAccount = async (
  input: CreateAccountInput
): Promise<ActionResponse<{ validationId: string }>> => {
  const { email } = input;
  const existing = await prisma.user.findUnique({
    select: {
      id: true,
    },
    where: {
      email,
    },
  });

  if (existing) {
    return {
      ok: false,
      error: "email_taken",
    };
  }

  const validationId = await createValidationContext({
    validationEmail: email,
    validationEmailTemplate: "signup",
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

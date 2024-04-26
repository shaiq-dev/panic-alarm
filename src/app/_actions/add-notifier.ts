"use server";

import { ERROR_INVALID_EMAIL } from "@/constants/app-strings";
import { getUserGuarded } from "@/lib/auth";
import prisma from "@/lib/db";
import { error } from "console";
import { randomUUID } from "crypto";
import cypher from "../../lib/cypher";
import mailer from "../../lib/mailer";
import { base64Encode } from "../../utils/base64";

export interface AddNotifierInput {
  name: string;
  email: string;
  watchAssociationId: number;
}

type AddNotifierPayload = AddNotifierInput & { randomnessId: string };

export const addNotifier = async (input: AddNotifierInput) => {
  const user = await getUserGuarded();
  const { name, email, watchAssociationId } = input;

  if (!name || name.length < 3 || name.length > 30) {
    return {
      ok: false,
      error: "Name should be 3 - 30 characters",
    };
  }

  if (!email || false) {
    return {
      ok: false,
      error: ERROR_INVALID_EMAIL,
    };
  }

  if (email === user.email) {
    return {
      ok: false,
      error: "You can't add your own email",
    };
  }

  const existingNotifier = await prisma.notifier.findFirst({
    select: { id: true },
    where: {
      email,
      watchAssociationId,
    },
  });

  if (existingNotifier) {
    return {
      ok: false,
      error: "This email is already added for this watch",
    };
  }

  const validationPayload = cypher.encrypt(
    JSON.stringify({
      ...input,
      randomnessId: randomUUID(),
    })
  );

  if (!validationPayload) {
    return {
      ok: false,
      error: "Something went wrong",
    };
  }

  // Send the verification mail
  await mailer.send("signin", {
    to: email,
    dynamicTemplateData: {
      name,
      watchOwner: user.name,
      watchName: "",
      verificationLink: `https://localhost:3000/verify-notifier?state=${base64Encode(validationPayload)}`,
    },
  });
};

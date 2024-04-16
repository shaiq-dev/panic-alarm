"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { ActionResponse } from "@/types";

export interface AddWatchInput {
  code: string;
  name: string;
  colorSwatchId: number;
}

export const addWatch = async (input: AddWatchInput): Promise<ActionResponse> => {
  const { code, name, colorSwatchId } = input;

  const user = await getUser();

  if (!code || code.trim().length < 12) {
    return {
      ok: false,
      error: "Watch code should be exact 12 characters",
    };
  }

  if (!name || name.trim().length < 3) {
    return {
      ok: false,
      error: "Watch name should be at least 3 characters and may not start or end with space",
    };
  }

  const colorSwatch = await prisma.colorSwatch.findFirst({
    select: {
      id: true,
    },
    where: {
      id: colorSwatchId,
    },
  });

  if (!colorSwatch) {
    return {
      ok: false,
      error: "Select a valid color",
    };
  }

  const watch = await prisma.watch.findFirst({
    select: { id: true },
    where: {
      code,
      active: false,
    },
  });

  if (!watch) {
    return {
      ok: false,
      error: "Watch code is invalid or watch is already active",
    };
  }

  await prisma.watchAssociation.create({
    data: {
      userId: user.id,
      watchId: watch.id,
      name: name,
      colorSwatchId,
    },
  });

  await prisma.watch.update({
    where: {
      id: watch.id,
    },
    data: {
      active: true,
    },
  });

  revalidatePath("/dashboard/watch");

  return { ok: true };
};

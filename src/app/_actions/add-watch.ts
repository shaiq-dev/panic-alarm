"use server";

import { revalidatePath } from "next/cache";
import {
  ERROR_INVALID_WATCH_CODE,
  ERROR_INVALID_WATCH_NAME,
  ERROR_UNKNOWN_COLOR_SWATCH,
  ERROR_WATCH_ACTIVE,
} from "@/constants/app-strings";
import { getUserGuarded } from "@/lib/auth";
import prisma from "@/lib/db";
import { ActionResponse } from "@/types";

export interface AddWatchInput {
  code: string;
  name: string;
  colorSwatchId: number;
}

export const addWatch = async (input: AddWatchInput): Promise<ActionResponse> => {
  const { code, name, colorSwatchId } = input;

  const user = await getUserGuarded();

  if (!code || code.trim().length < 12) {
    return {
      ok: false,
      error: ERROR_INVALID_WATCH_CODE,
    };
  }

  if (!name || name.trim().length < 3) {
    return {
      ok: false,
      error: ERROR_INVALID_WATCH_NAME,
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
      error: ERROR_UNKNOWN_COLOR_SWATCH,
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
      error: ERROR_WATCH_ACTIVE,
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

  // Disable onbaording if active
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      initiateOnboarding: false,
    },
  });

  revalidatePath("/dashboard/watch");

  return { ok: true };
};

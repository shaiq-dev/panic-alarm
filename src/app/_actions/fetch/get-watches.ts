"use server";

import { ColorSwatch, Watch as PrismaWatch } from "@prisma/client/edge";
import { getUserGuarded } from "@/lib/auth";
import prisma from "@/lib/db";
import { maskCode } from "@/utils/mask-code";

export type Watch = {
  name: string;
  createdAt: Date;
  colorSwatch: Omit<ColorSwatch, "id" | "active">;
} & Omit<PrismaWatch, "active" | "createdAt">;

export const getWatches = async (): Promise<Watch[]> => {
  const user = await getUserGuarded();

  const watches = await prisma.watchAssociation.findMany({
    where: {
      userId: user.id,
      Watch: {
        active: true,
      },
    },
    select: {
      name: true,
      createdAt: true,
      ColorSwatch: {
        select: {
          name: true,
          value: true,
        },
      },
      Watch: {
        select: {
          id: true,
          code: true,
          model: true,
        },
      },
    },
  });

  return watches.map(watch => {
    const {
      Watch: { id, code, model },
      ColorSwatch,
      ...rest
    } = watch;

    return {
      id,
      code: maskCode(code),
      model,
      colorSwatch: ColorSwatch,
      ...rest,
    };
  });
};

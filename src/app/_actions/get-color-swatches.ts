import prisma from "@/lib/db";
import { ColorSwatch } from "@prisma/client";

export const getColorSwatches = async (): Promise<ColorSwatch[]> => {
  return await prisma.colorSwatch.findMany({
    where: {
      active: true,
    },
  });
};

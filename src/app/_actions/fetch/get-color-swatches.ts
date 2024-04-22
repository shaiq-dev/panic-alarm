import { ColorSwatch } from "@prisma/client/edge";
import prisma from "@/lib/db";

export const getColorSwatches = async (): Promise<ColorSwatch[]> => {
  return await prisma.colorSwatch.findMany({
    where: {
      active: true,
    },
  });
};

import prisma from "@/lib/db";

export const isUserRegistered = async (email: string) => {
  const user = await prisma.user.findUnique({
    select: {
      id: true,
    },
    where: {
      email,
    },
  });

  if (user) {
    return true;
  }

  return false;
};

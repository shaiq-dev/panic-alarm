"use server";

import { revalidatePath } from "next/cache";
import { Watch } from "@/app/dashboard/watch/_components/WatchList";
import prisma from "@/lib/db";
import { maskCode } from "@/utils/mask-code";

export const getWatches = async (): Promise<Watch[]> => {
  const watches = await prisma.watchAssociation.findMany({
    where: {
      userId: "cluoma9fw0001wvhq7h1ttejv",
      Watch: {
        active: true,
      },
    },
    select: {
      watchId: true,
      name: true,
      tag: true,
      createdAt: true,
      Watch: {
        select: {
          code: true,
          model: true,
        },
      },
    },
  });

  return watches.map(watch => {
    const {
      Watch: { code, model },
      ...rest
    } = watch;

    return {
      ...rest,
      model,
      code: maskCode(code),
      status: "ONLINE",
    };
  });
};

export interface FormStateAddWatch {
  fieldError: {
    code?: string;
    name?: string;
  };
}

export async function addWatch(prevState: FormStateAddWatch, data: { code: string; name: string }) {
  // const code = formData.get("code") as string;
  // const name = formData.get("name") as string;

  // if (!code || code.trim().length < 12) {
  //   return {
  //     fieldError: {
  //       code: "Watch code should be exact 12 characters",
  //     },
  //   };
  // }

  // if (!name || name.trim().length < 5) {
  //   return {
  //     fieldError: {
  //       name: "Watch name should be atleast 5 characters and may not start or end with space",
  //     },
  //   };
  // }

  const watch = await prisma.watch.findFirst({
    where: {
      code: data.code,
      active: false,
    },
  });

  if (!watch) {
    return {
      fieldError: {
        watch: "Either watch code is invalid or watch is already active",
        code: undefined,
      },
    };
  }

  await prisma.watchAssociation.create({
    data: {
      userId: "cluoma9fw0001wvhq7h1ttejv",
      watchId: watch.id,
      name: data.name,
      tag: "#e01d5a",
      removedAt: new Date(),
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

  return { fieldError: { watch: undefined, code: undefined } };
}

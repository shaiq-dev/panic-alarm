"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signout = async () => {
  cookies().delete("__sat");
  redirect("/signin");
};

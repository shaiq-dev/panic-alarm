"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ColorSwatch } from "@prisma/client";
import { AddWatchInput } from "@/app/_actions/add-watch";
import Logo from "@/assets/logo-full.svg";
import { AddWatch } from "@/components/AddWatch";
import { WatchIcon } from "@/components/WatchIcon";
import { ONBOARDING_PAGE_DESCRIPTION, ONBOARDING_PAGE_TITLE } from "@/constants/app-strings";
import { ActionResponse } from "@/types";

export interface Props {
  colorSwatches: ColorSwatch[];

  /* Server action to add the watch */
  action: (input: AddWatchInput) => Promise<ActionResponse>;
}

export default function OnboardingClientComponent(props: Props) {
  const { colorSwatches, action } = props;
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-white items-center">
      <div className="py-12 flex items-center justify-center w-full">
        <Image src={Logo} alt="PanicAlarm logo" height={32} />
      </div>
      <h1 className="text-[56px] font-medium pb-2">{ONBOARDING_PAGE_TITLE}</h1>
      <p className="mb-8">{ONBOARDING_PAGE_DESCRIPTION}</p>
      <div className="flex flex-col items-center justify-center relative w-[400px]">
        <AddWatch
          action={action}
          colorSwatches={colorSwatches}
          watchPreview={colorSwatch => (
            <div className="center size-24 shadow-sm rounded-3xl border border-solid border-[--color-border]">
              <WatchIcon size={80} fill={colorSwatch.value} />
            </div>
          )}
          showNotification={false}
          onSubmitComplete={() => router.push("/dashboard")}
        />
      </div>
    </div>
  );
}

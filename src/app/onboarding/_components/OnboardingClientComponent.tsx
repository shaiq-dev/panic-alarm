"use client";

import { useState } from "react";
import Image from "next/image";
import { TextInput, Group, Button, ColorSwatch, CheckIcon, rem, Tooltip } from "@mantine/core";
import Logo from "@/assets/logo-full.svg";
import { WatchIcon } from "@/components/WatchIcon";
import { ONBOARDING_PAGE_DESCRIPTION, ONBOARDING_PAGE_TITLE } from "@/constants/app-strings";
import { type ColorSwatch as WatchColorSwatch } from "@prisma/client";

export interface Props {
  colors: WatchColorSwatch[];
}

export default function OnboardingClientComponent  (props: Props)  {
  const { colors } = props;
  const [watchColor, setWatchColor] = useState(colors[0]);

  return (
    <div className="flex flex-col h-full bg-white items-center">
      <div className="py-12 flex items-center justify-center w-full">
        <Image src={Logo} alt="PanicAlarm logo" height={32} />
      </div>
      <>
        <h1 className="text-[56px] font-medium pb-2">{ONBOARDING_PAGE_TITLE}</h1>
        <p className="mb-8">{ONBOARDING_PAGE_DESCRIPTION}</p>
        <div className="flex flex-col items-center justify-center relative w-[400px]">
          <div className="center size-24 shadow-sm rounded-3xl border border-solid border-[--color-border]">
            <WatchIcon size={80} fill={watchColor.value} />
          </div>
          <form className="w-full mt-8 change-mantine-input-focus">
            <TextInput
              placeholder="Watch Code - xxx-xxxx-xxx"
              className="mb-4"
              maxLength={12}
              size="md"
            />
            <TextInput placeholder="My cool watch" className="mb-6" size="md" />
            <Group className="mb-8">
              <label className="mr-auto font-normal">Give it a cool color</label>
              {colors.map((color, idx) => (
                <Tooltip label={color.name} key={idx} arrowSize={6} color={color.value} withArrow>
                  <ColorSwatch
                    component="button"
                    type="button"
                    color={color.value}
                    onClick={() => setWatchColor(color)}
                  >
                    {color.id === watchColor.id && (
                      <CheckIcon style={{ width: rem(12), height: rem(12) }} color="white" />
                    )}
                  </ColorSwatch>
                </Tooltip>
              ))}
            </Group>
            <Button className="mt-4" color="var(--color-teal)" size="md" type="submit" fullWidth>
              Add Watch
            </Button>
          </form>
        </div>
      </>
    </div>
  );
};

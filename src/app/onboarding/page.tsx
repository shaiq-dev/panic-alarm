"use client";

import Image from "next/image";

import Logo from "@/assets/logo-full.svg";
import Watch from "@/assets/watch.svg";
import { IoWatch } from "react-icons/io5";
import { WatchIcon } from "@/components/WatchIcon";
import { Button, ColorSwatch, Group, Radio, TextInput } from "@mantine/core";

export default function OnboardingPage() {
  return (
    <div className="flex flex-col h-full bg-white items-center">
      <div className="py-12 flex items-center justify-center w-full">
        <Image src={Logo} alt="PanicAlarm logo" height={32} />
      </div>
      <>
        <h1 className="text-[56px] font-medium pb-2">Add your first watch</h1>
        <p className="mb-8">
          A closer look at your loved ones. The more informed you are, the more
          empowered you are to take action.
        </p>
        <div className="flex flex-col items-center justify-center relative w-[400px]">
          <div className="center size-24 shadow-sm rounded-3xl border border-solid border-[--color-border]">
            <WatchIcon size={80} fill="var(--color-green)" />
          </div>
          <form className="w-full mt-8 change-mantine-input-focus">
            <TextInput
              placeholder="Watch Code - xxx-xxxx-xxx"
              className="mb-4"
              maxLength={12}
              size="md"
            />
            <TextInput placeholder="My cool watch" className="mb-8" size="md" />
            <Group>
              <ColorSwatch component="button" color="#009790" />
              <ColorSwatch color="rgba(234, 22, 174, 0.5)" />
              <ColorSwatch color="var(--mantine-color-orange-5)" />
            </Group>
            <Button
              className="mt-4"
              color="var(--color-teal)"
              size="md"
              type="submit"
              fullWidth
            >
              Add Watch
            </Button>
          </form>
        </div>
      </>
    </div>
  );
}

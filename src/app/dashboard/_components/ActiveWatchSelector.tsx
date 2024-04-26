"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "@mantine/core";
import { type Watch } from "@/app/_actions/fetch/get-watches";
import { ActiveWatchContext } from "@/context/active-watch";
import classNames from "classnames";
import { IoWatchOutline } from "react-icons/io5";

export interface Props {
  watches: Watch[];
  useLayout?: "dashboard" | "settings";
}

export const SingleWatch = ({ watch, active = false }: { watch: Watch; active?: boolean }) => {
  const cn = classNames("text-[--color-text]", {
    heading: active,
    "text-sm font-medium": !active,
  });

  return (
    <div className="flex-ic">
      <div
        className={"size-8 rounded-full text-white mr-4 center"}
        style={{
          background: watch.colorSwatch.value,
        }}
      >
        <IoWatchOutline size={20} strokeWidth={4} />
      </div>
      <div className="flex flex-col">
        <h3 className={cn}>{watch.name}</h3>
        <p className="flex items-center text-xs text-dimmed font-light">
          <span>{watch.code}</span>
          {active && (
            <>
              <span className="dot-seperator mx-1" />
              <span>Series 1</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export const ActiveWatchSelector = (props: Props) => {
  const { watches, useLayout = "dashboard" } = props;
  const { activeWatchId, setActiveWatchId } = useContext(ActiveWatchContext);

  const [activeWatch, setActiveWatch] = useState(watches[0]);
  const availableWatches = watches.filter(watch => watch.id !== activeWatch.id);

  const isDashboardLayout = useLayout === "dashboard";

  useEffect(() => {
    if (activeWatchId && activeWatchId !== "") {
      setActiveWatch(watches.filter(watch => watch.id === activeWatchId)[0]);
    }
  }, [activeWatchId]);

  return (
    <Menu
      position="bottom-start"
      offset={-50}
      classNames={{
        dropdown: isDashboardLayout ? "!pt-0 -ml-[11px] -mt-[2px]" : "!pt-0 -ml-[11px] -mt-[6px]",
      }}
      shadow="sm"
    >
      <Menu.Target>
        <div className="border border-solid border-transparent inline-block p-px rounder-[3px] hover:cursor-pointer hover:border-[--color-border]">
          <SingleWatch watch={activeWatch} active />
        </div>
      </Menu.Target>

      <Menu.Dropdown w={240}>
        <Menu.Label>
          <SingleWatch watch={activeWatch} active />
        </Menu.Label>
        {availableWatches.length ? (
          availableWatches.map((watch, idx) => (
            <Menu.Item key={idx} onClick={() => setActiveWatchId(watch.id)}>
              <SingleWatch watch={watch} />
            </Menu.Item>
          ))
        ) : (
          <Menu.Label className="flex flex-col text-sm">
            <span className="text-[--color-text]">No Watches</span>
            <span className="text-dimmed font-light">
              You can add additional watches from{" "}
              <Link href="/dashboard/watches" className="link font-normal">
                here
              </Link>
            </span>
          </Menu.Label>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

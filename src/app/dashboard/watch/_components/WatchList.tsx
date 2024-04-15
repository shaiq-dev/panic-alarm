"use client";

import { Drawer, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IoWatchOutline } from "react-icons/io5";

import { Badge } from "@/components/Badge";

export interface Watch {
  name: string;
  watchId: string;
  code: string;
  tag: string;
  model: string;
  status: "ONLINE" | "OFFLINE";
  createdAt: Date;
}

const Watch = ({ name, code, tag, model, status }: Watch) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <div
        className="flex items-center border-b border-solid border-[--color-border] py-4 cursor-pointer"
        onClick={open}
      >
        <IoWatchOutline size={24} color={tag} />
        <div className="flex flex-col ms-2.5">
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-dimmed">
            <Badge>{status}</Badge>
            <span className="ms-1.5">{code}</span>
          </div>
        </div>
      </div>
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        overlayProps={{ backgroundOpacity: 0.5, blur: 2.5 }}
      >
        Hello
      </Drawer>
    </>
  );
};

export interface Props {
  watches: Watch[];
}

export const WatchList = ({ watches }: Props) => {
  return (
    <ScrollArea scrollbarSize={4} type="scroll" scrollHideDelay={0} h={400}>
      {watches.map((watch, idx) => (
        <Watch key={idx} {...watch} />
      ))}
    </ScrollArea>
  );
};

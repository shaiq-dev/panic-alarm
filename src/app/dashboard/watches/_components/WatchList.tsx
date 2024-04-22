"use client";

import { Drawer, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type Watch as IWatch } from "@/app/_actions/fetch/get-watches";
import { Badge } from "@/components/Badge";
import { IoWatchOutline } from "react-icons/io5";

const Watch = ({ name, code, colorSwatch }: IWatch) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <div className="flex-ic border-b def-border py-4 cursor-pointer" onClick={open}>
        <IoWatchOutline size={24} color={colorSwatch.value} />
        <div className="flex flex-col ms-2.5">
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-dimmed">
            <Badge>{"ONLINE"}</Badge>
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
  watches: IWatch[];
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

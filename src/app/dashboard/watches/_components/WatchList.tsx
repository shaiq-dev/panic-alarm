"use client";

import { Drawer, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type Watch } from "@/app/_actions/fetch/get-watches";
import { Badge } from "@/components/Badge";
import classNames from "classnames";
import { IoWatchOutline } from "react-icons/io5";

interface WatchRowProps {
  watch: Watch;
  cn: string;
}

const WatchRow = (props: WatchRowProps) => {
  const {
    watch: { name, code, colorSwatch },
    cn,
  } = props;

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <div className={cn} onClick={open}>
        <IoWatchOutline size={24} color={colorSwatch.value} />
        <div className="flex flex-col ms-2.5">
          <div className="text-base font-medium">{name}</div>
          <div className="flex-ic text-sm text-dimmed">
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

export interface WatchListProps {
  watches: Watch[];
}

export const WatchList = ({ watches }: WatchListProps) => {
  return (
    <ScrollArea scrollbarSize={4} type="scroll" scrollHideDelay={0} h={400}>
      {watches.map((watch, idx) => {
        const cn = classNames("flex-ic border def-border p-4 cursor-pointer", {
          "!border-t-0": idx !== 0,
          "rounded-t": idx === 0,
          "rounded-b": idx === watches.length - 1,
        });
        return <WatchRow key={idx} watch={watch} cn={cn} />;
      })}
    </ScrollArea>
  );
};

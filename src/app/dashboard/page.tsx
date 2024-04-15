"use client";

import { Box, ScrollArea } from "@mantine/core";

import { PulseChart } from "@/components/PulseChart";
import { Location } from "@/components/Location";
import { WatchSelector } from "@/components/WatchSelector";
import { WatchStatus } from "@/components/WatchStatus";
import { Suspense } from "react";

const DashboardPage = () => {
  return (
    <Suspense fallback="loading">
      <div className="flex-1 grid grid-cols-[1fr_0.5fr] grid-rows-[1fr] gap-0">
        <ScrollArea scrollbarSize={4} type="scroll" scrollHideDelay={0}>
          <Box
            py="var(--default-gap)"
            px="var(--default-section-gap)"
            bg="white"
          >
            <WatchSelector />
            <WatchStatus />
            <PulseChart />
            <Location />
          </Box>
        </ScrollArea>
        <div className="border-l border-solid border-[--color-border]">2</div>
      </div>
    </Suspense>
  );
};

export default DashboardPage;

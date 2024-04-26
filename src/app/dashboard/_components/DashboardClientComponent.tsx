"use client";

import { ScrollArea } from "@mantine/core";
import { Watch } from "@/app/_actions/fetch/get-watches";
import {
  DASHBOARD_PAGE_ACTIVITY_HISTORY_TITLE,
  DASHBOARD_PAGE_ACTIVITY_HISTORY_DESCRIPTION,
} from "@/constants/app-strings";
import { ActiveWatchProvider } from "@/context/active-watch";
import { ActiveWatchSelector } from "./ActiveWatchSelector";
import { ActivityHistory } from "./ActivityHistory";
import { Location } from "./Location";
import { PulseChart } from "./PulseChart";
import { WatchQuickStats } from "./WatchQuickStats";

export interface Props {
  watches: Watch[];
}

export default function DashboardClientComponent(props: Props) {
  const { watches } = props;

  return (
    <ActiveWatchProvider>
      <div className="flex-1 grid grid-cols-[1fr_0.5fr] grid-rows-[1fr] gap-0">
        <ScrollArea scrollbarSize={4} type="scroll" scrollHideDelay={0}>
          <div className="py-4 px-10 bg-white">
            <ActiveWatchSelector watches={watches} />
            <WatchQuickStats beats={88} autoAlerts={3} triggeredAlerts={0} connection="Online" />
            <PulseChart />
            <Location />
          </div>
        </ScrollArea>
        <ScrollArea scrollbarSize={4} type="scroll" scrollHideDelay={0}>
          <div className="border-l def-border">
            <div className="p-4 bg-white sticky top-0 z-10">
              <h3 className="heading">{DASHBOARD_PAGE_ACTIVITY_HISTORY_TITLE}</h3>
              <p className="text-sm text-dimmed">{DASHBOARD_PAGE_ACTIVITY_HISTORY_DESCRIPTION}</p>
            </div>
            <div className="p-4 pt-0">
              <ActivityHistory />
            </div>
          </div>
        </ScrollArea>
      </div>
    </ActiveWatchProvider>
  );
}

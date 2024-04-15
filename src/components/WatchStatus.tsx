import { Flex, Stack, Text } from "@mantine/core";

import { IoPulse, IoAlertCircleOutline } from "react-icons/io5";
import { AiOutlineAlert } from "react-icons/ai";
import { ImConnection } from "react-icons/im";
import { IconType } from "react-icons/lib";

const getStatusIcon = (status: keyof WatchStatusProps) => {
  const icons: Record<keyof WatchStatusProps, IconType> = {
    beats: IoPulse,
    alerts: IoAlertCircleOutline,
    entry: AiOutlineAlert,
    connection: ImConnection,
  };

  const Icon = icons[status];
  return <Icon size={20} />;
};

export interface WatchStatusProps {
  beats: number;

  alerts: number;

  entry: number;

  connection: "Online" | "Delay" | "Offline";
}

const data: WatchStatusProps = {
  beats: 110,
  alerts: 12,
  entry: 0,
  connection: "Online",
};

export const WatchStatus = () => {
  return (
    <div className="border border-solid border-[--mantine-color-gray-3] p-[--default-gap] my-[--default-section-gap] flex gap-[--default-gap] justify-between rounded-md">
      {Object.entries(data).map(([k, v], idx) => (
        <Flex key={idx} align="center">
          <div className="dot">
            {getStatusIcon(k as keyof WatchStatusProps)}
          </div>
          <Stack key={idx} pr="calc(var(--default-gap) * 2)" gap={0}>
            <Text
              c="dimmed"
              size="sm"
              mb="calc(var(--default-gap) * 0.3)"
              fw={500}
              lh={1}
            >
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </Text>
            <Text size="lg" lh={1}>
              {v}
            </Text>
          </Stack>
        </Flex>
      ))}
    </div>
  );
};

"use client";

import { Flex, Stack, Title, Text, Menu } from "@mantine/core";
import { IoWatchOutline } from "react-icons/io5";
import { faker } from "@faker-js/faker";

const fakeWatch = () => ({
  name: `${faker.person.firstName()}'s Watch`,
  actionId: faker.string.uuid(),
  code: `xxxx-${faker.string.alpha(4).toUpperCase()}`,
  tag: faker.color.rgb({ format: "css" }),
});

const WATCHES = [...Array(10)].map(fakeWatch);

export const WatchSelector = () => {
  return (
    <Menu position="bottom-start">
      <Menu.Target>
        <div className="border border-solid border-transparent inline-block p-[1px] rounder-[3px] hover:cursor-pointer hover:border-[--color-border]">
          <Flex align="center">
            <div className="watch-logo">
              <IoWatchOutline size={20} strokeWidth={4} />
            </div>
            <Stack gap={0}>
              <Title order={5} fw={500}>
                Johns Watch
              </Title>
              <Text size="xs" c="dimmed" lh={1}>
                ID: xxxx-4JFS
              </Text>
            </Stack>
          </Flex>
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        {WATCHES.map((watch, idx) => (
          <Menu.Item key={idx}>
            <Flex align="center">
              <div
                className="watch-logo"
                style={
                  { "--watch-tag-color": watch.tag } as React.CSSProperties
                }
              >
                <IoWatchOutline size={20} strokeWidth={4} />
              </div>
              <Stack gap={0}>
                <Title order={6} fw={500}>
                  {watch.name}
                </Title>
                <Text size="xs" c="dimmed" lh={1}>
                  {watch.code}
                </Text>
              </Stack>
            </Flex>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

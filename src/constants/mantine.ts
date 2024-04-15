"use client";

import { Menu, type MantineThemeOverride } from "@mantine/core";
import { Notification } from "@mantine/core";

export const mantineThemeOverride: MantineThemeOverride = {
  fontFamily: "sohne",
  headings: {
    fontFamily: "sohne",
  },
  components: {
    Notification: Notification.extend({
      classNames: {
        root: "pa-notification-root",
        description: "pa-notification-description",
      },
    }),
    Menu: Menu.extend({
      classNames: {
        dropdown: "pa-menu-dropdown",
        item: "pa-menu-item",
      },
    }),
  },
};

import type { Metadata } from "next";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";

import "./globals.scss";
import { mantineThemeOverride } from "@/constants/mantine";

export const metadata: Metadata = {
  title: "PanicAlarm",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MantineProvider theme={mantineThemeOverride}>
          <Notifications position="bottom-center" limit={3} />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}

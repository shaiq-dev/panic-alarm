"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Loader, Menu, Tooltip } from "@mantine/core";
import Logo from "@/assets/logo.svg";
import classNames from "classnames";
import { CgUserlane } from "react-icons/cg";
import {
  IoSettings,
  IoSettingsOutline,
  IoStatsChart,
  IoStatsChartOutline,
  IoWatch,
  IoWatchOutline,
} from "react-icons/io5";
import { IconType } from "react-icons/lib";
import { MdOutlineManageAccounts } from "react-icons/md";
import { RxExternalLink } from "react-icons/rx";

const NAV_LINKS: [string, string, IconType, IconType][] = [
  ["Status", "/dashboard", IoStatsChartOutline, IoStatsChart],
  ["Watches", "/dashboard/watches", IoWatchOutline, IoWatch],
  ["Settings", "/dashboard/settings", IoSettingsOutline, IoSettings],
];

export interface SidebarProps {
  onSignout: () => Promise<void>;
  userName: string;
  userEmail: string;
}

export const Sidebar = (props: SidebarProps) => {
  const { onSignout, userName, userEmail } = props;
  const [isSigningOut, setIsSigningOut] = useState(false);

  const ROOT_SEGMENT = "/dashboard";
  const segment = useSelectedLayoutSegment();

  const handleSignout = async () => {
    setIsSigningOut(true);
    await onSignout();
  };

  return (
    <>
      <div className="flex-ic flex-col  border-r def-border w-[--sidebar-width] py-4 text-[--sidebar-icon-color]">
        <Image src={Logo} alt="PanicAlarm Logo" height={32} />
        <div className="flex-ic flex-col gap-5 w-full my-auto">
          {NAV_LINKS.map(([name, href, Icon, IconActive], idx) => {
            const active =
              (href === ROOT_SEGMENT && segment === null) ||
              href.startsWith(`${ROOT_SEGMENT}/${segment!}`);

            const cn = classNames("center w-full py-2 cursor-pointer", { active });

            return (
              <Tooltip key={idx} label={name} position="right">
                <Link href={href} className={cn}>
                  {active ? <IconActive size={22} /> : <Icon size={22} />}
                </Link>
              </Tooltip>
            );
          })}
        </div>
        <div className="w-full">
          <Menu trigger="click-hover" position="right-end" width={200}>
            <Menu.Target>
              <div className="center w-full py-2 cursor-pointer">
                <CgUserlane size={20} />
              </div>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label className="flex flex-col text-sm">
                <span className="text-[--color-text] truncate">{userName}</span>
                <span className="text-dimmed font-light truncate">{userEmail}</span>
              </Menu.Label>
              <Menu.Item rightSection={<MdOutlineManageAccounts size={18} />}>
                Account Settings
              </Menu.Item>
              <Menu.Item onClick={handleSignout}>Signout</Menu.Item>
              <Menu.Divider />
              <Menu.Item rightSection={<RxExternalLink size={18} />}>Homepage</Menu.Item>
              <Menu.Item>Usage Guide</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>

      {isSigningOut && (
        <>
          <div className="flex items-center justify-center absolute inset-0 w-full h-full bg-white z-50">
            <span className="mr-3">Signing Out</span>
            <Loader size={16} color="var(--color-text)" />
          </div>
        </>
      )}
    </>
  );
};

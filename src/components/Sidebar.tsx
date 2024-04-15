"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader, Menu } from "@mantine/core";
import Logo from "@/assets/logo.svg";
import { CgUserlane } from "react-icons/cg";
import { GoGear } from "react-icons/go";
import { IoHardwareChipOutline, IoStatsChartOutline } from "react-icons/io5";
import { IconType } from "react-icons/lib";
import { MdOutlineManageAccounts } from "react-icons/md";
import { RxExternalLink } from "react-icons/rx";

const NAV_LINKS: [string, string, IconType][] = [
  ["Status", "/dashboard", IoStatsChartOutline],
  ["Watch", "/dashboard/watch", IoHardwareChipOutline],
  ["Settings", "/dashboard/settings", GoGear],
];

export interface SidebarProps {
  onSignout: () => Promise<void>;
}

export const Sidebar = (props: SidebarProps) => {
  const { onSignout } = props;
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignout = async () => {
    setIsSigningOut(true);
    await onSignout();
  };

  return (
    <>
      <div className="flex flex-col items-center border-r border-solid border-[--color-border] w-[--sidebar-width] py-[--default-gap] text-[--sidebar-icon-color]">
        <Image src={Logo} alt="PanicAlarm Logo" height={32} />
        <div className="flex flex-col items-center gap-5 w-full my-auto">
          {NAV_LINKS.map(([name, href, Icon], idx) => (
            <Link
              key={idx}
              href={href}
              className="inline-flex items-center justify-center w-full py-2"
            >
              <Icon size={20} />
            </Link>
          ))}
        </div>
        <div className="w-full">
          <Menu trigger="hover" position="right-end" width={200}>
            <Menu.Target>
              <div className="inline-flex items-center justify-center w-full py-2 cursor-pointer">
                <CgUserlane size={20} />
              </div>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label className="flex flex-col text-sm">
                <span className="text-[--color-text] truncate">Shaiq Kar</span>
                <span className="text-dimmed font-light truncate">shaiqkar@gmail.com</span>
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

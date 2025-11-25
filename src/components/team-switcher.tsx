"use client";

import Image from "next/image";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher() {
  const { open } = useSidebar(); // open = expanded, false = collapsed

  // switch logos automatically
  const logoSrc = open ? "/logo_dark.svg" : "/logo.svg";
  const logoSrcDark = open ? "/logo_white.svg" : "/logo.svg";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <Image
            src={logoSrc}
            alt="App Logo"
            width={open ? 150 : 40} // big when open, small when collapsed
            height={40}
            className="transition-all duration-200 hidden dark:block" 
          />
          <Image
            src={logoSrcDark}
            alt="App Logo"
            width={open ? 150 : 40} // big when open, small when collapsed
            height={40}
            className="transition-all duration-200 block dark:hidden"
          />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

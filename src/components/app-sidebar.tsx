"use client";

import * as React from "react";
import { Home, Library, Plus, Search, ArrowRight } from "lucide-react";

import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";


// This is sample data.
const data = {
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: Home,
      isActive: true,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
      isActive: false,
    },
  ],
  playlists: [
    {
      name: "Liked Songs",
      type: "Playlist",
      url: "#",
    },
    {
      name: "Daily Mix 1",
      type: "Playlist",
      url: "#",
    },
    {
      name: "Discover Weekly",
      type: "Playlist",
      url: "#",
    },
    {
      name: "Release Radar",
      type: "Playlist",
      url: "#",
    },
    {
      name: "Chill Vibes",
      type: "Playlist",
      url: "#",
    },
    {
      name: "Gym Motivation",
      type: "Playlist",
      url: "#",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="bg-black border-none">
      <SidebarHeader className="bg-[#121212] rounded-lg m-2 mb-0 p-4 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:m-0 group-data-[collapsible=icon]:mt-2 group-data-[collapsible=icon]:mx-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)-16px)]">
        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={item.isActive}
                className="text-zinc-400 hover:text-white hover:bg-transparent active:bg-transparent data-[active=true]:bg-transparent data-[active=true]:text-white font-bold text-md transition-colors h-12 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-1! group-data-[collapsible=icon]:justify-center"
              >
                <a href={item.url}>
                  <item.icon className="size-6!" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-[#121212] rounded-lg m-2 mt-2 flex-1 overflow-hidden group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:m-0 group-data-[collapsible=icon]:mt-2 group-data-[collapsible=icon]:mx-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)-16px)]">
        <div className="p-4 pb-0 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between mb-4 px-2 text-zinc-400">
            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer group">
              <Library className="size-6 group-hover:text-white transition-colors" />
              <span className="font-bold text-md">Your Library</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="hover:bg-[#1f1f1f] p-1 rounded-full text-zinc-400 hover:text-white transition-colors">
                <Plus className="size-5" />
              </button>
              <button className="hover:bg-[#1f1f1f] p-1 rounded-full text-zinc-400 hover:text-white transition-colors">
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
            <span className="bg-[#2a2a2a] text-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-[#3a3a3a] transition-colors whitespace-nowrap">
              Playlists
            </span>
            <span className="bg-[#2a2a2a] text-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-[#3a3a3a] transition-colors whitespace-nowrap">
              Artists
            </span>
          </div>
        </div>

        <div className="px-2 overflow-y-auto flex-1 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
          <SidebarMenu>
            {data.playlists.map((playlist) => (
              <SidebarMenuItem key={playlist.name}>
                <SidebarMenuButton
                  asChild
                  className="h-16 hover:bg-[#1f1f1f] text-zinc-400 hover:text-white transition-colors group group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center"
                >
                  <a href={playlist.url} className="flex items-center gap-3">
                    <div className="size-12 bg-[#282828] rounded-md flex items-center justify-center shrink-0 group-data-[collapsible=icon]:size-8">
                      <span className="text-xs group-data-[collapsible=icon]:hidden">
                        IMG
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                      <span className="font-medium text-white truncate">
                        {playlist.name}
                      </span>
                      <span className="text-xs truncate">
                        {playlist.type} • {"Levi"}
                      </span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="m-2 mt-0 p-0 group-data-[collapsible=icon]:p-0">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

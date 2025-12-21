"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { PlayerProvider, usePlayer } from "@/components/player-context";
import { MusicCard } from "@/components/musicCards";
import BottomPlayer from "@/components/bottom-player";

/* ---------------- INTERNAL PAGE CONTENT ---------------- */

function PageContent() {
  const musictracks = useQuery(api.musicTracks.get);
  const { setTracks } = usePlayer();

  useEffect(() => {
    if (!musictracks) return;

    setTracks(
      musictracks.map((t) => ({
        url: t.mp3Url,
        title: t.title,
        artist: t.artist,
        coverImage: t.coverArtUrl,
      }))
    );
  }, [musictracks, setTracks]);

  if (!musictracks) return null;

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 items-center gap-2 px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Sangeet</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Music Grid */}
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-32">
            {musictracks.map((track, index) => (
              <MusicCard
                key={track._id}
                index={index}
                title={track.title}
                artist={track.artist}
                coverImage={track.coverArtUrl}
              />
            ))}
          </div>
        </SidebarInset>
      </SidebarProvider>

      <BottomPlayer />
    </>
  );
}

/* ---------------- PAGE WRAPPER ---------------- */

export default function Page() {
  return (
    <PlayerProvider>
      <PageContent />
    </PlayerProvider>
  );
}

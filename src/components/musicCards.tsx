"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { usePlayer } from "./player-context";

type Props = {
  index: number;
  title: string;
  artist: string;
  coverImage?: string;
};

export function MusicCard({ index, title, artist, coverImage }: Props) {
  const { playTrackAt, setUserInteracted } = usePlayer();

  const safeImage =
    typeof coverImage === "string" && coverImage.startsWith("http")
      ? coverImage
      : "/placeholder.png";

  return (
    <Card
      onClick={() => {
        setUserInteracted(); // 👈 unlock audio
        playTrackAt(index);
      }}
    >
      <Image
        src={safeImage}
        alt={title}
        width={200}
        height={200}
        className="rounded-md"
      />
      <h3 className="mt-2 font-semibold truncate">{title}</h3>
      <p className="text-sm text-muted-foreground truncate">{artist}</p>
    </Card>
  );
}

"use client";

import { createContext, useContext, useState } from "react";

export type Track = {
  url: string;
  title: string;
  artist: string;
  coverImage?: string;
};

type PlayerContextType = {
  tracks: Track[];
  currentIndex: number;
  setTracks: (tracks: Track[]) => void;
  playTrackAt: (index: number) => void;
  next: () => void;
  previous: () => void;
  userInteracted: boolean;
  setUserInteracted: () => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInteracted, setUserInteractedState] = useState(false);

  const setUserInteracted = () => setUserInteractedState(true);

  const playTrackAt = (index: number) => {
    if (index < 0 || index >= tracks.length) return;
    setCurrentIndex(index);
  };

  const next = () => {
    setCurrentIndex((i) => (i + 1) % tracks.length);
  };

  const previous = () => {
    setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length);
  };

  return (
    <PlayerContext.Provider
      value={{
        tracks,
        currentIndex,
        setTracks,
        playTrackAt,
        next,
        previous,
        userInteracted,
        setUserInteracted,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}

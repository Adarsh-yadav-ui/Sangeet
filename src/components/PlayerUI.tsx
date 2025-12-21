"use client";

import React from "react";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  ShuffleIcon,
  RepeatIcon,
  Volume2Icon,
  VolumeXIcon,
  ListMusicIcon,
  Laptop2Icon,
  HeartIcon,
  Music2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const PlayerUI = () => {
  const {
    currentTrack,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    togglePlayPause,
    playNextTrack,
    playPrevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    tracks,
  } = useAudioPlayer();

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!currentTrack) {
    return null; // Don't render the player if no track is selected
  }

  return (
    <footer className="h-24 bg-black border-t border-neutral-800 px-4 grid grid-cols-3 items-center z-50">
      {/* Left: Track Info */}
      <div className="flex items-center justify-start gap-4 min-w-0">
        {currentTrack && (
          <>
            <div className="relative w-14 h-14 rounded overflow-hidden bg-neutral-800 shrink-0 group">
              {currentTrack.coverArtUrl ? (
                <Image
                  src={currentTrack.coverArtUrl}
                  alt={currentTrack.title}
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                  <Music2Icon className="w-6 h-6 text-neutral-400" />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center overflow-hidden">
              <div className="font-medium text-sm truncate hover:underline cursor-pointer text-white">
                {currentTrack.title}
              </div>
              <div className="text-xs text-neutral-400 truncate hover:underline cursor-pointer hover:text-white">
                {currentTrack.artist}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-400 hover:text-white hidden sm:flex"
            >
              <HeartIcon className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Center: Controls & Progress */}
      <div className="flex flex-col items-center max-w-[45%] w-full mx-auto gap-1">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-8 h-8 text-neutral-400 hover:text-white",
              isShuffle && "text-green-500 hover:text-green-400"
            )}
            onClick={toggleShuffle}
            disabled={tracks.length === 0}
          >
            <ShuffleIcon className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-neutral-400 hover:text-white"
            onClick={playPrevTrack}
            disabled={tracks.length === 0}
          >
            <SkipBackIcon className="w-5 h-5 fill-current" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 bg-white rounded-full text-black hover:scale-105 transition-transform hover:bg-white"
            onClick={togglePlayPause}
            disabled={tracks.length === 0}
          >
            {isPlaying ? (
              <PauseIcon className="w-5 h-5 fill-current" />
            ) : (
              <PlayIcon className="w-5 h-5 fill-current ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-neutral-400 hover:text-white"
            onClick={playNextTrack}
            disabled={tracks.length === 0}
          >
            <SkipForwardIcon className="w-5 h-5 fill-current" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-8 h-8 text-neutral-400 hover:text-white",
              isRepeat && "text-green-500 hover:text-green-400"
            )}
            onClick={toggleRepeat}
            disabled={tracks.length === 0}
          >
            <RepeatIcon className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-full flex items-center gap-2 text-xs text-neutral-400 font-medium">
          <span className="min-w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={(value) => seek(value[0])}
            className="w-full cursor-pointer group"
            disabled={tracks.length === 0}
          />
          <span className="min-w-10">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume & Extras */}
      <div className="flex items-center justify-end gap-2 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="text-neutral-400 hover:text-white hidden md:flex"
        >
          <ListMusicIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-neutral-400 hover:text-white hidden md:flex"
        >
          <Laptop2Icon className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2 w-32 group">
          <Button
            variant="ghost"
            size="icon"
            className="text-neutral-400 hover:text-white"
            onClick={toggleMute}
          >
            {isMuted || volume === 0 ? (
              <VolumeXIcon className="w-5 h-5" />
            ) : (
              <Volume2Icon className="w-5 h-5" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0])}
            className="w-full cursor-pointer"
          />
        </div>
      </div>
    </footer>
  );
};
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Volume2,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { usePlayer } from "./player-context";

/* ---------------- HELPERS ---------------- */

const FALLBACK_IMAGE =
  "https://files.edgestore.dev/e7h6nqgb3zux5qhz/publicFiles/_public/843d206d-1b34-41ea-aec3-ebb9434dd954.jpg";

function isValidHttpUrl(value?: string | null) {
  try {
    if (!value) return false;
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function formatTime(time: number) {
  if (!time || isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/* ---------------- COMPONENT ---------------- */

export default function BottomPlayer() {
  /* ✅ ALL HOOKS FIRST (NO CONDITIONS ABOVE) */
  const {
    tracks,
    currentIndex,
    next,
    previous,
    userInteracted,
    setUserInteracted,
  } = usePlayer();

  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  /* ---------------- SAFE TRACK RESOLUTION ---------------- */

  const rawTrack = tracks[currentIndex];
  const validTrack =
    rawTrack && isValidHttpUrl(rawTrack.url)
      ? {
          ...rawTrack,
          coverImage: isValidHttpUrl(rawTrack.coverImage)
            ? rawTrack.coverImage
            : FALLBACK_IMAGE,
        }
      : null;

  /* ---------------- AUTOPLAY AFTER INTERACTION ---------------- */

  useEffect(() => {
    if (!audioRef.current || !validTrack || !userInteracted) return;

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  }, [validTrack?.url, userInteracted]);

  /* ---------------- RENDER GUARD (SAFE) ---------------- */

  if (!validTrack) return null;

  /* ---------------- HELPERS ---------------- */

  const skipSeconds = (seconds: number) => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = Math.min(
      Math.max(0, audioRef.current.currentTime + seconds),
      duration
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 p-4 z-50">
      <audio
        ref={audioRef}
        src={validTrack.url}
        onTimeUpdate={() =>
          setCurrentTime(audioRef.current?.currentTime || 0)
        }
        onLoadedMetadata={() =>
          setDuration(audioRef.current?.duration || 0)
        }
        onEnded={next}
      />

      {/* TOP ROW */}
      <div className="flex items-center justify-between gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 w-1/4">
          <Image
            src={validTrack.coverImage}
            alt={validTrack.title}
            width={56}
            height={56}
            className="rounded"
          />
          <div>
            <p className="font-semibold text-white truncate">
              {validTrack.title}
            </p>
            <p className="text-sm text-gray-400 truncate">
              {validTrack.artist}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button onClick={previous}>
            <SkipBack />
          </button>

          <button onClick={() => skipSeconds(-10)}>
            <Rewind />
          </button>

          <button
            onClick={() => {
              if (!audioRef.current) return;

              setUserInteracted();

              if (isPlaying) {
                audioRef.current.pause();
              } else {
                audioRef.current.play().catch(() => {});
              }
              setIsPlaying(!isPlaying);
            }}
            className="bg-white rounded-full p-3"
          >
            {isPlaying ? (
              <Pause className="text-black" />
            ) : (
              <Play className="text-black ml-1" />
            )}
          </button>

          <button onClick={() => skipSeconds(10)}>
            <FastForward />
          </button>

          <button onClick={next}>
            <SkipForward />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 w-1/4 justify-end">
          <Volume2 />
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={([v]) => {
              setVolume(v);
              if (audioRef.current) audioRef.current.volume = v;
            }}
            className="w-32"
          />
        </div>
      </div>

      {/* PROGRESS */}
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
        <span className="w-10 text-right">
          {formatTime(currentTime)}
        </span>

        <Slider
          value={[currentTime]}
          max={duration || 1}
          step={0.1}
          onValueChange={([v]) => {
            if (audioRef.current) {
              audioRef.current.currentTime = v;
              setCurrentTime(v);
            }
          }}
          className="flex-1"
        />

        <span className="w-10">{formatTime(duration)}</span>
      </div>
    </div>
  );
}

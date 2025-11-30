"use client";

import React, { useState, useRef, useEffect } from "react";
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
  UploadIcon,
  Music2Icon,
  Laptop2Icon,
  ListMusicIcon,
  HeartIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {}

interface Track {
  title: string;
  artist: string;
  src: string;
  cover?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(100);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newTracks: Track[] = Array.from(files).map((file) => ({
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        artist: "Unknown Artist",
        src: URL.createObjectURL(file),
      }));
      setTracks((prev) => [...prev, ...newTracks]);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    if (tracks.length === 0) return;

    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % tracks.length;
    }
    setCurrentTrackIndex(nextIndex);
  };

  const handlePrevTrack = () => {
    if (tracks.length === 0) return;

    // If more than 3 seconds in, restart song like Spotify
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    setCurrentTrackIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
  };

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      audioRef.current.muted = newMuted;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isSeeking) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      handleNextTrack();
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (audioRef.current && tracks.length > 0) {
      audioRef.current.src = tracks[currentTrackIndex]?.src || "";
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrackIndex, tracks]);

  // Update volume ref when volume state changes (initial load)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  return (
    <div className="flex flex-col h-screen dark:bg-neutral-950 b overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 bg-linear-to-b from-neutral-900 to-black">
        <div className="text-center space-y-6">
          <div className="relative w-64 h-64 mx-auto shadow-2xl shadow-black/50 group">
            {currentTrack ? (
              <div className="w-full h-full bg-neutral-800 flex items-center justify-center rounded-md">
                <Music2Icon className="w-24 h-24 text-neutral-500" />
              </div>
            ) : (
              <div className="w-full h-full bg-neutral-800 flex items-center justify-center rounded-md border-2 border-dashed border-neutral-700">
                <span className="text-neutral-500">No Track Selected</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              {currentTrack?.title || "Welcome to Sangeet"}
            </h1>
            <p className="text-neutral-400 text-lg">
              {currentTrack?.artist || "Upload music to get started"}
            </p>
          </div>

          <label className="inline-flex items-center justify-center gap-2 px-8 py-3 font-semibold text-black transition-transform bg-green-500 rounded-full cursor-pointer hover:scale-105 active:scale-95 hover:bg-green-400">
            <UploadIcon className="w-5 h-5" />
            <span>Upload Tracks</span>
            <input
              type="file"
              accept="audio/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>
      </main>

      {/* Footer Player */}
      <footer className="h-24 bg-black border-t border-neutral-800 px-4 grid grid-cols-3 items-center z-50">
        {/* Left: Track Info */}
        <div className="flex items-center justify-start gap-4 min-w-0">
          {currentTrack && (
            <>
              <div className="relative w-14 h-14 rounded overflow-hidden bg-neutral-800 shrink-0 group">
                <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                  <Music2Icon className="w-6 h-6 text-neutral-400" />
                </div>
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
              onClick={() => setIsShuffle(!isShuffle)}
              disabled={tracks.length === 0}
            >
              <ShuffleIcon className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-400 hover:text-white"
              onClick={handlePrevTrack}
              disabled={tracks.length === 0}
            >
              <SkipBackIcon className="w-5 h-5 fill-current" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 bg-white rounded-full text-black hover:scale-105 transition-transform hover:bg-white"
              onClick={handlePlayPause}
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
              onClick={handleNextTrack}
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
              onClick={() => setIsRepeat(!isRepeat)}
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
              onValueChange={handleSliderChange}
              onPointerDown={() => setIsSeeking(true)}
              onPointerUp={() => setIsSeeking(false)}
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
              onValueChange={handleVolumeChange}
              className="w-full cursor-pointer"
            />
          </div>
        </div>
      </footer>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </div>
  );
};

export default AudioPlayer;

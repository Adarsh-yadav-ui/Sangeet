"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useEdgeStore } from "@/lib/edgestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Music, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function MusicTrackForm() {
  const { user } = useUser();
  const createMusicTrack = useMutation(api.musicTracks.create);
  const { edgestore } = useEdgeStore();

  const convexUser = useQuery(api.users.current);
  const artist = useQuery(
    api.artists.getByUserId,
    convexUser ? { userId: convexUser._id } : "skip"
  );

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [mp3File, setMp3File] = useState<File | null>(null);
  const [coverArtFile, setCoverArtFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!artist) {
      toast.error(
        "Artist profile not found. Please create an artist profile first."
      );
      return;
    }

    if (!title) {
      toast.error("Please enter a title.");
      return;
    }

    if (!mp3File) {
      toast.error("Please select an MP3 file.");
      return;
    }

    setIsSubmitting(true);
    const uploadToast = toast.loading("Uploading your track...");

    try {
      // Upload MP3 to EdgeStore
      toast.loading("Uploading MP3 file...", { id: uploadToast });
      const mp3Result = await edgestore.publicFiles.upload({
        file: mp3File,
        onProgressChange: (progress) => {
          setUploadProgress(progress);
        },
      });

      // Upload Cover Art to EdgeStore (if provided)
      let coverArtUrl = undefined;
      if (coverArtFile) {
        toast.loading("Uploading cover art...", { id: uploadToast });
        const coverArtResult = await edgestore.publicFiles.upload({
          file: coverArtFile,
          onProgressChange: (progress) => {
            console.log("Cover art upload progress:", progress);
          },
        });
        coverArtUrl = coverArtResult.url;
      }

      // Create Music Track in Convex with EdgeStore URLs
      toast.loading("Saving track details...", { id: uploadToast });
      await createMusicTrack({
        title,
        artist: artist._id,
        genre,
        mp3Url: mp3Result.url,
        coverArtUrl: coverArtUrl || "https://files.edgestore.dev/e7h6nqgb3zux5qhz/publicFiles/_public/843d206d-1b34-41ea-aec3-ebb9434dd954.jpg",
        uploadedBy: artist._id,
        status: "ready",
      });

      // Reset form
      setTitle("");
      setGenre("");
      setMp3File(null);
      setCoverArtFile(null);
      setUploadProgress(0);

      toast.success("Track uploaded successfully!", { id: uploadToast });

      setTimeout(() => {
        setOpen(false);
      }, 1000);
    } catch (err: any) {
      console.error("Upload failed:", err);
      toast.error(err.message || "Failed to upload track.", {
        id: uploadToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              Please log in to create music tracks.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (artist === undefined) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              Loading artist profile...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (artist === null) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              You must be an artist to create music tracks.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 max-w-35 hover:scale-105 transition-transform">
          <Upload className="w-4 h-4" />
          Upload Track
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="w-5 h-5" />
            Upload Music Track
          </DialogTitle>
          <DialogDescription>
            Upload your music track with cover art and details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter track title"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g., Pop, Rock, Hip-Hop"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mp3">MP3 File *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="mp3"
                type="file"
                accept="audio/mpeg"
                onChange={(e) => setMp3File(e.target.files?.[0] || null)}
                className="cursor-pointer"
                required
                disabled={isSubmitting}
              />
              {mp3File && <Music className="w-5 h-5 text-green-600 shrink-0" />}
            </div>
            {mp3File && (
              <p className="text-sm text-muted-foreground">
                {mp3File.name} ({(mp3File.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">Cover Art (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="cover"
                type="file"
                accept="image/*"
                onChange={(e) => setCoverArtFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
                disabled={isSubmitting}
              />
              {coverArtFile && (
                <ImageIcon className="w-5 h-5 text-green-600 shrink-0" />
              )}
            </div>
            {coverArtFile && (
              <p className="text-sm text-muted-foreground">
                {coverArtFile.name}
              </p>
            )}
          </div>

          {isSubmitting && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !mp3File}
              className="flex-1 gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

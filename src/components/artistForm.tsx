import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RotatingText from "./RotatingText";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Loader2, Music, Sparkles } from "lucide-react";

export function ArtistForm() {
  const [userName, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = useQuery(api.users.current);
  const isArtist = useQuery(
    api.artists.getByUserId,
    currentUser ? { userId: currentUser._id } : "skip"
  );
  const createArtist = useMutation(api.artists.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    setIsSubmitting(true);
    try {
      await createArtist({ name: userName, bio: bio });
      setOpen(false);
      setUserName("");
      setBio("");
    } catch (error) {
      console.error("Failed to create artist profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state for initial query
  if (currentUser === undefined || isArtist === undefined) {
    return (
      <Button variant="ghost" className="p-2" disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    );
  }

  // Don't render if user is already an artist
  if (isArtist !== null) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="p-2 hover:bg-none dark:hover:bg-none transition-colors"
        >
          <span className="flex items-center gap-1">
            Become a
            <RotatingText
              texts={["Artist", "Composer", "Singer", "Music Guy!"]}
              mainClassName="px-2 sm:px-2 md:px-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white overflow-hidden h-8 sm:py-1 md:py-2 justify-center rounded-lg size-fit shadow-md"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] gap-6">
        <DialogHeader className="space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-2xl text-center">
            Create Your Artist Profile
          </DialogTitle>
          <DialogDescription className="text-center">
            Join our community of talented musicians and share your music with
            the world.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1" className="text-base font-medium">
                Artist Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name-1"
                name="name"
                placeholder="e.g., Pedro Duarte"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={isSubmitting}
                className="h-11"
                required
              />
              <p className="text-xs text-muted-foreground">
                This is how you'll appear to other users
              </p>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="bio-1" className="text-base font-medium">
                Bio
              </Label>
              <Input
                id="bio-1"
                name="bio"
                placeholder="e.g., A passionate musician creating soulful melodies"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={isSubmitting}
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Tell us a bit about yourself and your music
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting} type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting || !userName.trim()}
              className="bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Profile
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

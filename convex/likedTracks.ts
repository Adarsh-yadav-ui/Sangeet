import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const getLikedTracks = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return await ctx.db
      .query("likedTracks")
      .withIndex("byUser", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const toggleLike = mutation({
  args: { trackId: v.id("musicTracks") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    
    const existingLike = await ctx.db
      .query("likedTracks")
      .withIndex("byUserTrack", (q) => 
        q.eq("userId", user._id).eq("trackId", args.trackId)
      )
      .unique();

    const track = await ctx.db.get(args.trackId);
    if (!track) {
        throw new Error("Track not found");
    }

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.trackId, { likes: Math.max(0, track.likes - 1) });
      return false; // Unliked
    } else {
      await ctx.db.insert("likedTracks", {
        userId: user._id,
        trackId: args.trackId,
        likedAt: Date.now(),
      });
      await ctx.db.patch(args.trackId, { likes: track.likes + 1 });
      return true; // Liked
    }
  },
});

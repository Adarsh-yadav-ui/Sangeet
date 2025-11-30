import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const getHistory = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);
    return await ctx.db
      .query("playHistory")
      .withIndex("byUser", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(20); // Limit to last 20 plays
  },
});

export const recordPlay = mutation({
  args: { 
    trackId: v.id("musicTracks"),
    duration: v.number() 
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    
    await ctx.db.insert("playHistory", {
      userId: user._id,
      trackId: args.trackId,
      playedAt: Date.now(),
      duration: args.duration,
    });
  },
});

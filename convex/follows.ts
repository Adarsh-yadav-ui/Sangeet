import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const getFollowers = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("follows")
      .withIndex("byFollowing", (q) => q.eq("followingId", args.userId))
      .collect();
  },
});

export const getFollowing = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("follows")
      .withIndex("byFollower", (q) => q.eq("followerId", args.userId))
      .collect();
  },
});

export const getFollowStatus = query({
  args: { followingId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const follow = await ctx.db
      .query("follows")
      .withIndex("byFollowerFollowing", (q) => 
        q.eq("followerId", user._id).eq("followingId", args.followingId)
      )
      .unique();
    return !!follow;
  },
});

export const follow = mutation({
  args: { followingId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    
    if (user._id === args.followingId) {
      throw new Error("Cannot follow yourself");
    }

    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("byFollowerFollowing", (q) => 
        q.eq("followerId", user._id).eq("followingId", args.followingId)
      )
      .unique();

    if (existingFollow) {
      return; // Already following
    }

    await ctx.db.insert("follows", {
      followerId: user._id,
      followingId: args.followingId,
      followedAt: Date.now(),
    });
  },
});

export const unfollow = mutation({
  args: { followingId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    
    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("byFollowerFollowing", (q) => 
        q.eq("followerId", user._id).eq("followingId", args.followingId)
      )
      .unique();

    if (existingFollow) {
      await ctx.db.delete(existingFollow._id);
    }
  },
});

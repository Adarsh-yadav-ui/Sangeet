import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("artists").collect();
  },
});

export const getById = query({
  args: { id: v.id("artists") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("artists")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .unique();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    bio: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    
    // Check if user is already an artist
    const existingArtist = await ctx.db
      .query("artists")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .unique();

    if (existingArtist) {
      throw new Error("User is already an artist");
    }

    return await ctx.db.insert("artists", {
      ...args,
      userId: user._id,
      songs: [],
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("artists"),
    name: v.optional(v.string()),
    bio: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const artist = await ctx.db.get(args.id);

    if (!artist) {
      throw new Error("Artist not found");
    }

    if (artist.userId !== user._id) {
      throw new Error("You are not authorized to update this artist profile");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

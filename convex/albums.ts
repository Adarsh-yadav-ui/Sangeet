import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("albums").collect();
  },
});

export const getById = query({
  args: { id: v.id("albums") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByArtist = query({
  args: { artistId: v.id("artists") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("albums")
      .withIndex("byArtist", (q) => q.eq("artist", args.artistId))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    artist: v.id("artists"),
    releaseDate: v.optional(v.number()),
    coverArtUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const artist = await ctx.db
      .query("artists")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .unique();

    if (!artist) {
      throw new Error("User is not an artist");
    }

    if (args.artist !== artist._id) {
      throw new Error("Artist ID mismatch");
    }

    return await ctx.db.insert("albums", {
      ...args,
      uploadedBy: artist._id,
      musicTracks: [],
    });
  },
});

export const deleteAlbum = mutation({
  args: { id: v.id("albums") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const artist = await ctx.db
      .query("artists")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .unique();

    if (!artist) {
      throw new Error("User is not an artist");
    }

    const album = await ctx.db.get(args.id);
    if (!album) {
      throw new Error("Album not found");
    }

    if (album.uploadedBy !== artist._id) {
      throw new Error("You are not authorized to delete this album");
    }

    await ctx.db.delete(args.id);
  },
});

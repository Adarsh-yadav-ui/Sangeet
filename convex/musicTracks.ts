import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const getById = query({
  args: { id: v.id("musicTracks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("musicTracks").collect();
  },
});

export const getByArtist = query({
  args: { artist: v.id("artists") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("musicTracks")
      .filter((q) => q.eq(q.field("artist"), args.artist))
      .collect();
  },
});

export const getByAlbum = query({
  args: { album: v.id("albums") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("musicTracks")
      .filter((q) => q.eq(q.field("albumId"), args.album))
      .collect();
  },
});

export const getByGenre = query({
  args: { genre: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("musicTracks")
      .filter((q) => q.eq(q.field("genre"), args.genre))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    artist: v.id("artists"),
    albumId: v.optional(v.id("albums")),
    genre: v.optional(v.string()),
    mp3Url: v.string(),
    coverArtUrl: v.optional(v.string()),
    uploadedBy: v.id("artists"),
    status: v.optional(
      v.union(v.literal("processing"), v.literal("ready"), v.literal("failed"))
    ),
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

    if (args.uploadedBy !== artist._id) {
        throw new Error("UploadedBy ID mismatch");
    }

    if (args.artist) {
      const artistRecord = await ctx.db.get(args.artist);
      if (!artistRecord) {
        throw new Error("Artist not found");
      }
    }
    return await ctx.db.insert("musicTracks", {
      ...args,
      likes: 0,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("musicTracks"),
    title: v.optional(v.string()),
    artist: v.optional(v.id("artists")),
    albumId: v.optional(v.id("albums")),
    genre: v.optional(v.string()),
    releaseDate: v.optional(v.number()),
    mp3Url: v.optional(v.string()),
    coverArtUrl: v.optional(v.string()),
    status: v.optional(
      v.union(v.literal("processing"), v.literal("ready"), v.literal("failed"))
    ),
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

    const track = await ctx.db.get(args.id);
    if (!track) {
      throw new Error("Track not found");
    }

    if (track.uploadedBy !== artist._id) {
      throw new Error("You are not authorized to update this track");
    }

    if (args.artist) {
      const artistRecord = await ctx.db.get(args.artist);
      if (!artistRecord) {
        throw new Error("Artist not found");
      }
    }
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteTrack = mutation({
  args: { id: v.id("musicTracks") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const artist = await ctx.db
      .query("artists")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .unique();

    if (!artist) {
      throw new Error("User is not an artist");
    }

    const track = await ctx.db.get(args.id);
    if (!track) {
      throw new Error("Track not found");
    }

    if (track.uploadedBy !== artist._id) {
      throw new Error("You are not authorized to delete this track");
    }

    await ctx.db.delete(args.id);
  },
});

export const updateLikes = mutation({
  args: { id: v.id("musicTracks"), likes: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { likes: args.likes + 1 });
  },
});

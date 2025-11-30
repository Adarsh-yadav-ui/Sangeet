import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("playlists").collect();
  },
});

export const getById = query({
  args: { id: v.id("playlists") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("playlists")
      .withIndex("byCreatedBy", (q) => q.eq("createdBy", args.userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    return await ctx.db.insert("playlists", {
      ...args,
      createdBy: user._id,
      followerCount: 0,
      musicTracks: [],
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("playlists"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const playlist = await ctx.db.get(args.id);
    if (!playlist) {
      throw new Error("Playlist not found");
    }
    if (playlist.createdBy !== user._id) {
      throw new Error("You are not authorized to update this playlist");
    }
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deletePlaylist = mutation({
  args: { id: v.id("playlists") },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const playlist = await ctx.db.get(args.id);
    if (!playlist) {
      throw new Error("Playlist not found");
    }
    if (playlist.createdBy !== user._id) {
      throw new Error("You are not authorized to delete this playlist");
    }
    await ctx.db.delete(args.id);
  },
});

export const addTrack = mutation({
  args: {
    playlistId: v.id("playlists"),
    trackId: v.id("musicTracks"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const playlist = await ctx.db.get(args.playlistId);
    if (!playlist) {
      throw new Error("Playlist not found");
    }
    if (playlist.createdBy !== user._id) {
      throw new Error("You are not authorized to modify this playlist");
    }
    
    if (playlist.musicTracks.includes(args.trackId)) {
      return; // Track already in playlist
    }

    await ctx.db.patch(args.playlistId, {
      musicTracks: [...playlist.musicTracks, args.trackId],
    });
  },
});

export const removeTrack = mutation({
  args: {
    playlistId: v.id("playlists"),
    trackId: v.id("musicTracks"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const playlist = await ctx.db.get(args.playlistId);
    if (!playlist) {
      throw new Error("Playlist not found");
    }
    if (playlist.createdBy !== user._id) {
      throw new Error("You are not authorized to modify this playlist");
    }

    await ctx.db.patch(args.playlistId, {
      musicTracks: playlist.musicTracks.filter((id) => id !== args.trackId),
    });
  },
});

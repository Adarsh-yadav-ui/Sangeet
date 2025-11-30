// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.optional(v.string()),
    clerkUserId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    username: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("byClerkUserId", ["clerkUserId"])
    .index("byEmail", ["email"]),

  musicTracks: defineTable({
    title: v.string(),
    artist: v.string(),
    albumId: v.optional(v.id("albums")),
    genre: v.optional(v.string()),
    mp3Url: v.string(),
    coverArtUrl: v.optional(v.string()),
    uploadedBy: v.id("artists"),
    likes: v.number(),
    status: v.optional(
      v.union(v.literal("processing"), v.literal("ready"), v.literal("failed"))
    ),
  }).index("byArtist", ["artist"]),

  playlists: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    createdBy: v.id("users"),
    followerCount: v.number(),
    musicTracks: v.array(v.id("musicTracks")),
  }).index("byCreatedBy", ["createdBy"]),

  albums: defineTable({
    title: v.string(),
    artist: v.id("artists"),
    releaseDate: v.optional(v.number()),
    coverArtUrl: v.optional(v.string()),
    musicTracks: v.array(v.id("musicTracks")),
    uploadedBy: v.id("artists"),
  })
    .index("byTitle", ["title"])
    .index("byArtist", ["artist"]),

  artists: defineTable({
    name: v.string(),
    bio: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
    userId: v.id("users"),
    songs: v.optional(v.array(v.id("musicTracks"))),
  }),

  likedTracks: defineTable({
    userId: v.id("users"),
    trackId: v.id("musicTracks"),
    likedAt: v.number(),
  })
    .index("byUser", ["userId"])
    .index("byTrack", ["trackId"])
    .index("byUserTrack", ["userId", "trackId"]),

  playHistory: defineTable({
    userId: v.id("users"),
    trackId: v.id("musicTracks"),
    playedAt: v.number(),
    duration: v.number(), // how long they listened in seconds
  })
    .index("byUser", ["userId"])
    .index("byTrack", ["trackId"])
    .index("byUserTime", ["userId", "playedAt"]),

  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
    followedAt: v.number(),
  })
    .index("byFollower", ["followerId"])
    .index("byFollowing", ["followingId"])
    .index("byFollowerFollowing", ["followerId", "followingId"]),
});

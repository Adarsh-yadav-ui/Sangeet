/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as albums from "../albums.js";
import type * as artists from "../artists.js";
import type * as follows from "../follows.js";
import type * as http from "../http.js";
import type * as likedTracks from "../likedTracks.js";
import type * as musicTracks from "../musicTracks.js";
import type * as playHistory from "../playHistory.js";
import type * as playlists from "../playlists.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  albums: typeof albums;
  artists: typeof artists;
  follows: typeof follows;
  http: typeof http;
  likedTracks: typeof likedTracks;
  musicTracks: typeof musicTracks;
  playHistory: typeof playHistory;
  playlists: typeof playlists;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

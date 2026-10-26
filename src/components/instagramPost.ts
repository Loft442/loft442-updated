import type { InstagramPost } from "@/lib/instagram";

export type Position = { post: number; slide: number };

export function postLabel(post: InstagramPost) {
  return post.isReel ? "Reel" : post.mediaType === "CAROUSEL_ALBUM" ? "Album" : "Post";
}

import { unstable_cache } from "next/cache";
import { sanityWriteClient } from "@/lib/sanityWriteClient";

const GRAPH_URL = "https://graph.instagram.com";
const API_VERSION = "v23.0";
const REQUEST_TIMEOUT_MS = 5000;
const MEDIA_LIMIT = 9;

export const INSTAGRAM_CACHE_TAG = "instagram";
export const INSTAGRAM_REVALIDATE_SECONDS = 3600;
export const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/loft.442/";

// IDs containing a dot are private in Sanity, even on public datasets.
const TOKEN_DOC_ID = "secrets.instagramToken";
const TOKEN_DOC_TYPE = "instagramToken";

export type InstagramMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

export type InstagramPost = {
  id: string;
  caption: string;
  mediaType: InstagramMediaType;
  isReel: boolean;
  imageUrl: string;
  permalink: string;
  timestamp: string;
};

export type InstagramProfile = {
  username: string;
  name: string;
  biography: string;
  profilePictureUrl: string | null;
  followersCount: number | null;
  mediaCount: number | null;
  profileUrl: string;
};

export type InstagramFeed = {
  profile: InstagramProfile;
  posts: InstagramPost[];
};

type StoredToken = {
  token?: string;
  refreshedAt?: string;
  expiresAt?: string;
};

type GraphProfile = {
  username?: string;
  name?: string;
  biography?: string;
  profile_picture_url?: string;
  followers_count?: number;
  media_count?: number;
};

type GraphMedia = {
  id?: string;
  caption?: string;
  media_type?: string;
  media_product_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
};

async function readStoredToken(): Promise<StoredToken | null> {
  if (!sanityWriteClient) return null;
  return sanityWriteClient.fetch<StoredToken | null>(
    `*[_id == $id][0]{ token, refreshedAt, expiresAt }`,
    { id: TOKEN_DOC_ID },
  );
}

const getCachedAccessToken = unstable_cache(
  async (): Promise<string | null> => {
    try {
      const stored = await readStoredToken();
      if (stored?.token) return stored.token;
    } catch (error) {
      console.error("[instagram] Failed to read stored token", error);
    }
    return process.env.INSTAGRAM_ACCESS_TOKEN || null;
  },
  ["instagram-access-token"],
  { revalidate: INSTAGRAM_REVALIDATE_SECONDS, tags: [INSTAGRAM_CACHE_TAG] },
);

async function graphGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${GRAPH_URL}/${API_VERSION}/${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    next: { revalidate: INSTAGRAM_REVALIDATE_SECONDS, tags: [INSTAGRAM_CACHE_TAG] },
  });

  if (!response.ok) {
    throw new Error(`Instagram API ${path} responded with ${response.status}`);
  }

  return (await response.json()) as T;
}

function normalizePost(item: GraphMedia): InstagramPost | null {
  const mediaType = item.media_type as InstagramMediaType | undefined;
  if (!item.id || !item.permalink || !mediaType) return null;

  const imageUrl = mediaType === "VIDEO" ? item.thumbnail_url : item.media_url;
  if (!imageUrl) return null;

  return {
    id: item.id,
    caption: item.caption ?? "",
    mediaType,
    isReel: item.media_product_type === "REELS" || mediaType === "VIDEO",
    imageUrl,
    permalink: item.permalink,
    timestamp: item.timestamp ?? "",
  };
}

export async function getInstagramFeed(): Promise<InstagramFeed | null> {
  try {
    const accessToken = await getCachedAccessToken();
    if (!accessToken) return null;

    const [profile, media] = await Promise.all([
      graphGet<GraphProfile>("me", {
        fields:
          "username,name,biography,profile_picture_url,followers_count,media_count",
        access_token: accessToken,
      }),
      graphGet<{ data?: GraphMedia[] }>("me/media", {
        fields:
          "id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp",
        limit: String(MEDIA_LIMIT),
        access_token: accessToken,
      }),
    ]);

    if (!profile.username) return null;

    const posts = (media.data ?? [])
      .map(normalizePost)
      .filter((post): post is InstagramPost => post !== null)
      .slice(0, MEDIA_LIMIT);

    return {
      profile: {
        username: profile.username,
        name: profile.name ?? "",
        biography: profile.biography ?? "",
        profilePictureUrl: profile.profile_picture_url ?? null,
        followersCount:
          typeof profile.followers_count === "number" ? profile.followers_count : null,
        mediaCount: typeof profile.media_count === "number" ? profile.media_count : null,
        profileUrl: `https://www.instagram.com/${profile.username}/`,
      },
      posts,
    };
  } catch (error) {
    console.error("[instagram] Failed to load feed", error);
    return null;
  }
}

export type RefreshResult =
  | { status: "refreshed"; expiresAt: string }
  | { status: "skipped"; reason: string }
  | { status: "error"; reason: string };

const MIN_REFRESH_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export async function refreshAccessToken(): Promise<RefreshResult> {
  if (!sanityWriteClient) {
    return { status: "error", reason: "SANITY_API_WRITE_TOKEN or Sanity project is not configured" };
  }

  let stored: StoredToken | null = null;
  try {
    stored = await readStoredToken();
  } catch {
    return { status: "error", reason: "Could not read stored token" };
  }

  const currentToken = stored?.token || process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!currentToken) {
    return { status: "error", reason: "No Instagram access token configured" };
  }

  if (stored?.refreshedAt) {
    const age = Date.now() - new Date(stored.refreshedAt).getTime();
    if (age < MIN_REFRESH_AGE_MS) {
      return { status: "skipped", reason: "Token was refreshed recently" };
    }
  }

  try {
    const url = new URL(`${GRAPH_URL}/refresh_access_token`);
    url.searchParams.set("grant_type", "ig_refresh_token");
    url.searchParams.set("access_token", currentToken);

    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) {
      return { status: "error", reason: `Refresh responded with ${response.status}` };
    }

    const body = (await response.json()) as { access_token?: string; expires_in?: number };
    if (!body.access_token) {
      return { status: "error", reason: "Refresh response missing access_token" };
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + (body.expires_in ?? 0) * 1000).toISOString();

    await sanityWriteClient.createOrReplace({
      _id: TOKEN_DOC_ID,
      _type: TOKEN_DOC_TYPE,
      token: body.access_token,
      refreshedAt: now.toISOString(),
      expiresAt,
    });

    return { status: "refreshed", expiresAt };
  } catch (error) {
    console.error("[instagram] Token refresh failed", error);
    return { status: "error", reason: "Token refresh request failed" };
  }
}

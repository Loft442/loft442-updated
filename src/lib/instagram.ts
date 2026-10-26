import { sanityWriteClient } from "@/lib/sanityWriteClient";

const GRAPH_URL = "https://graph.instagram.com";
const API_VERSION = "v23.0";
const REQUEST_TIMEOUT_MS = 8000;
export const MEDIA_LIMIT = 12;
// Pull a full page so older pinned posts can still be found.
const FETCH_LIMIT = 50;

// The API does not expose pins. Keep this in sync with the profile's pinned posts, in order.
const PINNED_SHORTCODES = ["DTt_yUADFDI", "DPwpQ5SErHm", "DVKioLVjJj5"];

// Posts left off the site, e.g. reels whose API thumbnail is a blank first frame.
const HIDDEN_SHORTCODES = ["DaykY-UBG-t"];

export const INSTAGRAM_CACHE_TAG = "instagram";
export const INSTAGRAM_REVALIDATE_SECONDS = 3600;
export const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/loft.442/";

// IDs containing a dot are private in Sanity, even on public datasets.
const TOKEN_DOC_ID = "secrets.instagramToken";
const TOKEN_DOC_TYPE = "instagramToken";

export type InstagramMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

export type InstagramMedia = {
  type: "IMAGE" | "VIDEO";
  url: string;
  posterUrl: string | null;
  /** Instagram withheld the file (usually copyrighted audio). Play it on Instagram instead. */
  requiresInstagram?: boolean;
};

export type InstagramPost = {
  id: string;
  caption: string;
  mediaType: InstagramMediaType;
  isReel: boolean;
  imageUrl: string;
  media: InstagramMedia[];
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

type GraphChild = {
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
};

type GraphMedia = GraphChild & {
  id?: string;
  caption?: string;
  media_product_type?: string;
  is_shared_to_feed?: boolean;
  permalink?: string;
  timestamp?: string;
  children?: { data?: GraphChild[] };
};

async function readStoredToken(): Promise<StoredToken | null> {
  if (!sanityWriteClient) return null;
  return sanityWriteClient.fetch<StoredToken | null>(
    `*[_id == $id][0]{ token, refreshedAt, expiresAt }`,
    { id: TOKEN_DOC_ID },
  );
}

async function getAccessToken(): Promise<string | null> {
  const envToken = process.env.INSTAGRAM_ACCESS_TOKEN || null;

  // Local .env must win so a leftover Sanity/test token cannot keep serving the wrong account.
  if (process.env.NODE_ENV !== "production" && envToken) {
    return envToken;
  }

  try {
    const stored = await readStoredToken();
    if (stored?.token) return stored.token;
  } catch (error) {
    console.error("[instagram] Failed to read stored token", error);
  }

  return envToken;
}

async function graphGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${GRAPH_URL}/${API_VERSION}/${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    ...(process.env.NODE_ENV === "production"
      ? { next: { revalidate: INSTAGRAM_REVALIDATE_SECONDS, tags: [INSTAGRAM_CACHE_TAG] } }
      : { cache: "no-store" }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { error?: { message?: string; code?: number } }
      | null;
    const detail = body?.error ? `: ${body.error.message} (code ${body.error.code})` : "";
    throw new Error(`Instagram API ${path} responded with ${response.status}${detail}`);
  }

  return (await response.json()) as T;
}

function toMedia(item: GraphChild): InstagramMedia | null {
  if (item.media_type === "VIDEO") {
    if (item.media_url) {
      return { type: "VIDEO", url: item.media_url, posterUrl: item.thumbnail_url ?? null };
    }
    // Copyrighted audio: Instagram omits media_url and only returns a still.
    return item.thumbnail_url
      ? { type: "IMAGE", url: item.thumbnail_url, posterUrl: null, requiresInstagram: true }
      : null;
  }
  return item.media_url
    ? { type: "IMAGE", url: item.media_url, posterUrl: null }
    : item.thumbnail_url
      ? { type: "IMAGE", url: item.thumbnail_url, posterUrl: null }
      : null;
}

function stillUrl(item: GraphChild): string | null {
  // media_url on a video is an mp4. An <img> pointed at it renders blank.
  if (item.media_type === "VIDEO") return item.thumbnail_url ?? null;
  return item.media_url || item.thumbnail_url || null;
}

function coverUrl(item: GraphMedia): string | null {
  const own = stillUrl(item);
  if (own) return own;
  const child = item.children?.data?.find((entry) => stillUrl(entry));
  return child ? stillUrl(child) : null;
}

function shortcode(permalink: string | undefined): string | null {
  return permalink?.match(/\/(?:p|reel|tv)\/([^/?#]+)/)?.[1] ?? null;
}

function normalizePost(item: GraphMedia): InstagramPost | null {
  const mediaType = item.media_type as InstagramMediaType | undefined;
  if (!item.id || !item.permalink || !mediaType) return null;

  // Keep the slot even when Instagram omits the file, so a missing post or reel
  // is not replaced by the next item and the posted order stays intact.
  const imageUrl = coverUrl(item) ?? "";

  const sources = mediaType === "CAROUSEL_ALBUM" ? item.children?.data ?? [] : [item];
  const media = sources
    .map(toMedia)
    .filter((entry): entry is InstagramMedia => entry !== null);

  return {
    id: item.id,
    caption: item.caption ?? "",
    mediaType,
    isReel: item.media_product_type === "REELS" || mediaType === "VIDEO",
    imageUrl,
    media:
      media.length > 0
        ? media
        : [
            {
              type: "IMAGE",
              url: imageUrl,
              posterUrl: null,
              requiresInstagram: mediaType === "VIDEO" || !imageUrl,
            },
          ],
    permalink: item.permalink,
    timestamp: item.timestamp ?? "",
  };
}

export async function getInstagramFeed(): Promise<InstagramFeed | null> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) return null;

    const [profile, media] = await Promise.all([
      graphGet<GraphProfile>("me", {
        fields:
          "username,name,biography,profile_picture_url,followers_count,media_count",
        access_token: accessToken,
      }),
      graphGet<{ data?: GraphMedia[] }>("me/media", {
        fields:
          "id,caption,media_type,media_product_type,is_shared_to_feed,media_url,thumbnail_url,permalink,timestamp",
        limit: String(FETCH_LIMIT),
        access_token: accessToken,
      }),
    ]);

    if (!profile.username) return null;

    // Reels hidden from the profile grid only live in the Reels tab, so skip them here too.
    const onGrid = [...(media.data ?? [])]
      .filter(
        (item) =>
          item.is_shared_to_feed !== false &&
          !HIDDEN_SHORTCODES.includes(shortcode(item.permalink) ?? ""),
      )
      .sort(
        (a, b) => Date.parse(b.timestamp ?? "") - Date.parse(a.timestamp ?? ""),
      );

    // Mirror the profile: pinned posts first, then everything else newest first.
    const pinned = PINNED_SHORTCODES.map((code) =>
      onGrid.find((item) => shortcode(item.permalink) === code),
    ).filter((item): item is GraphMedia => item !== undefined);
    const rest = onGrid.filter((item) => !pinned.includes(item));
    const newest = [...pinned, ...rest].slice(0, MEDIA_LIMIT);

    const withCovers = await Promise.all(
      newest.map(async (item) => {
        if (!item.id) return item;
        let next = item;

        if (item.media_type === "VIDEO" && !item.thumbnail_url) {
          try {
            const detail = await graphGet<{ thumbnail_url?: string }>(item.id, {
              fields: "thumbnail_url",
              access_token: accessToken,
            });
            if (detail.thumbnail_url) next = { ...next, thumbnail_url: detail.thumbnail_url };
          } catch (error) {
            console.error("[instagram] Failed to load video thumbnail", error);
          }
        }

        if (next.media_type !== "CAROUSEL_ALBUM") return next;

        try {
          const children = await graphGet<{ data?: GraphChild[] }>(`${item.id}/children`, {
            fields: "media_type,media_url,thumbnail_url",
            access_token: accessToken,
          });
          return { ...next, children };
        } catch (error) {
          console.error("[instagram] Failed to load album slides", error);
          return next;
        }
      }),
    );

    const posts = withCovers
      .map(normalizePost)
      .filter((post): post is InstagramPost => post !== null);

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

import "server-only";

import { createClient } from "@sanity/client";
import type { GalleryItem, GalleryItemCategory } from "@/lib/galleryItems";
import { apiVersion, dataset, projectId } from "../../sanity/env";

export const GALLERY_CACHE_TAG = "gallery";
const GALLERY_REVALIDATE_SECONDS = 3600;

/** Document written by the Studio's "Import existing photos" once every built-in photo is in Sanity. */
export const GALLERY_IMPORT_DOC_ID = "galleryImport";

const CATEGORIES: readonly GalleryItemCategory[] = [
  "Weddings",
  "Private Events",
  "Birthdays",
  "Kids Parties",
  "Baby Shower",
];

type UploadRow = {
  _id: string;
  alt?: string;
  category?: string;
  url?: string;
  mimeType?: string;
  poster?: string;
  legacyId?: number;
};

const QUERY = `{
  "items": *[_type == "galleryItem" && defined(media.asset)] | order(_createdAt desc){
    _id,
    alt,
    category,
    legacyId,
    "url": media.asset->url,
    "mimeType": media.asset->mimeType,
    "poster": poster.asset->url
  },
  "importDone": defined(*[_id == $importId][0].completedAt)
}`;

export type SanityGallery = {
  /** Published gallery items, newest first. */
  items: (GalleryItem & { legacyId?: number })[];
  /** True once the built-in photos have all been imported into Sanity. */
  importDone: boolean;
};

// Published gallery items from the Studio. Published documents are public, so no token
// is needed. Returns null if Sanity can't be reached, so the caller can fall back to the
// built-in photo list.
export async function getSanityGallery(): Promise<SanityGallery | null> {
  if (!/^[a-z0-9-]+$/.test(projectId)) return null;

  try {
    const client = createClient({ projectId, dataset, apiVersion, useCdn: false });
    const result = await client.fetch<{ items: UploadRow[]; importDone: boolean }>(
      QUERY,
      { importId: GALLERY_IMPORT_DOC_ID },
      { next: { revalidate: GALLERY_REVALIDATE_SECONDS, tags: [GALLERY_CACHE_TAG] } },
    );

    const items = result.items.flatMap((row): SanityGallery["items"] => {
      const category = CATEGORIES.find((entry) => entry === row.category);
      const isVideo = row.mimeType?.startsWith("video/") ?? false;
      const isImage = row.mimeType?.startsWith("image/") ?? false;
      if (!row.url || !category || (!isVideo && !isImage)) return [];

      return [
        {
          id: row._id,
          src: row.url,
          alt: row.alt ?? "",
          category,
          type: isVideo ? "video" : "image",
          poster: row.poster ?? undefined,
          legacyId: row.legacyId,
        },
      ];
    });

    return { items, importDone: Boolean(result.importDone) };
  } catch (error) {
    console.error("[gallery] Failed to load Sanity gallery", error);
    return null;
  }
}

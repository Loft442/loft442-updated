import "server-only";

import { createClient } from "@sanity/client";
import type { GalleryItem, GalleryItemCategory } from "@/lib/galleryItems";
import { apiVersion, dataset, projectId } from "../../sanity/env";

export const GALLERY_CACHE_TAG = "gallery";
const GALLERY_REVALIDATE_SECONDS = 3600;

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
};

const QUERY = `*[_type == "galleryItem" && defined(media.asset)] | order(_createdAt desc){
  _id,
  alt,
  category,
  "url": media.asset->url,
  "mimeType": media.asset->mimeType,
  "poster": poster.asset->url
}`;

// Published gallery uploads from the Studio, newest first. Published documents are
// public, so no token is needed. Any failure falls back to an empty list so the
// static gallery still renders.
export async function getGalleryUploads(): Promise<GalleryItem[]> {
  if (!/^[a-z0-9-]+$/.test(projectId)) return [];

  try {
    const client = createClient({ projectId, dataset, apiVersion, useCdn: false });
    const rows = await client.fetch<UploadRow[]>(
      QUERY,
      {},
      { next: { revalidate: GALLERY_REVALIDATE_SECONDS, tags: [GALLERY_CACHE_TAG] } },
    );

    return rows.flatMap((row): GalleryItem[] => {
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
        },
      ];
    });
  } catch (error) {
    console.error("[gallery] Failed to load uploads", error);
    return [];
  }
}

"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { GALLERY_CACHE_TAG } from "@/lib/galleryUploads";

/** Brief pause so Sanity's published docs are readable before we bust the Next cache. */
const SANITY_READ_DELAY_MS = 800;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Bust the cached /gallery page so Studio publish/delete/move shows up immediately. */
export async function revalidateGalleryAction(): Promise<{ revalidated: true }> {
  await sleep(SANITY_READ_DELAY_MS);
  revalidateTag(GALLERY_CACHE_TAG, "max");
  revalidatePath("/gallery");
  return { revalidated: true };
}

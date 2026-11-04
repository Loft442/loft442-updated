import Footer from "@/components/Footer";
import GalleryPage from "@/components/GalleryPage";
import { galleryItems } from "@/lib/galleryItems";
import { getSanityGallery } from "@/lib/galleryUploads";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "The Gallery",
  description:
    "Moments from weddings, milestone celebrations and private events hosted at LOFT 442 in Elmont, NY.",
  path: "/gallery",
  keywords: [
    "LOFT 442 gallery",
    "event venue photos",
    "wedding venue gallery",
    "private event photos Elmont NY",
  ],
});

export const revalidate = 3600;

export default async function Gallery() {
  const sanity = await getSanityGallery();

  // GalleryPage shows the list in reverse (last item first), so lists are built oldest-first.
  // - After the one-time import, Sanity is the only source: deletes and category moves made
  //   in the Studio apply to every photo, including the original ones.
  // - Before the import (or if Sanity is unreachable), show the built-in photos plus any
  //   Studio uploads, skipping already-imported copies so nothing appears twice.
  const items = sanity?.importDone
    ? [...sanity.items].reverse()
    : [...galleryItems, ...[...(sanity?.items ?? [])].filter((item) => item.legacyId == null).reverse()];

  return (
    <main className="bg-[var(--background)] pt-nav text-white">
      <GalleryPage items={items} />
      <Footer />
    </main>
  );
}

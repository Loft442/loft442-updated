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

  // Built-in Enhanced photos are the gallery source of truth. Studio uploads that are not
  // copies of the old imported set are appended afterward.
  const studioUploads = [...(sanity?.items ?? [])]
    .filter((item) => item.legacyId == null)
    .reverse();
  const items = [...galleryItems, ...studioUploads];

  return (
    <main className="bg-[var(--background)] pt-nav text-white">
      <GalleryPage items={items} />
      <Footer />
    </main>
  );
}

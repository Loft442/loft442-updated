import Footer from "@/components/Footer";
import GalleryPage from "@/components/GalleryPage";
import { galleryItems } from "@/lib/galleryItems";
import { getGalleryUploads } from "@/lib/galleryUploads";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Event Gallery",
  description:
    "Browse photos from weddings, private events, birthdays, and celebrations hosted at LOFT 442 in Elmont, NY.",
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
  const uploads = await getGalleryUploads();
  // GalleryPage shows the list in reverse, so appending the uploads oldest-first
  // puts them before the static photos, newest at the top.
  const items = [...galleryItems, ...[...uploads].reverse()];

  return (
    <main className="ambient-surface bg-black pt-[76px] text-white">
      <div className="ambient-glow" aria-hidden="true">
        <span className="ambient-glow__layer" />
      </div>
      <div className="divider-glow h-[2px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <GalleryPage items={items} />
      <Footer />
    </main>
  );
}

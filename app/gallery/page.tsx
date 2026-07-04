import Footer from "@/components/Footer";
import GalleryPage from "@/components/GalleryPage";
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

export default function Gallery() {
  return (
    <main className="ambient-surface bg-black pt-[76px] text-white">
      <div className="ambient-glow" aria-hidden="true">
        <span className="ambient-glow__layer" />
      </div>
      <div className="divider-glow h-[2px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <GalleryPage />
      <Footer />
    </main>
  );
}

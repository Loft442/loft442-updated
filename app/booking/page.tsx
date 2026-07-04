import BookingPage from "@/components/BookingPage";
import Footer from "@/components/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Book Your Event",
  description:
    "Start booking your event at LOFT 442 in Elmont, NY. Share your event details and our team will guide you through availability, planning, and next steps.",
  path: "/booking",
  keywords: [
    "book LOFT 442",
    "event booking Elmont NY",
    "reserve event venue",
    "wedding venue booking",
    "repass venue booking",
  ],
});

export default function Booking() {
  return (
    <main className="ambient-surface bg-black pt-[76px] text-white">
      <div className="ambient-glow" aria-hidden="true">
        <span className="ambient-glow__layer" />
      </div>
      <div className="divider-glow h-[2px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <BookingPage />
      <Footer />
    </main>
  );
}

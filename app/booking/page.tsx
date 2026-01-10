import BookingPage from "@/components/BookingPage";
import Footer from "@/components/Footer";
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

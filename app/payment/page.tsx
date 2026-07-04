import Footer from "@/components/Footer";
import PaymentPage from "@/components/PaymentPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Payment",
  description: "Submit payment for your LOFT 442 event booking.",
  path: "/payment",
  robots: {
    index: false,
    follow: false,
  },
});

export default function Payment() {
  return (
    <main className="ambient-surface bg-black pt-[76px] text-white">
      <div className="ambient-glow" aria-hidden="true">
        <span className="ambient-glow__layer" />
      </div>
      <div className="divider-glow h-[2px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <PaymentPage />
      <Footer />
    </main>
  );
}

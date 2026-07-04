import Footer from "@/components/Footer";
import PricingPage from "@/components/PricingPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Venue Pricing",
  description:
    "View LOFT 442 event venue pricing and package options for weddings, corporate events, repass gatherings, and private celebrations in Elmont, NY.",
  path: "/pricing",
  keywords: [
    "LOFT 442 pricing",
    "event venue pricing Elmont NY",
    "wedding venue packages",
    "repass venue pricing",
    "private event venue rates",
  ],
});

export default function Pricing() {
  return (
    <main className="ambient-surface bg-black pt-[76px] text-white">
      <div className="ambient-glow" aria-hidden="true">
        <span className="ambient-glow__layer" />
      </div>
      <div className="divider-glow h-[2px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <PricingPage />
      <Footer />
    </main>
  );
}

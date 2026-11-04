import Footer from "@/components/Footer";
import PricingPage from "@/components/PricingPage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Packages & Pricing",
  description:
    "LOFT 442 packages and pricing: The Essential for up to 50 guests and The Grand for up to 125, with curated enhancements, for weddings, milestone celebrations and private events in Elmont, NY.",
  path: "/pricing",
  keywords: [
    "LOFT 442 pricing",
    "event venue pricing Elmont NY",
    "wedding venue packages",
    "private event venue Nassau County",
    "wedding venue Long Island",
  ],
});

export default function Pricing() {
  return (
    <main className="bg-[var(--background)] pt-nav text-white">
      <PricingPage />
      <Footer />
    </main>
  );
}

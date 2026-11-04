import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import RepassPage from "@/components/RepassPage";
import { absoluteUrl, buildMetadata, serviceJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Repass & Celebration of Life Receptions in Elmont, NY",
  description:
    "Repass and celebration of life receptions at LOFT 442 in Elmont, NY: a calm, private and dignified space for families throughout Nassau County, Queens, Brooklyn and Long Island.",
  path: "/repass",
  image: "/images/Flyer/loft442-repass-flyer.webp",
  keywords: [
    "repass venue Elmont NY",
    "funeral repass venue",
    "memorial gathering space",
    "repass venue Nassau County",
    "repass venue Queens NY",
    "repass venue Long Island",
    "private repass venue",
    "LOFT 442 repass",
  ],
});

const repassServiceJsonLd = serviceJsonLd({
  name: "Repass & Celebration of Life Receptions at LOFT 442",
  description:
    "A private repass venue in Elmont, NY with a flexible layout, seating, bar and sound for families gathering to honor a loved one.",
  serviceType: "Repass venue",
  url: absoluteUrl("/repass"),
});

export default function Repass() {
  return (
    <main className="bg-[var(--background)] pt-nav text-white">
      <JsonLd data={repassServiceJsonLd} />
      <RepassPage />
      <Footer />
    </main>
  );
}

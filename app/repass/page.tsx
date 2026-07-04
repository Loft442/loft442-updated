import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import RepassPage from "@/components/RepassPage";
import { absoluteUrl, buildMetadata, serviceJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Repass Services in Elmont, NY",
  description:
    "LOFT 442 offers a warm, private, and elegant repass venue in Elmont, NY for families throughout Nassau County, Queens, Brooklyn, and Long Island. Schedule a tour or check availability today.",
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
  name: "Repass Services at LOFT 442",
  description:
    "Private repass venue in Elmont, NY with tables, chairs, bar area, sound equipment, and flexible layout options for families honoring their loved ones.",
  serviceType: "Repass venue",
  url: absoluteUrl("/repass"),
});

export default function Repass() {
  return (
    <main className="ambient-surface bg-black pt-[77px] text-white">
      <JsonLd data={repassServiceJsonLd} />
      <div className="ambient-glow" aria-hidden="true">
        <span className="ambient-glow__layer" />
      </div>
      <RepassPage />
      <Footer />
    </main>
  );
}

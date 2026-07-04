import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import CateringPage from "@/components/CateringPage";
import { absoluteUrl, buildMetadata, serviceJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Event Catering Options",
  description:
    "LOFT 442 offers exclusive discounted catering packages through The Door Restaurant in Queens, NY. Food is prepared and delivered to the venue for repass, celebrations, and private events.",
  path: "/catering",
  image: "/images/Flyer/the-door-catering-menu.webp",
  keywords: [
    "event catering Elmont NY",
    "LOFT 442 catering",
    "The Door Restaurant catering",
    "repass catering packages",
    "event catering Queens NY",
    "venue catering Long Island",
    "private event catering",
    "corporate event catering",
  ],
});

const cateringServiceJsonLd = serviceJsonLd({
  name: "Event Catering at LOFT 442",
  description:
    "Exclusive discounted catering packages through The Door Restaurant, with food prepared and delivered to LOFT 442 on the day of your event.",
  serviceType: "Event catering",
  url: absoluteUrl("/catering"),
});

export default function Catering() {
  return (
    <main className="ambient-surface bg-black pt-[77px] text-white">
      <JsonLd data={cateringServiceJsonLd} />
      <div className="ambient-glow" aria-hidden="true">
        <span className="ambient-glow__layer" />
      </div>
      <CateringPage />
      <Footer />
    </main>
  );
}

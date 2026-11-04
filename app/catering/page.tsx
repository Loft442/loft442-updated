import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import CateringPage from "@/components/CateringPage";
import { absoluteUrl, buildMetadata, serviceJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Catering by The Door",
  description:
    "LOFT 442 offers exclusive discounted catering packages through The Door Restaurant in Queens, NY. Menus are prepared and delivered to the venue for weddings, milestone celebrations and private events.",
  path: "/catering",
  image: "/images/Flyer/the-door-catering-menu.webp",
  keywords: [
    "event catering Elmont NY",
    "LOFT 442 catering",
    "The Door Restaurant catering",
    "wedding catering Long Island",
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
    <main className="bg-[var(--background)] pt-nav text-white">
      <JsonLd data={cateringServiceJsonLd} />
      <CateringPage />
      <Footer />
    </main>
  );
}

import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import PhotoBoothPage from "@/components/photo-booth/PhotoBoothPage";
import { absoluteUrl, buildMetadata, serviceJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Salsa 2 Photo Booth Rentals in Elmont, NY",
  description:
    "Rent the Salsa 2 photo booth from LOFT 442 in Elmont, New York, for weddings, corporate events, private parties, and milestone celebrations.",
  path: "/photo-booth",
  image: "/images/photo-booth/event-hero-group.webp",
  keywords: [
    "photo booth rental Elmont NY",
    "Salsa 2 photo booth",
    "wedding photo booth Long Island",
    "photo booth rental Queens",
    "corporate event photo booth Nassau County",
    "LOFT 442 photo booth",
  ],
});

const photoBoothServiceJsonLd = serviceJsonLd({
  name: "Salsa 2 Photo Booth Rentals by LOFT 442",
  description:
    "An attended Salsa 2 photo booth for weddings, corporate events and private celebrations, with digital sharing, an event gallery and custom photo layouts.",
  serviceType: "Photo booth rental",
  url: absoluteUrl("/photo-booth"),
});

export default function PhotoBooth() {
  return (
    <main className="bg-[var(--background)] pt-nav text-white">
      <JsonLd data={photoBoothServiceJsonLd} />
      <PhotoBoothPage />
      <Footer />
    </main>
  );
}

import HomePage from "@/components/HomePage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Luxury Event Venue in Elmont, NY",
  description:
    "LOFT 442 is a veteran-owned event venue designed for elegant weddings, corporate events, repass gatherings, and private celebrations in Elmont, NY.",
  path: "/",
  keywords: [
    "LOFT 442",
    "event venue Elmont NY",
    "wedding venue Nassau County",
    "veteran-owned venue",
    "private event space Long Island",
    "corporate event venue Queens",
  ],
});

export default function Home() {
  return <HomePage />;
}

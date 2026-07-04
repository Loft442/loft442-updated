import SchedulePage from "@/components/SchedulePage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Plan Your Event",
  description:
    "Select your preferred date and tell LOFT 442 about your event. Our team will follow up to confirm availability for weddings, repass gatherings, corporate events, and private celebrations.",
  path: "/schedule",
  keywords: [
    "schedule event LOFT 442",
    "request venue tour",
    "event availability request",
    "book event Elmont NY",
    "plan wedding venue",
    "plan repass venue",
  ],
});

export default function Schedule() {
  return <SchedulePage />;
}

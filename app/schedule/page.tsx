import SchedulePage from "@/components/SchedulePage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Request a Tour",
  description:
    "Request a private tour of LOFT 442. Select your preferred date and our team will follow up to confirm availability for weddings, milestone celebrations and private events.",
  path: "/schedule",
  keywords: [
    "schedule event LOFT 442",
    "request venue tour",
    "event availability request",
    "book event Elmont NY",
    "plan wedding venue",
    "private event venue Nassau County",
  ],
});

export default function Schedule() {
  return <SchedulePage />;
}

import SchedulePage from "@/components/SchedulePage";
import { getBookedDates } from "@/lib/bookedDates";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = buildMetadata({
  title: "Request a Date",
  description:
    "Select your preferred celebration date and tell us about your event for weddings, milestone celebrations and private events.",
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

export default async function Schedule() {
  return <SchedulePage bookedDates={await getBookedDates()} />;
}

import AvailabilityCalendar from "./AvailabilityCalendar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Button from "@/components/ui/Button";
import { SITE_EMAIL, SITE_PHONE, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Venue Availability",
  description:
    "Check LOFT 442 availability and request a private tour for your preferred date. Serving hosts throughout Elmont, Nassau County, Queens and Long Island.",
  path: "/availability",
  keywords: [
    "LOFT 442 availability",
    "venue tour Elmont NY",
    "check event date availability",
    "book venue tour",
  ],
});

export default function AvailabilityPage() {
  return (
    <main className="bg-[var(--background)] pt-nav text-white">
      <section className="border-t border-[var(--line)] pb-4 pt-16 sm:pt-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal mode="text" className="flex max-w-3xl flex-col gap-6">
            <p className="eyebrow">Loft 442</p>
            <h1 className="display-xl">Availability</h1>
            <span className="hairline" aria-hidden="true" />
            <p className="lede">
              A limited number of dates are available each season. Review the calendar, then request
              a private tour for the date you have in mind.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal mode="text">
            <AvailabilityCalendar />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[var(--line)] pb-24 pt-16">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal mode="text" className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-5">
              <p className="eyebrow">Begin the Conversation</p>
              <h2 className="display-lg">Request a private tour</h2>
              <p className="lede max-w-xl">
                Share your preferred date and guest count, and a member of our team will personally
                follow up.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Button href="/schedule">Plan Your Event</Button>
              <Button href={`tel:${SITE_PHONE}`} variant="ghost">
                Call
              </Button>
              <Button href={`mailto:${SITE_EMAIL}`} variant="ghost">
                Email
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}

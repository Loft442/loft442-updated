import Link from "next/link";
import AvailabilityCalendar from "./AvailabilityCalendar";
import Footer from "@/components/Footer";

const contactNumber = "555-123-4420";
const contactEmail = "events@loft442.com";

export default function AvailabilityPage() {

  return (
    <main className="relative min-h-screen bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(200,162,74,0.16),_transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_rgba(15,15,18,0.8),_rgba(0,0,0,0.95))]" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-20 sm:px-6 lg:px-8">
        <section className="reveal flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            Loft 442
          </p>
          <h1 className="font-[var(--font-playfair)] text-4xl text-white sm:text-5xl">
            Availability
          </h1>
          <p className="max-w-2xl text-sm text-white/70">
            Request a tour for any date.
          </p>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-200/50 to-transparent" />
        </section>

        <section className="reveal">
          <AvailabilityCalendar />
        </section>

        <section className="reveal">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                  Ready to book
                </p>
                <h2 className="font-[var(--font-playfair)] text-2xl text-white">
                  Request a tour or booking
                </h2>
                <p className="max-w-xl text-sm text-white/70">
                  Share your preferred dates and guest count, and our team will
                  follow up within 24 hours.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href="/contact"
                  className="cta-button cta-book rounded-full px-6 py-3 text-[0.65rem] uppercase tracking-[0.35em]"
                >
                  Request Booking
                </Link>
                <a
                  href={`tel:${contactNumber}`}
                  className="cta-button rounded-full border border-white/20 bg-black/50 px-5 py-3 text-[0.6rem] uppercase tracking-[0.35em] text-white/80 transition hover:border-white/50 hover:text-white motion-reduce:transition-none"
                >
                  Call / Text
                </a>
                <a
                  href={`mailto:${contactEmail}`}
                  className="cta-button rounded-full border border-white/15 bg-white/5 px-5 py-3 text-[0.6rem] uppercase tracking-[0.35em] text-white/70 transition hover:border-white/50 hover:text-white motion-reduce:transition-none"
                >
                  Email
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}

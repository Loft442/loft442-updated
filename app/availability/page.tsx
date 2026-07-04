import Link from "next/link";
import AvailabilityCalendar from "./AvailabilityCalendar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { buildMetadata } from "@/lib/seo";

const contactNumber = "555-123-4420";
const contactEmail = "events@loft442.com";

export const metadata = buildMetadata({
  title: "Venue Availability",
  description:
    "Check LOFT 442 availability and request a tour for your preferred date. Our team serves families and event hosts throughout Elmont, Nassau County, Queens, and Long Island.",
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
    <main className="ambient-surface bg-black pt-[76px] text-white">
      <div className="ambient-glow" aria-hidden="true">
        <span className="ambient-glow__layer" />
      </div>
      <div className="divider-glow h-[2px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <section className="section-glow section-divider relative border-t border-white/10 pb-0 pt-6 sm:pt-8">
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-white/10 backdrop-blur-xl"
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="spotlight rounded-sm px-4 py-3">
            <Reveal mode="text" className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white">
                Loft 442
              </p>
              <h1 className="text-spotlight relative inline-block text-3xl font-semibold tracking-[0.32em] text-white sm:text-4xl md:text-5xl">
                <span
                  className="pointer-events-none absolute -inset-x-12 -inset-y-8 z-0 blur-3xl"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(200,200,210,0.85) 0%, transparent 65%)",
                  }}
                  aria-hidden="true"
                />
                <span className="relative z-10">AVAILABILITY</span>
              </h1>
              <p className="max-w-2xl text-sm text-white/70">
                Request a tour for any date.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-divider border-t border-white/10 py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal mode="text">
            <AvailabilityCalendar />
          </Reveal>
        </div>
      </section>

      <section className="section-divider border-t border-white/10 pb-20 pt-10 sm:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal mode="text">
            <div className="rounded-sm border border-white/10 bg-white/6 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur sm:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-xs uppercase tracking-[0.4em] text-[#d9be62]">
                    Ready to book
                  </p>
                  <h2 className="text-xl uppercase tracking-[0.28em] text-white sm:text-2xl">
                    Request a tour or booking
                  </h2>
                  <p className="max-w-xl text-sm text-white/70">
                    Share your preferred dates and guest count, and our team will
                    follow up within 24 hours.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <Link
                    href="/schedule"
                    className="inline-flex h-11 items-center justify-center rounded-sm border border-[#d4af37] px-6 text-[0.65rem] uppercase tracking-[0.35em] text-white transition duration-300 hover:border-[#f5e6a8] hover:bg-[#d4af37]/15 hover:text-white hover:shadow-[0_0_24px_rgba(212,175,55,0.3)]"
                  >
                    Request Booking
                  </Link>
                  <a
                    href={`tel:${contactNumber}`}
                    className="inline-flex h-11 items-center justify-center rounded-sm border border-white/20 px-5 text-[0.65rem] uppercase tracking-[0.35em] text-white transition duration-300 hover:border-white/50 hover:bg-white/10 hover:text-white"
                  >
                    Call / Text
                  </a>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex h-11 items-center justify-center rounded-sm border border-white/20 px-5 text-[0.65rem] uppercase tracking-[0.35em] text-white transition duration-300 hover:border-white/50 hover:bg-white/10 hover:text-white"
                  >
                    Email
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}

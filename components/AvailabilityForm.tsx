import { BadgeCheck, Clock, MapPin, Phone, Users2 } from "lucide-react";

export default function AvailabilityForm() {
  return (
    <section id="pricing" className="section-glow pricing-glow px-4 pb-12 sm:px-6 sm:pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="hours-pattern hours-glow flex flex-col items-center gap-4 rounded-sm border border-white/15 bg-black/70 p-5 text-center sm:p-6">
            <Clock
              className="h-6 w-6 text-[#d4af37] [filter:drop-shadow(0_0_1px_rgba(255,255,255,0.45))_drop-shadow(0_0_4px_rgba(212,175,55,0.4))_drop-shadow(0_0_8px_rgba(212,175,55,0.2))]"
              aria-hidden="true"
            />
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              Viewing Hours Available
            </p>
            <div className="flex flex-col gap-2 text-sm uppercase tracking-[0.25em] text-white/80">
              <p>Monday: 8AM–9:30AM / 6PM–8PM</p>
              <p>Wednesday: 8AM–9:30AM / 6PM–8PM</p>
              <p>Friday: 8AM–9:30AM / 6PM–8PM</p>
            </div>
          </div>
          <div className="hours-pattern hours-glow flex flex-col items-center gap-4 rounded-sm border border-white/15 bg-black/70 p-5 text-center sm:p-6">
            <Phone
              className="h-6 w-6 text-[#d4af37] [filter:drop-shadow(0_0_1px_rgba(255,255,255,0.45))_drop-shadow(0_0_4px_rgba(212,175,55,0.4))_drop-shadow(0_0_8px_rgba(212,175,55,0.2))]"
              aria-hidden="true"
            />
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              Contacts
            </p>
            <div className="flex flex-col gap-2 text-sm uppercase tracking-[0.25em] text-white/80">
              <p>Andre: (347) 579-6578</p>
              <p>Alfred: (917) 496-2261</p>
              <p>Justine: (347) 975-5516</p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-6 grid max-w-7xl gap-4 sm:grid-cols-2 md:grid-cols-3">
          <article className="about-card-outline group relative flex min-w-0 min-h-12 items-center gap-3 rounded-sm p-4 text-left shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition">
            <Users2
              className="h-6 w-6 text-[#D4AF37] [filter:drop-shadow(0_0_6px_rgba(212,175,55,0.35))_drop-shadow(0_0_10px_rgba(212,175,55,0.2))] group-hover:[filter:drop-shadow(0_0_8px_rgba(212,175,55,0.45))_drop-shadow(0_0_14px_rgba(212,175,55,0.3))] group-focus-visible:[filter:drop-shadow(0_0_8px_rgba(212,175,55,0.45))_drop-shadow(0_0_14px_rgba(212,175,55,0.3))]"
              aria-hidden="true"
            />
            <h3 className="truncate text-sm font-semibold tracking-[0.14em] text-white whitespace-nowrap">
              Up to 125 Guests
            </h3>
          </article>
          <article className="about-card-outline group relative flex min-w-0 min-h-12 items-center gap-3 rounded-sm p-4 text-left shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition">
            <BadgeCheck
              className="h-6 w-6 text-[#D4AF37] [filter:drop-shadow(0_0_6px_rgba(212,175,55,0.35))_drop-shadow(0_0_10px_rgba(212,175,55,0.2))] group-hover:[filter:drop-shadow(0_0_8px_rgba(212,175,55,0.45))_drop-shadow(0_0_14px_rgba(212,175,55,0.3))] group-focus-visible:[filter:drop-shadow(0_0_8px_rgba(212,175,55,0.45))_drop-shadow(0_0_14px_rgba(212,175,55,0.3))]"
              aria-hidden="true"
            />
            <h3 className="truncate text-sm font-semibold tracking-[0.14em] text-white whitespace-nowrap">
              Veteran Discounts
            </h3>
          </article>
          <article className="about-card-outline group relative flex min-w-0 min-h-12 items-center gap-3 rounded-sm p-4 text-left shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition">
            <MapPin
              className="h-6 w-6 text-[#D4AF37] [filter:drop-shadow(0_0_6px_rgba(212,175,55,0.35))_drop-shadow(0_0_10px_rgba(212,175,55,0.2))] group-hover:[filter:drop-shadow(0_0_8px_rgba(212,175,55,0.45))_drop-shadow(0_0_14px_rgba(212,175,55,0.3))] group-focus-visible:[filter:drop-shadow(0_0_8px_rgba(212,175,55,0.45))_drop-shadow(0_0_14px_rgba(212,175,55,0.3))]"
              aria-hidden="true"
            />
            <h3 className="truncate text-sm font-semibold tracking-[0.14em] text-white whitespace-nowrap">
              New York
            </h3>
          </article>
        </div>
      </div>
    </section>
  );
}

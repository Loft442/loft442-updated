import Link from "next/link";
import Button from "@/components/ui/Button";
import { TEAM_CONTACTS, TEAM_EMAIL } from "@/lib/contacts";
import { venuePackages } from "@/lib/packages";

const viewingHours = [
  { day: "Monday", times: ["7:00 – 9:00 AM", "6:30 – 8:30 PM"] },
  { day: "Wednesday", times: ["7:00 – 9:00 AM", "6:30 – 8:30 PM"] },
  { day: "Friday", times: ["7:00 – 9:00 AM", "6:30 – 8:30 PM"] },
];

const detailLinkClass =
  "tap self-start text-[0.7rem] uppercase tracking-[0.3em] text-white/75 underline decoration-gold/50 underline-offset-[6px] transition-colors hover:text-gold-light hover:decoration-gold";

/** Booking facts, viewing hours, and a short inquiry beside the date request. */
export default function AvailabilityForm() {
  return (
    <section id="contact" className="scroll-mt-28 section-pad border-t border-[var(--line)] md:scroll-mt-32">
      {/* Older links point at /#pricing; keep that anchor alive. */}
      <span id="pricing" className="block scroll-mt-28 md:scroll-mt-32" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-5 text-center">
          <h2 className="display-lg max-w-2xl">Ready to plan your event?</h2>
        </div>

        <div className="mt-8 flex flex-col gap-px bg-[var(--line)] sm:mt-10">
          <div className="grid gap-px lg:grid-cols-2">
            <div className="flex flex-col gap-6 bg-[var(--background)] p-8 sm:p-10">
              <p className="eyebrow">Packages</p>
              <ul className="flex flex-col">
                {venuePackages.map((pkg) => (
                  <li
                    key={pkg.name}
                    className="flex flex-col gap-1 border-b border-[var(--line)] py-4 last:border-b-0"
                  >
                    <span className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-serif text-2xl text-[var(--ivory)]">{pkg.name}</span>
                      <span className="font-serif text-2xl text-gold-accent">${pkg.price}</span>
                    </span>
                    <span className="text-sm text-white/65">{pkg.guests}</span>
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className={detailLinkClass}>
                See packages
              </Link>
            </div>

            <div className="flex flex-col gap-6 bg-[var(--background)] p-8 sm:p-10">
              <p className="eyebrow">Catering</p>
              <p className="font-serif text-2xl leading-snug text-[var(--ivory)]">
                The Door, or your own caterer
              </p>
              <p className="text-sm leading-relaxed text-white/65">
                Guests can dine through our preferred partner, The Door, or you may bring the
                caterer of your choice.
              </p>
              <Link href="/catering" className={detailLinkClass}>
                Catering details
              </Link>
            </div>
          </div>

          <div className="grid gap-px lg:grid-cols-2">
            <div className="flex flex-col gap-6 bg-[var(--background)] p-8 sm:p-10">
              <div
                id="phones"
                className="flex scroll-mt-36 flex-col gap-2 md:scroll-mt-40"
              >
                <p className="eyebrow">Reach us</p>
                <p className="font-serif text-lg leading-snug text-[var(--ivory)]">
                  Call for Tours &amp; Inquiries
                </p>
              </div>
              <ul className="flex flex-col gap-3">
                {TEAM_CONTACTS.map((contact) => (
                  <li key={contact.tel}>
                    <a
                      href={`tel:${contact.tel}`}
                      className="tap group flex w-full items-baseline justify-between gap-3"
                    >
                      <span className="font-serif text-lg text-[var(--ivory)]">
                        {contact.name}
                      </span>
                      <span className="text-sm text-gold underline decoration-gold/50 underline-offset-[5px] transition-colors group-hover:text-gold-light group-hover:decoration-gold">
                        {contact.display}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href={`mailto:${TEAM_EMAIL}`}
                className="tap text-sm text-white/70 transition-colors hover:text-gold-light"
              >
                {TEAM_EMAIL}
              </a>
            </div>

            <div className="flex flex-col items-center gap-3 bg-[var(--background)] p-8 text-center sm:p-10">
              <p className="eyebrow">Available Times to Tour the Venue</p>
              <ul className="flex w-full flex-col">
                {viewingHours.map((row) => (
                  <li
                    key={row.day}
                    className="flex flex-col items-center gap-1 border-b border-[var(--line)] py-3 last:border-b-0"
                  >
                    <span className="font-serif text-lg text-[var(--ivory)]">{row.day}</span>
                    <span className="text-sm text-white/65">{row.times.join("  ·  ")}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start gap-5 border-t border-[var(--line)] pt-16">
          <p className="eyebrow">Request a date</p>
          <p className="font-serif text-2xl leading-snug text-[var(--ivory)]">
            Have a vision and a date in mind? Request your preferred date.
          </p>
          <Button href="/schedule">Book a Date</Button>
        </div>
      </div>
    </section>
  );
}

import Button from "@/components/ui/Button";
import { TEAM_CONTACTS } from "@/lib/contacts";

const viewingHours = [
  { day: "Monday", times: ["7:00 – 9:00 AM", "6:30 – 8:30 PM"] },
  { day: "Wednesday", times: ["7:00 – 9:00 AM", "6:30 – 8:30 PM"] },
  { day: "Friday", times: ["7:00 – 9:00 AM", "6:30 – 8:30 PM"] },
];

const contacts = TEAM_CONTACTS;

/** "Private Tours & Contact": viewing hours, the team, and the inquiry CTA. */
export default function AvailabilityForm() {
  return (
    <section id="contact" className="scroll-mt-28 section-pad border-t border-[var(--line)] md:scroll-mt-32">
      {/* Older links point at /#pricing; keep that anchor alive. */}
      <span id="pricing" className="block scroll-mt-28 md:scroll-mt-32" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="eyebrow">Begin the Conversation</p>
          <h2 className="display-lg max-w-2xl">Ready to plan your event?</h2>
        </div>

        <div className="mt-16 grid gap-px bg-[var(--line)] md:grid-cols-2">
          <div className="flex flex-col gap-6 bg-[var(--background)] p-8 sm:p-12">
            <p className="eyebrow">Viewing Hours</p>
            <ul className="flex flex-col">
              {viewingHours.map((row) => (
                <li
                  key={row.day}
                  className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--line)] py-4 last:border-b-0"
                >
                  <span className="font-serif text-xl text-[var(--ivory)]">{row.day}</span>
                  <span className="text-sm text-white/65">{row.times.join("  ·  ")}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6 bg-[var(--background)] p-8 sm:p-12">
            <p className="eyebrow">Your Hosts</p>
            <ul className="flex flex-col">
              {contacts.map((row) => (
                <li
                  key={row.tel}
                  className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--line)] py-4 last:border-b-0"
                >
                  <span className="font-serif text-xl text-[var(--ivory)]">{row.name}</span>
                  <a href={`tel:${row.tel}`} className="tap text-sm text-white/65 transition-colors hover:text-gold-light">
                    {row.display}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href="/schedule">Plan Your Event</Button>
        </div>
      </div>
    </section>
  );
}

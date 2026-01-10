export default function AvailabilityForm() {
  return (
    <section id="pricing" className="px-6 pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="hours-pattern grid gap-8 rounded-sm border border-white/15 bg-black/70 p-6 md:grid-cols-2">
          <div className="hours-glow flex flex-col gap-4">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              Viewing Hours Available
            </p>
            <div className="flex flex-col gap-2 text-sm uppercase tracking-[0.25em] text-white/80">
              <p>Monday: 8AM–9:30AM / 6PM–8PM</p>
              <p>Wednesday: 8AM–9:30AM / 6PM–8PM</p>
              <p>Friday: 8AM–9:30AM / 6PM–8PM</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:items-end md:text-right">
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
      </div>
    </section>
  );
}

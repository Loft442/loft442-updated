import Link from "next/link";

export default function LocationSection() {
  return (
    <section className="section-divider border-t border-white/10 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden rounded-sm border border-white/10 bg-black/60 shadow-[0_0_20px_rgba(255,255,255,0.12),0_0_32px_rgba(59,130,246,0.06),0_0_32px_rgba(239,68,68,0.06),0_25px_70px_rgba(0,0,0,0.45)] transition duration-200 ease-out hover:shadow-[0_0_32px_rgba(255,255,255,0.22),0_0_48px_rgba(59,130,246,0.1),0_0_48px_rgba(239,68,68,0.1),0_25px_70px_rgba(0,0,0,0.45)] focus-within:shadow-[0_0_32px_rgba(255,255,255,0.22),0_0_48px_rgba(59,130,246,0.1),0_0_48px_rgba(239,68,68,0.1),0_25px_70px_rgba(0,0,0,0.45)]">
            <iframe
              title="Loft 442 location map"
              src="https://www.google.com/maps?q=784%20Elmont%20Road%20Elmont%20NY%2011003&output=embed"
              className="h-[320px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
          <div>
            <div className="text-spotlight inline-block rounded-sm px-4 py-3">
              <div className="flex flex-col gap-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                  LOCATION
                </p>
                <p className="text-lg leading-relaxed text-white/85">
                  784 Elmont Road, Elmont,
                  <br />
                  NY 11003
                </p>
                <Link
                  href="https://maps.google.com/?q=784%20Elmont%20Road%20Elmont%20NY%2011003"
                  className="text-xs uppercase tracking-[0.35em] text-white/70 transition hover:text-white"
                >
                  Open in Maps
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

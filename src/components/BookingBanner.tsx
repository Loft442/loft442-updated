import Link from "next/link";

export default function BookingBanner() {
  return (
    <div className="relative z-20 overflow-hidden border-b border-gold/50 bg-[var(--background)]">
      {/* Soft gold glow centred behind the message. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_120%_at_50%_50%,rgba(201,169,97,0.16)_0%,rgba(201,169,97,0.05)_45%,transparent_75%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 text-center text-[0.7rem] uppercase tracking-[0.3em] text-white/60 sm:px-6">
        <p>
          <span className="sm:hidden">Limited 2026–2027 dates</span>
          <span className="hidden sm:inline">Now accepting a limited number of 2026–2027 dates</span>
        </p>
        <span className="text-gold/60" aria-hidden="true">
          ·
        </span>
        <Link href="/schedule" className="tap text-gold-light underline-offset-4 transition hover:underline">
          Inquire
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function BookingBanner() {
  return (
    <div className="relative z-20 border-b border-[#d4af37]/30 bg-gradient-to-r from-black via-[#1a1508] to-black">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.12)_0%,_transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center gap-2 px-4 py-3 text-center sm:flex-row sm:gap-4 sm:px-6">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#f5e6a8] sm:text-xs">
          Now Booking 2026–2027 Events
        </p>
        <span className="hidden text-[#d4af37]/50 sm:inline" aria-hidden="true">
          |
        </span>
        <Link
          href="/schedule"
          className="text-[0.6rem] uppercase tracking-[0.3em] text-white/75 transition hover:text-[#f5e6a8] hover:[text-shadow:0_0_10px_rgba(212,175,55,0.35)]"
        >
          Check availability
        </Link>
      </div>
    </div>
  );
}

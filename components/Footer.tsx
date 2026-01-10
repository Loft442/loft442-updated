import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="section-divider border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 md:flex-row md:justify-between">
        <div className="flex flex-col gap-5 text-white/70 md:items-start">
          <div className="flex flex-col gap-1">
            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-white/50">
              Email
            </p>
            <a
              href="mailto:events@loft442.com"
              className="text-sm text-white/80 transition hover:text-white hover:[text-shadow:0_0_10px_rgba(255,255,255,0.35)]"
            >
              events@loft442.com
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-white/50">
              Contacts
            </p>
            <div className="flex flex-col gap-1 text-sm text-white/80">
              <a
                href="tel:+13475796578"
                className="transition hover:text-white hover:[text-shadow:0_0_10px_rgba(255,255,255,0.35)]"
              >
                ANDRE: (347) 579-6578
              </a>
              <a
                href="tel:+19174962261"
                className="transition hover:text-white hover:[text-shadow:0_0_10px_rgba(255,255,255,0.35)]"
              >
                ALFRED: (917) 496-2261
              </a>
              <a
                href="tel:+13479755516"
                className="transition hover:text-white hover:[text-shadow:0_0_10px_rgba(255,255,255,0.35)]"
              >
                JUSTINE: (347) 975-5516
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/LOFT.442"
              aria-label="Instagram"
              className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/80 transition hover:text-white hover:[text-shadow:0_0_10px_rgba(255,255,255,0.35)]"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
          </div>
        </div>
        <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/50">
          Ac 2024 Loft 442. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

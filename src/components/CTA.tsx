import Link from "next/link";

export default function CTA() {
  return (
    <section
      id="contact"
      className="section-glow contact-glow section-divider border-t border-white/10 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="spotlight inline-block rounded-sm px-4 py-3">
          <div className="flex flex-col items-center gap-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              Ready to celebrate
            </p>
            <h2 className="spotlight-bright text-2xl font-semibold tracking-[0.12em] text-white sm:text-3xl md:text-4xl">
              READY TO PLAN YOUR EVENT?
            </h2>
            <Link
              href="/schedule"
              className="cta-button cta-book inline-flex h-12 items-center justify-center rounded-sm px-10 text-[0.7rem] uppercase tracking-[0.4em] text-black transition hover:opacity-90"
            >
              Start planning
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

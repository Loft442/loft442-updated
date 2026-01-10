import Link from "next/link";

export default function CTA() {
  return (
    <section
      id="contact"
      className="section-divider border-t border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_60%)] py-20"
    >
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="text-spotlight inline-block rounded-sm px-4 py-3">
          <div className="flex flex-col items-center gap-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              Ready to celebrate
            </p>
            <h2 className="text-3xl font-semibold tracking-[0.12em] text-white sm:text-4xl">
              READY TO BOOK YOUR EVENT?
            </h2>
            <Link
              href="/booking"
              className="cta-button cta-book rounded-sm px-10 py-4 text-[0.7rem] uppercase tracking-[0.4em] text-black transition hover:opacity-90"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

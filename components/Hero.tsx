import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] bg-black">
      <div className="absolute inset-0">
        <Image
          src="/images/banner-image.png"
          alt="Loft 442 banner"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center hero-motion"
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[60%] opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(120% 80% at 10% 20%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%), radial-gradient(100% 70% at 20% 80%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 65%)",
            backgroundRepeat: "no-repeat",
            WebkitMaskImage:
              "radial-gradient(circle at 25% 50%, transparent 0%, transparent 35%, black 70%), linear-gradient(to right, black 0%, black 70%, transparent 100%)",
            maskImage:
              "radial-gradient(circle at 25% 50%, transparent 0%, transparent 35%, black 70%), linear-gradient(to right, black 0%, black 70%, transparent 100%)",
          }}
        />
      </div>
      <div className="relative z-20 mx-auto flex min-h-[10vh] max-w-7xl items-center px-6 pb-12 pt-24 md:pt-36">
        <div className="max-w-2xl">
          <div className="text-spotlight inline-block rounded-sm px-4 py-3">
            <div className="flex flex-col gap-8">
              <p className="pl-1 text-[0.75rem] uppercase tracking-[0.45em] text-white/60 [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]">
                Loft 442
              </p>
              <h1 className="hero-stagger hero-stagger--1 text-4xl font-semibold tracking-[0.12em] text-white [text-shadow:1px_0_rgba(0,0,0,0.85),-1px_0_rgba(0,0,0,0.85),0_1px_rgba(0,0,0,0.85),0_-1px_rgba(0,0,0,0.85),0_8px_22px_rgba(0,0,0,0.55)] sm:text-5xl lg:text-6xl">
                ELEGANT VENUE FOR UNFORGETTABLE EVENTS
              </h1>
              <div className="hero-stagger hero-stagger--2 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/veteran-icon.svg"
                    alt="Veteran Owned icon"
                    className="h-9 w-7 [filter:drop-shadow(0_2px_6px_rgba(0,0,0,0.6))]"
                  />
                  <p className="hero-underline relative inline-block overflow-visible text-lg font-medium text-white/90 [text-shadow:1px_0_rgba(0,0,0,0.75),-1px_0_rgba(0,0,0,0.75),0_1px_rgba(0,0,0,0.75),0_-1px_rgba(0,0,0,0.75),0_6px_16px_rgba(0,0,0,0.5)] sm:text-xl">
                    VETERAN OWNED & OPERATED
                  </p>
                </div>
                <p className="text-sm uppercase tracking-[0.35em] text-white/70 [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]">
                  Proudly Serving Those Who Served
                </p>
                <div
                  className="flex self-start items-center gap-2 text-white"
                  role="img"
                  aria-label="5 star rating"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[22px] w-[22px]">
                    <path d="M12 2.5l2.955 5.985 6.61.96-4.782 4.66 1.128 6.57L12 17.77l-5.911 3.105 1.128-6.57-4.782-4.66 6.61-.96L12 2.5z" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[22px] w-[22px]">
                    <path d="M12 2.5l2.955 5.985 6.61.96-4.782 4.66 1.128 6.57L12 17.77l-5.911 3.105 1.128-6.57-4.782-4.66 6.61-.96L12 2.5z" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[22px] w-[22px]">
                    <path d="M12 2.5l2.955 5.985 6.61.96-4.782 4.66 1.128 6.57L12 17.77l-5.911 3.105 1.128-6.57-4.782-4.66 6.61-.96L12 2.5z" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[22px] w-[22px]">
                    <path d="M12 2.5l2.955 5.985 6.61.96-4.782 4.66 1.128 6.57L12 17.77l-5.911 3.105 1.128-6.57-4.782-4.66 6.61-.96L12 2.5z" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[22px] w-[22px]">
                    <path d="M12 2.5l2.955 5.985 6.61.96-4.782 4.66 1.128 6.57L12 17.77l-5.911 3.105 1.128-6.57-4.782-4.66 6.61-.96L12 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="hero-stagger hero-stagger--3 -mt-3 flex flex-wrap gap-4">
                <Link
                  href="/gallery"
                  className="relative isolate cta-button border border-white/60 px-6 py-3 text-[0.65rem] uppercase tracking-[0.35em] text-white/90 transition hover:border-white hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                >
                  <span className="absolute inset-0 -z-10 rounded-sm bg-white/10 backdrop-blur-xl" />
                  View Gallery
                </Link>
                <Link
                  href="/booking"
                  className="cta-button cta-book px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-black transition hover:opacity-90"
                >
                  Book a Tour
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

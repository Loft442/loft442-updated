import Image, { getImageProps } from "next/image";
import Button from "@/components/ui/Button";

const bannerProps = { alt: "", fill: true, sizes: "100vw", quality: 85 } as const;

const {
  props: { srcSet: desktopBanner },
} = getImageProps({ ...bannerProps, src: "/images/banner-opt.webp" });

const { props: mobileBanner } = getImageProps({
  ...bannerProps,
  src: "/images/banner-image-mobile-2.webp",
  loading: "eager",
  fetchPriority: "high",
});

const STAR_PATH =
  "M12 2.5l2.955 5.985 6.61.96-4.782 4.66 1.128 6.57L12 17.77l-5.911 3.105 1.128-6.57-4.782-4.66 6.61-.96L12 2.5z";

export default function Hero() {
  return (
    <section className="hero-no-glow relative w-full min-h-[calc(100svh-var(--nav-offset)-3rem)] overflow-hidden bg-black sm:min-h-[calc(100svh-var(--nav-offset)-2.25rem)]">
      <div className="absolute inset-0 z-0">
        {/* One art-directed <picture> so each device downloads only its own banner. */}
        <picture>
          <source media="(min-width: 640px)" srcSet={desktopBanner} sizes="100vw" />
          <img
            {...mobileBanner}
            alt="The Loft 442 event salon set for an evening reception"
            className="object-cover object-center"
          />
        </picture>
        {/* Quiet tonal wash keeps the type legible without heavy text effects. */}
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,8,0.88)_0%,rgba(7,7,8,0.62)_45%,rgba(7,7,8,0.25)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--background)] to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-7xl items-center px-6 py-24 sm:px-10 sm:py-[clamp(2rem,7svh,8rem)] lg:px-12">
        <div className="max-w-2xl">
          <p className="eyebrow hero-stagger hero-stagger--1">Loft 442 &nbsp;·&nbsp; Elmont, New York</p>

          <h1 className="display-xl hero-stagger hero-stagger--1 mt-7 sm:mt-[clamp(1rem,3svh,1.75rem)]">
            A private loft for celebrations worth{" "}
            <em className="display-italic">remembering</em>
          </h1>

          <p className="lede hero-stagger hero-stagger--2 mt-7 max-w-xl sm:mt-[clamp(1rem,3svh,1.75rem)]">
            Weddings, milestone celebrations and private events for up to 125 guests, with a
            dedicated team attending to every detail.
          </p>

          <div className="hero-stagger hero-stagger--3 mt-10 flex flex-col items-start gap-4 sm:mt-[clamp(1.25rem,4svh,2.5rem)] sm:flex-row">
            <Button href="/schedule" className="w-full sm:w-64">Request a Tour</Button>
            <Button href="/gallery" variant="ghost" className="w-full sm:w-64">
              View the Gallery
            </Button>
          </div>

          <div className="hero-stagger hero-stagger--3 mt-12 flex flex-wrap sm:mt-[clamp(1.25rem,4.5svh,3rem)] sm:pt-[clamp(1rem,2.5svh,1.5rem)] items-center gap-x-8 gap-y-4 border-t border-[var(--line)] pt-6 text-[0.7rem] uppercase tracking-[0.3em] text-white/60">
            <span className="flex items-center gap-3">
              <Image
                src="/images/veteran-icon.svg"
                alt=""
                width={18}
                height={24}
                sizes="18px"
                className="h-6 w-[18px] opacity-80"
              />
              Veteran owned &amp; operated
            </span>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-gold" role="img" aria-label="4.8 star rating">
                {[0, 1, 2, 3].map((index) => (
                  <svg key={index} viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" aria-hidden="true">
                    <path d={STAR_PATH} />
                  </svg>
                ))}
                <span className="relative inline-block h-3 w-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full text-white/20" aria-hidden="true">
                    <path d={STAR_PATH} />
                  </svg>
                  <span className="absolute inset-0 overflow-hidden" style={{ width: "80%" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" aria-hidden="true">
                      <path d={STAR_PATH} />
                    </svg>
                  </span>
                </span>
              </span>
              4.8 on Google
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

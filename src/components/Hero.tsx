import { getImageProps } from "next/image";
import Image from "next/image";
import Button, { buttonClasses } from "@/components/ui/Button";
import HeroMobileLock from "@/components/HeroMobileLock";

const {
  props: { srcSet: desktopBanner, sizes: desktopSizes },
} = getImageProps({
  alt: "",
  width: 1920,
  height: 1080,
  // Full-bleed hero; cap the selected candidate near common laptop widths so
  // Lighthouse/desktop doesn't pull a 1920px q=100 asset for a ~1400px paint.
  sizes: "(min-width: 1600px) 1600px, 100vw",
  quality: 100,
  src: "/images/loft442-banner-enhanced2.webp",
});

const {
  props: { srcSet: mobileBanner, sizes: mobileSizes, src: mobileSrc },
} = getImageProps({
  alt: "",
  width: 750,
  height: 1334,
  sizes: "100vw",
  quality: 85,
  src: "/images/loft442-banner-mobile-v4.webp",
});

const STAR_PATH =
  "M12 2.5l2.955 5.985 6.61.96-4.782 4.66 1.128 6.57L12 17.77l-5.911 3.105 1.128-6.57-4.782-4.66 6.61-.96L12 2.5z";

export default function Hero() {
  return (
    <section
      id="site-hero"
      className="hero-no-glow relative w-full overflow-hidden bg-black"
    >
      <HeroMobileLock />
      {/* Art-directed preloads so each viewport discovers only its LCP candidate. */}
      <link
        rel="preload"
        as="image"
        imageSrcSet={mobileBanner}
        imageSizes={mobileSizes}
        media="(max-width: 639px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        imageSrcSet={desktopBanner}
        imageSizes={desktopSizes}
        media="(min-width: 640px)"
        fetchPriority="high"
      />
      <div className="hero-banner-frame absolute inset-0 z-0 overflow-hidden">
        {/* Two mutually exclusive <source>s so only one asset is requested. */}
        <picture>
          <source
            media="(max-width: 639px)"
            srcSet={mobileBanner}
            sizes={mobileSizes}
          />
          <source
            media="(min-width: 640px)"
            srcSet={desktopBanner}
            sizes={desktopSizes}
          />
          <img
            src={mobileSrc}
            alt="The Loft 442 event salon set for an evening reception"
            width={750}
            height={1334}
            decoding="async"
            loading="eager"
            fetchPriority="high"
            className="hero-banner-img absolute left-0 top-0 w-full object-cover object-[58%_center] sm:inset-0 sm:h-full sm:object-center"
          />
        </picture>
        {/* Mobile: stronger full wash so type clears the bright table/arches.
            Desktop: darken left only for type. */}
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,8,0.22)_0%,rgba(7,7,8,0.48)_28%,rgba(7,7,8,0.7)_58%,rgba(7,7,8,0.92)_74%,var(--background)_90%,var(--background)_100%)] sm:bg-[linear-gradient(90deg,rgba(7,7,8,0.94)_0%,rgba(7,7,8,0.78)_42%,rgba(7,7,8,0.48)_58%,rgba(7,7,8,0.18)_74%,transparent_90%)]"
          aria-hidden="true"
        />
        {/* Feather the hero image into the page background. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-[linear-gradient(to_top,var(--background)_0%,var(--background)_22%,color-mix(in_srgb,var(--background)_78%,transparent)_48%,color-mix(in_srgb,var(--background)_32%,transparent)_74%,transparent_100%)] sm:h-56 sm:bg-[linear-gradient(to_top,var(--background)_0%,var(--background)_18%,color-mix(in_srgb,var(--background)_72%,transparent)_46%,color-mix(in_srgb,var(--background)_28%,transparent)_74%,transparent_100%)]"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[inherit] w-full max-w-7xl items-start px-5 pt-20 pb-12 sm:items-center sm:px-10 sm:py-[clamp(2rem,7svh,8rem)] lg:px-12">
        <div className="w-full min-w-0 max-w-2xl [text-shadow:0_1px_2px_rgba(0,0,0,0.7),0_2px_28px_rgba(0,0,0,0.45)] [&_a]:[text-shadow:none] [&_button]:[text-shadow:none]">
          <p className="eyebrow hero-stagger hero-stagger--1 tracking-[0.28em] text-gold-light sm:tracking-[0.38em]">
            Loft 442 &nbsp;·&nbsp; Elmont, New York
          </p>

          <h1 className="display-xl hero-stagger hero-stagger--1 mt-5 text-[clamp(1.85rem,8.6vw,2.45rem)] leading-[1.14] text-white! sm:mt-[clamp(1rem,3svh,1.75rem)] sm:text-[clamp(2.4rem,min(5.6vw,8.5svh),4.75rem)] sm:leading-[1.04]">
            <span className="inline-block max-w-full whitespace-nowrap">
              Creating{" "}
              <em className="display-italic hero-unforgettable !text-[#e6cc90]">Unforgettable</em>
            </span>{" "}
            Memories One Event At A Time
          </h1>

          <p className="hero-stagger hero-stagger--2 mt-6 max-w-xl text-[0.9rem] font-normal leading-relaxed text-white sm:mt-[clamp(1rem,3svh,1.75rem)] sm:text-[1.0625rem] sm:leading-[1.85]">
            Weddings and birthdays, milestone celebrations and private events for up to 125 guests,
            with a dedicated team attending to every detail.
          </p>

          <div className="hero-stagger hero-stagger--2 mt-7 flex flex-wrap items-center gap-x-5 gap-y-4 text-[0.65rem] uppercase tracking-[0.22em] text-white sm:mt-6 sm:gap-x-8 sm:gap-y-4 sm:text-[0.7rem] sm:tracking-[0.3em]">
            <span className="flex items-center gap-2 sm:gap-3">
              <Image
                src="/images/veteran-icon.svg"
                alt=""
                width={18}
                height={24}
                sizes="18px"
                className="h-5 w-[15px] opacity-95 sm:h-6 sm:w-[18px]"
              />
              Veteran owned &amp; operated
            </span>
            <span className="inline-flex items-center gap-2 leading-none sm:gap-3">
              <span className="inline-flex -translate-y-px items-center gap-1 text-gold-deep drop-shadow-[0_0_6px_rgba(230,180,34,0.35)]" role="img" aria-label="4.8 star rating">
                {[0, 1, 2, 3].map((index) => (
                  <svg key={index} viewBox="0 0 24 24" fill="currentColor" className="block h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3" aria-hidden="true">
                    <path d={STAR_PATH} />
                  </svg>
                ))}
                <span className="relative block h-2.5 w-2.5 shrink-0 sm:h-3 sm:w-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="absolute inset-0 h-full w-full text-white/20" aria-hidden="true">
                    <path d={STAR_PATH} />
                  </svg>
                  <span className="absolute inset-0 overflow-hidden" style={{ width: "80%" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="block h-2.5 w-2.5 sm:h-3 sm:w-3" aria-hidden="true">
                      <path d={STAR_PATH} />
                    </svg>
                  </span>
                </span>
              </span>
              <span className="leading-[1.2]">4.8 on Google</span>
            </span>
          </div>

          <div className="hero-stagger hero-stagger--3 mt-9 flex w-full flex-col items-stretch gap-4 sm:mt-[clamp(1.25rem,4svh,2.5rem)] sm:items-start sm:gap-4">
            <div className="flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-start sm:gap-4">
              <a href="#phones" className={buttonClasses("primary", "sm", "w-full sm:w-64 sm:h-12!")}>
                Schedule a Tour
              </a>
              <Button
                href="/gallery"
                variant="ghost"
                size="sm"
                className="w-full border-white/75 text-white hover:border-gold hover:text-gold-light sm:w-64 sm:h-12!"
              >
                View the Gallery
              </Button>
            </div>
            <a
              href="/pricing"
              className="mt-1.5 self-start text-[0.85rem] font-normal tracking-[0.04em] text-gold-light underline decoration-gold-light/55 underline-offset-[0.28em] transition-colors duration-300 hover:text-gold hover:decoration-gold sm:mt-2 sm:text-[0.9rem]"
            >
              Discover all LOFT 442 offers →
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

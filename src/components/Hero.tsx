import { getImageProps } from "next/image";
import Image from "next/image";
import Button, { buttonClasses } from "@/components/ui/Button";

const {
  props: { srcSet: desktopBanner, sizes: desktopSizes },
} = getImageProps({
  alt: "",
  width: 1920,
  height: 1080,
  // Full-bleed hero; cap the selected candidate near common laptop widths so
  // Lighthouse/desktop doesn't pull a 1920px q=100 asset for a ~1400px paint.
  sizes: "(min-width: 1600px) 1600px, 100vw",
  quality: 85,
  src: "/images/loft442-banner-enhanced2.webp",
});

const {
  props: { srcSet: mobileBanner, sizes: mobileSizes, src: mobileSrc },
} = getImageProps({
  alt: "",
  width: 750,
  height: 1334,
  // Phones rarely exceed ~430 CSS px; keep the LCP image lean.
  sizes: "100vw",
  quality: 68,
  src: "/images/loft442-banner-mobile-v4.webp",
});

const STAR_PATH =
  "M12 2.5l2.955 5.985 6.61.96-4.782 4.66 1.128 6.57L12 17.77l-5.911 3.105 1.128-6.57-4.782-4.66 6.61-.96L12 2.5z";

export default function Hero() {
  return (
    <section className="hero-no-glow relative w-full min-h-[calc(100svh-var(--nav-offset)-1rem)] overflow-hidden bg-black sm:min-h-[calc(100svh-var(--nav-offset)-2.25rem)]">
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
      <div className="absolute inset-0 z-0">
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
            className="absolute inset-0 h-full w-full object-cover object-[58%_center] blur-[2.5px] scale-105 sm:object-center sm:blur-none sm:scale-100"
          />
        </picture>
        {/* Mobile: stronger full wash so type clears the bright table/arches.
            Desktop: darken left only for type. */}
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,8,0.58)_0%,rgba(7,7,8,0.64)_42%,rgba(7,7,8,0.82)_100%)] sm:bg-[linear-gradient(90deg,rgba(7,7,8,0.9)_0%,rgba(7,7,8,0.62)_38%,rgba(7,7,8,0.22)_60%,transparent_80%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/55 to-transparent sm:hidden"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-7xl items-center px-5 py-12 sm:px-10 sm:py-[clamp(2rem,7svh,8rem)] lg:px-12">
        <div className="max-w-2xl [text-shadow:0_1px_2px_rgba(0,0,0,0.7),0_2px_28px_rgba(0,0,0,0.45)] [&_a]:[text-shadow:none] [&_button]:[text-shadow:none]">
          <p className="eyebrow hero-stagger hero-stagger--1 tracking-[0.28em] text-gold-light sm:tracking-[0.38em]">
            Loft 442 &nbsp;·&nbsp; Elmont, New York
          </p>

          <h1 className="display-xl hero-stagger hero-stagger--1 mt-4 text-[clamp(1.85rem,8.5vw,2.5rem)] leading-[1.08] text-white! sm:mt-[clamp(1rem,3svh,1.75rem)] sm:text-[clamp(2.4rem,min(5.6vw,8.5svh),4.75rem)] sm:leading-[1.04]">
            A private loft for celebrations worth{" "}
            <em className="display-italic !text-gold">remembering</em>
          </h1>

          <p className="hero-stagger hero-stagger--2 mt-4 max-w-xl text-[0.9rem] font-normal leading-snug text-white sm:mt-[clamp(1rem,3svh,1.75rem)] sm:text-[1.0625rem] sm:leading-[1.85]">
            Weddings and birthdays, milestone celebrations and private events for up to 125 guests,
            with a dedicated team attending to every detail.
          </p>

          <div className="hero-stagger hero-stagger--2 mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-[0.65rem] uppercase tracking-[0.22em] text-white sm:mt-6 sm:gap-x-8 sm:gap-y-4 sm:text-[0.7rem] sm:tracking-[0.3em]">
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
            <span className="flex items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1 text-gold-light" role="img" aria-label="4.8 star rating">
                {[0, 1, 2, 3].map((index) => (
                  <svg key={index} viewBox="0 0 24 24" fill="currentColor" className="h-2.5 w-2.5 sm:h-3 sm:w-3" aria-hidden="true">
                    <path d={STAR_PATH} />
                  </svg>
                ))}
                <span className="relative inline-block h-2.5 w-2.5 sm:h-3 sm:w-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full text-white/20" aria-hidden="true">
                    <path d={STAR_PATH} />
                  </svg>
                  <span className="absolute inset-0 overflow-hidden" style={{ width: "80%" }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-2.5 w-2.5 sm:h-3 sm:w-3" aria-hidden="true">
                      <path d={STAR_PATH} />
                    </svg>
                  </span>
                </span>
              </span>
              4.8 on Google
            </span>
          </div>

          <div className="hero-stagger hero-stagger--3 mt-7 flex flex-col items-start gap-3.5 sm:mt-[clamp(1.25rem,4svh,2.5rem)] sm:gap-4">
            <div className="flex w-full flex-col items-start gap-3.5 sm:flex-row sm:gap-4">
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
            <div className="mt-1.5 flex w-full flex-col items-start gap-3.5 sm:mt-2 sm:gap-4">
              <p className="max-w-sm font-serif text-base leading-snug text-white sm:text-lg">
                Discover Everything LOFT 442 Has to Offer
              </p>
              <Button
                href="/pricing"
                variant="ghost"
                size="sm"
                className="w-full border-white/75 text-white hover:border-gold hover:text-gold-light sm:w-64 sm:h-12!"
              >
                View Pricing
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

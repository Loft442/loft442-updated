import Image, { getImageProps } from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./Hero.module.css";

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

export default function Hero() {
  const letterDelay = 18;

  const renderLetters = (text: string, startIndex: number) => {
    const chars = Array.from(text);
    const nodes = chars.map((char, index) => (
      <span
        key={`${startIndex + index}`}
        className={styles.heroLetter}
        style={
          { "--letter-delay": `${(startIndex + index) * letterDelay}ms` } as CSSProperties
        }
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

    return { nodes, nextIndex: startIndex + chars.length };
  };

  let letterIndex = 0;
  const { nodes: creatingNodes, nextIndex: afterCreating } = renderLetters(
    "CREATING ",
    letterIndex
  );
  letterIndex = afterCreating;
  const { nodes: unforgettableNodes, nextIndex: afterUnforgettable } =
    renderLetters("UNFORGETTABLE", letterIndex);
  letterIndex = afterUnforgettable;

  const { nodes: line2Nodes, nextIndex: line2End } = renderLetters(
    "MEMORIES ONE EVENT ",
    letterIndex
  );
  const { nodes: line3Nodes } = renderLetters("AT A TIME", line2End);

  return (
    <section
      className="hero-no-glow relative w-full -mt-19 min-h-[calc(100svh-76px)] overflow-hidden bg-black aspect-9/16 sm:min-h-0 sm:aspect-640/367 md:min-h-[85vh] lg:min-h-[90vh]"
    >
      <div className="absolute inset-0 z-0">
        {/* One art-directed <picture> so each device downloads only its own banner. */}
        <picture>
          <source media="(min-width: 640px)" srcSet={desktopBanner} sizes="100vw" />
          <img
            {...mobileBanner}
            alt="Loft 442 elegant event venue interior"
            className="object-cover object-center"
          />
        </picture>
      </div>
      <div className="relative z-10 translate-y-19 mx-auto flex min-h-[10vh] max-w-7xl items-center px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-12 lg:py-28">
        <div className="max-w-2xl md:max-w-3xl">
          <div className="text-spotlight inline-block rounded-sm px-4 py-4">
            <div className="flex flex-col gap-5 sm:gap-6">
              <p className={`text-[0.75rem] uppercase tracking-[0.2em] text-white/60 sm:tracking-[0.45em] ${styles.heroTextStroke}`}>
                Loft 442
              </p>
              <h1 className="hero-stagger hero-stagger--1 flex flex-col gap-1.5 text-3xl font-semibold tracking-[0.06em] text-white sm:gap-2 sm:text-4xl sm:tracking-[0.12em] md:text-4xl lg:text-6xl leading-[1.05] md:leading-[1.1]">
                <span className={`${styles.heroHeadlineLine} block sm:whitespace-nowrap`}>
                  <span className={styles.heroLetterGroup}>{creatingNodes}</span>
                  <span
                    className={`${styles.heroLetterGroup} ${styles.venueUnderline} ${styles.venueUnderlineAnimated} block sm:inline`}
                  >
                    {unforgettableNodes}
                  </span>
                </span>
                <span className={`${styles.heroHeadlineLine} block`}>
                  <span className={styles.heroLetterGroup}>{line2Nodes}</span>
                </span>
                <span className={`${styles.heroHeadlineLine} block`}>
                  <span className={styles.heroLetterGroup}>{line3Nodes}</span>
                </span>
              </h1>
              <div className="hero-stagger hero-stagger--2 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/veteran-icon.svg"
                    alt="Veteran Owned icon"
                    width={28}
                    height={36}
                    sizes="28px"
                    className="h-9 w-7"
                  />
                  <p className={`hero-underline relative inline-block overflow-visible text-base sm:text-lg md:text-base font-medium text-white/90 ${styles.heroTextStroke}`}>
                    VETERAN OWNED & OPERATED
                  </p>
                </div>
                <p className={`text-xs sm:text-sm md:text-sm uppercase tracking-[0.18em] text-white sm:tracking-[0.35em] ${styles.heroTextStroke}`}>
                  Proudly Serving Those Who Served
                </p>
                <div className="flex self-start items-center gap-3">
                  <div
                    className="flex items-center gap-2 text-[#d4af37] [filter:drop-shadow(0_0_4px_rgba(212,175,55,0.6))]"
                    role="img"
                    aria-label="4.8 star rating"
                  >
                    {[0, 1, 2, 3].map((index) => (
                      <svg
                        key={index}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-[20px] w-[20px] md:h-[22px] md:w-[22px]"
                        aria-hidden="true"
                      >
                        <path d="M12 2.5l2.955 5.985 6.61.96-4.782 4.66 1.128 6.57L12 17.77l-5.911 3.105 1.128-6.57-4.782-4.66 6.61-.96L12 2.5z" />
                      </svg>
                    ))}
                    <span className="relative inline-block h-[20px] w-[20px] md:h-[22px] md:w-[22px]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-full w-full text-white/20"
                        aria-hidden="true"
                      >
                        <path d="M12 2.5l2.955 5.985 6.61.96-4.782 4.66 1.128 6.57L12 17.77l-5.911 3.105 1.128-6.57-4.782-4.66 6.61-.96L12 2.5z" />
                      </svg>
                      <span className="absolute inset-0 overflow-hidden" style={{ width: "80%" }}>
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-[20px] w-[20px] md:h-[22px] md:w-[22px]"
                          aria-hidden="true"
                        >
                          <path d="M12 2.5l2.955 5.985 6.61.96-4.782 4.66 1.128 6.57L12 17.77l-5.911 3.105 1.128-6.57-4.782-4.66 6.61-.96L12 2.5z" />
                        </svg>
                      </span>
                    </span>
                  </div>
                  <span className={`text-base sm:text-lg md:text-base font-medium text-white/90 ${styles.heroTextStroke}`}>
                    4.8 on Google
                  </span>
                </div>
              </div>
              <div className="hero-stagger hero-stagger--3 flex flex-col items-start gap-3 sm:flex-row">
                <Link
                  href="/gallery"
                  className="no-shadow relative isolate inline-flex h-10 sm:h-11 md:h-10 items-center justify-center cta-button border border-white/60 bg-black px-6 text-[0.65rem] uppercase tracking-[0.35em] text-white/90 transition hover:border-white hover:text-white"
                >
                  <span className={`relative z-10 ${styles.heroTextStroke}`}>
                    View Gallery
                  </span>
                </Link>
                <Link
                  href="/schedule"
                  className={`cta-button cta-book inline-flex h-10 sm:h-11 md:h-10 items-center justify-center px-6 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-black transition hover:-translate-y-px hover:shadow-[0_0_20px_rgba(212,175,55,0.18)] ${styles.heroCtaReveal}`}
                >
                  Plan Your Event
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

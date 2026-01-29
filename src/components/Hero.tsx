import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./Hero.module.css";

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
  const line1Segments = [
    { text: "ELEGANT ", className: styles.heroLetterGroup },
    {
      text: "VENUE ",
      className: `${styles.heroLetterGroup} ${styles.venueUnderline} ${styles.venueUnderlineAnimated}`,
    },
    { text: "FOR", className: styles.heroLetterGroup },
  ];

  const line1Nodes = line1Segments.map((segment) => {
    const { nodes, nextIndex } = renderLetters(segment.text, letterIndex);
    letterIndex = nextIndex;
    return (
      <span key={`${segment.text}-${letterIndex}`} className={segment.className}>
        {nodes}
      </span>
    );
  });

  const { nodes: line2Nodes, nextIndex: line2End } = renderLetters(
    "UNFORGETTABLE",
    letterIndex
  );
  const { nodes: line3Nodes } = renderLetters("EVENTS", line2End);

  return (
    <section
      className="hero-no-glow relative w-full -mt-19 min-h-[calc(100svh-76px)] overflow-hidden bg-black aspect-9/16 sm:min-h-0 sm:aspect-640/367 md:min-h-[85vh] lg:min-h-[90vh]"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banner-image-mobile-2.webp"
          alt="Loft 442 elegant event venue interior"
          fill
          priority
          loading="eager"
          fetchPriority="high"
          quality={85}
          sizes="100vw"
          className="object-cover object-center sm:hidden"
        />
        <Image
          src="/images/banner-opt.webp"
          alt="Loft 442 elegant event venue interior"
          fill
          priority
          loading="eager"
          fetchPriority="high"
          quality={85}
          sizes="100vw"
          className="object-cover object-center hidden sm:block"
        />
      </div>
      <div className="relative z-10 translate-y-19 mx-auto flex min-h-[10vh] max-w-7xl items-center px-4 pb-10 pt-20 sm:px-6 sm:pb-12 sm:pt-24 md:px-10 md:pb-16 md:pt-28 lg:px-12 lg:pb-20 lg:pt-32">
        <div className="max-w-2xl md:max-w-3xl">
          <div className="text-spotlight inline-block rounded-sm px-4 py-3">
            <div className="flex flex-col gap-6 sm:gap-8 md:gap-7 lg:gap-8">
              <p className={`pl-1 text-[0.75rem] uppercase tracking-[0.45em] text-white/60 ${styles.heroTextStroke}`}>
                Loft 442
              </p>
              <h1 className="hero-stagger hero-stagger--1 text-3xl font-semibold tracking-[0.12em] text-white sm:text-4xl md:text-4xl lg:text-6xl leading-[1.05] md:leading-[1.1]">
                <span className={styles.heroHeadlineLine}>{line1Nodes}</span>
                <span className={`${styles.heroHeadlineLine} block`}>
                  <span className={styles.heroLetterGroup}>{line2Nodes}</span>
                </span>
                <span className={`${styles.heroHeadlineLine} block`}>
                  <span className={styles.heroLetterGroup}>{line3Nodes}</span>
                </span>
              </h1>
              <div className="hero-stagger hero-stagger--2 flex flex-col gap-3 md:gap-2">
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
                <p className={`text-xs sm:text-sm md:text-sm uppercase tracking-[0.35em] text-white ${styles.heroTextStroke}`}>
                  Proudly Serving Those Who Served
                </p>
                <div
                  className="flex self-start items-center gap-2 text-[#d4af37] [filter:drop-shadow(0_0_4px_rgba(212,175,55,0.6))]"
                  role="img"
                  aria-label="5 star rating"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[20px] w-[20px] md:h-[22px] md:w-[22px]">
                    <path d="M12 2.5l2.955 5.985 6.61.96-4.782 4.66 1.128 6.57L12 17.77l-5.911 3.105 1.128-6.57-4.782-4.66 6.61-.96L12 2.5z" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[20px] w-[20px] md:h-[22px] md:w-[22px]">
                    <path d="M12 2.5l2.955 5.985 6.61.96-4.782 4.66 1.128 6.57L12 17.77l-5.911 3.105 1.128-6.57-4.782-4.66 6.61-.96L12 2.5z" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[20px] w-[20px] md:h-[22px] md:w-[22px]">
                    <path d="M12 2.5l2.955 5.985 6.61.96-4.782 4.66 1.128 6.57L12 17.77l-5.911 3.105 1.128-6.57-4.782-4.66 6.61-.96L12 2.5z" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[20px] w-[20px] md:h-[22px] md:w-[22px]">
                    <path d="M12 2.5l2.955 5.985 6.61.96-4.782 4.66 1.128 6.57L12 17.77l-5.911 3.105 1.128-6.57-4.782-4.66 6.61-.96L12 2.5z" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[20px] w-[20px] md:h-[22px] md:w-[22px]">
                    <path d="M12 2.5l2.955 5.985 6.61.96-4.782 4.66 1.128 6.57L12 17.77l-5.911 3.105 1.128-6.57-4.782-4.66 6.61-.96L12 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="hero-stagger hero-stagger--3 flex flex-col items-start gap-3 sm:gap-4 sm:flex-row md:gap-3">
                <Link
                  href="/gallery"
                  className="cta-glass no-shadow relative isolate inline-flex h-10 sm:h-11 md:h-10 items-center justify-center cta-button border border-white/60 px-6 text-[0.65rem] uppercase tracking-[0.35em] text-white/90 transition hover:border-white hover:text-white"
                >
                  <span className="absolute inset-0 -z-10 rounded-sm bg-white/10 backdrop-blur-xl" />
                  <span className={`relative z-10 ${styles.heroTextStroke}`}>
                    View Gallery
                  </span>
                </Link>
                <Link
                  href="/schedule"
                  className={`cta-button cta-book no-shadow inline-flex h-10 sm:h-11 md:h-10 items-center justify-center px-6 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-black transition hover:opacity-90 ${styles.heroCtaReveal}`}
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

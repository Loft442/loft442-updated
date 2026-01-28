"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NextImage from "next/image";
import styles from "./Hero.module.css";
import { galleryItems } from "@/lib/galleryItems";

const railImages = galleryItems.map(item => ({
  src: item.src,
  alt: item.alt
}));

const railQuality = 70;

const buildRailImages = (offset: number, count = 5) =>
  Array.from({ length: count }, (_, index) => {
    return railImages[(index + offset) % railImages.length];
  });

const unifiedRail = { id: "unified-rail", offset: 0 };

const useMediaQuery = (query: string, defaultValue = false) => {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(query);

    const onChange = () => setMatches(media.matches);
    onChange();

    if (media.addEventListener) {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, [query]);

  return matches;
};

export default function VideoSection() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [isSafari, setIsSafari] = useState(false);
  const [loadedSrcs, setLoadedSrcs] = useState<Record<string, boolean>>({});
  const [repaintKey, setRepaintKey] = useState(0);
  const railRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const detected =
      typeof navigator !== "undefined" &&
      /safari/i.test(navigator.userAgent) &&
      !/chrome|android|crios|fxios|edgios/i.test(navigator.userAgent);
    setIsSafari(detected);
  }, []);

  // Keep rails short to limit DOM count and WebKit memory pressure.
  const mobileCount = Math.min(railImages.length, 6);
  const desktopCount = Math.min(railImages.length, 10);

  const mobileImages = useMemo(
    () => buildRailImages(unifiedRail.offset, mobileCount),
    [mobileCount]
  );
  const desktopImages = useMemo(
    () => buildRailImages(unifiedRail.offset, desktopCount),
    [desktopCount]
  );

  const mobileLoop = useMemo(() => [...mobileImages, ...mobileImages], [mobileImages]);
  const desktopLoop = useMemo(() => [...desktopImages, ...desktopImages], [desktopImages]);

  useEffect(() => {
    if (!isSafari) return;

    // Force a tiny repaint on interaction/visibility to mitigate iOS/Safari image flicker.
    let scheduled = false;
    let rafId = 0;

    const repaint = () => {
      if (scheduled) return;
      scheduled = true;
      rafId = requestAnimationFrame(() => {
        scheduled = false;
        const rail = railRef.current;
        if (!rail) return;
        rail.style.opacity = "0.999";
        requestAnimationFrame(() => {
          const current = railRef.current;
          if (current) current.style.opacity = "";
        });
      });
    };

    const onInteraction = () => repaint();
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        setRepaintKey(key => key + 1);
        repaint();
      }
    };
    const onPageShow = () => {
      setRepaintKey(key => key + 1);
      repaint();
    };

    window.addEventListener("scroll", onInteraction, { passive: true });
    window.addEventListener("touchstart", onInteraction, { passive: true });
    window.addEventListener("mousemove", onInteraction, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("scroll", onInteraction);
      window.removeEventListener("touchstart", onInteraction);
      window.removeEventListener("mousemove", onInteraction);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isSafari]);

  const markLoaded = (src: string) => {
    setLoadedSrcs(prev => (prev[src] ? prev : { ...prev, [src]: true }));
  };

  return (
    <section
      id="video-section"
      className="pt-12 pb-10 sm:pt-16 sm:pb-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-white sm:text-xl uppercase" style={{ fontFamily: "var(--font-heading)" }}>
            <span className={`text-spotlight ${styles.venueUnderline} video-underline-static`}>
              Moments at Loft 442
            </span>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">
            Where weddings, celebrations, and unforgettable memories unfold.
          </p>
        </div>
        <div className="overflow-hidden" ref={railRef} key={repaintKey}>
          {(() => {
            return (
              <>
                {/* Mobile carousel (sm and below) */}
                <div className="flex sm:hidden overflow-hidden">
                  <div className="rail video-rail video-rail--mobile relative w-full overflow-hidden">
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-black to-transparent" />
                    <div className="video-rail__motion">
                      <div className="video-rail__track flex w-max items-center gap-3">
                        {mobileLoop.map((image, index) => {
                          const eager = index < 2;
                          const priority = index < 2;
                          return (
                            <div
                              key={`mobile-${image.src}-${index}`}
                              className={`video-rail__item relative h-40 w-60 shrink-0 overflow-hidden bg-white/5${loadedSrcs[image.src] ? " is-loaded" : ""}`}
                            >
                              <NextImage
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="(max-width: 640px) 240px, 240px"
                                className="video-rail__image object-cover"
                                quality={railQuality}
                                decoding={index < 2 ? "sync" : "async"}
                                loading={eager ? "eager" : "lazy"}
                                priority={priority}
                                onLoadingComplete={() => markLoaded(image.src)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-black to-transparent" />
                  </div>
                </div>

                {/* Desktop carousel (sm and above) */}
                <div className="hidden sm:flex">
                  <div className="rail video-rail video-rail--unified relative h-full w-full overflow-hidden">
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-black to-transparent" />
                    <div className="video-rail__motion">
                      <div className="video-rail__track flex h-full w-max items-center gap-2">
                        {desktopLoop.map((image, index) => {
                          const eager = index < 2;
                          const priority = index < 2;
                          return (
                            <div
                              key={`desktop-${image.src}-${index}`}
                              className={`video-rail__item relative h-[200px] w-[280px] shrink-0 overflow-hidden bg-white/5${loadedSrcs[image.src] ? " is-loaded" : ""}`}
                            >
                              <NextImage
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="(max-width: 640px) 240px, 280px"
                                className="video-rail__image object-cover"
                                quality={railQuality}
                                decoding={index < 2 ? "sync" : "async"}
                                loading={eager ? "eager" : "lazy"}
                                priority={priority}
                                onLoadingComplete={() => markLoaded(image.src)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-black to-transparent" />
                  </div>
                </div>
              </>
            );
          })()}
        </div>
        <div className="mt-6 sm:mt-8 flex justify-center sm:justify-start">
          <a
            href="/gallery"
            className="about-card-outline relative inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm uppercase tracking-[0.3em] text-white/80 transition hover:text-white"
          >
            View Full Gallery
          </a>
        </div>
      </div>
    </section>
  );
}

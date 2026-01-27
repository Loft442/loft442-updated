"use client";

import type { CSSProperties } from "react";
import NextImage from "next/image";
import styles from "./Hero.module.css";
import { galleryItems } from "./GalleryPage";

const railImages = galleryItems.map(item => ({
  src: item.src,
  alt: item.alt
}));

const buildRailImages = (offset: number, count = 5) =>
  Array.from({ length: count }, (_, index) => {
    return railImages[(index + offset) % railImages.length];
  });

const unifiedRail = { id: "unified-rail", offset: 0 };

// Inline styles for better Safari/WebKit compatibility
const trackStyle: CSSProperties = {
  WebkitTransform: 'translate3d(0, 0, 0)',
  transform: 'translate3d(0, 0, 0)',
  WebkitBackfaceVisibility: 'hidden',
  backfaceVisibility: 'hidden',
};

export default function VideoSection() {

  return (
    <section id="video" className="pt-12 pb-10 sm:pt-16 sm:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-white sm:text-xl uppercase" style={{ fontFamily: "var(--font-heading)" }}>
            <span className={`text-spotlight ${styles.venueUnderline}`}>Moments at Loft 442</span>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">
            Where weddings, celebrations, and unforgettable memories unfold.
          </p>
        </div>
        <div className="overflow-hidden">
          {(() => {
            const mobileImages = buildRailImages(unifiedRail.offset, railImages.length);
            const desktopImages = buildRailImages(unifiedRail.offset, railImages.length);
            // Triple the images for seamless looping on all devices (especially Safari/Mac)
            const mobileLoop = [...mobileImages, ...mobileImages, ...mobileImages];
            const desktopLoop = [...desktopImages, ...desktopImages, ...desktopImages];

            return (
              <>
                {/* Mobile carousel (sm and below) */}
                <div className="flex sm:hidden overflow-hidden">
                  <div className="video-rail video-rail--mobile relative w-full overflow-hidden">
                    <div
                      className="video-rail__track flex w-max items-center gap-3"
                      style={trackStyle}
                    >
                      {mobileLoop.map((image, index) => (
                        <div
                          key={`${unifiedRail.id}-mobile-${image.src}-${index}`}
                          className="relative h-40 w-60 shrink-0 overflow-hidden"
                        >
                          <NextImage
                            src={image.src}
                            alt={image.alt}
                            fill
                            sizes="240px"
                            className="object-cover"
                            // iOS Safari/WebKit can skip lazy-loading inside transformed/animated containers.
                            loading={index < 12 ? "eager" : "lazy"}
                            priority={index < 4}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Desktop carousel (sm and above) */}
                <div className="hidden sm:flex">
                  <div className="video-rail video-rail--unified relative h-full w-full overflow-hidden">
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10 sm:w-14 bg-gradient-to-r from-[#070708] to-transparent" />
                    <div
                      className="video-rail__track flex h-full w-max items-center gap-2"
                      style={trackStyle}
                    >
                      {desktopLoop.map((image, index) => (
                        <div
                          key={`${unifiedRail.id}-desktop-${image.src}-${index}`}
                          className="relative h-[200px] w-[280px] shrink-0 overflow-hidden"
                        >
                          <NextImage
                            src={image.src}
                            alt={image.alt}
                            fill
                            sizes="280px"
                            className="object-cover"
                            // iOS Safari/WebKit can skip lazy-loading inside transformed/animated containers.
                            loading={index < 16 ? "eager" : "lazy"}
                            priority={index < 4}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 sm:w-14 bg-gradient-to-l from-[#070708] to-transparent" />
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

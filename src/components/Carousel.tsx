'use client'

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Carousel.module.css";

// List of images in public/images
const images = [
  "/images/Carousel/babyshower10.webp",
  "/images/Carousel/birthday10.webp",
  "/images/Carousel/birthday11.webp",
  "/images/Carousel/birthday12.webp",
  "/images/Carousel/birthday2.webp",
  "/images/Carousel/birthday4.webp",
  "/images/Carousel/birthday5.webp",
  "/images/Carousel/birthday7.webp",
  "/images/Carousel/birthday9.webp",
  "/images/Carousel/private-event2.webp",
  "/images/Carousel/private-event3.webp",
  "/images/Carousel/wedding4.webp",
  "/images/Carousel/wedding5.webp",
  "/images/Carousel/wedding6.webp",
  "/images/Carousel/wedding9.webp",
];

// The track holds the list twice and a CSS animation slides it by exactly one copy,
// so the loop is seamless and runs on the compositor instead of the main thread.
export default function Carousel() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  // Only animate while the carousel is on screen, so it isn't burning frames below the fold.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new IntersectionObserver(([entry]) => {
      setInView(Boolean(entry?.isIntersecting));
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`${styles.embla} mx-auto mt-12 w-full max-w-7xl`}>
      <div className={styles.embla__viewport} ref={viewportRef}>
        <div
          className={`${styles.embla__container} ${inView ? "" : styles.isPaused}`.trim()}
        >
          {[0, 1].map((copy) =>
            images.map((src, idx) => (
              <div
                key={`${copy}-${src}`}
                className={styles.embla__slide}
                aria-hidden={copy === 1 || undefined}
              >
                <Image
                  src={src}
                  alt={copy === 0 ? `Slide ${idx + 1}` : ""}
                  width={240}
                  height={320}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 640px) 160px, 240px"
                  loading="eager"
                  fetchPriority="low"
                  draggable={false}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

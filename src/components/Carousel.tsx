'use client'

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Carousel.module.css";

const slides = [
  "babyshower6-photoshoot.webp",
  "image-7-enhanced.webp",
  "image-8-enhanced.webp",
  "image-9-enhanced.webp",
  "lavender-tea-party-tablescape.webp",
  "luxury-loft-442-entrance.webp",
  "wedding6-sweetheart-table.webp",
  "image-12-enhanced.webp",
  "bearly-wait-baby-shower.webp",
  "babyshower14-photoshoot.webp",
] as const;

// The track holds the list twice and a CSS animation slides it by exactly one copy,
// so the loop is seamless and runs on the compositor instead of the main thread.
export default function Carousel() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  // Animate only while on screen and the tab is visible — same look, less GPU work.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let inView = false;
    const sync = () => {
      const saveData = Boolean(
        (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
          ?.saveData
      );
      setActive(inView && document.visibilityState === "visible" && !saveData);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        sync();
      },
      // Tighter margin on small screens so the marquee isn't running while still off-screen.
      {
        rootMargin:
          typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches
            ? "40px 0px"
            : "120px 0px",
        threshold: 0,
      }
    );
    observer.observe(viewport);

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <Link
      href="/gallery"
      aria-label="View the gallery"
      className={`${styles.embla} mx-auto mt-12 block w-full max-w-7xl cursor-pointer`}
    >
      <div className={styles.embla__viewport} ref={viewportRef}>
        <div
          className={`${styles.embla__container} ${active ? "" : styles.isPaused}`.trim()}
        >
          {[0, 1].map((copy) =>
            slides.map((file) => (
              <div
                key={`${copy}-${file}`}
                className={styles.embla__slide}
                aria-hidden={copy === 1 || undefined}
              >
                <picture>
                  <source
                    media="(min-width: 641px)"
                    srcSet={`/images/Carousel/sm/${file}`}
                    type="image/webp"
                  />
                  <img
                    src={`/images/Carousel/xs/${file}`}
                    alt=""
                    width={160}
                    height={220}
                    className="h-full w-full object-cover"
                    loading="eager"
                    fetchPriority="low"
                    decoding="async"
                    draggable={false}
                  />
                </picture>
              </div>
            ))
          )}
        </div>
      </div>
    </Link>
  );
}

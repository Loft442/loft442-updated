"use client";

import Carousel from "@/components/Carousel";
import { useEffect, useRef, useState } from "react";
import styles from "./VideoSection.module.css";

export default function VideoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [underlineVisible, setUnderlineVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || underlineVisible) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setUnderlineVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.9 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [underlineVisible]);

  return (
    <section
      id="video-section"
      ref={sectionRef}
      className="pt-12 pb-10 sm:pt-16 sm:pb-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6 text-center sm:text-left">
          <h3
            className="text-2xl font-semibold tracking-[0.12em] text-white sm:text-3xl md:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span
              className={`text-spotlight ${styles.videoUnderline} ${underlineVisible ? styles.videoUnderlineActive : ""}`}
            >
              Moments at Loft 442
            </span>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/80 sm:text-base">
            Where weddings, celebrations, and unforgettable memories unfold.
          </p>
        </div>
        <Carousel />
        <div className="mt-6 sm:mt-8 flex justify-center sm:justify-start">
          <a
            href="/gallery"
            className="overview-button about-card-outline relative inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm uppercase tracking-[0.3em] text-white transition"
          >
            View Full Gallery
          </a>
        </div>
      </div>
    </section>
  );
}

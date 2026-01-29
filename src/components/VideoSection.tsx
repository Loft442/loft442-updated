"use client";

import Carousel from "@/components/Carousel";
import styles from "./Hero.module.css";

export default function VideoSection() {
  return (
    <section id="video-section" className="pt-12 pb-10 sm:pt-16 sm:pb-14">
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
        <Carousel />
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

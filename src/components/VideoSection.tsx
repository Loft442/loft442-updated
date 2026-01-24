"use client";

import NextImage from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Volume2, VolumeX } from "lucide-react";

const POSTER_SRC = "/video-poster.jpg";
const railImages = [
  { src: "/images/wedding1.webp", alt: "Wedding reception at Loft 442" },
  { src: "/images/wedding2.webp", alt: "Wedding ceremony at Loft 442" },
  { src: "/images/wedding3.webp", alt: "Wedding tablescape at Loft 442" },
  { src: "/images/wedding4.webp", alt: "Wedding dance floor at Loft 442" },
];

const buildRailImages = (offset: number, count = 5) =>
  Array.from({ length: count }, (_, index) => {
    return railImages[(index + offset) % railImages.length];
  });

const leftRail = { id: "left-rail", offset: 0, duration: 12 };
const rightRail = { id: "right-rail", offset: 1, duration: 13 };

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [controlsEnabled, setControlsEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [visibilityRatio, setVisibilityRatio] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [userInitiated, setUserInitiated] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [poster, setPoster] = useState<string | undefined>(undefined);

  useEffect(() => {
    let active = true;
    const probe = new Image();
    probe.src = POSTER_SRC;
    probe.onload = () => {
      if (active) setPoster(POSTER_SRC);
    };
    probe.onerror = () => {
      if (active) setPoster(undefined);
    };

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", updatePreference);
      return () => media.removeEventListener("change", updatePreference);
    }

    media.addListener(updatePreference);
    return () => media.removeListener(updatePreference);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setVisibilityRatio(entry.intersectionRatio);
      },
      { threshold: [0, 0.1, 0.95, 1], rootMargin: "0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (visibilityRatio <= 0.1) {
      video.pause();
      setShowFallback(false);
      return;
    }

    if (visibilityRatio < 0.95) {
      return;
    }

    if (prefersReducedMotion && !userInitiated) {
      return;
    }

    const attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => setShowFallback(true));
    }
  }, [visibilityRatio, prefersReducedMotion, userInitiated]);

  const handleEnableControls = () => {
    setControlsEnabled(true);
    setShowFallback(false);
    setUserInitiated(true);
    const video = videoRef.current;
    if (!video) return;
    const attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => undefined);
    }
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      const video = videoRef.current;
      if (video) {
        video.muted = next;
        if (!next) {
          setUserInitiated(true);
          const attempt = video.play();
          if (attempt && typeof attempt.catch === "function") {
            attempt.catch(() => undefined);
          }
        }
      }
      return next;
    });
  };

  return (
    <section
      id="video"
      ref={sectionRef}
      className="section-glow section-divider relative isolate border-t border-white/10 py-12 sm:py-16"
    >
      <div className="relative z-10 left-1/2 w-screen -translate-x-1/2">
        <div className="grid items-center px-4 sm:px-6 lg:px-0 lg:grid-cols-[minmax(0,1fr)_400px_minmax(0,1fr)] lg:items-stretch">
          <div className="hidden w-full lg:flex lg:self-stretch lg:py-1 lg:pr-0">
            {(() => {
              const images = buildRailImages(leftRail.offset, railImages.length);
              const loopImages = [...images, ...images];

              return (
                <div
                  className="video-rail video-rail--left video-rail--scale-left video-rail--reverse group relative h-full w-full overflow-hidden lg:-ml-6 xl:-ml-12 2xl:-ml-5"
                >
                  <div
                    className="video-rail__track flex h-full w-max items-center gap-2"
                    style={{ "--rail-duration": "24s" } as CSSProperties}
                  >
                    {loopImages.map((image, index) => (
                      <div
                        key={`${leftRail.id}-${image.src}-${index}`}
                        className="relative h-[300px] w-[400px] flex-shrink-0 overflow-hidden rounded-sm border border-white/10 bg-black/50"
                      >
                        <NextImage
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="400px"
                          className="object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
          <div className="lg:col-start-2">
            <div className="relative w-full">
              <div
                className="pointer-events-none absolute -inset-6 rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_rgba(0,0,0,0.6)_55%,_transparent_72%)] opacity-60 blur-2xl"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden rounded-sm border border-[#d4af37]/20 bg-black/60 shadow-[0_25px_70px_rgba(0,0,0,0.55)]">
                <div className="relative aspect-[9/16] w-full">
                  <video
                    ref={videoRef}
                    aria-label="Loft 442 venue highlight video"
                    className="h-full w-full object-cover"
                    src="/loft-video.mp4"
                    poster={poster}
                    preload="metadata"
                    loop
                    muted={isMuted}
                    playsInline
                    controls={controlsEnabled}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                </div>
                <div className="absolute right-3 top-3 flex gap-2">
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    aria-pressed={!isMuted}
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-white/15 bg-black/60 text-[#d4af37] shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition hover:border-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                  >
                    {isMuted ? (
                      <VolumeX
                        className="h-4 w-4 [filter:drop-shadow(0_0_1px_rgba(255,255,255,0.45))_drop-shadow(0_0_4px_rgba(212,175,55,0.4))_drop-shadow(0_0_8px_rgba(212,175,55,0.2))]"
                        aria-hidden="true"
                      />
                    ) : (
                      <Volume2
                        className="h-4 w-4 [filter:drop-shadow(0_0_1px_rgba(255,255,255,0.45))_drop-shadow(0_0_4px_rgba(212,175,55,0.4))_drop-shadow(0_0_8px_rgba(212,175,55,0.2))]"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
                {showFallback ? (
                  <div className="absolute inset-x-0 bottom-4 flex justify-center">
                    <button
                      type="button"
                      onClick={handleEnableControls}
                      className="rounded-sm border border-white/30 bg-black/70 px-4 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/80 transition hover:border-[#d4af37]/60 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                    >
                      Open video
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="hidden w-full lg:flex lg:self-stretch lg:py-1 lg:pl-6">
            {(() => {
              const images = buildRailImages(rightRail.offset, railImages.length);
              const loopImages = [...images, ...images];

              return (
                <div
                  className="video-rail video-rail--right video-rail--scale-right video-rail--reverse group relative h-full w-full overflow-hidden lg:-mr-10 xl:-mr-16 2xl:-mr-20"
                >
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-[#070708] to-transparent" />
                  <div
                    className="video-rail__track flex h-full w-max items-center gap-2"
                    style={{ "--rail-duration": "26s" } as CSSProperties}
                  >
                    {loopImages.map((image, index) => (
                      <div
                        key={`${rightRail.id}-${image.src}-${index}`}
                        className="relative h-[300px] w-[400px] flex-shrink-0 overflow-hidden rounded-sm border border-white/10 bg-black/50"
                      >
                        <NextImage
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="400px"
                          className="object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}

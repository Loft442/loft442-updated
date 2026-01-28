"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import NextImage from "next/image";
import styles from "./Hero.module.css";
import { galleryItems } from "./GalleryPage";

export function SafariDebugHUD({ selector = "img" }: { selector?: string }) {
  const [info, setInfo] = useState<Record<string, string | number | boolean>>({});
  const [lastTouch, setLastTouch] = useState(Date.now());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onTouch = () => setLastTouch(Date.now());
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("scroll", onTouch, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("scroll", onTouch);
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      const imgs = Array.from(document.querySelectorAll(selector)) as HTMLImageElement[];
      const mounted = imgs.length;

      const visible = imgs.filter(img => {
        const r = img.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
      });

      const blankVisible = visible.filter(img => img.complete && img.naturalWidth === 0);
      const notCompleteVisible = visible.filter(img => !img.complete);

      setInfo({
        time: new Date().toLocaleTimeString(),
        hidden: document.hidden,
        idleSec: Math.floor((Date.now() - lastTouch) / 1000),
        mounted,
        visible: visible.length,
        blankVisible: blankVisible.length,
        notCompleteVisible: notCompleteVisible.length,
        vw: window.innerWidth,
        vh: window.innerHeight,
        dpr: window.devicePixelRatio
      });
    };

    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [selector, lastTouch]);

  if (!mounted) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 8,
        right: 8,
        zIndex: 999999,
        background: "rgba(0,0,0,0.65)",
        color: "white",
        padding: "10px 12px",
        fontSize: 12,
        borderRadius: 10,
        maxWidth: 220,
        pointerEvents: "none",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial"
      }}
    >
      <div>
        <b>HUD</b> {info.time}
      </div>
      <div>hidden: {String(info.hidden)}</div>
      <div>idle: {info.idleSec}s</div>
      <div>imgs mounted: {info.mounted}</div>
      <div>imgs visible: {info.visible}</div>
      <div>blank visible: {info.blankVisible}</div>
      <div>not complete: {info.notCompleteVisible}</div>
      <div>
        {info.vw}×{info.vh} dpr:{info.dpr}
      </div>
    </div>,
    document.body
  );
}

const railImages = galleryItems.map(item => ({
  src: item.src,
  alt: item.alt
}));

const railQuality = 70;
const mobilePreloadWidth = 256;
const desktopPreloadWidth = 384;

const buildNextImageUrl = (src: string, width: number, quality = railQuality) => {
  if (!src) return "";
  const params = new URLSearchParams();
  params.set("url", src);
  params.set("w", String(width));
  params.set("q", String(quality));
  return `/_next/image?${params.toString()}`;
};

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

  useEffect(() => {
    const id = setInterval(() => {
      const imgs = Array.from(document.querySelectorAll(".rail img")) as HTMLImageElement[];
      const bad = imgs.filter(i => i.complete && i.naturalWidth === 0);
      console.log("imgs:", imgs.length, "bad:", bad.length, "hidden:", document.hidden);
    }, 1000);
    return () => clearInterval(id);
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

  const preloadUrls = useMemo(() => {
    const eagerCount = 2;
    const warmCount = 4;
    const targets = isMobile
      ? mobileImages.slice(eagerCount, eagerCount + warmCount)
      : desktopImages.slice(eagerCount, eagerCount + warmCount);
    const width = isMobile ? mobilePreloadWidth : desktopPreloadWidth;
    const optimized = targets.map(item => buildNextImageUrl(item.src, width));
    return Array.from(new Set(optimized)).filter(Boolean);
  }, [isMobile, mobileImages, desktopImages]);

  useEffect(() => {
    if (!isSafari) return;
    if (typeof document === "undefined") return;

    // Safari/WebKit: preload exact Next/Image URLs to avoid blank tiles.
    preloadUrls.forEach(url => {
      if (!url) return;
      const existing = document.querySelector(`link[rel="preload"][href="${url}"]`);
      if (!existing) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = url;
        document.head.appendChild(link);
      }

      const img = new Image();
      img.src = url;
      if (typeof img.decode === "function") {
        img.decode().catch(() => {});
      }
    });
  }, [isSafari, preloadUrls]);

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
    <section id="video-section" className="pt-12 pb-10 sm:pt-16 sm:pb-14">
      <SafariDebugHUD selector="#video-section img" />
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
                    <div className="video-rail__motion">
                      <div className="video-rail__track flex w-max items-center gap-3">
                        {mobileLoop.map((image, index) => {
                          const eager = isSafari || index < 2;
                          const priority = isSafari ? index < 4 : index < 2;
                          return (
                            <div
                              key={`${unifiedRail.id}-mobile-${image.src}-${index}`}
                              className="video-rail__item relative h-40 w-60 shrink-0 overflow-hidden bg-white/5"
                            >
                              <NextImage
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="(max-width: 640px) 240px, 240px"
                                className={`video-rail__image object-cover ${loadedSrcs[image.src] ? "is-loaded" : ""}`}
                                quality={railQuality}
                                decoding="async"
                                loading={eager ? "eager" : "lazy"}
                                priority={priority}
                                onLoadingComplete={() => markLoaded(image.src)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop carousel (sm and above) */}
                <div className="hidden sm:flex">
                  <div className="rail video-rail video-rail--unified relative h-full w-full overflow-hidden">
                    <div className="video-rail__motion">
                      <div className="video-rail__track flex h-full w-max items-center gap-2">
                        {desktopLoop.map((image, index) => {
                          const eager = isSafari || index < 2;
                          const priority = isSafari ? index < 4 : index < 2;
                          return (
                            <div
                              key={`${unifiedRail.id}-desktop-${image.src}-${index}`}
                              className="video-rail__item relative h-[200px] w-[280px] shrink-0 overflow-hidden bg-white/5"
                            >
                              <NextImage
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="(max-width: 640px) 240px, 280px"
                                className={`video-rail__image object-cover ${loadedSrcs[image.src] ? "is-loaded" : ""}`}
                                quality={railQuality}
                                decoding="async"
                                loading={eager ? "eager" : "lazy"}
                                priority={priority}
                                onLoadingComplete={() => markLoaded(image.src)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
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

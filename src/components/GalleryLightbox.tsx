"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import type { GalleryItem } from "@/lib/galleryItems";
import { cn } from "@/lib/utils";

const LIGHTBOX_MAX_WIDTH = 900;
const THUMB_STRIP_H = 72;

function getSafeAreaInsets() {
  const style = getComputedStyle(document.documentElement);
  return {
    top: parseFloat(style.getPropertyValue("--safe-area-inset-top")) || 0,
    right: parseFloat(style.getPropertyValue("--safe-area-inset-right")) || 0,
    bottom: parseFloat(style.getPropertyValue("--safe-area-inset-bottom")) || 0,
    left: parseFloat(style.getPropertyValue("--safe-area-inset-left")) || 0,
  };
}

type GalleryLightboxProps = {
  items: GalleryItem[];
  activeIndex: number;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
};

function thumbSrc(item: GalleryItem) {
  return item.type === "video" && item.poster ? item.poster : item.src;
}

// Loaded on demand from GalleryPage (next/dynamic), so none of this ships with
// the gallery's first load.
export default function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onSelectIndex,
}: GalleryLightboxProps) {
  const lightboxShellRef = useRef<HTMLDivElement>(null);
  const skipSelectSync = useRef(false);
  const reduceMotion = useReducedMotion();
  // Stay mounted through the exit animation; parent unmounts via onClose after.
  const [open, setOpen] = useState(true);

  const [mainRef, mainApi] = useEmblaCarousel({
    loop: items.length > 1,
    align: "center",
    duration: 22,
  });
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    align: "start",
  });

  const canSlide = items.length > 1;
  const activeItem = items[activeIndex];

  const requestClose = useCallback(() => {
    setOpen(false);
  }, []);

  const scrollTo = useCallback(
    (index: number) => {
      if (!mainApi) return;
      skipSelectSync.current = true;
      mainApi.scrollTo(index);
      thumbApi?.scrollTo(index);
      onSelectIndex(index);
    },
    [mainApi, thumbApi, onSelectIndex]
  );

  // Main carousel drives parent index + thumbnail strip.
  // Jump to the opened slide on init so reInit/select never resets the parent to 0.
  useEffect(() => {
    if (!mainApi) return;

    const onSelect = () => {
      const index = mainApi.selectedScrollSnap();
      thumbApi?.scrollTo(index);
      if (skipSelectSync.current) {
        skipSelectSync.current = false;
        return;
      }
      onSelectIndex(index);
    };

    skipSelectSync.current = true;
    mainApi.scrollTo(activeIndex, true);
    thumbApi?.scrollTo(activeIndex);

    mainApi.on("select", onSelect);

    return () => {
      mainApi.off("select", onSelect);
    };
    // Only re-bind when the Embla instance (or callback) changes — not on every index tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- activeIndex applied once per api init
  }, [mainApi, thumbApi, onSelectIndex]);

  // Keep Embla aligned if the parent index changes from outside (e.g. category reset).
  useEffect(() => {
    if (!mainApi) return;
    if (mainApi.selectedScrollSnap() === activeIndex) return;
    skipSelectSync.current = true;
    mainApi.scrollTo(activeIndex, true);
    thumbApi?.scrollTo(activeIndex);
  }, [mainApi, thumbApi, activeIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        requestClose();
        return;
      }

      if (event.key === "ArrowRight") {
        mainApi?.scrollNext();
      }

      if (event.key === "ArrowLeft") {
        mainApi?.scrollPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [requestClose, mainApi]);

  useEffect(() => {
    const startedPortrait = window.innerHeight >= window.innerWidth;

    const syncLightboxSize = () => {
      const shell = lightboxShellRef.current;
      const viewport = window.visualViewport;
      if (!shell || !viewport) return;

      // Keep the frame as it was when opened if the phone is rotated.
      const isPortrait = window.innerHeight >= window.innerWidth;
      if (isPortrait !== startedPortrait) return;

      const safeArea = getSafeAreaInsets();
      const isSm = window.matchMedia("(min-width: 640px)").matches;
      const overlayPadY = isSm ? 48 : 32;
      const overlayPadX = isSm ? 48 : 32;
      const maxWidth = Math.min(viewport.width * 0.92, LIGHTBOX_MAX_WIDTH);
      const height = Math.max(
        240,
        viewport.height - overlayPadY - safeArea.top - safeArea.bottom
      );

      shell.style.maxWidth = `${maxWidth}px`;
      shell.style.width = `${Math.min(
        viewport.width - overlayPadX - safeArea.left - safeArea.right,
        maxWidth
      )}px`;
      shell.style.height = `${height}px`;
      shell.style.maxHeight = `${height}px`;
    };

    syncLightboxSize();

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", syncLightboxSize);
    viewport?.addEventListener("scroll", syncLightboxSize);
    window.addEventListener("resize", syncLightboxSize);

    return () => {
      viewport?.removeEventListener("resize", syncLightboxSize);
      viewport?.removeEventListener("scroll", syncLightboxSize);
      window.removeEventListener("resize", syncLightboxSize);
    };
  }, []);

  // Re-measure Embla after shell size settles.
  useEffect(() => {
    mainApi?.reInit();
    thumbApi?.reInit();
  }, [mainApi, thumbApi, items.length]);

  if (!activeItem) return null;

  const mediaSizes = "(max-width: 640px) 92vw, 900px";
  const overlayTransition = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };
  const shellTransition = reduceMotion
    ? { duration: 0.01 }
    : { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.85 };

  return createPortal(
    <AnimatePresence onExitComplete={onClose}>
      {open ? (
    <motion.div
      key="gallery-lightbox-overlay"
      className="fixed inset-0 z-50 grid place-items-center overscroll-contain bg-black/90 p-4 pt-safe pb-safe pl-safe pr-safe sm:bg-black/85 sm:p-6 sm:backdrop-blur-sm"
      onClick={requestClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={overlayTransition}
    >
      <motion.div
        ref={lightboxShellRef}
        className="relative flex min-h-0 max-w-[900px] flex-col rounded-sm border border-white/10 bg-black/60 p-[clamp(8px,1.5svh,20px)] shadow-[0_30px_90px_rgba(0,0,0,0.7)] sm:backdrop-blur"
        onClick={(event) => event.stopPropagation()}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
        transition={shellTransition}
      >
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-black/40">
          <div className="absolute inset-0 p-[clamp(0px,0.75svh,16px)]">
            <div className="relative h-full w-full overflow-hidden" ref={mainRef}>
              <div className="flex h-full touch-pan-y">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative min-w-0 shrink-0 grow-0 basis-full"
                  >
                    {item.type === "video" ? (
                      <video
                        src={item.src}
                        poster={item.poster}
                        controls={index === activeIndex}
                        autoPlay={index === activeIndex}
                        muted
                        playsInline
                        preload={Math.abs(index - activeIndex) <= 1 ? "metadata" : "none"}
                        aria-label={item.alt}
                        className="absolute inset-0 h-full w-full object-contain object-center"
                      />
                    ) : (
                      <Image
                        src={item.src}
                        alt={item.alt ?? ""}
                        fill
                        sizes={mediaSizes}
                        className="object-contain object-center"
                        style={{ objectFit: "contain" }}
                        quality={index === activeIndex ? 75 : 70}
                        loading={Math.abs(index - activeIndex) <= 1 ? "eager" : "lazy"}
                        fetchPriority={index === activeIndex ? "high" : "low"}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <button
            type="button"
            onClick={requestClose}
            aria-label="Close gallery"
            className="min-tap-target absolute right-3 top-3 z-20 rounded-sm border border-white/20 bg-black/60 p-3 text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
          >
            <X className="h-5 w-5" />
          </button>
          {canSlide ? (
            <>
              <button
                type="button"
                onClick={() => mainApi?.scrollPrev()}
                aria-label="Previous image"
                className="min-tap-target absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-sm border border-white/20 bg-black/60 p-3 text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 sm:p-4"
              >
                <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
              <button
                type="button"
                onClick={() => mainApi?.scrollNext()}
                aria-label="Next image"
                className="min-tap-target absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-sm border border-white/20 bg-black/60 p-3 text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 sm:p-4"
              >
                <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
            </>
          ) : null}
        </div>

        {canSlide ? (
          <div
            className="mt-[clamp(8px,1svh,12px)] shrink-0 overflow-hidden"
            style={{ height: THUMB_STRIP_H }}
            ref={thumbRef}
          >
            <div className="flex h-full gap-2">
              {items.map((item, index) => {
                const selected = index === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollTo(index)}
                    aria-label={`View ${item.alt || `image ${index + 1}`}`}
                    aria-current={selected ? "true" : undefined}
                    className={cn(
                      "relative h-full w-[4.5rem] shrink-0 overflow-hidden rounded-sm border transition duration-200 sm:w-20",
                      selected
                        ? "border-gold opacity-100"
                        : "border-white/15 opacity-55 hover:border-white/40 hover:opacity-85"
                    )}
                  >
                    <Image
                      src={thumbSrc(item)}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                      quality={60}
                      loading="lazy"
                    />
                    {item.type === "video" ? (
                      <span className="pointer-events-none absolute inset-0 grid place-items-center bg-black/35">
                        <Play className="h-3.5 w-3.5 fill-white text-white" aria-hidden="true" />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-[clamp(8px,1svh,16px)] flex max-w-full shrink-0 flex-wrap items-center justify-between gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-white/60">
          <span>{activeItem.category}</span>
          <span>
            {activeIndex + 1} / {items.length}
          </span>
        </div>
        <p className="mt-[clamp(4px,0.5svh,8px)] max-w-full shrink-0 text-sm text-white/70">
          {activeItem.alt}
        </p>
      </motion.div>
    </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

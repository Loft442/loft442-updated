"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/lib/galleryItems";

const LIGHTBOX_MAX_WIDTH = 900;

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
  onPrev: () => void;
  onNext: () => void;
};

// Loaded on demand from GalleryPage (next/dynamic), so none of this ships with
// the gallery's first load.
export default function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: GalleryLightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const lightboxShellRef = useRef<HTMLDivElement>(null);
  const activeItem = items[activeIndex];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowRight") {
        onNext();
      }

      if (event.key === "ArrowLeft") {
        onPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onNext, onPrev]);

  useEffect(() => {
    const syncLightboxSize = () => {
      const shell = lightboxShellRef.current;
      const viewport = window.visualViewport;
      if (!shell || !viewport) return;

      const safeArea = getSafeAreaInsets();
      const isSm = window.matchMedia("(min-width: 640px)").matches;
      const overlayPadY = isSm ? 48 : 32;
      const overlayPadX = isSm ? 48 : 32;
      const maxWidth = Math.min(viewport.width * 0.92, LIGHTBOX_MAX_WIDTH);
      const height = Math.max(
        200,
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

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) {
      return;
    }

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = touchStartX.current - endX;

    if (Math.abs(delta) > 50) {
      if (delta > 0) {
        onNext();
      } else {
        onPrev();
      }
    }

    touchStartX.current = null;
  };

  if (!activeItem) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center overscroll-contain bg-black/85 p-4 pt-safe pb-safe pl-safe pr-safe backdrop-blur-sm sm:p-6"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={lightboxShellRef}
        className="relative flex min-h-0 max-w-[900px] flex-col rounded-sm border border-white/10 bg-black/60 p-[clamp(8px,1.5svh,20px)] shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-black/40">
          <div className="absolute inset-0 p-[clamp(0px,0.75svh,16px)]">
            <div className="relative h-full w-full">
              <Image
                src={activeItem.src}
                alt={activeItem.alt ?? ""}
                fill
                sizes="(max-width: 640px) 92vw, 900px"
                className="object-contain object-center"
                style={{ objectFit: 'contain' }}
                quality={80}
              />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery"
            className="min-tap-target absolute right-3 top-3 z-20 rounded-sm border border-white/20 bg-black/60 p-3 text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
          >
            <X className="h-5 w-5" />
          </button>
          {items.length > 1 ? (
            <>
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous image"
                className="min-tap-target absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-sm border border-white/20 bg-black/60 p-3 text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 sm:p-4"
              >
                <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label="Next image"
                className="min-tap-target absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-sm border border-white/20 bg-black/60 p-3 text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 sm:p-4"
              >
                <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
            </>
          ) : null}
        </div>
        <div className="mt-[clamp(8px,1svh,16px)] flex max-w-full shrink-0 flex-wrap items-center justify-between gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/60">
          <span>{activeItem.category}</span>
          <span>
            {activeIndex + 1} / {items.length}
          </span>
        </div>
        <p className="mt-[clamp(4px,0.5svh,8px)] max-w-full shrink-0 text-sm text-white/70">
          {activeItem.alt}
        </p>
      </div>
    </div>,
    document.body
  );
}

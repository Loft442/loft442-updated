"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Masonry from "@/components/Masonry";
import Reveal from "@/components/Reveal";
import { galleryItems, type GalleryItemCategory } from "@/lib/galleryItems";
import { useLockBodyScroll, getScrollY } from "@/lib/useIOSSafari";

// Helper to check if we're in browser - doesn't change after mount
const subscribe = () => () => { };
const getIsBrowser = () => typeof window !== "undefined";
const getServerSnapshot = () => false;

type GalleryCategory = "All" | GalleryItemCategory;

const categories: GalleryItemCategory[] = [
  "Weddings",
  "Private Events",
  "Birthdays",
  "Kids Parties",
  "Baby Shower",
];
const filterCategories: GalleryCategory[] = ["All", ...categories];

const masonryHeights = [560, 480, 640, 520, 720, 440, 680, 500];

const slugify = (value: string) => value.toLowerCase().replace(/\s+/g, "-");

type MasonryGalleryItem = {
  id: string;
  img: string;
  alt: string;
  url: string;
  height: number;
  index: number;
};

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] =
    useState<GalleryCategory>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);
  const scrollYRef = useRef(0);

  // Use useSyncExternalStore to safely detect browser environment
  const isBrowser = useSyncExternalStore(subscribe, getIsBrowser, getServerSnapshot);

  const filteredItems = useMemo(() => {
    const items =
      activeCategory === "All"
        ? galleryItems
        : galleryItems.filter((item) => item.category === activeCategory);

    return [...items].reverse();
  }, [activeCategory]);

  const masonryItems = useMemo(
    () =>
      filteredItems.map((item, index) => ({
        id: String(item.id),
        img: item.src,
        alt: item.alt,
        url: "",
        height: masonryHeights[index % masonryHeights.length],
        index,
      })),
    [filteredItems]
  );

  const activeTabId = `gallery-tab-${slugify(activeCategory)}`;

  // Reset active index when category changes (in event handler, not effect)
  const handleCategoryChange = useCallback((category: GalleryCategory) => {
    setActiveCategory(category);
    setActiveIndex(null);
  }, []);

  // Use iOS-safe body scroll locking
  useLockBodyScroll(activeIndex !== null, scrollYRef.current);

  const handleOpenGallery = useCallback((index: number) => {
    scrollYRef.current = getScrollY();
    setActiveIndex(index);
  }, []);

  const handlePrev = useCallback(() => {
    if (!filteredItems.length) {
      return;
    }

    setActiveIndex((prev) =>
      prev === null ? prev : (prev - 1 + filteredItems.length) % filteredItems.length
    );
  }, [filteredItems.length]);

  const handleNext = useCallback(() => {
    if (!filteredItems.length) {
      return;
    }

    setActiveIndex((prev) =>
      prev === null ? prev : (prev + 1) % filteredItems.length
    );
  }, [filteredItems.length]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
        return;
      }

      if (event.key === "ArrowRight") {
        handleNext();
      }

      if (event.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, handleNext, handlePrev]);

  const handleTabKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (
      event.key !== "ArrowRight" &&
      event.key !== "ArrowLeft" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }

    event.preventDefault();

    const lastIndex = filterCategories.length - 1;
    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = index === lastIndex ? 0 : index + 1;
    } else if (event.key === "ArrowLeft") {
      nextIndex = index === 0 ? lastIndex : index - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = lastIndex;
    }

    handleCategoryChange(filterCategories[nextIndex]);
    tabRefs.current[nextIndex]?.focus();
  };

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
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartX.current = null;
  };

  const activeItem = activeIndex !== null ? filteredItems[activeIndex] : null;

  return (
    <div>
      <section className="section-glow section-divider relative border-t border-white/10 pb-0 pt-6 sm:pt-8">
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-white/10 backdrop-blur-xl"
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="spotlight rounded-sm px-4 py-3">
            <Reveal mode="text" className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white">
                Loft 442
              </p>
              <h1 className="text-spotlight relative inline-block text-3xl font-semibold tracking-[0.32em] text-white sm:text-4xl md:text-5xl">
                <span
                  className="pointer-events-none absolute -inset-x-12 -inset-y-8 z-0 blur-3xl"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(200,200,210,0.85) 0%, transparent 65%)",
                  }}
                  aria-hidden="true"
                />
                <span className="relative z-10">GALLERY</span>
              </h1>
              <p className="max-w-2xl text-sm text-white/70">
                Explore LOFT 442 across events and setups.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-divider border-t border-white/10 bg-black">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-6 sm:px-6 sm:py-8">
          <div
            role="tablist"
            aria-label="Gallery categories"
            className="flex flex-wrap justify-center gap-3"
          >
            {filterCategories.map((category, index) => {
              const isActive = category === activeCategory;
              const tabId = `gallery-tab-${slugify(category)}`;

              return (
                <button
                  key={category}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  id={tabId}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls="gallery-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleCategoryChange(category)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={`relative min-h-11 rounded-sm border border-white/10 bg-white/5 px-5 py-2 text-[0.65rem] uppercase tracking-[0.2em] text-white/60 transition duration-200 ease-out hover:border-white/30 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 sm:tracking-[0.35em] after:pointer-events-none after:absolute after:left-1/2 after:-bottom-2 after:h-[2px] after:w-full after:-translate-x-1/2 after:bg-gradient-to-r after:from-transparent after:via-white after:to-transparent after:opacity-0 after:transition after:duration-200 after:ease-out after:content-[''] after:shadow-[0_0_8px_rgba(255,255,255,0.35)] after:[mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)] after:[mask-size:100%_100%] after:[mask-repeat:no-repeat] after:[mask-position:center] after:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)] after:[-webkit-mask-size:100%_100%] after:[-webkit-mask-repeat:no-repeat] after:[-webkit-mask-position:center] ${isActive
                    ? "border-white/40 text-white shadow-[0_0_25px_rgba(255,255,255,0.18)] after:opacity-100"
                    : ""
                    }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-divider border-t border-white/10 bg-black pb-20 pt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div
            key={activeCategory}
            id="gallery-panel"
            role="tabpanel"
            aria-labelledby={activeTabId}
          >
            {filteredItems.length === 0 ? (
              <Reveal immediate className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-sm tracking-[0.2em] uppercase text-white/70">
                  Images coming soon
                </p>
              </Reveal>
            ) : (
              <Masonry
                items={masonryItems}
                ease="power3.out"
                duration={0.6}
                stagger={0.05}
                animateFrom="bottom"
                scaleOnHover
                hoverScale={0.95}
                blurToFocus
                colorShiftOnHover={false}
                onItemClick={(item: MasonryGalleryItem) => handleOpenGallery(item.index)}
              />
            )}
          </div>
        </div>
      </section>

      {activeItem && isBrowser
        ? createPortal(
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4 backdrop-blur-sm sm:p-6"
            onClick={() => setActiveIndex(null)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="relative flex w-[92vw] max-w-[900px] h-[calc(100svh-3rem)] max-h-[calc(100svh-3rem)] flex-col min-h-0 rounded-sm border border-white/10 bg-black/60 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur sm:p-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative flex-1 min-h-0 overflow-hidden rounded-2xl bg-black/40">
                <div className="absolute inset-0 p-0 sm:p-4">
                  <div className="relative h-full w-full">
                    <Image
                      src={activeItem.src}
                      alt={activeItem.alt ?? ""}
                      fill
                      sizes="(max-width: 640px) 92vw, 900px"
                      className="object-contain object-center"
                      style={{ objectFit: 'contain' }}
                      quality={90}
                    />
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <button
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  aria-label="Close gallery"
                  className="min-tap-target absolute right-3 top-3 z-20 rounded-sm border border-white/20 bg-black/60 p-3 text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                >
                  <X className="h-5 w-5" />
                </button>
                {filteredItems.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous image"
                      className="min-tap-target absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-sm border border-white/20 bg-black/60 p-3 text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 sm:p-4"
                    >
                      <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next image"
                      className="min-tap-target absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-sm border border-white/20 bg-black/60 p-3 text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 sm:p-4"
                    >
                      <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
                    </button>
                  </>
                ) : null}
              </div>
              <div className="mt-4 flex max-w-full flex-wrap items-center justify-between gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/60">
                <span>{activeItem.category}</span>
                <span>
                  {activeIndex !== null ? activeIndex + 1 : 1} /{" "}
                  {filteredItems.length}
                </span>
              </div>
              <p className="mt-2 max-w-full text-sm text-white/70">
                {activeItem.alt}
              </p>
            </div>
          </div>,
          document.body
        )
        : null}
    </div>
  );
}

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
import { ChevronLeft, ChevronRight, Eye, X } from "lucide-react";
import Reveal from "@/components/Reveal";
import { galleryItems, type GalleryItemCategory } from "@/lib/galleryItems";
import { useLockBodyScroll } from "@/lib/useIOSSafari";

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


const slugify = (value: string) => value.toLowerCase().replace(/\s+/g, "-");

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] =
    useState<GalleryCategory>("All");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  // Use useSyncExternalStore to safely detect browser environment
  const isBrowser = useSyncExternalStore(subscribe, getIsBrowser, getServerSnapshot);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") {
      return galleryItems;
    }

    return galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const activeTabId = `gallery-tab-${slugify(activeCategory)}`;

  // Reset active index when category changes (in event handler, not effect)
  const handleCategoryChange = useCallback((category: GalleryCategory) => {
    setActiveCategory(category);
    setActiveIndex(null);
  }, []);

  // Use iOS-safe body scroll locking
  useLockBodyScroll(activeIndex !== null);

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
      <section className="relative overflow-hidden border-b border-white/10 bg-black">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,_rgba(255,255,255,0.05),_transparent_45%)]" />
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 sm:py-10 md:py-12">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            Loft 442
          </p>
          <h1 className="text-3xl font-semibold tracking-[0.35em] text-white sm:text-4xl md:text-5xl">
            GALLERY
          </h1>
          <p className="max-w-xl text-sm text-white/70">
            Explore LOFT 442 across events and setups.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black">
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
                  className={`relative min-h-11 rounded-sm border border-white/10 bg-white/5 px-5 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-white/60 transition duration-200 ease-out hover:border-white/30 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 after:pointer-events-none after:absolute after:left-1/2 after:-bottom-2 after:h-[2px] after:w-full after:-translate-x-1/2 after:bg-gradient-to-r after:from-transparent after:via-white after:to-transparent after:opacity-0 after:transition after:duration-200 after:ease-out after:content-[''] after:shadow-[0_0_8px_rgba(255,255,255,0.35)] after:[mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)] after:[mask-size:100%_100%] after:[mask-repeat:no-repeat] after:[mask-position:center] after:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)] after:[-webkit-mask-size:100%_100%] after:[-webkit-mask-repeat:no-repeat] after:[-webkit-mask-position:center] ${isActive
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

      <section className="bg-black pb-20 pt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div
            id="gallery-panel"
            role="tabpanel"
            aria-labelledby={activeTabId}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredItems.map((item, index) => (
              <Reveal
                key={item.id}
                immediate
                className="w-full"
              >
                <button
                  type="button"
                  aria-label={`Open image: ${item.alt}`}
                  onClick={() => setActiveIndex(index)}
                  className="gallery-card group relative w-full overflow-hidden rounded-sm border border-white/10 bg-white/5 text-left shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition hover:border-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                >
                  <div className="relative w-full overflow-hidden bg-black aspect-[4/3]">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={1200}
                      height={900}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="gallery-image h-full w-full object-cover transition duration-200 ease-out group-hover:scale-[1.03]"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="gallery-overlay absolute inset-0 bg-black/0 transition duration-200 ease-out group-hover:bg-black/40" />
                    <span className="gallery-shine" aria-hidden="true" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 ease-out group-hover:opacity-100">
                      <span className="flex items-center gap-2 rounded-sm border border-white/40 bg-black/50 px-4 py-2 text-[0.6rem] uppercase tracking-[0.35em] text-white">
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </span>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
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
                  className="absolute right-3 top-3 z-20 rounded-sm border border-white/20 bg-black/60 p-2 text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                >
                  <X className="h-4 w-4" />
                </button>
                {filteredItems.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-sm border border-white/20 bg-black/60 p-3 text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 sm:p-4"
                    >
                      <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-sm border border-white/20 bg-black/60 p-3 text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 sm:p-4"
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

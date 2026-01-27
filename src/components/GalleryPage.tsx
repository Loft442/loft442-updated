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
import { useLockBodyScroll } from "@/lib/useIOSSafari";

// Helper to check if we're in browser - doesn't change after mount
const subscribe = () => () => { };
const getIsBrowser = () => typeof window !== "undefined";
const getServerSnapshot = () => false;

type GalleryCategory =
  | "All"
  | "Weddings"
  | "Private Events"
  | "Birthdays"
  | "Kids Parties"
  | "Baby Shower";

type GalleryItemCategory = Exclude<GalleryCategory, "All">;

type GalleryItem = {
  id: number;
  src: string;
  alt: string;
  category: GalleryItemCategory;
};

const categories: GalleryItemCategory[] = [
  "Weddings",
  "Private Events",
  "Birthdays",
  "Kids Parties",
  "Baby Shower",
];
const filterCategories: GalleryCategory[] = ["All", ...categories];

export const galleryItems: GalleryItem[] = [
  // Weddings
  {
    id: 1,
    src: "/images/wedding1.webp",
    alt: "Wedding reception overview with soft lighting",
    category: "Weddings",
  },
  {
    id: 2,
    src: "/images/wedding2.webp",
    alt: "Wedding ceremony setup with floral details",
    category: "Weddings",
  },
  {
    id: 3,
    src: "/images/wedding3.webp",
    alt: "Wedding tablescape with candles and greenery",
    category: "Weddings",
  },
  {
    id: 4,
    src: "/images/wedding4.webp",
    alt: "Wedding dance floor with uplighting",
    category: "Weddings",
  },
  {
    id: 5,
    src: "/images/wedding5.webp",
    alt: "Wedding celebration at Loft 442",
    category: "Weddings",
  },
  {
    id: 6,
    src: "/images/wedding6.webp",
    alt: "Wedding venue setup at Loft 442",
    category: "Weddings",
  },
  {
    id: 7,
    src: "/images/wedding7.webp",
    alt: "Wedding reception decor at Loft 442",
    category: "Weddings",
  },
  {
    id: 8,
    src: "/images/wedding8.webp",
    alt: "Wedding event at Loft 442",
    category: "Weddings",
  },
  {
    id: 9,
    src: "/images/wedding9.webp",
    alt: "Wedding gathering at Loft 442",
    category: "Weddings",
  },
  // Private Events
  {
    id: 10,
    src: "/images/private-event1.webp",
    alt: "Private event at Loft 442",
    category: "Private Events",
  },
  {
    id: 11,
    src: "/images/private-event2.webp",
    alt: "Corporate gathering at Loft 442",
    category: "Private Events",
  },
  {
    id: 12,
    src: "/images/private-event3.webp",
    alt: "Private celebration at Loft 442",
    category: "Private Events",
  },
  {
    id: 13,
    src: "/images/private-event4.webp",
    alt: "Special event at Loft 442",
    category: "Private Events",
  },
  // Birthdays
  {
    id: 14,
    src: "/images/birthday1.webp",
    alt: "Birthday party at Loft 442",
    category: "Birthdays",
  },
  {
    id: 15,
    src: "/images/birthday2.webp",
    alt: "Birthday celebration setup",
    category: "Birthdays",
  },
  {
    id: 16,
    src: "/images/birthday3.webp",
    alt: "Birthday party decor at Loft 442",
    category: "Birthdays",
  },
  {
    id: 17,
    src: "/images/birthday4.webp",
    alt: "Birthday event at Loft 442",
    category: "Birthdays",
  },
  {
    id: 18,
    src: "/images/birthday5.webp",
    alt: "Birthday gathering at Loft 442",
    category: "Birthdays",
  },
  {
    id: 33,
    src: "/images/birthday6.webp",
    alt: "Birthday party celebration at Loft 442",
    category: "Birthdays",
  },
  {
    id: 34,
    src: "/images/birthday7.webp",
    alt: "Birthday event setup at Loft 442",
    category: "Birthdays",
  },
  {
    id: 35,
    src: "/images/birthday8.webp",
    alt: "Birthday party venue at Loft 442",
    category: "Birthdays",
  },
  {
    id: 36,
    src: "/images/birthday9.webp",
    alt: "Birthday celebration decor at Loft 442",
    category: "Birthdays",
  },
  {
    id: 37,
    src: "/images/birthday10.webp",
    alt: "Birthday party atmosphere at Loft 442",
    category: "Birthdays",
  },
  {
    id: 38,
    src: "/images/birthday11.webp",
    alt: "Birthday event gathering at Loft 442",
    category: "Birthdays",
  },
  {
    id: 39,
    src: "/images/birthday12.webp",
    alt: "Birthday party setup at Loft 442",
    category: "Birthdays",
  },
  // Baby Shower
  {
    id: 19,
    src: "/images/babyshower1.webp",
    alt: "Baby shower at Loft 442",
    category: "Baby Shower",
  },
  {
    id: 20,
    src: "/images/babyshower2.webp",
    alt: "Baby shower celebration",
    category: "Baby Shower",
  },
  {
    id: 21,
    src: "/images/babyshower3.webp",
    alt: "Baby shower decor at Loft 442",
    category: "Baby Shower",
  },
  {
    id: 22,
    src: "/images/babyshower4.webp",
    alt: "Baby shower setup",
    category: "Baby Shower",
  },
  {
    id: 23,
    src: "/images/babyshower5.webp",
    alt: "Baby shower event at Loft 442",
    category: "Baby Shower",
  },
  {
    id: 24,
    src: "/images/babyshower6.webp",
    alt: "Baby shower gathering",
    category: "Baby Shower",
  },
  {
    id: 25,
    src: "/images/babyshower7.webp",
    alt: "Baby shower party at Loft 442",
    category: "Baby Shower",
  },
  {
    id: 26,
    src: "/images/babyshower8.webp",
    alt: "Baby shower celebration at Loft 442",
    category: "Baby Shower",
  },
  {
    id: 27,
    src: "/images/babyshower9.webp",
    alt: "Baby shower venue setup",
    category: "Baby Shower",
  },
  {
    id: 28,
    src: "/images/babyshower10.webp",
    alt: "Baby shower decor details",
    category: "Baby Shower",
  },
  {
    id: 29,
    src: "/images/babyshower11.webp",
    alt: "Baby shower event setup",
    category: "Baby Shower",
  },
  {
    id: 30,
    src: "/images/babyshower12.webp",
    alt: "Baby shower party setup",
    category: "Baby Shower",
  },
  {
    id: 31,
    src: "/images/babyshower13.webp",
    alt: "Baby shower celebration setup",
    category: "Baby Shower",
  },
  {
    id: 32,
    src: "/images/babyshower14.webp",
    alt: "Baby shower at Loft 442 venue",
    category: "Baby Shower",
  },
];

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
                delayMs={index * 80}
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

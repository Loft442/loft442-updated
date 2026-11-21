"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import posthog from "posthog-js";
import Masonry from "@/components/Masonry";
import Reveal from "@/components/Reveal";
import type { GalleryItem, GalleryItemCategory } from "@/lib/galleryItems";
import { useLockBodyScroll, getScrollY } from "@/lib/useIOSSafari";

const loadLightbox = () => import("@/components/GalleryLightbox");
const GalleryLightbox = dynamic(() => import("@/components/GalleryLightbox"), {
  ssr: false,
});

type GalleryCategory = "All" | "Weddings" | "Private Events" | "Birthdays" | "Baby Showers";

// Gallery tabs map onto the category values stored with each photo (and in Sanity).
// Keep in sync with sanity/galleryCategories.ts. "Kids Parties" is a retired value,
// shown under Birthdays.
const categoryFilters: Record<Exclude<GalleryCategory, "All">, GalleryItemCategory[]> = {
  Weddings: ["Weddings"],
  "Private Events": ["Private Events"],
  Birthdays: ["Birthdays", "Kids Parties"],
  "Baby Showers": ["Baby Shower"],
};
const filterCategories: GalleryCategory[] = ["All", "Weddings", "Private Events", "Birthdays", "Baby Showers"];

const masonryHeights = [560, 480, 640, 520, 720, 440, 680, 500];

const slugify = (value: string) => value.toLowerCase().replace(/\s+/g, "-");

type MasonryGalleryItem = {
  id: string;
  img: string;
  alt: string;
  type: "image" | "video";
  poster?: string;
  url: string;
  height: number;
  index: number;
};

type GalleryPageProps = {
  items: GalleryItem[];
};

export default function GalleryPage({ items: galleryItems }: GalleryPageProps) {
  // The tab highlight follows selectedCategory right away; the grid rebuilds from the
  // deferred value so a tap is never blocked behind re-laying out every photo.
  const [selectedCategory, setSelectedCategory] =
    useState<GalleryCategory>("All");
  const activeCategory = useDeferredValue(selectedCategory);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollYRef = useRef(0);

  // Fetch the lightbox code while idle so the first tap on a photo opens it at once.
  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => void loadLightbox(), { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => void loadLightbox(), 1000);
    return () => window.clearTimeout(id);
  }, []);

  const filteredItems = useMemo(() => {
    const items =
      activeCategory === "All"
        ? galleryItems
        : galleryItems.filter((item) => categoryFilters[activeCategory].includes(item.category));

    const ordered = [...items].reverse();
    // In All, keep Private Events pinned to the top.
    if (activeCategory === "All") {
      ordered.sort((a, b) => {
        const aPrivate = a.category === "Private Events" ? 0 : 1;
        const bPrivate = b.category === "Private Events" ? 0 : 1;
        return aPrivate - bPrivate;
      });
    }
    return ordered;
  }, [activeCategory, galleryItems]);

  const masonryItems = useMemo(
    () =>
      filteredItems.map((item, index) => ({
        id: String(item.id),
        img: item.src,
        alt: item.alt,
        type: item.type ?? "image",
        poster: item.poster,
        url: "",
        height: masonryHeights[index % masonryHeights.length],
        index,
      })),
    [filteredItems]
  );

  const activeTabId = `gallery-tab-${slugify(activeCategory)}`;

  // Reset active index when category changes (in event handler, not effect)
  const handleCategoryChange = useCallback((category: GalleryCategory) => {
    if (category === selectedCategory) {
      return;
    }

    posthog.capture("gallery_category_selected", { category });
    setSelectedCategory(category);
    setActiveIndex(null);
  }, [selectedCategory]);

  // Use iOS-safe body scroll locking
  useLockBodyScroll(activeIndex !== null, scrollYRef);

  const handleOpenGallery = useCallback((index: number) => {
    const item = filteredItems[index];
    if (!item) {
      return;
    }

    posthog.capture("gallery_item_opened", {
      category: item.category,
      content_type: item.type ?? "image",
    });
    scrollYRef.current = getScrollY();
    setActiveIndex(index);
  }, [filteredItems]);

  const handleClose = useCallback(() => {
    setActiveIndex(null);
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

  return (
    <div>
      <section className="border-t border-[var(--line)] pb-4 pt-16 sm:pt-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal mode="text" className="wine-copy-glow flex flex-col items-center gap-6 text-center">
            <p className="eyebrow">Loft 442</p>
            <h1 className="display-xl">The Gallery</h1>
            <span className="hairline" aria-hidden="true" />
            <p className="lede max-w-xl">Moments from celebrations at Loft 442.</p>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10">
          <div
            role="tablist"
            aria-label="Gallery categories"
            className="flex flex-wrap justify-center gap-x-8 gap-y-2"
          >
            {filterCategories.map((category, index) => {
              const isActive = category === selectedCategory;
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
                  className={`relative min-h-11 px-1 py-2 text-[0.7rem] uppercase tracking-[0.3em] transition-colors duration-300 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-center after:bg-gold after:transition-transform after:duration-300 after:content-[''] ${isActive
                    ? "text-gold-light after:scale-x-100"
                    : "text-white/55 after:scale-x-0 hover:text-[var(--ivory)]"
                    }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-24 pt-4">
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
                duration={0.6}
                stagger={0.05}
                animateFrom="none"
                scaleOnHover
                hoverScale={0.95}
                colorShiftOnHover={false}
                onItemClick={(item: MasonryGalleryItem) => handleOpenGallery(item.index)}
              />
            )}
          </div>
        </div>
      </section>

      {activeIndex !== null ? (
        <GalleryLightbox
          items={filteredItems}
          activeIndex={activeIndex}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      ) : null}
    </div>
  );
}

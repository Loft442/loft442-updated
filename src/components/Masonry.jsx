"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

import "./Masonry.css";

const IMAGE_SIZES =
  "(max-width: 400px) 50vw, (max-width: 600px) 33vw, (max-width: 1000px) 25vw, (max-width: 1500px) 20vw, 15vw";

// CSS equivalents of the GSAP eases this grid used to run with.
const EASE_OUT_QUART = "cubic-bezier(0.25, 1, 0.5, 1)"; // power3.out
const EASE_OUT_CUBIC = "cubic-bezier(0.33, 1, 0.68, 1)"; // power2.out

const useMedia = (queries, values, defaultValue) => {
  const get = () => {
    if (typeof window === "undefined") return defaultValue;
    return values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue;
  };

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const handler = () => setValue(get());
    handler();
    queries.forEach((q) => matchMedia(q).addEventListener("change", handler));
    return () =>
      queries.forEach((q) =>
        matchMedia(q).removeEventListener("change", handler)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries]);

  return value;
};

const useMeasure = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
};

const MEDIA_QUERIES = [
  "(min-width:1500px)",
  "(min-width:1000px)",
  "(min-width:600px)",
  "(min-width:400px)",
];
const MEDIA_COLUMNS = [5, 4, 3, 2];

// Positions animate with the `translate` property and the intro/hover with
// `opacity`/`scale`, so the grid only ever composites: no width/height or filter
// animation and no layout work per frame.
const Masonry = ({
  items,
  ease = EASE_OUT_QUART,
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.95,
  colorShiftOnHover = false,
  onItemClick,
}) => {
  const columns = useMedia(MEDIA_QUERIES, MEDIA_COLUMNS, 1);

  const [containerRef, { width }] = useMeasure();
  const itemRefs = useRef(new Map());
  const introItemsRef = useRef(null);

  const getInitialPosition = (item) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;

    if (animateFrom === "random") {
      const directions = ["top", "bottom", "left", "right"];
      direction = directions[Math.floor(Math.random() * directions.length)];
    }

    switch (direction) {
      case "none":
        return { x: item.x, y: item.y };
      case "top":
        return { x: item.x, y: -200 };
      case "bottom":
        return { x: item.x, y: window.innerHeight + 200 };
      case "left":
        return { x: -200, y: item.y };
      case "right":
        return { x: window.innerWidth + 200, y: item.y };
      case "center":
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  const grid = useMemo(() => {
    if (!width) return [];

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    return items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const height = child.height / 2;
      const y = colHeights[col];

      colHeights[col] += height;

      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width]);

  const containerHeight = useMemo(() => {
    if (!grid.length) return 0;
    return Math.max(...grid.map((item) => item.y + item.h));
  }, [grid]);

  // Staggered entrance the first time a set of items is laid out. Later layout
  // changes (resize, column count) glide via the CSS `translate` transition.
  useLayoutEffect(() => {
    if (!grid.length || introItemsRef.current === items) return;
    introItemsRef.current = items;

    const popInPlace = animateFrom === "none";

    grid.forEach((item, index) => {
      const element = itemRefs.current.get(item.id);
      if (!element?.animate) return;

      const from = getInitialPosition(item);
      element.animate(
        [
          {
            opacity: 0,
            translate: `${from.x}px ${from.y}px`,
            ...(popInPlace && { scale: "0.92" }),
          },
          {
            opacity: 1,
            translate: `${item.x}px ${item.y}px`,
            ...(popInPlace && { scale: "1" }),
          },
        ],
        {
          duration: 800,
          easing: EASE_OUT_QUART,
          delay: index * stagger * 1000,
          fill: "backwards",
        }
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, items, stagger, animateFrom]);

  const handleClick = (item, event) => {
    event?.preventDefault?.();

    if (onItemClick) {
      onItemClick(item);
      return;
    }

    if (item.url) {
      window.open(item.url, "_blank", "noopener");
    }
  };

  return (
    <div
      ref={containerRef}
      className="list"
      data-scale-on-hover={scaleOnHover || undefined}
      data-color-shift={colorShiftOnHover || undefined}
      style={{
        height: containerHeight || undefined,
        "--masonry-hover-scale": hoverScale,
        "--masonry-move": `${duration}s ${ease}`,
        "--masonry-hover-ease": EASE_OUT_CUBIC,
      }}
    >
      {grid.map((item) => {
        return (
          <div
            key={item.id}
            ref={(element) => {
              if (element) itemRefs.current.set(item.id, element);
              else itemRefs.current.delete(item.id);
            }}
            data-key={item.id}
            className="item-wrapper"
            role="button"
            tabIndex={0}
            aria-label={
              item.alt
                ? `${item.type === "video" ? "Play video" : "Open image"}: ${item.alt}`
                : undefined
            }
            style={{
              width: item.w,
              height: item.h,
              translate: `${item.x}px ${item.y}px`,
            }}
            onClick={(event) => handleClick(item, event)}
            onMouseDown={(event) => event.preventDefault()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleClick(item, event);
              }
            }}
          >
            <div className="item-img">
              {item.type === "video" ? (
                <>
                  {item.poster ? (
                    <Image
                      src={item.poster}
                      alt={item.alt ?? ""}
                      fill
                      sizes={IMAGE_SIZES}
                      quality={75}
                      loading="lazy"
                      className="object-cover object-center"
                    />
                  ) : (
                    // No cover image: show the video's first frame.
                    <video
                      src={`${item.img}#t=0.1`}
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                  )}
                  <span className="pointer-events-none absolute inset-0 grid place-items-center">
                    <span className="rounded-full border border-white/40 bg-black/50 p-3 text-white backdrop-blur-sm">
                      <Play className="h-5 w-5 translate-x-px fill-white" aria-hidden="true" />
                    </span>
                  </span>
                </>
              ) : (
                <Image
                  src={item.img}
                  alt={item.alt ?? ""}
                  fill
                  sizes={IMAGE_SIZES}
                  quality={75}
                  loading="lazy"
                  className="object-cover object-center"
                />
              )}
              {colorShiftOnHover && (
                <div
                  className="color-overlay"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(45deg, rgba(255,0,150,0.5), rgba(0,150,255,0.5))",
                    opacity: 0,
                    pointerEvents: "none",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Masonry;

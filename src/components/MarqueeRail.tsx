"use client";

import { useMemo, type CSSProperties } from "react";
import NextImage from "next/image";
import styles from "./MarqueeRail.module.css";

type RailItem = {
  src: string;
  alt: string;
};

type MarqueeRailProps = {
  items: RailItem[];
  direction?: "left" | "right";
  speedSec?: number;
  heightPx?: number;
  gapPx?: number;
  className?: string;
};

export default function MarqueeRail({
  items,
  direction = "left",
  speedSec = 18,
  heightPx = 120,
  gapPx = 16,
  className
}: MarqueeRailProps) {
  const lists = useMemo(() => [items, items], [items]);

  if (items.length === 0) return null;

  const trackClass = direction === "right" ? styles.animateRight : styles.animateLeft;

  const styleVars = {
    "--rail-height": `${heightPx}px`,
    "--rail-gap": `${gapPx}px`,
    "--rail-speed": `${speedSec}s`
  } as CSSProperties;

  return (
    <div
      className={`${styles.viewport}${className ? ` ${className}` : ""}`}
      style={styleVars}
      aria-hidden="true"
    >
      <div className={`${styles.track} ${trackClass}`}>
        {lists.map((list, listIndex) => (
          <div
            key={`list-${listIndex}`}
            className={`${styles.list}${listIndex === 1 ? ` ${styles.clone}` : ""}`}
            aria-hidden={listIndex === 1 ? true : undefined}
          >
            {list.map((item, index) => (
              <div key={`item-${listIndex}-${item.src}-${index}`} className={styles.item}>
                <NextImage
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 240px, 320px"
                  quality={75}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

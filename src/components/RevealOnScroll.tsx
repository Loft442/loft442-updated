"use client";

import { useEffect } from "react";

type Props = {
  /** optional: when you want to disable on certain pages */
  enabled?: boolean;
};

export default function RevealOnScroll({ enabled = true }: Props) {
  useEffect(() => {
    if (!enabled) return;

    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!nodes.length) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (reduceMotion) {
      nodes.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { root: null, threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    nodes.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);

  return null;
}

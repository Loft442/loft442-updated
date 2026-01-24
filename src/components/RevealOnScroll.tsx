"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type Props = {
  /** optional: when you want to disable on certain pages */
  enabled?: boolean;
};

export default function RevealOnScroll({ enabled = true }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled) return;

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)")
    );
    if (!nodes.length) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (reduceMotion) {
      nodes.forEach((el) => el.classList.add("is-visible", "reveal-done"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.classList.add("is-visible");
            const handleTransitionEnd = (event: TransitionEvent) => {
              if (event.propertyName !== "transform") return;
              target.classList.add("reveal-done");
              target.removeEventListener("transitionend", handleTransitionEnd);
            };
            target.addEventListener("transitionend", handleTransitionEnd);
            window.setTimeout(() => {
              target.classList.add("reveal-done");
              target.removeEventListener("transitionend", handleTransitionEnd);
            }, 900);
            io.unobserve(entry.target);
          }
        }
      },
      { root: null, threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    nodes.forEach((el) => io.observe(el));

    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (!hash) {
        return;
      }

      const target = document.getElementById(hash.slice(1));
      if (!target) {
        return;
      }

      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);

    return () => {
      io.disconnect();
      window.removeEventListener("hashchange", handleHashScroll);
    };
  }, [enabled, pathname]);

  return null;
}

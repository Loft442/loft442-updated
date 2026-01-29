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

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const prefersReducedData =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-data: reduce)")?.matches;
    const connection = typeof navigator !== "undefined" ? navigator.connection : undefined;
    const saveData = connection?.saveData === true;
    const effectiveType = connection?.effectiveType;
    const slowConnection = effectiveType === "slow-2g" || effectiveType === "2g";
    const reduceMotion =
      Boolean(prefersReducedMotion || prefersReducedData || saveData || slowConnection);

    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("reduce-motion", reduceMotion);
    }

    // Debounce to avoid excessive queries on rapid route changes
    const timeoutId = setTimeout(() => {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible):not(.reveal-done)")
      );
      if (!nodes.length) return;

      if (reduceMotion) {
        nodes.forEach((el) => el.classList.add("is-visible", "reveal-done"));
        return;
      }

      // iOS Safari-safe IntersectionObserver configuration
      // Use lower threshold and smaller rootMargin for reliable callbacks
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const target = entry.target as HTMLElement;
              target.classList.add("is-visible");
              const handleTransitionEnd = (event: TransitionEvent) => {
                if (event.propertyName !== "transform" && event.propertyName !== "opacity") return;
                target.classList.add("reveal-done");
                target.removeEventListener("transitionend", handleTransitionEnd);
              };
              target.addEventListener("transitionend", handleTransitionEnd);
              // Fallback timeout in case transitionend doesn't fire (iOS Safari quirk)
              window.setTimeout(() => {
                target.classList.add("reveal-done");
                target.removeEventListener("transitionend", handleTransitionEnd);
              }, 800);
              io.unobserve(entry.target);
            }
          }
        },
        {
          root: null,
          threshold: [0, 0.1, 0.15], // Multiple thresholds for iOS Safari reliability
          rootMargin: "0px 0px -8% 0px" // Slightly reduced for iOS
        }
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
        clearTimeout(timeoutId);
        io.disconnect();
        window.removeEventListener("hashchange", handleHashScroll);
      };
    }, 100); // Wait 100ms after route change

    return () => clearTimeout(timeoutId);
  }, [enabled, pathname]);

  return null;
}

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type Props = {
  /** optional: when you want to disable on certain pages */
  enabled?: boolean;
};

const PENDING_SELECTOR = ".reveal:not(.is-visible):not(.reveal-done):not([data-reveal-bound])";

function getReduceMotion() {
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const prefersReducedData = window.matchMedia?.("(prefers-reduced-data: reduce)")?.matches;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  const saveData = connection?.saveData === true;
  const effectiveType = connection?.effectiveType;
  const slowConnection = effectiveType === "slow-2g" || effectiveType === "2g";
  return Boolean(prefersReducedMotion || prefersReducedData || saveData || slowConnection);
}

function markDone(target: HTMLElement, fallbackMs: number) {
  const handleTransitionEnd = (event: TransitionEvent) => {
    if (event.target !== target) return;
    if (event.propertyName !== "transform" && event.propertyName !== "opacity") return;
    finish();
  };
  // Fallback timeout in case transitionend doesn't fire (iOS Safari quirk)
  const timeoutId = window.setTimeout(() => finish(), fallbackMs);
  function finish() {
    target.classList.add("reveal-done");
    target.removeEventListener("transitionend", handleTransitionEnd);
    window.clearTimeout(timeoutId);
  }
  target.addEventListener("transitionend", handleTransitionEnd);
}

function show(target: HTMLElement) {
  target.classList.add("is-visible");
  markDone(target, 800 + (Number(target.dataset.revealDelay) || 0));
}

export default function RevealOnScroll({ enabled = true }: Props) {
  const pathname = usePathname();

  // One IntersectionObserver for every `.reveal` on the site. A MutationObserver
  // picks up elements added later (route changes, client-rendered sections).
  useEffect(() => {
    if (!enabled) return;

    const reduceMotion = getReduceMotion();
    document.documentElement.classList.toggle("reduce-motion", reduceMotion);

    // iOS Safari-safe IntersectionObserver configuration
    // Use lower threshold and smaller rootMargin for reliable callbacks
    const io = reduceMotion
      ? null
      : new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              io?.unobserve(entry.target);
              show(entry.target as HTMLElement);
            }
          },
          {
            root: null,
            threshold: [0, 0.1, 0.15], // Multiple thresholds for iOS Safari reliability
            rootMargin: "0px 0px -8% 0px", // Slightly reduced for iOS
          }
        );

    const bindPending = () => {
      const nodes = document.querySelectorAll<HTMLElement>(PENDING_SELECTOR);
      nodes.forEach((el) => {
        el.dataset.revealBound = "";
        if (reduceMotion) {
          el.classList.add("is-visible", "reveal-done");
        } else if (el.dataset.revealImmediate !== undefined) {
          show(el);
        } else {
          io?.observe(el);
        }
      });
    };

    let frame: number | null = null;
    const scheduleBind = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        bindPending();
      });
    };

    const mo = new MutationObserver((records) => {
      for (const record of records) {
        if (record.addedNodes.length) {
          scheduleBind();
          return;
        }
      }
    });

    bindPending();
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      mo.disconnect();
      io?.disconnect();
      document
        .querySelectorAll<HTMLElement>("[data-reveal-bound]")
        .forEach((el) => delete el.dataset.revealBound);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    let retryId: number | undefined;

    const scrollToHash = (attempt = 0) => {
      const hash = window.location.hash;
      if (!hash) {
        return;
      }

      const target = document.getElementById(hash.slice(1));
      if (!target) {
        if (attempt < 20) {
          retryId = window.setTimeout(() => scrollToHash(attempt + 1), 100);
        }
        return;
      }

      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    const handleHashScroll = () => {
      scrollToHash();
    };

    window.addEventListener("hashchange", handleHashScroll);
    scrollToHash();
    // Re-run once the new route has painted
    const timeoutId = window.setTimeout(() => scrollToHash(), 100);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearTimeout(retryId);
      window.removeEventListener("hashchange", handleHashScroll);
    };
  }, [enabled, pathname]);

  return null;
}

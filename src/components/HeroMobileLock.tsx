"use client";

import { useLayoutEffect } from "react";

const HERO_ID = "site-hero";
const DESKTOP_MQ = "(min-width: 640px)";

/**
 * Measure a stable layout viewport height.
 * Prefer documentElement.clientHeight (large/layout viewport on iOS Safari —
 * does not jump when the URL bar shows/hides). Fall back to innerHeight for
 * older Chrome Android where clientHeight can be 0 during early layout.
 */
function measureLockHeight() {
  const client = document.documentElement.clientHeight || 0;
  const inner = window.innerHeight || 0;
  return Math.round(Math.max(client, inner));
}

function clearLock(el: HTMLElement) {
  el.style.removeProperty("--hero-lock-height");
  el.style.minHeight = "";
}

function applyLock(el: HTMLElement) {
  if (window.matchMedia(DESKTOP_MQ).matches) {
    clearLock(el);
    return;
  }

  const height = measureLockHeight();
  if (height < 200) return;

  // Drive both section min-height and banner height from one token so Safari
  // and Chrome keep the image crop stable while chrome UI animates.
  el.style.setProperty("--hero-lock-height", `${height}px`);
  el.style.minHeight = "";
}

/**
 * Freeze mobile hero + banner height after first layout so URL-bar
 * show/hide on iOS Safari and Chrome Android does not rescale the image.
 * Relocks only on orientation change or desktop breakpoint crossover —
 * never on scroll-driven resize / visualViewport events.
 */
export default function HeroMobileLock() {
  useLayoutEffect(() => {
    const el = document.getElementById(HERO_ID);
    if (!el) return;

    let orientTimer = 0;

    const lock = () => applyLock(el);

    const relockAfterOrient = () => {
      clearLock(el);
      window.clearTimeout(orientTimer);
      // Safari reports the old clientHeight until the rotate settles;
      // Chrome orientationchange is immediate — double-rAF + timeout covers both.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          orientTimer = window.setTimeout(lock, 120);
        });
      });
    };

    lock();

    window.addEventListener("orientationchange", relockAfterOrient);
    const orientation = window.screen?.orientation;
    orientation?.addEventListener?.("change", relockAfterOrient);

    const mq = window.matchMedia(DESKTOP_MQ);
    const onMq = () => lock();
    mq.addEventListener("change", onMq);

    // Restore lock if the page comes back from bfcache with stale inline styles.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) lock();
    };
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.clearTimeout(orientTimer);
      window.removeEventListener("orientationchange", relockAfterOrient);
      orientation?.removeEventListener?.("change", relockAfterOrient);
      mq.removeEventListener("change", onMq);
      window.removeEventListener("pageshow", onPageShow);
      clearLock(el);
    };
  }, []);

  return null;
}

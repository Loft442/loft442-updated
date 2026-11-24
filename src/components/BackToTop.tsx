"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { getScrollY } from "@/lib/useIOSSafari";

const SHOW_AFTER_PX = 480;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      setVisible(getScrollY() > SHOW_AFTER_PX);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={[
        "tap fixed z-40 inline-flex h-11 w-11 items-center justify-center border border-white/20 bg-black/70 text-white/80 backdrop-blur-sm transition-[opacity,transform,border-color,color] duration-300 hover:border-white/40 hover:text-white print:hidden",
        "right-[max(1.25rem,env(safe-area-inset-right))] bottom-[max(1.25rem,env(safe-area-inset-bottom))] sm:right-6 sm:bottom-6",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      ].join(" ")}
    >
      <ChevronUp className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
    </button>
  );
}

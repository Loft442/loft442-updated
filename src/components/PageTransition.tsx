"use client";

import { useState, type AnimationEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type PageTransitionProps = {
  children: ReactNode;
};

// Fades each route in without remounting the tree: dropping `page-transition--done`
// on a pathname change restarts the CSS `pageEnter` animation on the same element.
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [done, setDone] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Adjusting state during render (not in an effect) so the new route never
  // paints at full opacity before the fade starts.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setDone(false);
  }

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.animationName !== "pageEnter") return;
    setDone(true);
  };

  return (
    <div
      className={`page-transition ${done ? "page-transition--done" : ""}`.trim()}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
}

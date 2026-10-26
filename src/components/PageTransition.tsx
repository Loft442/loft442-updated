"use client";

import { useState, type AnimationEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type PageTransitionProps = {
  children: ReactNode;
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [done, setDone] = useState(false);

  // Replay the enter animation on each route change.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setDone(false);
  }

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.animationName !== "pageEnter") return;
    setDone(true);
  };

  return (
    <div
      key={pathname}
      className={`page-transition ${done ? "page-transition--done" : ""}`.trim()}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </div>
  );
}

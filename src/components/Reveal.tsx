"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type TransitionEvent,
} from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  mode?: "text" | "media";
  immediate?: boolean;
};

export default function Reveal({
  children,
  className,
  delayMs = 0,
  mode = "media",
  immediate = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    if (immediate) {
      setVisible(true);
      return;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [immediate]);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (done) return;
    if (!["transform", "opacity"].includes(event.propertyName)) return;
    setDone(true);
  };

  useEffect(() => {
    if (!visible || done) return;
    const timeoutId = window.setTimeout(() => {
      setDone(true);
    }, delayMs + 700);

    return () => window.clearTimeout(timeoutId);
  }, [visible, done, delayMs]);

  const style = { "--reveal-delay": `${delayMs}ms` } as CSSProperties;
  const classes = [
    "reveal",
    mode === "text" ? "reveal--text" : "",
    visible ? "is-visible" : "",
    done ? "reveal-done" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={classes}
      style={style}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </div>
  );
}

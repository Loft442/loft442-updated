import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  mode?: "text" | "media" | "slide";
  immediate?: boolean;
};

// Plain markup: RevealOnScroll (mounted once in the root layout) owns the single
// IntersectionObserver that adds `is-visible` / `reveal-done` to every `.reveal`.
export default function Reveal({
  children,
  className,
  delayMs = 0,
  mode = "media",
  immediate = false,
}: RevealProps) {
  const style = delayMs
    ? ({ "--reveal-delay": `${delayMs}ms` } as CSSProperties)
    : undefined;
  const classes = [
    "reveal",
    mode === "text" ? "reveal--text" : mode === "slide" ? "reveal--slide" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      style={style}
      data-reveal-delay={delayMs || undefined}
      data-reveal-immediate={immediate || undefined}
    >
      {children}
    </div>
  );
}

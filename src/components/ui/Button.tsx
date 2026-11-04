import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";
type Size = "md" | "sm";

const base =
  "cta-button inline-flex items-center justify-center gap-3 rounded-none font-sans font-normal uppercase whitespace-nowrap transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "cta-book font-semibold",
  ghost:
    "border border-[var(--line-strong)] bg-transparent text-[var(--ivory)] hover:border-gold hover:text-gold-light",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-9 text-[0.72rem] tracking-[0.26em]",
  sm: "h-10 px-6 text-[0.7rem] tracking-[0.24em]",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type LinkButtonProps = CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">;
type NativeButtonProps = CommonProps & { href?: undefined } & Omit<ComponentProps<"button">, "className">;

export default function Button(props: LinkButtonProps | NativeButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = buttonClasses(variant, size, className);

  if (props.href !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { variant: _v, size: _s, className: _c, children: _ch, href, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, ...rest } = props;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

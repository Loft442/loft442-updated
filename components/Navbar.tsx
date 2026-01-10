"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/gallery" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      // small hysteresis so it doesn’t flicker around the threshold
      setIsScrolled((prev) => (prev ? y > 8 : y > 24));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 w-full border-b",
        "transition-all duration-300 ease-out motion-reduce:transition-none",
        isScrolled
          ? "border-white/10 bg-black/70 backdrop-blur-md"
          : "border-transparent bg-transparent",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex max-w-7xl items-center justify-between px-6",
          "transition-all duration-300 ease-out motion-reduce:transition-none",
          isScrolled ? "py-1.5" : "py-2",
        ].join(" ")}
      >
        <Link href="/" className="flex items-center">
          <Image
            src="/images/loft-logo.svg"
            alt="Loft 442 logo"
            width={480}
            height={88}
            priority
            className={[
              "w-auto",
              "transition-all duration-300 ease-out motion-reduce:transition-none",
              isScrolled ? "h-[46px]" : "h-[60px]",
            ].join(" ")}
          />
        </Link>

        <nav className="hidden items-center gap-8 text-xs uppercase tracking-[0.3em] text-white/70 md:flex md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="nav-underline relative transition hover:text-white after:pointer-events-none after:absolute after:left-1/2 after:-bottom-2 after:h-[2px] after:w-full after:-translate-x-1/2 after:bg-gradient-to-r after:from-transparent after:via-white after:to-transparent after:opacity-0 after:transition after:duration-200 after:ease-out after:content-[''] after:shadow-[0_0_8px_rgba(255,255,255,0.35)] hover:after:opacity-100 after:[mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)] after:[mask-size:100%_100%] after:[mask-repeat:no-repeat] after:[mask-position:center] after:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)] after:[-webkit-mask-size:100%_100%] after:[-webkit-mask-repeat:no-repeat] after:[-webkit-mask-position:center]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/booking"
          className="cta-button cta-book rounded-sm border border-white/60 px-5 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-white/90 transition hover:border-white hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          Book Now
        </Link>
      </div>
    </header>
  );
}
"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href !== "#about") {
      return;
    }

    const target = document.getElementById("about");
    if (pathname !== "/") {
      event.preventDefault();
      router.push("/#about");
      setMenuOpen(false);
      return;
    }

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      // small hysteresis so it doesn't flicker around the threshold
      setIsScrolled((prev) => (prev ? y > 8 : y > 24));
      ticking = false;
    };

    const handleScroll = () => {
      // Throttle with requestAnimationFrame for iOS Safari performance
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
          "mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6",
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
            sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 320px"
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
              onClick={(event) => handleNavClick(event, link.href)}
              className="nav-underline relative transition hover:text-white after:pointer-events-none after:absolute after:left-1/2 after:-bottom-2 after:h-[2px] after:w-full after:-translate-x-1/2 after:bg-gradient-to-r after:from-transparent after:via-white after:to-transparent after:opacity-0 after:transition after:duration-200 after:ease-out after:content-[''] after:shadow-[0_0_8px_rgba(255,255,255,0.35)] hover:after:opacity-100 after:[mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)] after:[mask-size:100%_100%] after:[mask-repeat:no-repeat] after:[mask-position:center] after:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)] after:[-webkit-mask-size:100%_100%] after:[-webkit-mask-repeat:no-repeat] after:[-webkit-mask-position:center]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/schedule"
            className="cta-button cta-book inline-flex h-11 items-center justify-center rounded-sm border border-[#d4af37] px-4 text-[0.65rem] uppercase tracking-[0.35em] text-white/90 transition hover:border-[#f5e6a8] hover:text-white hover:shadow-[0_0_20px_rgba(212,175,55,0.18)] sm:px-5"
          >
            Start planning
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-white/20 text-white/80 transition hover:border-white/40 hover:text-white md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="border-t border-white/10 bg-black/90 px-4 pb-4 pt-3 backdrop-blur sm:px-6">
          <div className="flex flex-col gap-3 text-xs uppercase tracking-[0.3em] text-white/70">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(event) => {
                  handleNavClick(event, link.href);
                  setMenuOpen(false);
                }}
                className="py-3.5 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

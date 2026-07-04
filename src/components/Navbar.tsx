"use client";

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useLockBodyScroll } from "@/lib/useIOSSafari";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/gallery" },
  { label: "Pricing", href: "/pricing" },
  { label: "Repass", href: "/repass" },
  { label: "Catering", href: "/catering" },
  { label: "About", href: "#about" },
];

const getDesktopNavSnapshot = () =>
  typeof window !== "undefined"
    ? window.matchMedia("(min-width: 768px)").matches
    : false;
const getServerDesktopNavSnapshot = () => false;

function useDesktopNav() {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const mediaQuery = window.matchMedia("(min-width: 768px)");
      mediaQuery.addEventListener("change", onStoreChange);
      return () => mediaQuery.removeEventListener("change", onStoreChange);
    },
    getDesktopNavSnapshot,
    getServerDesktopNavSnapshot
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isDesktopNav = useDesktopNav();
  const isHome = pathname === "/";
  const suppressNavBorder =
    pathname === "/repass" || pathname === "/catering";

  useLockBodyScroll(menuOpen);
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
    if (isDesktopNav) {
      setMenuOpen(false);
    }
  }, [isDesktopNav]);

  const handleCloseMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const showScrollDivider = isScrolled && !suppressNavBorder;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 w-full overflow-hidden",
        "transition-[background-color] duration-300 ease-out motion-reduce:transition-none",
        isScrolled ? "bg-black/70 backdrop-blur-md" : "bg-transparent",
      ].join(" ")}
    >
      {showScrollDivider ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10"
        />
      ) : null}
      <div
        className={[
          "relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6",
          "transition-[padding] duration-300 ease-out motion-reduce:transition-none",
          isHome && isScrolled ? "py-1.5" : "py-2",
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
              "transition-[height] duration-300 ease-out motion-reduce:transition-none",
              isHome && isScrolled ? "h-[46px]" : "h-[60px]",
            ].join(" ")}
          />
        </Link>

        <nav className="hidden items-center gap-8 text-xs uppercase tracking-[0.3em] text-white/70 md:flex md:min-w-0 md:flex-1 md:justify-center md:px-6 lg:absolute lg:left-1/2 lg:top-1/2 lg:w-auto lg:flex-none lg:-translate-x-1/2 lg:-translate-y-1/2 lg:px-0">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(event) => handleNavClick(event, link.href)}
              className={`nav-underline relative transition hover:text-white after:pointer-events-none after:absolute after:left-1/2 after:-bottom-2 after:h-[2px] after:w-full after:-translate-x-1/2 after:bg-gradient-to-r after:from-transparent after:via-white after:to-transparent after:opacity-0 after:transition after:duration-200 after:ease-out after:content-[''] after:shadow-[0_0_8px_rgba(255,255,255,0.35)] hover:after:opacity-100 after:[mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)] after:[mask-size:100%_100%] after:[mask-repeat:no-repeat] after:[mask-position:center] after:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)] after:[-webkit-mask-size:100%_100%] after:[-webkit-mask-repeat:no-repeat] after:[-webkit-mask-position:center] ${link.label === "Home" ? "nav-home-reveal" : ""} ${link.label === "Gallery" ? "nav-gallery-reveal" : ""} ${link.label === "Pricing" ? "nav-pricing-reveal" : ""} ${link.label === "Repass" ? "nav-repass-reveal" : ""} ${link.label === "Catering" ? "nav-catering-reveal" : ""} ${link.label === "About" ? "nav-about-reveal" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/schedule"
            className="nav-cta-reveal cta-button cta-book inline-flex h-11 items-center justify-center rounded-sm border border-[#d4af37] px-4 text-[0.65rem] uppercase tracking-[0.35em] text-white/90 transition hover:border-[#f5e6a8] hover:text-white hover:shadow-[0_0_20px_rgba(212,175,55,0.18)] sm:px-5"
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

      {!isDesktopNav ? (
        <div
          id="mobile-nav"
          className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
            menuOpen
              ? "max-h-[min(26rem,calc(100dvh-5rem-env(safe-area-inset-top)-env(safe-area-inset-bottom)))] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div
            className={`max-h-[inherit] overflow-y-auto overscroll-contain bg-black/90 px-4 pb-4 pb-safe pt-3 backdrop-blur sm:px-6${
              menuOpen ? " border-t border-white/10" : ""
            }`}
          >
            <div className="flex flex-col gap-3 text-xs uppercase tracking-[0.3em] text-white/70">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(event) => {
                    handleNavClick(event, link.href);
                    handleCloseMenu();
                  }}
                  className="py-3.5 transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

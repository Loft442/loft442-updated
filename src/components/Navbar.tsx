"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { getScrollY, useLockBodyScroll } from "@/lib/useIOSSafari";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Gallery", href: "/gallery" },
  { label: "Catering", href: "/catering" },
  { label: "Repass", href: "/repass" },
  { label: "About", href: "#about" },
];

const navRevealClasses = [
  "nav-home-reveal",
  "nav-gallery-reveal",
  "nav-pricing-reveal",
  "nav-repass-reveal",
  "nav-catering-reveal",
  "nav-about-reveal",
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
  const scrollYRef = useRef(0);
  const isDesktopNav = useDesktopNav();
  const isHome = pathname === "/";
  const suppressNavBorder =
    pathname === "/repass" || pathname === "/catering";

  useLockBodyScroll(menuOpen, scrollYRef);
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
      if (menuOpen) {
        ticking = false;
        return;
      }

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
  }, [menuOpen]);

  // Close the mobile menu when the viewport grows to the desktop nav. Adjusting state
  // during render on change avoids an extra effect-driven render pass.
  const [prevIsDesktopNav, setPrevIsDesktopNav] = useState(isDesktopNav);
  if (isDesktopNav !== prevIsDesktopNav) {
    setPrevIsDesktopNav(isDesktopNav);
    if (isDesktopNav) setMenuOpen(false);
  }

  const handleCloseMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const showScrollDivider = isScrolled && !suppressNavBorder && !menuOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full overflow-x-clip isolate pt-safe pl-safe pr-safe [transform:translateZ(0)]">
      {/* The blur layer always exists and only fades, so WebKit never rebuilds the
          header's compositing layer mid-scroll (which let content paint above it). */}
      <div
        aria-hidden
        className={[
          "nav-glass pointer-events-none absolute inset-0 -z-10 backdrop-blur-md",
          "transition-opacity duration-300 ease-out motion-reduce:transition-none",
          menuOpen ? "bg-black/95" : "bg-black/90",
          menuOpen || isScrolled ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
      {showScrollDivider ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10"
        />
      ) : null}
      <div
        className={[
          "relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6",
          "transition-[height] duration-300 ease-out motion-reduce:transition-none",
          isHome && isScrolled ? "h-(--nav-h-compact)" : "h-(--nav-h)",
        ].join(" ")}
      >
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/loft-logo.webp"
            alt="Loft 442 logo"
            width={183}
            height={180}
            sizes="64px"
            preload
            className={[
              "w-auto",
              "transition-[height] duration-300 ease-out motion-reduce:transition-none",
              isHome && isScrolled ? "h-10 md:h-[46px]" : "h-12 md:h-[60px]",
            ].join(" ")}
          />
        </Link>

        <nav className="hidden items-center gap-4 text-[0.7rem] uppercase tracking-[0.16em] lg:gap-8 lg:text-[0.78rem] lg:tracking-[0.24em] text-white/65 md:flex md:min-w-0 md:flex-1 md:justify-center md:px-6 lg:absolute lg:left-1/2 lg:top-1/2 lg:w-auto lg:flex-none lg:-translate-x-1/2 lg:-translate-y-1/2 lg:px-0">
          {navLinks.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(event) => handleNavClick(event, link.href)}
              className={`nav-underline relative transition-colors duration-300 hover:text-[var(--ivory)] after:pointer-events-none after:absolute after:left-0 after:-bottom-2 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100 ${navRevealClasses[index] ?? ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/schedule"
            className={buttonClasses(
              "primary",
              "sm",
              "nav-cta-reveal h-11 px-3.5 tracking-[0.16em] sm:px-5 sm:tracking-[0.24em]"
            )}
          >
            Start Planning
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() =>
              setMenuOpen((prev) => {
                if (!prev) {
                  scrollYRef.current = getScrollY();
                }
                return !prev;
              })
            }
            className="inline-flex h-11 w-11 items-center justify-center border border-white/20 text-white/80 transition hover:border-white/40 hover:text-white md:hidden"
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
              ? "max-h-[min(26rem,calc(100dvh-var(--nav-offset)-env(safe-area-inset-bottom)))] opacity-100"
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
                  className="border-b border-[var(--line)] py-4 transition hover:text-gold-light last:border-b-0"
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

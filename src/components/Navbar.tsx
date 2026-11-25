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
import { Menu, Phone, X } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { getScrollY, useLockBodyScroll } from "@/lib/useIOSSafari";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Gallery", href: "/gallery" },
  { label: "Catering", href: "/catering" },
  { label: "Repass", href: "/repass" },
];

const photoBoothLink = { label: "Photo Booth", href: "/photobooth" };

/** Mobile drawer keeps Photo Booth with the other links (after Catering). */
const mobileNavLinks = [
  ...navLinks.slice(0, 4),
  photoBoothLink,
  ...navLinks.slice(4),
];

const navRevealClasses = [
  "nav-home-reveal",
  "nav-pricing-reveal",
  "nav-gallery-reveal",
  "nav-catering-reveal",
  "nav-repass-reveal",
];

// Must match the `lg:` breakpoint that shows the inline links and hides the menu button.
const DESKTOP_NAV_QUERY = "(min-width: 1024px)";

const getDesktopNavSnapshot = () =>
  typeof window !== "undefined"
    ? window.matchMedia(DESKTOP_NAV_QUERY).matches
    : false;
const getServerDesktopNavSnapshot = () => false;

function useDesktopNav() {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const mediaQuery = window.matchMedia(DESKTOP_NAV_QUERY);
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
    if (!href.startsWith("/#")) {
      return;
    }

    if (pathname !== "/") {
      setMenuOpen(false);
      return;
    }

    const target = document.getElementById(href.slice(2));
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const iconButtonClass =
    "inline-flex h-10 w-10 items-center justify-center border border-white/20 text-white/80 transition hover:border-white/40 hover:text-white min-[380px]:h-11 min-[380px]:w-11";

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

  // Warm common destinations when the mobile menu opens so taps feel instant.
  useEffect(() => {
    if (!menuOpen) return;
    router.prefetch("/schedule");
    router.prefetch("/gallery");
    router.prefetch("/pricing");
  }, [menuOpen, router]);

  const showNavDivider = !suppressNavBorder && !menuOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full print:hidden overflow-x-clip isolate pt-safe pl-safe pr-safe [transform:translateZ(0)]">
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
      {showNavDivider ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gold"
        />
      ) : null}
      <div
        className={[
          "relative mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-3 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr]",
          "transition-[height] duration-300 ease-out motion-reduce:transition-none",
          isHome && isScrolled ? "h-(--nav-h-compact)" : "h-(--nav-h)",
        ].join(" ")}
      >
        <Link href="/" className="flex shrink-0 items-center justify-self-start">
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

        <nav className="hidden items-center justify-center gap-4 text-center text-[0.7rem] uppercase tracking-[0.16em] text-white/65 lg:flex lg:gap-6 lg:text-[0.78rem] lg:tracking-[0.24em] xl:gap-8">
          {navLinks.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(event) => handleNavClick(event, link.href)}
              className={`nav-underline relative whitespace-nowrap text-center transition-colors duration-300 hover:text-[var(--ivory)] after:pointer-events-none after:absolute after:left-0 after:-bottom-2 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100 ${navRevealClasses[index] ?? ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center justify-self-end gap-3 sm:gap-4">
          <Link
            href={photoBoothLink.href}
            className="nav-underline nav-photo-booth nav-last-reveal relative hidden flex-col items-center justify-center text-center text-[0.7rem] uppercase leading-tight tracking-[0.16em] text-gold transition-colors duration-300 after:pointer-events-none after:absolute after:left-0 after:-bottom-2 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 after:content-[''] hover:text-gold-light hover:after:scale-x-100 lg:inline-flex lg:text-[0.78rem] lg:tracking-[0.24em]"
          >
            <span>Photo</span>
            <span>Booth</span>
          </Link>
          <Link
            href="/schedule"
            className={buttonClasses(
              "primary",
              "sm",
              "nav-cta-reveal h-10! min-h-10! px-2 text-[0.56rem] tracking-[0.08em] min-[380px]:h-11! min-[380px]:min-h-11! min-[380px]:px-3.5 min-[380px]:text-[0.7rem] min-[380px]:tracking-[0.16em] sm:px-5 sm:tracking-[0.24em]"
            )}
          >
            Reserve Your Date
          </Link>
          <Link
            href="/#phones"
            aria-label="Call for tours and inquiries"
            onClick={(event) => handleNavClick(event, "/#phones")}
            className={iconButtonClass}
          >
            <Phone className="h-5 w-5" />
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
            className={`${iconButtonClass} lg:hidden`}
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
              ? "max-h-[min(34rem,calc(100dvh-var(--nav-offset)-env(safe-area-inset-bottom)))] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div
            className={`max-h-[inherit] overflow-y-auto overscroll-contain bg-black px-4 pb-5 pb-safe pt-3 sm:px-6${
              menuOpen ? " border-t border-white/10" : ""
            }`}
          >
            <div className="flex flex-col items-center gap-3 text-center text-xs uppercase tracking-[0.3em] text-white/70">
              {mobileNavLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(event) => {
                    handleNavClick(event, link.href);
                    handleCloseMenu();
                  }}
                  className={`tap w-full border-b border-[var(--line)] py-3.5 text-center transition hover:text-gold-light last:border-b-0${
                    link.href === "/photobooth" ? " nav-photo-booth text-gold" : ""
                  }`}
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

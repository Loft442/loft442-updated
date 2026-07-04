"use client";

import Image from "next/image";
import MagnifierImage from "@/components/MagnifierImage";
import { Eye, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { getImageFileName, saveImageFile } from "@/lib/saveImage";
import { getScrollY, useLockBodyScroll } from "@/lib/useIOSSafari";

const subscribe = () => () => {};
const getIsBrowser = () => typeof window !== "undefined";
const getServerSnapshot = () => false;

const MODAL_MAX_WIDTH = 1280;

function getSafeAreaInsets() {
  const style = getComputedStyle(document.documentElement);
  return {
    top: parseFloat(style.getPropertyValue("--safe-area-inset-top")) || 0,
    right: parseFloat(style.getPropertyValue("--safe-area-inset-right")) || 0,
    bottom: parseFloat(style.getPropertyValue("--safe-area-inset-bottom")) || 0,
    left: parseFloat(style.getPropertyValue("--safe-area-inset-left")) || 0,
  };
}

type FlyerViewerProps = {
  src: string;
  alt: string;
  pdfHref: string;
  aspectClassName: string;
  thumbnailClassName?: string;
  fillHeight?: boolean;
  compactFillHeight?: boolean;
  thumbnailLayout?: "height" | "width";
  centerDownload?: boolean;
  imageFileName?: string;
};

export default function FlyerViewer({
  src,
  alt,
  pdfHref,
  aspectClassName,
  thumbnailClassName,
  fillHeight = false,
  compactFillHeight = false,
  thumbnailLayout = "height",
  centerDownload = false,
  imageFileName,
}: FlyerViewerProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const scrollYRef = useRef(0);
  const modalShellRef = useRef<HTMLDivElement>(null);
  const isBrowser = useSyncExternalStore(
    subscribe,
    getIsBrowser,
    getServerSnapshot
  );

  useLockBodyScroll(open, scrollYRef.current);

  const handleOpen = useCallback(() => {
    scrollYRef.current = getScrollY();
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const resolvedImageFileName = getImageFileName(src, imageFileName);

  const handleSaveImage = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await saveImageFile(src, resolvedImageFileName);
    } catch (error) {
      console.error("Failed to save image:", error);
      window.open(src, "_blank", "noopener,noreferrer");
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, resolvedImageFileName, src]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  useLayoutEffect(() => {
    if (!open) return;

    const syncModalSize = () => {
      const shell = modalShellRef.current;
      const viewport = window.visualViewport;
      if (!shell || !viewport) return;

      const safeArea = getSafeAreaInsets();
      const isSm = window.matchMedia("(min-width: 640px)").matches;
      const isDesktopMagnifier = window.matchMedia(
        "(min-width: 768px) and (hover: hover) and (pointer: fine)"
      ).matches;
      const overlayPadY = isSm ? 48 : 32;
      const overlayPadX = isSm ? 48 : 32;
      const maxWidth = Math.min(viewport.width * 0.96, MODAL_MAX_WIDTH);
      const height = Math.max(
        200,
        viewport.height - overlayPadY - safeArea.top - safeArea.bottom
      );

      shell.style.maxWidth = `${maxWidth}px`;
      shell.style.height = `${height}px`;
      shell.style.maxHeight = `${height}px`;

      if (isDesktopMagnifier) {
        shell.style.width = "";
      } else {
        shell.style.width = `${Math.min(
          viewport.width - overlayPadX - safeArea.left - safeArea.right,
          maxWidth
        )}px`;
      }
    };

    syncModalSize();

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", syncModalSize);
    window.addEventListener("resize", syncModalSize);

    return () => {
      viewport?.removeEventListener("resize", syncModalSize);
      window.removeEventListener("resize", syncModalSize);

      const shell = modalShellRef.current;
      if (shell) {
        shell.style.width = "";
        shell.style.maxWidth = "";
        shell.style.height = "";
        shell.style.maxHeight = "";
      }
    };
  }, [open]);

  const thumbnailBaseClass =
    "group relative block w-full bg-transparent text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40";
  const thumbnailDefaultClass = thumbnailClassName ?? "mx-auto max-w-md";
  const thumbnailFillClass = fillHeight
    ? compactFillHeight
      ? "md:flex md:flex-none md:items-center md:justify-center"
      : "md:flex md:min-h-0 md:flex-1 md:items-center md:justify-center"
    : "mt-6";
  const thumbnailClasses = [
    thumbnailBaseClass,
    thumbnailDefaultClass,
    thumbnailFillClass,
  ]
    .filter(Boolean)
    .join(" ");

  const imageContainerClass = fillHeight
    ? compactFillHeight
      ? `relative w-full overflow-hidden rounded-sm border border-white/10 ${aspectClassName}`
      : thumbnailLayout === "width"
      ? `relative w-full overflow-hidden rounded-sm border border-white/10 ${aspectClassName} md:h-auto md:max-h-full md:w-full`
      : `relative w-full overflow-hidden rounded-sm border border-white/10 ${aspectClassName} md:h-full md:max-h-full md:w-auto md:max-w-full`
    : `relative w-full overflow-hidden rounded-sm border border-white/10 ${aspectClassName}`;

  const imageSizes = fillHeight
    ? thumbnailLayout === "width"
      ? "(max-width: 768px) 85vw, (max-width: 1024px) 480px, 640px"
      : "(max-width: 768px) 85vw, (max-width: 1024px) 416px, 560px"
    : "(max-width: 768px) 85vw, 448px";

  const thumbnailButton = (
    <button
      type="button"
      aria-label={`View fullscreen: ${alt}`}
      onClick={handleOpen}
      onMouseDown={(event) => event.preventDefault()}
      className={thumbnailClasses}
    >
      <div className={imageContainerClass}>
        <Image
          src={src}
          alt={alt}
          fill
          priority
          quality={90}
          sizes={imageSizes}
          className="object-contain object-center"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-transparent transition duration-300 ease-out group-hover:bg-black/40">
          <span className="flex items-center gap-2 rounded-sm border border-white/40 bg-black/50 px-4 py-2 text-[0.6rem] uppercase tracking-[0.35em] text-white opacity-0 transition duration-300 ease-out group-hover:opacity-100">
            <Eye className="h-3.5 w-3.5" />
            View
          </span>
        </div>
      </div>
    </button>
  );

  const actionButtonClass =
    "inline-flex h-11 w-full items-center justify-center rounded-sm border border-[#d4af37] px-6 text-[0.65rem] uppercase tracking-[0.35em] text-white transition duration-300 hover:border-[#f5e6a8] hover:bg-[#d4af37]/15 hover:text-white hover:shadow-[0_0_24px_rgba(212,175,55,0.3)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto";

  const downloadLink = (
    <a
      href={pdfHref}
      target="_blank"
      rel="noopener noreferrer"
      className={`${actionButtonClass} hidden md:inline-flex`}
    >
      Download
    </a>
  );

  const saveImageButton = (
    <button
      type="button"
      onClick={handleSaveImage}
      disabled={isSaving}
      className={`${actionButtonClass} md:hidden`}
    >
      {isSaving ? "Saving..." : "Save image"}
    </button>
  );

  const actionButtons = (
    <div
      className={`mt-6 flex flex-wrap gap-3${fillHeight ? " shrink-0" : ""}${centerDownload ? " justify-center" : ""}`}
    >
      {saveImageButton}
      {downloadLink}
    </div>
  );

  return (
    <>
      {fillHeight ? (
        <div
          className={`mt-5 flex min-h-0 flex-col md:mt-6 md:flex-1${compactFillHeight ? " md:items-center md:justify-center" : ""}`}
        >
          {thumbnailButton}
          {actionButtons}
        </div>
      ) : (
        <>
          {thumbnailButton}
          {actionButtons}
        </>
      )}

      {open && isBrowser
        ? createPortal(
            <div
              className="fixed inset-0 z-[60] grid place-items-center overscroll-contain bg-black/85 p-4 pt-safe pb-safe pl-safe pr-safe backdrop-blur-sm sm:p-6"
              onClick={handleClose}
            >
              <div
                ref={modalShellRef}
                className="relative flex min-h-0 max-w-[1280px] flex-col rounded-sm border border-white/10 bg-black/60 p-[clamp(8px,1.5svh,20px)] shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur md:w-fit md:max-w-full"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="relative flex min-h-0 flex-1 flex-col rounded-2xl bg-black/40 p-[clamp(6px,1svh,16px)]">
                  <div className="relative min-h-0 flex-1 overflow-hidden">
                    <MagnifierImage
                      src={src}
                      alt={alt}
                      paneAside={downloadLink}
                    />
                  </div>
                  <div className="mt-4 flex shrink-0 justify-center md:hidden">
                    {saveImageButton}
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close flyer viewer"
                    className="min-tap-target absolute right-3 top-3 z-30 rounded-sm border border-white/20 bg-black/60 p-3 text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Instagram,
  Layers,
  Play,
  X,
} from "lucide-react";
import { getScrollY, useLockBodyScroll } from "@/lib/useIOSSafari";
import type { InstagramMedia, InstagramPost } from "@/lib/instagram";

type Position = { post: number; slide: number };

const NAV_BUTTON =
  "min-tap-target absolute top-1/2 z-20 -translate-y-1/2 rounded-sm border border-white/20 bg-black/60 p-3 text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 sm:p-4";

function postLabel(post: InstagramPost) {
  return post.isReel ? "Reel" : post.mediaType === "CAROUSEL_ALBUM" ? "Album" : "Post";
}

function isInstagramOnly(media: InstagramMedia) {
  return Boolean(media.requiresInstagram);
}

function PostTile({ post, onOpen }: { post: InstagramPost; onOpen: () => void }) {
  const caption = post.caption.trim();
  const label = postLabel(post);
  const alt = caption ? caption.slice(0, 120) : `Loft 442 Instagram ${label.toLowerCase()}`;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`View ${label.toLowerCase()}`}
      className="group relative block aspect-square w-full overflow-hidden rounded-sm border border-white/10 bg-white/5 text-left transition-colors hover:border-[#d4af37]/50 focus-visible:border-[#d4af37] focus-visible:outline-none"
    >
      {post.imageUrl ? (
        <Image
          src={post.imageUrl}
          alt={alt}
          fill
          sizes="(max-width: 640px) 33vw, 360px"
          className="object-cover transition duration-500 ease-out group-hover:scale-105"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center">
          <Instagram className="h-6 w-6 text-white/50" aria-hidden="true" />
        </span>
      )}

      {post.isReel ? (
        <Clapperboard
          className="absolute right-2 top-2 h-4 w-4 text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.8))]"
          aria-hidden="true"
        />
      ) : post.mediaType === "CAROUSEL_ALBUM" ? (
        <Layers
          className="absolute right-2 top-2 h-4 w-4 text-white [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.8))]"
          aria-hidden="true"
        />
      ) : null}

      {caption && (
        <div className="pointer-events-none absolute inset-0 hidden items-end bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:flex">
          <p className="line-clamp-3 text-xs leading-relaxed text-white/90">{caption}</p>
        </div>
      )}
    </button>
  );
}

function PlayOnInstagram({
  permalink,
  posterUrl,
  caption,
}: {
  permalink: string;
  posterUrl: string;
  caption: string;
}) {
  return (
    <div className="relative flex h-[min(72svh,72vh)] w-full items-center justify-center bg-black">
      {posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={posterUrl}
          alt={caption.slice(0, 120) || "Loft 442 Instagram video"}
          referrerPolicy="no-referrer"
          className="h-full w-full object-contain opacity-70"
        />
      ) : null}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 p-6 text-center">
        <p className="max-w-xs text-sm leading-relaxed text-white/80">
          This video can only be played on Instagram.
        </p>
        <a
          href={permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button cta-book inline-flex h-11 items-center justify-center gap-2 rounded-sm px-5 text-[0.65rem] uppercase tracking-[0.16em] text-black transition hover:opacity-90 sm:px-6 sm:tracking-[0.28em]"
        >
          <Play className="h-4 w-4" aria-hidden="true" />
          Play on Instagram
        </a>
      </div>
    </div>
  );
}

export default function InstagramGrid({ posts }: { posts: InstagramPost[] }) {
  const [position, setPosition] = useState<Position | null>(null);
  const touchStartX = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const scrollYRef = useRef(0);

  useLockBodyScroll(position !== null, scrollYRef);

  const open = useCallback((post: number) => {
    openerRef.current = document.activeElement as HTMLElement | null;
    scrollYRef.current = getScrollY();
    setPosition({ post, slide: 0 });
  }, []);

  const close = useCallback(() => {
    setPosition(null);
    openerRef.current?.focus({ preventScroll: true });
  }, []);

  const step = useCallback(
    (direction: 1 | -1) => {
      setPosition((current) => {
        if (!current) return current;
        const slideCount = posts[current.post].media.length;
        const slide = current.slide + direction;
        if (slide >= 0 && slide < slideCount) return { post: current.post, slide };

        const post = (current.post + direction + posts.length) % posts.length;
        return { post, slide: direction === 1 ? 0 : posts[post].media.length - 1 };
      });
    },
    [posts],
  );

  const isOpen = position !== null;

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close, step]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const target = event.target;
    if (
      target instanceof HTMLVideoElement ||
      (target instanceof Element && target.closest("video, a"))
    ) {
      return;
    }
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - (event.changedTouches[0]?.clientX ?? touchStartX.current);
    if (Math.abs(delta) > 50) step(delta > 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const activePost = position ? posts[position.post] : null;
  const activeMedia = activePost && position ? activePost.media[position.slide] : null;
  const canStep = posts.length > 1 || (activePost?.media.length ?? 0) > 1;

  return (
    <>
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
        {posts.map((post, index) => (
          <PostTile key={post.id} post={post} onOpen={() => open(index)} />
        ))}
      </div>

      {typeof document !== "undefined" && activePost && activeMedia && position
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Instagram ${postLabel(activePost).toLowerCase()}`}
              className="fixed inset-0 z-50 grid place-items-center overscroll-contain bg-black/85 p-4 pt-safe pb-safe pl-safe pr-safe backdrop-blur-sm sm:p-6"
              onClick={close}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="relative flex max-h-full w-full max-w-[900px] flex-col overflow-y-auto rounded-sm border border-white/10 bg-black/60 p-[clamp(8px,1.5svh,20px)] shadow-[0_30px_90px_rgba(0,0,0,0.7)] backdrop-blur [-webkit-overflow-scrolling:touch]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="relative flex min-h-0 items-center justify-center overflow-hidden rounded-2xl bg-black/40">
                  {isInstagramOnly(activeMedia) || !activeMedia.url ? (
                    <PlayOnInstagram
                      permalink={activePost.permalink}
                      posterUrl={activeMedia.url}
                      caption={activePost.caption.trim()}
                    />
                  ) : activeMedia.type === "VIDEO" ? (
                    <video
                      key={activeMedia.url}
                      src={activeMedia.url}
                      poster={activeMedia.posterUrl ?? undefined}
                      controls
                      autoPlay
                      muted
                      playsInline
                      preload="metadata"
                      className="h-auto max-h-[min(72svh,72vh)] w-full bg-black object-contain"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={activeMedia.url}
                      src={activeMedia.url}
                      alt={activePost.caption.trim().slice(0, 120) || "Loft 442 Instagram post"}
                      referrerPolicy="no-referrer"
                      className="h-auto max-h-[min(72svh,72vh)] w-full object-contain"
                    />
                  )}

                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={close}
                    aria-label="Close"
                    className="min-tap-target absolute right-3 top-3 z-20 rounded-sm border border-white/20 bg-black/60 p-3 text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  {canStep ? (
                    <>
                      <button
                        type="button"
                        onClick={() => step(-1)}
                        aria-label="Previous"
                        className={`${NAV_BUTTON} left-3 hidden sm:block`}
                      >
                        <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
                      </button>
                      <button
                        type="button"
                        onClick={() => step(1)}
                        aria-label="Next"
                        className={`${NAV_BUTTON} right-3 hidden sm:block`}
                      >
                        <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
                      </button>
                    </>
                  ) : null}

                  {activePost.media.length > 1 ? (
                    <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                      {activePost.media.map((media, index) => (
                        <span
                          key={`${media.url}-${index}`}
                          className={`h-1.5 w-1.5 rounded-full ${
                            index === position.slide ? "bg-white" : "bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>

                {canStep ? (
                  <div className="mt-3 flex items-center justify-between sm:hidden">
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      className="min-tap-target inline-flex items-center gap-1 rounded-sm border border-white/20 bg-black/60 px-3 text-[0.6rem] uppercase tracking-[0.2em] text-white/80"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      className="min-tap-target inline-flex items-center gap-1 rounded-sm border border-white/20 bg-black/60 px-3 text-[0.6rem] uppercase tracking-[0.2em] text-white/80"
                    >
                      Next
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                ) : null}

                <div className="mt-[clamp(8px,1svh,16px)] flex shrink-0 flex-wrap items-center justify-between gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/60">
                  <span>
                    {position.post + 1} / {posts.length}
                  </span>
                  <a
                    href={activePost.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 transition hover:text-white"
                  >
                    <Instagram className="h-3.5 w-3.5" aria-hidden="true" />
                    View on Instagram
                  </a>
                </div>

                {activePost.caption.trim() ? (
                  <p className="mt-[clamp(4px,0.5svh,8px)] line-clamp-4 max-w-full shrink-0 whitespace-pre-line text-sm text-white/70">
                    {activePost.caption.trim()}
                  </p>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

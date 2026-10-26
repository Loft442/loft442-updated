"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Clapperboard, Instagram, Layers } from "lucide-react";
import { getScrollY, useLockBodyScroll } from "@/lib/useIOSSafari";
import type { InstagramPost } from "@/lib/instagram";
import { postLabel, type Position } from "@/components/instagramPost";

const InstagramModal = dynamic(() => import("@/components/InstagramModal"), {
  ssr: false,
});
const preloadModal = () => {
  void import("@/components/InstagramModal");
};

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

export default function InstagramGrid({ posts }: { posts: InstagramPost[] }) {
  const [position, setPosition] = useState<Position | null>(null);
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

  return (
    <>
      <div
        className="grid grid-cols-3 gap-1.5 sm:gap-3"
        onPointerOver={preloadModal}
        onTouchStart={preloadModal}
        onFocus={preloadModal}
      >
        {posts.map((post, index) => (
          <PostTile key={post.id} post={post} onOpen={() => open(index)} />
        ))}
      </div>

      {position ? (
        <InstagramModal posts={posts} position={position} close={close} step={step} />
      ) : null}
    </>
  );
}

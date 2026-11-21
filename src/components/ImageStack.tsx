"use client";

import Image from "next/image";
import { useState } from "react";

type StackImage = { src: string; alt: string };

type ImageStackProps = {
  images: [StackImage, StackImage];
  sizes: string;
  className?: string;
  /** Prioritize the front image (above-the-fold stacks on mobile). */
  priority?: boolean;
};

// Two photos stacked like prints: the second peeks out behind the first, and a tap
// swaps which one is in front.
export default function ImageStack({
  images,
  sizes,
  className = "",
  priority = false,
}: ImageStackProps) {
  const [frontIndex, setFrontIndex] = useState(0);
  const front = images[frontIndex];

  return (
    <button
      type="button"
      onClick={() => setFrontIndex((index) => (index === 0 ? 1 : 0))}
      aria-label={`${front.alt}. Show the other photo`}
      className={`image-stack group relative block w-full cursor-pointer overflow-visible text-left focus-visible:outline-none ${className}`}
    >
      {images.map((image, index) => {
        const isFront = index === frontIndex;
        return (
          <span
            key={image.src}
            aria-hidden={!isFront}
            className={[
              "image-stack__frame absolute left-0 top-0 block h-[94%] w-[94%] origin-center overflow-hidden",
              isFront ? "image-stack__frame--front z-[2]" : "image-stack__frame--back z-[1]",
            ].join(" ")}
          >
            <Image
              src={image.src}
              alt={isFront ? image.alt : ""}
              fill
              sizes={sizes}
              quality={70}
              {...(priority && isFront
                ? { priority: true }
                : { loading: "lazy" as const })}
              className="object-cover"
            />
            <span className="frame-line pointer-events-none absolute inset-4" aria-hidden="true" />
          </span>
        );
      })}
      <span
        className="pointer-events-none absolute bottom-[calc(6%+1.75rem)] left-7 z-[3] flex gap-1.5"
        aria-hidden="true"
      >
        {images.map((image, index) => (
          <span
            key={image.src}
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
              index === frontIndex ? "bg-gold" : "bg-white/40"
            }`}
          />
        ))}
      </span>
      <span
        className="pointer-events-none absolute inset-0 z-[3] h-[94%] w-[94%] ring-1 ring-inset ring-gold/0 transition group-focus-visible:ring-gold/70"
        aria-hidden="true"
      />
    </button>
  );
}

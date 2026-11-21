"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export type BoothPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Shown under the enlarged photo. */
  caption: string;
  title: string;
  subtitle?: string;
  objectPosition?: string;
  /** Backing colour behind template previews. */
  mat?: string;
};

type Variant = "gallery" | "setup" | "template";

const gridClass: Record<Variant, string> = {
  gallery: "grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4 md:gap-6",
  setup: "grid gap-6 md:grid-cols-[1.25fr_1fr_1fr]",
  template: "grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-4 md:gap-6",
};

const frameClass: Record<Variant, string> = {
  gallery: "aspect-[3/4] border border-gold/25 bg-black p-1.5",
  setup: "h-[clamp(14rem,28vw,26rem)] border border-gold/25 bg-black p-1.5",
  template: "aspect-[4/5] p-[clamp(10px,1.65vw,25px)]",
};

const sizes: Record<Variant, string> = {
  gallery: "(min-width: 768px) 25vw, 50vw",
  setup: "(min-width: 768px) 35vw, 100vw",
  template: "(min-width: 768px) 25vw, 50vw",
};

export default function PhotoGrid({ photos, variant }: { photos: BoothPhoto[]; variant: Variant }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<BoothPhoto | null>(null);

  const open = (photo: BoothPhoto) => {
    setActive(photo);
    dialogRef.current?.showModal();
  };

  return (
    <>
      <div className={gridClass[variant]}>
        {photos.map((photo) => (
          <figure key={photo.src} className="min-w-0">
            <button
              type="button"
              onClick={() => open(photo)}
              aria-label={`Enlarge: ${photo.caption}`}
              className={`group relative block w-full cursor-zoom-in overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/60 ${frameClass[variant]}`}
              style={photo.mat ? { background: photo.mat } : undefined}
            >
              <span className="relative block h-full w-full">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes={sizes[variant]}
                  className={`transition-[filter] duration-200 md:group-hover:brightness-[0.86] ${
                    variant === "template" ? "object-contain drop-shadow-[0_5px_9px_rgba(0,0,0,0.35)]" : "object-cover"
                  }`}
                  style={photo.objectPosition ? { objectPosition: photo.objectPosition } : undefined}
                />
              </span>
              <span
                aria-hidden="true"
                className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-black/85 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                +
              </span>
            </button>
            <figcaption className="mt-3">
              <span className="block font-serif text-[clamp(0.95rem,1.6vw,1.25rem)] leading-snug text-[var(--ivory)]">
                {photo.title}
              </span>
              {photo.subtitle ? <span className="mt-0.5 block text-sm text-white/55">{photo.subtitle}</span> : null}
            </figcaption>
          </figure>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={active?.caption ?? "Enlarged photo"}
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="booth-dialog m-auto max-h-[92vh] max-w-[92vw] bg-transparent p-0 text-white backdrop:bg-black/90"
      >
        {active ? (
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close photo"
              className="self-end px-2 text-3xl leading-none text-white/80 hover:text-white"
            >
              ×
            </button>
            <Image
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              sizes="92vw"
              className="h-auto max-h-[78vh] w-auto max-w-full object-contain"
            />
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-white/70">{active.caption}</p>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

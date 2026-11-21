"use client";

import Image from "next/image";
import { useRef } from "react";

export default function FilmPlayer() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = () => {
    dialogRef.current?.showModal();
    videoRef.current?.play().catch(() => {
      // The native controls stay available when the browser blocks autoplay.
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={play}
        aria-label="Play the Salsa 2 product film"
        className="group relative block aspect-[16/8.5] w-full overflow-hidden border border-gold/40 bg-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/60"
      >
        <Image
          src="/images/photo-booth/film.webp"
          alt=""
          fill
          sizes="(min-width: 768px) 55vw, 100vw"
          className="object-cover opacity-80 transition-opacity duration-200 md:group-hover:opacity-100"
        />
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold-light/70 bg-black/40"
        >
          <span className="ml-1 h-0 w-0 border-y-[11px] border-l-[18px] border-y-transparent border-l-[var(--gold-light)]" />
        </span>
        <span className="absolute bottom-4 left-5 text-[0.7rem] font-normal uppercase tracking-[0.3em] text-white">
          Play Film
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Official Salsa 2 product film"
        onClose={() => videoRef.current?.pause()}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="booth-dialog m-auto w-[min(92vw,1100px)] bg-transparent p-0 text-white backdrop:bg-black/90"
      >
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close film"
            className="self-end px-2 text-3xl leading-none text-white/80 hover:text-white"
          >
            ×
          </button>
          <video
            ref={videoRef}
            controls
            playsInline
            preload="none"
            poster="/images/photo-booth/film.webp"
            className="w-full bg-black"
          >
            <source src="/images/photo-booth/salsa-film.mp4" type="video/mp4" />
          </video>
          <p className="text-sm text-white/60">A visual showcase of the Salsa 2 photo booth by Photobooth Supply Co.</p>
        </div>
      </dialog>
    </>
  );
}

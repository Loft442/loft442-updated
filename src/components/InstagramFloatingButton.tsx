"use client";

import { Instagram } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/loft.442/";

export default function InstagramFloatingButton() {
  return (
    <div
      className="fixed bottom-4 left-4 z-[9999] sm:bottom-5"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
      }}
    >
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow Loft 442 on Instagram"
        className="group relative inline-flex items-center rounded-sm p-[1px] shadow-lg shadow-black/30 transition duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(245,230,168,0.7), rgba(212,175,55,0.6), rgba(184,150,46,0.7))",
        }}
      >
        <span className="relative z-10 inline-flex items-center gap-2 rounded-sm bg-black px-3 py-2 text-xs uppercase tracking-[0.25em] text-white transition duration-200 ease-out group-hover:bg-black/90 sm:px-4 sm:py-2.5 [text-shadow:0_0_12px_rgba(255,255,255,0.45)]">
          <Instagram
            className="h-4 w-4 text-[#dd2a7b] [filter:drop-shadow(0_0_6px_rgba(245,133,41,0.35))_drop-shadow(0_0_8px_rgba(81,91,212,0.3))]"
            aria-hidden="true"
          />
          <span className="hidden sm:inline">Follow us!</span>
        </span>
      </a>
    </div>
  );
}

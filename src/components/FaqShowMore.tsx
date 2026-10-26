"use client";

import { useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type FaqShowMoreProps = {
  primary: ReactNode;
  children: ReactNode;
};

// The only interactive part of the FAQ: reveals the extra questions. The questions
// themselves are server-rendered <details> passed in as children.
export default function FaqShowMore({ primary, children }: FaqShowMoreProps) {
  const [showAll, setShowAll] = useState(false);
  const extraRef = useRef<HTMLDivElement>(null);

  const handleToggleShowAll = () => {
    if (showAll) {
      extraRef.current
        ?.querySelectorAll<HTMLDetailsElement>("details[open]")
        .forEach((details) => {
          details.open = false;
        });
    }
    setShowAll(!showAll);
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {primary}

        <div
          ref={extraRef}
          aria-hidden={!showAll}
          inert={!showAll}
          className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
            showAll ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 flex flex-col gap-3">{children}</div>
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={handleToggleShowAll}
          aria-expanded={showAll}
          className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/5 px-5 py-3 text-[0.65rem] uppercase tracking-[0.35em] text-white/80 transition-[border-color,background-color,color,box-shadow,transform,opacity] duration-300 ease-out motion-reduce:transition-none hover:-translate-y-px hover:border-[#d4af37]/50 hover:bg-white/10 hover:text-white hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
        >
          <span
            className={`transition-opacity duration-300 motion-reduce:transition-none ${
              showAll ? "opacity-100" : "opacity-90"
            }`}
          >
            {showAll ? "View less" : "View more"}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ease-out motion-reduce:transition-none ${
              showAll ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </>
  );
}

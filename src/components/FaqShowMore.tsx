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
      <div className="flex flex-col">
        {primary}

        <div
          ref={extraRef}
          aria-hidden={!showAll}
          inert={!showAll}
          className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
            showAll ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 flex flex-col">{children}</div>
        </div>
      </div>
      <div className="mt-10 flex justify-start">
        <button
          type="button"
          onClick={handleToggleShowAll}
          aria-expanded={showAll}
          className="inline-flex items-center gap-2 border border-[var(--line-strong)] px-6 py-3 text-[0.7rem] uppercase tracking-[0.3em] text-white/75 transition-colors duration-300 ease-out motion-reduce:transition-none hover:border-gold hover:text-gold-light"
        >
          <span
            className={`transition-opacity duration-300 motion-reduce:transition-none ${
              showAll ? "opacity-100" : "opacity-90"
            }`}
          >
            {showAll ? "Fewer questions" : "More questions"}
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

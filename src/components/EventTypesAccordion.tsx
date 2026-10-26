"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { preload } from "react-dom";

export type EventTypeEntry = {
  key: string;
  panelId: string;
  triggerId: string;
  preload: { src: string; srcSet?: string; sizes?: string };
  label: ReactNode;
  chevron: ReactNode;
  body: ReactNode;
};

const PANEL_TRANSITION =
  "overflow-hidden transition-[max-height,opacity,transform] duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]";
const PANEL_CARD =
  "grid gap-6 rounded-sm border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:grid-cols-2";

// Open/close state for EventTypes. Every label, icon and panel body arrives as
// server-rendered markup; this only decides which panel is mounted and animated.
export default function EventTypesAccordion({ entries }: { entries: EventTypeEntry[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [renderKey, setRenderKey] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Open a panel - called from event handler
  const handleOpenPanel = useCallback((key: string) => {
    // Clear any pending close timer
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenKey(key);
    setRenderKey(key);
    requestAnimationFrame(() => setIsPanelOpen(true));
  }, []);

  // Close the panel - called from event handler
  const handleClosePanel = useCallback(() => {
    setOpenKey(null);
    setIsPanelOpen(false);
    closeTimerRef.current = setTimeout(() => {
      setRenderKey(null);
      closeTimerRef.current = null;
    }, 500);
  }, []);

  // Toggle panel
  const handleTogglePanel = useCallback((key: string) => {
    if (openKey === key) {
      handleClosePanel();
    } else {
      handleOpenPanel(key);
    }
  }, [openKey, handleOpenPanel, handleClosePanel]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const preloadImage = (entry: EventTypeEntry) => {
    preload(entry.preload.src, {
      as: "image",
      imageSrcSet: entry.preload.srcSet,
      imageSizes: entry.preload.sizes,
    });
  };

  const renderEntry = renderKey ? entries.find((entry) => entry.key === renderKey) : null;
  const panelState = isPanelOpen
    ? "max-h-[900px] translate-y-0 opacity-100"
    : "max-h-0 -translate-y-1 opacity-0";

  return (
    <>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-6 lg:gap-2 xl:gap-3">
        {entries.map((entry) => (
          <div key={entry.key} className="flex flex-col">
            <button
              type="button"
              aria-expanded={openKey === entry.key}
              aria-controls={`${entry.panelId} ${entry.panelId}-mobile`}
              id={entry.triggerId}
              onPointerEnter={() => preloadImage(entry)}
              onFocus={() => preloadImage(entry)}
              onClick={() => handleTogglePanel(entry.key)}
              className="overview-button about-card-outline group relative flex min-h-11 min-w-0 items-center justify-between gap-1.5 rounded-md px-2.5 py-3 text-left shadow-[0_16px_48px_rgba(0,0,0,0.4)] transition sm:min-h-12 sm:gap-2 sm:px-3 lg:gap-1.5 lg:px-2 lg:py-2.5 xl:gap-2 xl:px-3"
            >
              {entry.label}
              {entry.chevron}
            </button>
            {renderKey === entry.key ? (
              <div
                className={`mt-4 md:hidden ${PANEL_TRANSITION} ${panelState}`}
                aria-hidden={!isPanelOpen}
              >
                <div
                  id={`${entry.panelId}-mobile`}
                  role="region"
                  aria-labelledby={entry.triggerId}
                  className={PANEL_CARD}
                >
                  {entry.body}
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {renderEntry ? (
        <div
          className={`mt-6 hidden md:block ${PANEL_TRANSITION} ${panelState}`}
          aria-hidden={!isPanelOpen}
        >
          <div
            id={renderEntry.panelId}
            role="region"
            aria-labelledby={renderEntry.triggerId}
            className={PANEL_CARD}
          >
            {renderEntry.body}
          </div>
        </div>
      ) : null}
    </>
  );
}

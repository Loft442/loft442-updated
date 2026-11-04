"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export type EventTypeEntry = {
  key: string;
  panelId: string;
  triggerId: string;
  label: ReactNode;
  chevron: ReactNode;
  body: ReactNode;
};

const PANEL_TRANSITION =
  "overflow-hidden transition-[max-height,opacity,transform] duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]";
// Spans both mobile grid columns so the open panel is full width, not squeezed into one cell.
const MOBILE_PANEL = "mt-2 md:hidden";
const PANEL_CARD = "border border-[var(--line)] bg-white/[0.02] p-7 sm:p-10";

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

  const renderEntry = renderKey ? entries.find((entry) => entry.key === renderKey) : null;
  const panelState = isPanelOpen
    ? "max-h-[900px] translate-y-0 opacity-100"
    : "max-h-0 -translate-y-1 opacity-0";

  return (
    <>
      {/* On mobile each entry's wrapper dissolves (`contents`) so its panel becomes its own
          full-width grid row; dense flow keeps the button pairs together above it. */}
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-2">
        {entries.map((entry) => (
          <div key={entry.key} className="contents md:flex md:flex-col">
            <button
              type="button"
              aria-expanded={openKey === entry.key}
              aria-controls={`${entry.panelId} ${entry.panelId}-mobile`}
              id={entry.triggerId}
              onClick={() => handleTogglePanel(entry.key)}
              className="about-card-outline group relative flex min-h-16 min-w-0 items-center justify-between gap-3 px-5 py-4 text-left transition"
            >
              {entry.label}
              {entry.chevron}
            </button>
            {renderKey === entry.key ? (
              <div
                className={`${MOBILE_PANEL} ${PANEL_TRANSITION} ${panelState}`}
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
          className={`mx-auto mt-6 hidden max-w-4xl md:block ${PANEL_TRANSITION} ${panelState}`}
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

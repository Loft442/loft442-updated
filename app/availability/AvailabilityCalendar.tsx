"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";

const calendarClassNames = {
  root: "w-full font-[var(--font-inter)] text-white/80",
  months: "flex w-full flex-col gap-6",
  month: "w-full space-y-4",
  caption: "flex items-center justify-between gap-4",
  caption_label:
    "font-[var(--font-playfair)] text-sm uppercase tracking-[0.35em] text-white/80",
  nav: "flex items-center gap-2",
  nav_button:
    "h-9 w-9 rounded-full border border-white/20 bg-black/60 text-white/70 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-200/60 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none",
  table: "w-full border-separate border-spacing-2",
  head_cell:
    "text-center text-[0.6rem] uppercase tracking-[0.3em] text-white/50",
  cell: "text-center",
  day: "relative mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-[0.7rem] uppercase tracking-[0.2em] text-white/80 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-200/60 motion-reduce:transition-none",
  day_selected:
    "border border-amber-200/70 bg-amber-500/10 text-amber-100 shadow-[0_0_16px_rgba(200,162,74,0.35)] ring-1 ring-amber-200/60",
  day_today: "border border-white/40 text-white",
  day_outside: "text-white/25",
  day_disabled: "cursor-not-allowed text-white/30 opacity-50",
};

export default function AvailabilityCalendar() {
  const [selected, setSelected] = useState<Date | undefined>();

  return (
    <div className="availability-calendar w-full">
      <div className="text-spotlight rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur sm:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                Availability Calendar
              </p>
              <h2 className="font-[var(--font-playfair)] text-2xl text-white sm:text-3xl">
                Select an open date
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[0.6rem] uppercase tracking-[0.35em] text-white/60">
              <span className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-300/80 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                Available
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/60 p-4 sm:p-6">
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={setSelected}
              showOutsideDays
              fixedWeeks
              classNames={calendarClassNames}
            />
          </div>

          <p className="text-xs text-white/50">
            Dates are shown in your local time.
          </p>
        </div>
      </div>
    </div>
  );
}

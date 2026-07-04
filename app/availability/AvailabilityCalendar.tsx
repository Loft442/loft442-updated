"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";

const calendarClassNames = {
  root: "w-full font-[var(--font-inter)] text-white/80",
  months: "flex w-full flex-col gap-6",
  month: "w-full space-y-4",
  caption: "flex items-center justify-between gap-4",
  caption_label:
    "text-sm uppercase tracking-[0.35em] text-white/80",
  nav: "flex items-center gap-2",
  nav_button:
    "h-9 w-9 rounded-sm border border-white/20 bg-black/60 text-white/70 transition hover:border-[#d9be62]/60 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d9be62]/50 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none",
  table: "w-full border-separate border-spacing-2",
  head_cell:
    "text-center text-[0.6rem] uppercase tracking-[0.3em] text-white/50",
  cell: "text-center",
  day: "relative mx-auto flex h-10 w-10 items-center justify-center rounded-sm border border-transparent text-[0.7rem] uppercase tracking-[0.2em] text-white/80 transition hover:border-[#d9be62]/60 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d9be62]/50 motion-reduce:transition-none",
  day_selected:
    "border border-[#d9be62]/70 bg-[#d4af37]/10 text-[#f5e6a8] shadow-[0_0_16px_rgba(212,175,55,0.35)] ring-1 ring-[#d9be62]/60",
  day_today: "border border-white/40 text-white",
  day_outside: "text-white/25",
  day_disabled: "cursor-not-allowed text-white/30 opacity-50",
};

export default function AvailabilityCalendar() {
  const [selected, setSelected] = useState<Date | undefined>();

  return (
    <div className="availability-calendar w-full">
      <div className="text-spotlight rounded-sm border border-white/10 bg-white/8 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur sm:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-xs uppercase tracking-[0.4em] text-[#d9be62]">
                Availability Calendar
              </p>
              <h2 className="text-xl uppercase tracking-[0.28em] text-white sm:text-2xl">
                Select an open date
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[0.6rem] uppercase tracking-[0.35em] text-white/60">
              <span className="flex items-center gap-2 rounded-sm border border-white/10 bg-black/40 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-[#d9be62]/80 shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                Available
              </span>
            </div>
          </div>

          <div className="rounded-sm border border-white/10 bg-black/60 p-4 sm:p-6">
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

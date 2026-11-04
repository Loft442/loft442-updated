"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";

// Class names use react-day-picker v9 keys (the installed version).
const calendarClassNames = {
  root: "relative w-full font-sans text-white/80",
  months: "flex w-full flex-col gap-6",
  month: "w-full space-y-4",
  month_caption: "flex h-11 items-center pr-28",
  caption_label: "font-serif text-xl normal-case tracking-normal text-[var(--ivory)]",
  nav: "absolute right-0 top-0 flex items-center gap-2",
  button_previous:
    "flex h-11 w-11 items-center justify-center border border-[var(--line)] text-white/70 transition hover:border-gold/60 hover:text-gold-light disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:fill-current",
  button_next:
    "flex h-11 w-11 items-center justify-center border border-[var(--line)] text-white/70 transition hover:border-gold/60 hover:text-gold-light disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:fill-current",
  month_grid: "w-full border-separate border-spacing-0.5 sm:border-spacing-2",
  weekday: "text-center text-[0.7rem] font-normal uppercase tracking-[0.2em] text-white/50",
  day: "p-0 text-center",
  day_button:
    "mx-auto flex aspect-square w-full max-w-16 items-center justify-center border border-transparent text-sm text-white/80 transition hover:border-gold/60 hover:text-gold-light focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/50 motion-reduce:transition-none",
  selected: "[&>button]:border-gold [&>button]:bg-gold [&>button]:text-[var(--ink)]",
  today: "[&>button]:border-white/40 [&>button]:text-white",
  outside: "[&>button]:text-white/25",
  disabled: "[&>button]:cursor-not-allowed [&>button]:text-white/30 [&>button]:opacity-50",
};

export default function AvailabilityCalendar() {
  const [selected, setSelected] = useState<Date | undefined>();

  return (
    <div className="availability-calendar w-full">
      <div className="border border-[var(--line)] px-2 py-6 sm:p-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between sm:px-0">
            <div className="flex flex-col gap-2">
              <p className="eyebrow">Availability Calendar</p>
              <h2 className="display-md">
                Select an open date
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[0.7rem] uppercase tracking-[0.35em] text-white/60">
              <span className="flex items-center gap-2 rounded-sm border border-white/10 bg-black/40 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-gold/80" />
                Available
              </span>
            </div>
          </div>

          <div className="sm:border sm:border-[var(--line)] sm:p-6">
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={setSelected}
              showOutsideDays
              fixedWeeks
              classNames={calendarClassNames}
            />
          </div>

          <p className="px-2 text-xs text-white/50 sm:px-0">
            Dates are shown in your local time.
          </p>
        </div>
      </div>
    </div>
  );
}

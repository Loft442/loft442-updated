"use client";

import { useMemo, useState } from "react";
import { DayPicker, type DayButtonProps } from "react-day-picker";

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

const bookedClassName = [
  "[&>button]:relative [&>button]:overflow-hidden [&>button]:border-white/5 [&>button]:bg-white/[0.04] [&>button]:line-through",
  "[&>button]:after:pointer-events-none [&>button]:after:absolute [&>button]:after:left-1/2 [&>button]:after:top-1/2 [&>button]:after:h-px [&>button]:after:w-[141%] [&>button]:after:-translate-x-1/2 [&>button]:after:-translate-y-1/2 [&>button]:after:-rotate-45 [&>button]:after:bg-white/30 [&>button]:after:content-['']",
].join(" ");

const fromYmd = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

type AvailabilityCalendarProps = {
  /** YYYY-MM-DD days already booked on the venue's Google Calendar. */
  bookedDates: string[];
};

function BookedAwareDayButton(props: DayButtonProps) {
  const { day: _day, modifiers, ...buttonProps } = props;
  const isBooked = Boolean(modifiers.booked);

  return (
    <span
      className={`group/day relative block w-full ${isBooked ? "z-0 hover:z-20" : ""}`}
      title={isBooked ? "Sorry this day is booked" : undefined}
    >
      <button
        {...buttonProps}
        aria-label={
          isBooked
            ? `${buttonProps["aria-label"] ?? "Day"}. Sorry this day is booked`
            : buttonProps["aria-label"]
        }
      />
      {isBooked ? (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-[calc(100%+0.4rem)] left-1/2 z-30 hidden w-max max-w-[11rem] -translate-x-1/2 border border-[var(--line-strong)] bg-[var(--background)] px-2.5 py-1.5 text-center text-[0.65rem] leading-snug tracking-wide text-[var(--ivory)] opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-opacity duration-200 group-hover/day:opacity-100 md:block"
        >
          Sorry this day is booked
        </span>
      ) : null}
    </span>
  );
}

export default function AvailabilityCalendar({ bookedDates }: AvailabilityCalendarProps) {
  const [selected, setSelected] = useState<Date | undefined>();
  const booked = useMemo(() => bookedDates.map(fromYmd), [bookedDates]);

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
              <span className="flex items-center gap-2 rounded-sm border border-white/10 bg-black/40 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-white/25" />
                <span className="line-through decoration-white/40">Booked</span>
              </span>
            </div>
          </div>

          <div className="overflow-visible sm:border sm:border-[var(--line)] sm:p-6">
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={setSelected}
              showOutsideDays
              fixedWeeks
              disabled={booked}
              modifiers={{ booked }}
              modifiersClassNames={{ booked: bookedClassName }}
              classNames={calendarClassNames}
              components={{ DayButton: BookedAwareDayButton }}
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

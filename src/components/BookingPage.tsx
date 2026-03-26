"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Reveal from "@/components/Reveal";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const timeOptions = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM",
];

const bookingTypes = [
  "Weddings",
  "Anniversaries",
  "Private Events",
  "Birthdays",
  "Kids Parties",
  "Baby Shower",
];

const fieldClassName =
  "w-full rounded-sm border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-white/35 focus:border-[#d9be62]/70 focus:bg-black/50";

const iconButtonClassName =
  "rounded-sm border border-white/10 bg-black/40 p-2 text-white/70 transition duration-300 hover:border-[#d9be62]/60 hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d9be62]/50";

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export default function BookingPage() {
  const today = useMemo(() => new Date(), []);
  const [monthAnchor, setMonthAnchor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthLabel = useMemo(() => {
    return monthAnchor.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [monthAnchor]);

  const days = useMemo(() => {
    const start = new Date(monthAnchor.getFullYear(), monthAnchor.getMonth(), 1);
    const end = new Date(
      monthAnchor.getFullYear(),
      monthAnchor.getMonth() + 1,
      0
    );
    const startDay = start.getDay();
    const totalDays = end.getDate();
    const slots = Array.from({ length: startDay + totalDays }, (_, index) => {
      if (index < startDay) {
        return null;
      }
      const day = index - startDay + 1;
      return new Date(monthAnchor.getFullYear(), monthAnchor.getMonth(), day);
    });

    return slots;
  }, [monthAnchor]);

  return (
    <div>
      <section className="section-glow section-divider relative border-t border-white/10 pb-10 pt-6 sm:pb-12 sm:pt-8">
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-white/10 backdrop-blur-xl"
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="spotlight rounded-sm px-4 py-3">
            <Reveal mode="text" className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white">Loft 442</p>
              <h1 className="text-spotlight relative inline-block text-3xl font-semibold tracking-[0.32em] text-white sm:text-4xl md:text-5xl">
                <span
                  className="pointer-events-none absolute -inset-x-12 -inset-y-8 z-0 blur-3xl"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(200,200,210,0.85) 0%, transparent 65%)",
                  }}
                  aria-hidden="true"
                />
                <span className="relative z-10">BOOK YOUR EVENT</span>
              </h1>
              <p className="max-w-2xl text-sm text-white/70">
                Reserve your date at Loft 442 and share the event details needed to
                prepare the next step.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-divider border-t border-white/10 py-8 sm:py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6">
          <Reveal mode="text" className="rounded-sm border border-white/10 bg-white/6 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur sm:p-8">
            <span className="text-[0.62rem] uppercase tracking-[0.32em] text-[#d9be62]">
              Step 1 of 2
            </span>
            <div className="relative mt-3 h-2.5 w-full">
              <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/10" />
              <div className="absolute left-0 top-1/2 h-px w-1/2 -translate-y-1/2 bg-[#d9be62] shadow-[0_0_18px_rgba(217,190,98,0.28)]" />
              <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-[#d9be62]/80 bg-[#d9be62]/35 shadow-[0_0_14px_rgba(217,190,98,0.28)]" />
              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-white/20 bg-black/80" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-divider border-t border-white/10 pb-20 pt-2">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="text-spotlight relative grid gap-10 rounded-sm border border-white/10 bg-white/8 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur sm:p-8 lg:grid-cols-[1.1fr_1fr]">
            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#d9be62] sm:text-sm">
                    Select Date
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white">
                    Choose the day, time, and event type
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() =>
                      setMonthAnchor(
                        new Date(
                          monthAnchor.getFullYear(),
                          monthAnchor.getMonth() - 1,
                          1
                        )
                      )
                    }
                    className={iconButtonClassName}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() =>
                      setMonthAnchor(
                        new Date(
                          monthAnchor.getFullYear(),
                          monthAnchor.getMonth() + 1,
                          1
                        )
                      )
                    }
                    className={iconButtonClassName}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="rounded-sm border border-white/10 bg-black/40 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.35em] text-white">
                    {monthLabel}
                  </p>
                  {selectedDate ? (
                    <span className="text-[0.62rem] uppercase tracking-[0.32em] text-[#d9be62]">
                      {selectedDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  ) : null}
                </div>
                <div className="grid grid-cols-7 gap-2 text-[0.62rem] uppercase tracking-[0.3em] text-white/45">
                  {weekdays.map((day) => (
                    <div key={day} className="text-center">
                      {day}
                    </div>
                  ))}
                </div>
                <div
                  role="grid"
                  aria-label="Choose an event date"
                  className="mt-3 grid grid-cols-7 gap-2"
                >
                  {days.map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} className="h-10" />;
                    }

                    const isSelected =
                      !!selectedDate && isSameDay(selectedDate, date);
                    const isToday = isSameDay(today, date);

                    return (
                      <button
                        key={date.toISOString()}
                        type="button"
                        role="gridcell"
                        aria-selected={isSelected}
                        onClick={() => setSelectedDate(date)}
                        className={`flex h-10 items-center justify-center rounded-sm border text-[0.65rem] uppercase tracking-[0.3em] transition duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d9be62]/50 ${
                          isSelected
                            ? "border-[#d9be62]/70 bg-[#d9be62]/12 text-white shadow-[0_0_18px_rgba(217,190,98,0.18)]"
                            : "border-white/10 bg-black/30 text-white/70 hover:border-[#d9be62]/50 hover:bg-white/6 hover:text-white"
                        } ${isToday ? "border-white/20 text-white" : ""}`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[#d9be62]">
                  Start Time
                  <select className={fieldClassName}>
                    <option value="" className="text-black">
                      Select start
                    </option>
                    {timeOptions.map((time) => (
                      <option key={time} value={time} className="text-black">
                        {time}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[#d9be62]">
                  End Time
                  <select className={fieldClassName}>
                    <option value="" className="text-black">
                      Select end
                    </option>
                    {timeOptions.map((time) => (
                      <option key={time} value={time} className="text-black">
                        {time}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[#d9be62]">
                Type of Booking
                <select className={fieldClassName}>
                  <option value="" className="text-black">
                    Select type
                  </option>
                  {bookingTypes.map((type) => (
                    <option key={type} value={type} className="text-black">
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[#d9be62]">
                Special Requests (optional)
                <textarea
                  rows={4}
                  placeholder="Share lighting, setup, or accessibility needs."
                  className={fieldClassName}
                />
              </label>
            </div>

            <div className="relative z-10 flex flex-col gap-6">
              <div className="rounded-sm border border-white/10 bg-black/40 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6">
                <div className="flex flex-col gap-3 border-b border-white/10 pb-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#d9be62] sm:text-sm">
                    Contact Information
                  </p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white">
                    Where we should send next-step details
                  </p>
                </div>
                <div className="mt-5 flex flex-col gap-4">
                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[#d9be62]">
                  Full Name
                  <input
                    type="text"
                    className={fieldClassName}
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[#d9be62]">
                  Email Address
                  <input
                    type="email"
                    className={fieldClassName}
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-[#d9be62]">
                  Phone Number
                  <input
                    type="tel"
                    className={fieldClassName}
                  />
                </label>
                </div>
              </div>

              <div className="mt-auto flex justify-center lg:justify-end">
                <Link
                  href="/payment"
                  className="inline-flex h-11 items-center justify-center rounded-sm border border-[#d4af37] px-5 text-[0.65rem] uppercase tracking-[0.35em] text-white transition duration-300 hover:border-[#f5e6a8] hover:bg-[#d4af37]/15 hover:text-white hover:shadow-[0_0_24px_rgba(212,175,55,0.3)]"
                >
                  CONTINUE
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

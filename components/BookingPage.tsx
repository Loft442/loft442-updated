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
      <section className="relative border-b border-white/10 bg-black">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,_rgba(255,255,255,0.05),_transparent_45%)]" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="text-spotlight inline-block rounded-sm px-4 py-3">
            <div className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                Loft 442
              </p>
              <h1 className="text-3xl font-semibold tracking-[0.25em] text-white sm:text-4xl md:text-5xl">
                BOOK YOUR EVENT
              </h1>
              <p className="max-w-xl text-sm text-white/70">
                Reserve your date at LOFT 442.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black">
        <div className="mx-auto max-w-6xl px-6 pb-6 pt-4">
          <Reveal className="flex flex-col gap-3">
            <span className="text-[0.6rem] uppercase tracking-[0.35em] text-white/60">
              Step 1 of 2
            </span>
            <div className="relative h-[10px] w-full">
              <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/15" />
              <div className="absolute left-0 top-1/2 h-px w-1/2 -translate-y-1/2 bg-white/60 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
              <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-white/60 bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.25)]" />
              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-white/20 bg-black" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-black py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="text-spotlight grid gap-10 rounded-sm border border-white/10 bg-white/5 p-8 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur lg:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                  Select Date
                </p>
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
                    className="rounded-sm border border-white/20 bg-black/60 p-2 text-white/70 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
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
                    className="rounded-sm border border-white/20 bg-black/60 p-2 text-white/70 transition hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="rounded-sm border border-white/10 bg-black/60 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.35em] text-white/80">
                    {monthLabel}
                  </p>
                  {selectedDate ? (
                    <span className="text-[0.6rem] uppercase tracking-[0.35em] text-white/50">
                      {selectedDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  ) : null}
                </div>
                <div className="grid grid-cols-7 gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/40">
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
                        className={`flex h-10 items-center justify-center rounded-sm border text-[0.65rem] uppercase tracking-[0.3em] transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 ${
                          isSelected
                            ? "border-white/60 bg-white/10 text-white shadow-[0_0_18px_rgba(255,255,255,0.2)]"
                            : "border-white/10 text-white/70 hover:border-white/40 hover:text-white"
                        } ${isToday ? "border-white/30 text-white/90" : ""}`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                  Start Time
                  <select className="w-full rounded-sm border border-white/20 bg-black/60 px-4 py-3 text-sm text-white/80 outline-none transition focus:border-white/60">
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
                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                  End Time
                  <select className="w-full rounded-sm border border-white/20 bg-black/60 px-4 py-3 text-sm text-white/80 outline-none transition focus:border-white/60">
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

              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                Type of Booking
                <select className="w-full rounded-sm border border-white/20 bg-black/60 px-4 py-3 text-sm text-white/80 outline-none transition focus:border-white/60">
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

              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                Special Requests (optional)
                <textarea
                  rows={4}
                  placeholder="Share lighting, setup, or accessibility needs."
                  className="w-full rounded-sm border border-white/20 bg-black/60 px-4 py-3 text-sm text-white/80 outline-none transition focus:border-white/60"
                />
              </label>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                  Contact Information
                </p>
                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                  Full Name
                  <input
                    type="text"
                    className="w-full rounded-sm border border-white/20 bg-black/60 px-4 py-3 text-sm text-white/80 outline-none transition focus:border-white/60"
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                  Email Address
                  <input
                    type="email"
                    className="w-full rounded-sm border border-white/20 bg-black/60 px-4 py-3 text-sm text-white/80 outline-none transition focus:border-white/60"
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                  Phone Number
                  <input
                    type="tel"
                    className="w-full rounded-sm border border-white/20 bg-black/60 px-4 py-3 text-sm text-white/80 outline-none transition focus:border-white/60"
                  />
                </label>
              </div>

              <div className="mt-auto flex justify-center lg:justify-end">
                <Link
                  href="/payment"
                  className="cta-button bg-white px-6 py-3 text-[0.65rem] uppercase tracking-[0.35em] text-black transition hover:opacity-90"
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

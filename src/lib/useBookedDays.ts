"use client";

import { useEffect, useState } from "react";

const toMonthParam = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export function useBookedDays(monthAnchor: Date) {
  const [bookedDays, setBookedDays] = useState<Set<string>>(new Set());

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        const month = toMonthParam(monthAnchor);
        const response = await fetch(`/api/booked-dates?month=${month}`);
        const data = await response.json().catch(() => null);
        const dates = Array.isArray(data?.bookedDays) ? data.bookedDays : [];

        if (!isActive) {
          return;
        }
        setBookedDays(new Set(dates.filter(Boolean)));
      } catch {
        if (isActive) {
          setBookedDays(new Set());
        }
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [monthAnchor]);

  return bookedDays;
}

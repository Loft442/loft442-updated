import ical, { type EventInstance, type VEvent } from "node-ical";

export const BOOKED_DATES_CACHE_TAG = "booked-dates";
export const BOOKED_DATES_REVALIDATE_SECONDS = 300;

const VENUE_TIME_ZONE = "America/New_York";
const LOOKAHEAD_DAYS = 731;
const DAY_MS = 24 * 60 * 60 * 1000;
// An evening event that runs past midnight should not also book the next day.
const OVERNIGHT_CUTOFF_HOUR = 6;

const venueDateParts = new Intl.DateTimeFormat("en-US", {
  timeZone: VENUE_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  hourCycle: "h23",
});

type Ymd = { year: number; month: number; day: number };

function venueYmdAndHour(date: Date): Ymd & { hour: number } {
  const parts = Object.fromEntries(
    venueDateParts.formatToParts(date).map((part) => [part.type, part.value])
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
  };
}

// All-day dates from node-ical are local midnights, so they are read with local getters.
function localYmd(date: Date): Ymd {
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

function ymdToUtc({ year, month, day }: Ymd) {
  return Date.UTC(year, month - 1, day);
}

function utcToKey(utc: number) {
  return new Date(utc).toISOString().slice(0, 10);
}

function addDays(target: Set<string>, firstUtc: number, lastUtc: number) {
  for (let utc = firstUtc; utc <= lastUtc; utc += DAY_MS) {
    target.add(utcToKey(utc));
  }
}

function addInstance(target: Set<string>, instance: EventInstance) {
  const { start } = instance;
  const end = instance.end ?? start;

  if (instance.isFullDay) {
    const firstUtc = ymdToUtc(localYmd(start));
    // DTEND of an all-day event is exclusive.
    const lastUtc = Math.max(firstUtc, ymdToUtc(localYmd(end)) - DAY_MS);
    addDays(target, firstUtc, lastUtc);
    return;
  }

  const firstUtc = ymdToUtc(venueYmdAndHour(start));
  const lastMoment = venueYmdAndHour(new Date(Math.max(start.getTime(), end.getTime() - 1)));
  let lastUtc = ymdToUtc(lastMoment);
  if (lastUtc > firstUtc && lastMoment.hour < OVERNIGHT_CUTOFF_HOUR) {
    lastUtc -= DAY_MS;
  }
  addDays(target, firstUtc, lastUtc);
}

function isBlocking(event: VEvent) {
  // Google exports "Show as: Free" events as TRANSPARENT.
  return event.status !== "CANCELLED" && event.transparency !== "TRANSPARENT";
}

export function bookedDatesFromIcs(icsText: string, now = new Date()): string[] {
  const from = new Date(now.getTime() - DAY_MS);
  const to = new Date(now.getTime() + LOOKAHEAD_DAYS * DAY_MS);
  const booked = new Set<string>();

  for (const component of Object.values(ical.sync.parseICS(icsText))) {
    if (component?.type !== "VEVENT" || !component.start) continue;
    // Overrides of a recurring event are applied through their parent series.
    if (component.recurrenceid) continue;

    const instances = ical.expandRecurringEvent(component, {
      from,
      to,
      expandOngoing: true,
    });
    for (const instance of instances) {
      if (isBlocking(instance.event)) addInstance(booked, instance);
    }
  }

  return [...booked].sort();
}

/** Booked days (YYYY-MM-DD, venue time) from the Google Calendar secret iCal address. */
export async function getBookedDates(): Promise<string[]> {
  const icsUrl = process.env.GOOGLE_CALENDAR_ICS_URL?.trim();
  if (!icsUrl) return [];

  try {
    const response = await fetch(icsUrl, {
      next: { revalidate: BOOKED_DATES_REVALIDATE_SECONDS, tags: [BOOKED_DATES_CACHE_TAG] },
    });
    if (!response.ok) throw new Error(`Calendar feed responded ${response.status}`);
    return bookedDatesFromIcs(await response.text());
  } catch (error) {
    console.error("Could not load booked dates from Google Calendar", error);
    return [];
  }
}

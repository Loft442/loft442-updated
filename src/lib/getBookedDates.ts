import { sanity, isSanityConfigured } from "./sanityClient";

type DateRange = {
  from?: string;
  to?: string;
};

export async function getBookedDates(_range?: DateRange): Promise<string[]> {
  // Return empty array if Sanity is not configured
  if (!isSanityConfigured) {
    return [];
  }

  const baseQuery = `*[_type == "availability" && _id == "availability"][0].bookedDates`;
  const hasFrom = Boolean(_range?.from);
  const hasTo = Boolean(_range?.to);
  const query = hasFrom && hasTo
    ? `${baseQuery}[@ >= $from && @ <= $to]`
    : hasFrom
      ? `${baseQuery}[@ >= $from]`
      : hasTo
        ? `${baseQuery}[@ <= $to]`
        : baseQuery;

  const params: Record<string, string> = {};
  if (_range?.from) {
    params.from = _range.from;
  }
  if (_range?.to) {
    params.to = _range.to;
  }

  try {
    const data = await sanity.fetch<string[]>(query, params);
    return data ?? [];
  } catch {
    console.warn("Failed to fetch booked dates from Sanity");
    return [];
  }
}

import { NextResponse } from "next/server";
import { getBookedDates } from "@/lib/getBookedDates";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // YYYY-MM

  const range: { from?: string; to?: string } = {};

  if (month) {
    const [y, mRaw] = month.split("-");
    const yearNumber = Number(y);
    const monthNumber = Number(mRaw);
    if (
      !Number.isNaN(yearNumber) &&
      !Number.isNaN(monthNumber) &&
      monthNumber >= 1 &&
      monthNumber <= 12
    ) {
      const m = String(monthNumber).padStart(2, "0");
      const last = new Date(yearNumber, monthNumber, 0).getDate();
      range.from = `${yearNumber}-${m}-01`;
      range.to = `${yearNumber}-${m}-${String(last).padStart(2, "0")}`;
    }
  }

  try {
    const bookedDays = await getBookedDates(range);
    return NextResponse.json({ bookedDays });
  } catch {
    return NextResponse.json({ bookedDays: [] });
  }
}

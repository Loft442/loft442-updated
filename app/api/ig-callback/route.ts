import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Instagram login used to save a long-lived token in a private Sanity document.
// The live feed now reads INSTAGRAM_ACCESS_TOKEN only, so this callback no longer
// exchanges or stores a code.
export async function GET() {
  return new NextResponse(
    "Instagram is configured with the INSTAGRAM_ACCESS_TOKEN environment variable. This page no longer stores a token.",
    {
      status: 410,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
}

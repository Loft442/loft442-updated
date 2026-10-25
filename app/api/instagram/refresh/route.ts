import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { INSTAGRAM_CACHE_TAG, refreshAccessToken } from "@/lib/instagram";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await refreshAccessToken();

  if (result.status === "refreshed") {
    revalidateTag(INSTAGRAM_CACHE_TAG, "max");
  }

  return NextResponse.json(result, {
    status: result.status === "error" ? 500 : 200,
  });
}

import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { GALLERY_CACHE_TAG } from "@/lib/galleryUploads";

export const dynamic = "force-dynamic";

// Sanity webhook: refreshes /gallery as soon as the client publishes, edits or
// deletes a gallery upload in the Studio. Signed with SANITY_REVALIDATE_SECRET.
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret is not configured" }, { status: 500 });
  }

  try {
    // Waits briefly so the published document is readable before refetching.
    const { isValidSignature } = await parseBody(request, secret, true);
    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    revalidateTag(GALLERY_CACHE_TAG, "max");
    return NextResponse.json({ revalidated: true });
  } catch (error) {
    console.error("[gallery] Revalidate webhook failed", error);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

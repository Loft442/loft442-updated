import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { GALLERY_CACHE_TAG } from "@/lib/galleryUploads";

export const dynamic = "force-dynamic";

function bustGalleryCache() {
  revalidateTag(GALLERY_CACHE_TAG, "max");
  revalidatePath("/gallery");
}

// Refreshes /gallery immediately after Studio publish/edit/delete.
// Auth: Authorization Bearer SANITY_REVALIDATE_SECRET, or a signed Sanity webhook body.
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret is not configured" }, { status: 500 });
  }

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) {
    bustGalleryCache();
    return NextResponse.json({ revalidated: true });
  }

  try {
    // Waits briefly so the published document is readable before refetching.
    const { isValidSignature } = await parseBody(request, secret, true);
    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    bustGalleryCache();
    return NextResponse.json({ revalidated: true });
  } catch (error) {
    console.error("[gallery] Revalidate webhook failed", error);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

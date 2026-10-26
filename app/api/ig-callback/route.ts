import { NextResponse } from "next/server";
import { sanityWriteClient } from "@/lib/sanityWriteClient";

export const dynamic = "force-dynamic";

// Must match src/lib/instagram.ts token document identity.
const TOKEN_DOC_ID = "secrets.instagramToken";
const TOKEN_DOC_TYPE = "instagramToken";

type ShortTokenPayload = {
  access_token?: string;
  user_id?: string | number;
  data?: Array<{
    access_token?: string;
    user_id?: string | number;
  }>;
};

type LongTokenPayload = {
  access_token?: string;
  expires_in?: number;
};

function text(body: string, status = 200) {
  return new NextResponse(body, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function fail(reason: string) {
  console.error(`[ig-callback] ${reason}`);
  return text("Connection failed", 500);
}

async function readJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code");
  if (!code) {
    return text("Missing code", 400);
  }

  try {
    const body = new URLSearchParams({
      client_id: process.env.IG_APP_ID ?? "",
      client_secret: process.env.IG_APP_SECRET ?? "",
      grant_type: "authorization_code",
      redirect_uri: process.env.IG_REDIRECT_URI ?? "",
      code,
    });

    const shortRes = await fetch(
      "https://api.instagram.com/oauth/access_token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      },
    );
    if (!shortRes.ok) {
      return fail(`Code exchange responded with ${shortRes.status}`);
    }

    const shortData = await readJson<ShortTokenPayload>(shortRes);
    const nested = shortData?.data?.[0];
    const shortToken = shortData?.access_token ?? nested?.access_token;
    const userId = shortData?.user_id ?? nested?.user_id;
    if (!shortToken) {
      return fail("Code exchange response missing access_token");
    }

    const longUrl = new URL("https://graph.instagram.com/access_token");
    longUrl.searchParams.set("grant_type", "ig_exchange_token");
    longUrl.searchParams.set("client_secret", process.env.IG_APP_SECRET ?? "");
    longUrl.searchParams.set("access_token", shortToken);

    const longRes = await fetch(longUrl);
    if (!longRes.ok) {
      return fail(`Long-lived exchange responded with ${longRes.status}`);
    }

    const longData = await readJson<LongTokenPayload>(longRes);
    if (!longData?.access_token) {
      return fail("Long-lived exchange response missing access_token");
    }

    if (!sanityWriteClient) {
      return fail("Sanity write client is not configured");
    }

    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + (longData.expires_in ?? 0) * 1000,
    ).toISOString();

    await sanityWriteClient.createOrReplace({
      _id: TOKEN_DOC_ID,
      _type: TOKEN_DOC_TYPE,
      token: longData.access_token,
      refreshedAt: now.toISOString(),
      expiresAt,
    });

    console.log(`Instagram token saved for user ${userId}`);

    return text("Connected! You can close this page.");
  } catch (error) {
    console.error("[ig-callback] Unexpected error", error instanceof Error ? error.message : error);
    return text("Connection failed", 500);
  }
}

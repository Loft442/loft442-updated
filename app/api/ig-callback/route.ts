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

    const shortText = await shortRes.text();
    if (!shortRes.ok) {
      console.log(shortText);
      return text("Connection failed", 500);
    }

    let shortData: ShortTokenPayload;
    try {
      shortData = JSON.parse(shortText) as ShortTokenPayload;
    } catch {
      console.log(shortText);
      return text("Connection failed", 500);
    }

    const nested = shortData.data?.[0];
    const shortToken = shortData.access_token ?? nested?.access_token;
    const userId = shortData.user_id ?? nested?.user_id;

    if (!shortToken) {
      console.log(shortText);
      return text("Connection failed", 500);
    }

    const longUrl = new URL("https://graph.instagram.com/access_token");
    longUrl.searchParams.set("grant_type", "ig_exchange_token");
    longUrl.searchParams.set("client_secret", process.env.IG_APP_SECRET ?? "");
    longUrl.searchParams.set("access_token", shortToken);

    const longRes = await fetch(longUrl);
    const longText = await longRes.text();
    if (!longRes.ok) {
      console.log(longText);
      return text("Connection failed", 500);
    }

    let longData: LongTokenPayload;
    try {
      longData = JSON.parse(longText) as LongTokenPayload;
    } catch {
      console.log(longText);
      return text("Connection failed", 500);
    }

    if (!longData.access_token) {
      console.log(longText);
      return text("Connection failed", 500);
    }

    if (!sanityWriteClient) {
      console.log("Sanity write client is not configured");
      return text("Connection failed", 500);
    }

    try {
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
    } catch (error) {
      console.log(error);
      return text("Connection failed", 500);
    }

    console.log(`Instagram token saved for user ${userId}`);

    return text("Connected! You can close this page.");
  } catch (error) {
    console.log(error);
    return text("Connection failed", 500);
  }
}

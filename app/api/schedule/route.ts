import { NextResponse } from "next/server";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload !== "object") {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const clean = (v?: string) => (v ?? "").trim();
  const clamp = (v: string, n: number) => (v.length > n ? v.slice(0, n) : v);

  const firstName = clamp(clean(payload.firstName), 60);
  const lastName = clamp(clean(payload.lastName), 60);
  const email = clamp(clean(payload.email).toLowerCase(), 120);
  const phone = clamp(clean(payload.phone), 25);
  const partyType = clamp(clean(payload.partyType), 60);
  const date = clean(payload.date);
  const message = clamp(clean(payload.message), 1500);

  const origin = request.headers.get("origin") || "";
  const host = request.headers.get("host") || "";

  // allow your real domains here
  const allowedOrigins = [
    `https://${host}`, // current host
    "https://loft442.com",
    "https://www.loft442.com",
  ];

  if (origin && !allowedOrigins.includes(origin)) {
    return Response.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const missing = [
    ["date", date],
    ["firstName", firstName],
    ["lastName", lastName],
    ["partyType", partyType],
    ["phone", phone],
    ["email", email],
  ].filter(([, value]) => !value || !String(value).trim());

  if (missing.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing required fields.",
        fields: missing.map(([field]) => field),
      },
      { status: 400 }
    );
  }

  if (!datePattern.test(String(date))) {
    return NextResponse.json(
      { ok: false, error: "Invalid date format." },
      { status: 400 }
    );
  }

  if (!emailPattern.test(String(email))) {
    return NextResponse.json(
      { ok: false, error: "Invalid email address." },
      { status: 400 }
    );
  }

  // TODO: Send email confirmation to venue.
  // TODO: Push request to CRM or Google Sheets.
  // TODO: Store schedule request in Sanity or database.

  return NextResponse.json({ ok: true });
}

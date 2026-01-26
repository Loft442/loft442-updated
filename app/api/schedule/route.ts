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

  const {
    date,
    firstName,
    lastName,
    partyType,
    phone,
    email,
    message,
  } = payload as Record<string, string | undefined>;

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

export const runtime = "nodejs";

import { Resend } from "resend";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

type RequestPayload = {
  date?: string;
  firstName?: string;
  lastName?: string;
  partyType?: string;
  phone?: string;
  email?: string;
  message?: string;
  website?: string;
};

const formatDate = (date: string) => {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const getClientIp = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
  return (
    forwardedFor.split(",").map((entry) => entry.trim())[0] ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
};

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const now = Date.now();
  const existing = rateLimitStore.get(ip);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else if (existing.count >= RATE_LIMIT_MAX) {
    return Response.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  } else {
    existing.count += 1;
  }

  const payload = (await request.json().catch(() => null)) as
    | RequestPayload
    | null;

  if (!payload) {
    return Response.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  if (payload.website) {
    return Response.json({ ok: true });
  }

  const missing = [
    ["date", payload.date],
    ["firstName", payload.firstName],
    ["lastName", payload.lastName],
    ["partyType", payload.partyType],
    ["phone", payload.phone],
    ["email", payload.email],
  ].filter(([, value]) => !value || !String(value).trim());

  if (missing.length > 0) {
    return Response.json(
      {
        ok: false,
        error: "Missing required fields.",
        fields: missing.map(([field]) => field),
      },
      { status: 400 }
    );
  }

  if (!datePattern.test(String(payload.date))) {
    return Response.json(
      { ok: false, error: "Invalid date format." },
      { status: 400 }
    );
  }

  if (!emailPattern.test(String(payload.email))) {
    return Response.json(
      { ok: false, error: "Invalid email address." },
      { status: 400 }
    );
  }

  const { RESEND_API_KEY, LEADS_TO_EMAIL, SMTP_FROM } = process.env;

  if (!RESEND_API_KEY || !LEADS_TO_EMAIL) {
    return Response.json(
      { ok: false, error: "Email service not configured." },
      { status: 500 }
    );
  }

  const resend = new Resend(RESEND_API_KEY);
  const dateLabel = formatDate(String(payload.date));
  const messageText = payload.message?.trim() ? payload.message.trim() : "None";

  const emailText = `New Event Request – Loft 442

Name: ${payload.firstName} ${payload.lastName}
Email: ${payload.email}
Phone: ${payload.phone ?? ""}
Type of Party: ${payload.partyType}
Date: ${dateLabel}

Message:
${messageText}
`;

  const result = await resend.emails.send({
    from: SMTP_FROM ?? "Loft 442 <onboarding@resend.dev>",
    to: LEADS_TO_EMAIL,
    replyTo: payload.email,
    subject: `New Event Request – ${payload.partyType}`,
    text: emailText,
  });

  if (result.error) {
    return Response.json(
      { ok: false, error: result.error.message },
      { status: 500 }
    );
  }

  // TODO: Store submission in CRM or Google Sheets.
  // TODO: Send confirmation email to the requester.
  // TODO: Persist requests in Sanity or a database.

  return Response.json({ ok: true, id: result.data?.id });
}

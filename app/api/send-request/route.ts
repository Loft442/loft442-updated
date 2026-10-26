export const runtime = "nodejs";

import { Resend } from "resend";
import EventRequestNotification from "@/emails/EventRequestNotification";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MAX_BODY_BYTES = 20_000;
const MAX_FIELD_LENGTH = {
  firstName: 50,
  lastName: 50,
  partyType: 60,
  phone: 20,
  email: 254,
  message: 1000,
} as const;
// NOTE: In-memory store is reset on every cold-start in serverless environments (e.g. Vercel).
// For production-grade rate limiting, replace this with a Redis/Upstash store.
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
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return Response.json({ ok: false, error: "Unsupported content type." }, { status: 415 });
  }

  const contentLengthHeader = request.headers.get("content-length");
  const contentLength = contentLengthHeader ? Number(contentLengthHeader) : 0;
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return Response.json(
      { ok: false, error: "Request payload too large." },
      { status: 413 }
    );
  }

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

  let payload: RequestPayload | null = null;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!payload) {
    return Response.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  if (payload.website) {
    return Response.json({ ok: true });
  }

  const clean = (value?: string) => (value ?? "").trim();
  const firstName = clean(payload.firstName);
  const lastName = clean(payload.lastName);
  const phone = clean(payload.phone);
  const email = clean(payload.email);
  const message = clean(payload.message);
  const partyType = clean(payload.partyType);

  const lengthViolations = [
    ["firstName", firstName.length, MAX_FIELD_LENGTH.firstName],
    ["lastName", lastName.length, MAX_FIELD_LENGTH.lastName],
    ["partyType", partyType.length, MAX_FIELD_LENGTH.partyType],
    ["phone", phone.length, MAX_FIELD_LENGTH.phone],
    ["email", email.length, MAX_FIELD_LENGTH.email],
    ["message", message.length, MAX_FIELD_LENGTH.message],
  ].filter(([, length, max]) => length > max);

  if (lengthViolations.length > 0) {
    return Response.json(
      {
        ok: false,
        error: "One or more fields exceed allowed length.",
        fields: lengthViolations.map(([field]) => field),
      },
      { status: 400 }
    );
  }

  const missing = [
    ["date", payload.date],
    ["firstName", firstName],
    ["lastName", lastName],
    ["partyType", partyType],
    ["phone", phone],
    ["email", email],
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
    return Response.json({ ok: false, error: "Invalid date format." }, { status: 400 });
  }

  if (!emailPattern.test(email)) {
    return Response.json({ ok: false, error: "Invalid email address." }, { status: 400 });
  }

  const { RESEND_API_KEY, LEADS_TO_EMAIL, SMTP_FROM } = process.env;

  if (!RESEND_API_KEY || !LEADS_TO_EMAIL) {
    console.error("[send-request] RESEND_API_KEY or LEADS_TO_EMAIL is not configured");
    return Response.json({ ok: false, error: "Email service not configured." }, { status: 500 });
  }

  const resend = new Resend(RESEND_API_KEY);

  const dateLabel = formatDate(String(payload.date));
  const messageText = message.length > 0 ? message : "None";

  const emailText = `New Event Request – Loft 442

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Type of Event: ${partyType || "Unknown"}
Date: ${dateLabel}

Message:
${messageText}
`;

  const fromAddress = SMTP_FROM ?? "Loft 442 <onboarding@resend.dev>";

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: LEADS_TO_EMAIL,
      replyTo: email,
      subject: `New Event Request – ${partyType || "Unknown"}`,
      react: EventRequestNotification({
        firstName,
        lastName,
        email,
        phone,
        partyType: partyType || "Unknown",
        dateLabel,
        messageText,
      }),
      text: emailText, // fallback for clients that can't render HTML
    });

    if (error) {
      console.error("[send-request] Resend returned an error:", error.name, error.message);
      return Response.json({ ok: false, error: "Email send failed." }, { status: 500 });
    }

    return Response.json({ ok: true, id: data?.id });
  } catch (sendError) {
    console.error("[send-request] Exception while sending email:", sendError);
    return Response.json({ ok: false, error: "Email send failed." }, { status: 500 });
  }
}

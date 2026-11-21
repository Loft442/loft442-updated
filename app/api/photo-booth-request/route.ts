export const runtime = "nodejs";

import { after } from "next/server";
import { Resend } from "resend";
import PhotoBoothInquiryNotification from "@/emails/PhotoBoothInquiryNotification";
import { BOOTH_EVENT_TYPES, BOOTH_FIELD_MAX_LENGTH, BOOTH_PACKAGES } from "@/lib/photoBooth";
import {
  flushPostHogLogs,
  logEventRequestEmailConfigured,
  logEventRequestEmailFailed,
  logEventRequestEmailSent,
} from "../../../instrumentation";

const ROUTE = "/api/photo-booth-request";
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MAX_BODY_BYTES = 20_000;
const TBD = "To be determined";

// In-memory, so it resets on every serverless cold start.
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  eventType?: string;
  date?: string;
  venue?: string;
  packageName?: string;
  details?: string;
  website?: string;
};

const fail = (error: string, status: number, fields?: string[]) =>
  Response.json({ ok: false, error, ...(fields ? { fields } : {}) }, { status });

const formatDate = (date: string) => {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const getClientIp = (request: Request) =>
  (request.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() ||
  request.headers.get("x-real-ip") ||
  "unknown";

const flushLogsAfterResponse = () => {
  after(async () => {
    await flushPostHogLogs();
  });
};

export async function POST(request: Request) {
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    return fail("Unsupported content type.", 415);
  }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return fail("Request payload too large.", 413);
  }

  const ip = getClientIp(request);
  const now = Date.now();
  const existing = rateLimitStore.get(ip);
  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else if (existing.count >= RATE_LIMIT_MAX) {
    return fail("Too many requests. Please try again later.", 429);
  } else {
    existing.count += 1;
  }

  let payload: Payload | null = null;
  try {
    payload = await request.json();
  } catch {
    return fail("Invalid JSON payload.", 400);
  }
  if (!payload) return fail("Invalid JSON payload.", 400);
  if (payload.website) return Response.json({ ok: true });

  const clean = (value?: string) => (typeof value === "string" ? value.trim() : "");
  const name = clean(payload.name);
  const email = clean(payload.email);
  const phone = clean(payload.phone);
  const venue = clean(payload.venue);
  const details = clean(payload.details);
  const date = clean(payload.date);
  const eventType = clean(payload.eventType);
  const packageName = clean(payload.packageName);

  const tooLong = (
    [
      ["name", name],
      ["email", email],
      ["phone", phone],
      ["venue", venue],
      ["details", details],
    ] as const
  )
    .filter(([field, value]) => value.length > BOOTH_FIELD_MAX_LENGTH[field])
    .map(([field]) => field);
  if (tooLong.length > 0) return fail("One or more fields exceed allowed length.", 400, tooLong);

  const missing = [!name && "name", !email && "email"].filter(Boolean) as string[];
  if (missing.length > 0) return fail("Missing required fields.", 400, missing);
  if (!emailPattern.test(email)) return fail("Invalid email address.", 400, ["email"]);
  if (date && !datePattern.test(date)) return fail("Invalid date format.", 400, ["date"]);
  if (eventType && !BOOTH_EVENT_TYPES.includes(eventType)) return fail("Unknown event type.", 400, ["eventType"]);
  if (packageName && !BOOTH_PACKAGES.includes(packageName)) return fail("Unknown package.", 400, ["packageName"]);

  const { RESEND_API_KEY, LEADS_TO_EMAIL, SMTP_FROM } = process.env;
  if (!RESEND_API_KEY || !LEADS_TO_EMAIL) {
    console.error("[photo-booth-request] RESEND_API_KEY or LEADS_TO_EMAIL is not configured");
    if (logEventRequestEmailConfigured(ROUTE)) flushLogsAfterResponse();
    return fail("Email service not configured.", 500);
  }

  const fields = {
    name,
    email,
    phone: phone || "—",
    packageName: packageName || TBD,
    eventType: eventType || TBD,
    dateLabel: date ? formatDate(date) : TBD,
    venue: venue || TBD,
    messageText: details || "None",
  };

  const emailText = `New Photo Booth Inquiry – Loft 442

Name: ${fields.name}
Email: ${fields.email}
Phone: ${fields.phone}
Photo booth package: ${fields.packageName}
Event type: ${fields.eventType}
Event date: ${fields.dateLabel}
Venue or city: ${fields.venue}

About the event:
${fields.messageText}
`;

  try {
    const { data, error } = await new Resend(RESEND_API_KEY).emails.send({
      from: SMTP_FROM ?? "Loft 442 <onboarding@resend.dev>",
      to: LEADS_TO_EMAIL,
      replyTo: email,
      subject: `New Photo Booth Inquiry – ${fields.packageName}`,
      react: PhotoBoothInquiryNotification(fields),
      text: emailText,
    });

    if (error) {
      console.error("[photo-booth-request] Resend returned an error:", error.name, error.message);
      if (logEventRequestEmailFailed(ROUTE)) flushLogsAfterResponse();
      return fail("Email send failed.", 500);
    }

    if (logEventRequestEmailSent(ROUTE)) flushLogsAfterResponse();
    return Response.json({ ok: true, id: data?.id });
  } catch (sendError) {
    console.error("[photo-booth-request] Exception while sending email:", sendError);
    if (logEventRequestEmailFailed(ROUTE)) flushLogsAfterResponse();
    return fail("Email send failed.", 500);
  }
}

export const runtime = "nodejs";

import { Resend } from "resend";
import EventRequestNotification from "@/emails/EventRequestNotification";

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
  const startTime = Date.now();
  console.log("[send-request] ========== NEW REQUEST ==========");
  console.log("[send-request] Timestamp:", new Date().toISOString());
  console.log("[send-request] Request URL:", request.url);
  console.log("[send-request] Request method:", request.method);

  const ip = getClientIp(request);
  console.log("[send-request] Client IP:", ip);

  const now = Date.now();
  const existing = rateLimitStore.get(ip);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    console.log("[send-request] Rate limit: First request from this IP");
  } else if (existing.count >= RATE_LIMIT_MAX) {
    console.log("[send-request] Rate limit exceeded for IP:", ip, "Count:", existing.count);
    return Response.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  } else {
    existing.count += 1;
    console.log("[send-request] Rate limit count for IP:", existing.count);
  }

  let payload: RequestPayload | null = null;
  try {
    payload = await request.json();
  } catch (parseError) {
    console.error("[send-request] JSON parse error:", parseError);
    return Response.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  if (!payload) {
    console.error("[send-request] Payload is null after parsing");
    return Response.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  if (payload.website) {
    console.log("[send-request] Honeypot triggered, ignoring submission");
    return Response.json({ ok: true });
  }

  const clean = (value?: string) => (value ?? "").trim();
  const clamp = (value: string, max: number) =>
    value.length > max ? value.slice(0, max) : value;
  const partyType = clamp(clean(payload.partyType), 60);
  console.log("[send-request] Payload received:", Object.keys(payload));
  console.log("[send-request] Party Type:", partyType);

  console.log("[send-request] Validating required fields...");
  const missing = [
    ["date", payload.date],
    ["firstName", payload.firstName],
    ["lastName", payload.lastName],
    ["partyType", partyType],
    ["phone", payload.phone],
    ["email", payload.email],
  ].filter(([, value]) => !value || !String(value).trim());

  if (missing.length > 0) {
    console.error("[send-request] Missing required fields:", missing.map(([field]) => field));
    return Response.json(
      {
        ok: false,
        error: "Missing required fields.",
        fields: missing.map(([field]) => field),
      },
      { status: 400 }
    );
  }

  console.log("[send-request] All required fields present");

  if (!datePattern.test(String(payload.date))) {
    console.error("[send-request] Invalid date format:", payload.date);
    return Response.json({ ok: false, error: "Invalid date format." }, { status: 400 });
  }

  if (!emailPattern.test(String(payload.email))) {
    console.error("[send-request] Invalid email format:", payload.email);
    return Response.json({ ok: false, error: "Invalid email address." }, { status: 400 });
  }

  console.log("[send-request] Validation passed, checking environment variables...");

  const { RESEND_API_KEY, LEADS_TO_EMAIL, SMTP_FROM } = process.env;

  console.log("[send-request] Environment check:", {
    hasResendKey: !!RESEND_API_KEY,
    resendKeyPrefix: RESEND_API_KEY ? RESEND_API_KEY.substring(0, 5) + "..." : "NOT SET",
    hasLeadsEmail: !!LEADS_TO_EMAIL,
    leadsEmail: LEADS_TO_EMAIL || "NOT SET",
    hasSmtpFrom: !!SMTP_FROM,
    smtpFrom: SMTP_FROM || "NOT SET (will use default)",
  });

  if (!RESEND_API_KEY || !LEADS_TO_EMAIL) {
    console.error("[send-request] FATAL: Missing required environment variables!");
    console.error("[send-request] RESEND_API_KEY:", RESEND_API_KEY ? "SET" : "MISSING");
    console.error("[send-request] LEADS_TO_EMAIL:", LEADS_TO_EMAIL ? "SET" : "MISSING");
    return Response.json({ ok: false, error: "Email service not configured." }, { status: 500 });
  }

  console.log("[send-request] Initializing Resend client...");
  const resend = new Resend(RESEND_API_KEY);

  const dateLabel = formatDate(String(payload.date));
  const messageText = payload.message?.trim() ? payload.message.trim() : "None";

  const emailText = `New Event Request – Loft 442

Name: ${payload.firstName} ${payload.lastName}
Email: ${payload.email}
Phone: ${payload.phone ?? ""}
Type of Party: ${partyType || "Unknown"}
Date: ${dateLabel}

Message:
${messageText}
`;

  const fromAddress = SMTP_FROM ?? "Loft 442 <onboarding@resend.dev>";
  console.log("[send-request] Preparing to send email...");
  console.log("[send-request] From:", fromAddress);
  console.log("[send-request] To:", LEADS_TO_EMAIL);
  console.log("[send-request] Reply-To:", payload.email);
  console.log("[send-request] Subject:", `New Event Request – ${partyType || "Unknown"}`);

  try {
    const result = await resend.emails.send({
      from: fromAddress,
      to: LEADS_TO_EMAIL,
      replyTo: payload.email,
      subject: `New Event Request – ${partyType || "Unknown"}`,
      react: EventRequestNotification({
        firstName: String(payload.firstName),
        lastName: String(payload.lastName),
        email: String(payload.email),
        phone: String(payload.phone ?? ""),
        partyType: partyType || "Unknown",
        dateLabel,
        messageText,
      }),
      text: emailText, // fallback for clients that can't render HTML
    });

    console.log("[send-request] Resend API response received");
    console.log("[send-request] Result:", JSON.stringify(result, null, 2));

    if ((result as any).error) {
      const err = (result as any).error;
      console.error("[send-request] Resend API returned error:");
      console.error("[send-request] Error name:", err?.name);
      console.error("[send-request] Error message:", err?.message);
      return Response.json({ ok: false, error: "Email send failed." }, { status: 500 });
    }

    const duration = Date.now() - startTime;
    console.log("[send-request] ✅ Email sent successfully!");
    console.log("[send-request] Email ID:", (result as any).data?.id);
    console.log("[send-request] Total duration:", duration, "ms");
    console.log("[send-request] ========== REQUEST COMPLETE ==========");

    return Response.json({ ok: true, id: (result as any).data?.id });
  } catch (sendError) {
    console.error("[send-request] ❌ Exception while sending email:");
    console.error("[send-request] Error type:", typeof sendError);
    console.error("[send-request] Error:", sendError);
    if (sendError instanceof Error) {
      console.error("[send-request] Error name:", sendError.name);
      console.error("[send-request] Error message:", sendError.message);
      console.error("[send-request] Error stack:", sendError.stack);
    }
    return Response.json({ ok: false, error: "Email send failed." }, { status: 500 });
  }
}

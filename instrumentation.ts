import { SeverityNumber } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

let loggerProvider: LoggerProvider | undefined;

function getLoggerProvider() {
  if (loggerProvider) return loggerProvider;

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!projectToken || !host) {
    if (process.env.NODE_ENV !== "production") {
      const missingVariable = !projectToken
        ? "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN"
        : "NEXT_PUBLIC_POSTHOG_HOST";

      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      );
    }

    return undefined;
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ "service.name": "loft-442" }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host.replace(/\/$/, "")}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${projectToken}`,
            "Content-Type": "application/json",
          },
        }),
      }),
    ],
  });

  return loggerProvider;
}

function emitEventRequestLog(body: string, severityNumber: SeverityNumber) {
  const logger = getLoggerProvider()?.getLogger("loft-442-posthog");
  if (!logger) return false;

  logger.emit({
    body,
    severityNumber,
    attributes: {
      route: "/api/send-request",
      operation: "event_request_email_delivery",
    },
  });

  return true;
}

export function logEventRequestEmailConfigured() {
  return emitEventRequestLog("event_request_email_not_configured", SeverityNumber.ERROR);
}

export function logEventRequestEmailFailed() {
  return emitEventRequestLog("event_request_email_delivery_failed", SeverityNumber.ERROR);
}

export function logEventRequestEmailSent() {
  return emitEventRequestLog("event_request_email_delivery_succeeded", SeverityNumber.INFO);
}

export async function flushPostHogLogs() {
  await loggerProvider?.forceFlush();
}

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    getLoggerProvider();
  }
}

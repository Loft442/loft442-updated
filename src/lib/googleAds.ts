const GOOGLE_ADS_ID_PATTERN = /^AW-\d+$/;
const GA4_ID_PATTERN = /^G-[A-Z0-9]+$/;
const CONVERSION_LABEL_PATTERN = /^[A-Za-z0-9_-]+$/;

/** Google tag for the Loft 442 Ads account (conversion tracking id 17363960945). */
const DEFAULT_GOOGLE_ADS_ID = "AW-17363960945";

/** Google Analytics 4 measurement ID for loft442.com. */
const DEFAULT_GA4_MEASUREMENT_ID = "G-FE6GS4M5Z9";

/** Website call conversion: AW id + label from Google Ads. */
const DEFAULT_PHONE_CONVERSION_SEND_TO = "AW-17363960945/qWXZCMDUprAdEPGI5NdA";
const DEFAULT_PHONE_CONVERSION_NUMBER = "(347) 579-6578";

/**
 * Website conversion "Book appointment".
 * Google's event snippet sends this event; the account has no AW conversion label.
 */
const DEFAULT_SEND_REQUEST_EVENT = "ads_conversion_Book_appointment_1";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function getGoogleAdsId() {
  const configured = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() ?? "";
  if (!configured) return DEFAULT_GOOGLE_ADS_ID;
  return GOOGLE_ADS_ID_PATTERN.test(configured) ? configured : "";
}

export function getGa4MeasurementId() {
  const configured = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim() ?? "";
  if (!configured) return DEFAULT_GA4_MEASUREMENT_ID;
  return GA4_ID_PATTERN.test(configured) ? configured : "";
}

export function getPhoneConversionConfig() {
  const sendTo =
    process.env.NEXT_PUBLIC_GOOGLE_ADS_PHONE_CONVERSION_SEND_TO?.trim() ||
    DEFAULT_PHONE_CONVERSION_SEND_TO;
  const phoneNumber =
    process.env.NEXT_PUBLIC_GOOGLE_ADS_PHONE_CONVERSION_NUMBER?.trim() ||
    DEFAULT_PHONE_CONVERSION_NUMBER;

  if (!/^AW-\d+\/[A-Za-z0-9_-]+$/.test(sendTo)) return null;
  if (!phoneNumber) return null;

  return { sendTo, phoneNumber };
}

export function trackSendRequestConversion() {
  const id = getGoogleAdsId();
  if (!id || typeof window === "undefined") return;

  const label = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL?.trim() ?? "";
  const useLabel = CONVERSION_LABEL_PATTERN.test(label);

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      window.dataLayer?.push(arguments);
    };
  }

  if (useLabel) {
    window.gtag("event", "conversion", { send_to: `${id}/${label}` });
    return;
  }

  window.gtag("event", DEFAULT_SEND_REQUEST_EVENT);
}

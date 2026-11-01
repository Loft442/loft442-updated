const GOOGLE_ADS_ID_PATTERN = /^AW-\d+$/;
const CONVERSION_LABEL_PATTERN = /^[A-Za-z0-9_-]+$/;

/** Google tag for the Loft 442 Ads account (conversion tracking id 17363960945). */
const DEFAULT_GOOGLE_ADS_ID = "AW-17363960945";

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

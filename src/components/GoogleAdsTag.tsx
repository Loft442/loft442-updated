import Script from "next/script";
import {
  getGa4MeasurementId,
  getGoogleAdsId,
  getPhoneConversionConfig,
} from "@/lib/googleAds";

/**
 * Conversion / attribution bootstrap:
 * - Tiny inline stub runs immediately so dataLayer + gtag() queue exist before
 *   any user interaction (UTM/GCLID config commands are queued, conversion
 *   helpers can push events safely).
 * - The heavy googletagmanager.com script loads after the window `load` event
 *   so it does not contend with LCP images on mobile, then drains the queue.
 */
export default function GoogleAdsTag() {
  const adsId = getGoogleAdsId();
  const ga4Id = getGa4MeasurementId();
  const phoneConversion = getPhoneConversionConfig();
  const primaryId = adsId || ga4Id;
  if (!primaryId) return null;

  const configCalls = [
    adsId ? `gtag('config', '${adsId}', { send_page_view: true });` : "",
    ga4Id ? `gtag('config', '${ga4Id}', { send_page_view: true });` : "",
    phoneConversion
      ? `gtag('config', '${phoneConversion.sendTo}', {
  'phone_conversion_number': '${phoneConversion.phoneNumber}'
});`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const bootstrap = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
${configCalls}`;

  return (
    <>
      <Script id="google-ads-gtag-bootstrap" strategy="beforeInteractive">
        {bootstrap}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="lazyOnload"
      />
    </>
  );
}

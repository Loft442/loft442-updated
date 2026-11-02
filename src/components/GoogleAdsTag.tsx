import Script from "next/script";
import {
  getGa4MeasurementId,
  getGoogleAdsId,
  getPhoneConversionConfig,
} from "@/lib/googleAds";

export default function GoogleAdsTag() {
  const adsId = getGoogleAdsId();
  const ga4Id = getGa4MeasurementId();
  const phoneConversion = getPhoneConversionConfig();
  const primaryId = adsId || ga4Id;
  if (!primaryId) return null;

  const configCalls = [
    adsId ? `gtag('config', '${adsId}');` : "",
    ga4Id ? `gtag('config', '${ga4Id}');` : "",
    phoneConversion
      ? `gtag('config', '${phoneConversion.sendTo}', {
  'phone_conversion_number': '${phoneConversion.phoneNumber}'
});`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
${configCalls}`}
      </Script>
    </>
  );
}

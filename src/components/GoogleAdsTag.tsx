import Script from "next/script";
import { getGa4MeasurementId, getGoogleAdsId } from "@/lib/googleAds";

export default function GoogleAdsTag() {
  const adsId = getGoogleAdsId();
  const ga4Id = getGa4MeasurementId();
  const primaryId = adsId || ga4Id;
  if (!primaryId) return null;

  const configCalls = [adsId, ga4Id]
    .filter(Boolean)
    .map((id) => `gtag('config', '${id}');`)
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

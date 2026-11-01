import Script from "next/script";
import { getGoogleAdsId } from "@/lib/googleAds";

export default function GoogleAdsTag() {
  const id = getGoogleAdsId();
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}

import type { NextConfig } from "next";

const baseHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
];

const siteHeaders = [
  ...baseHeaders,
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      // Images (your site + Instagram CDN + Sanity gallery uploads + Google static)
      // A leading "*." already matches subdomains at any depth; "*.*." is invalid CSP.
      "img-src 'self' data: blob: https://*.cdninstagram.com https://*.fbcdn.net https://cdn.sanity.io https://maps.gstatic.com https://maps.google.com",
      // Video (Instagram Reels + Sanity gallery uploads)
      "media-src 'self' https://*.cdninstagram.com https://*.fbcdn.net https://cdn.sanity.io",
      // Scripts (Google Maps + Instagram embed if used)
      "script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com https://www.instagram.com",
      // Styles (Tailwind/inline styles + Google)
      "style-src 'self' 'unsafe-inline'",
      // Frames for embeds
      "frame-src 'self' https://www.google.com https://maps.google.com https://www.instagram.com",
      // Network calls (if any client-side fetches)
      "connect-src 'self' https://maps.googleapis.com https://maps.gstatic.com",
    ].join("; "),
  },
];

// Sanity Studio talks to the Sanity API (HTTPS + live-update websockets), loads
// asset previews from the Sanity CDN, and uses blob: workers and previews.
const studioHeaders = [
  ...baseHeaders,
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "img-src 'self' data: blob: https://*.sanity.io https://*.sanity-cdn.com https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
      "media-src 'self' blob: https://*.sanity.io https://*.sanity-cdn.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.sanity-cdn.com",
      "style-src 'self' 'unsafe-inline' https://*.sanity-cdn.com",
      "font-src 'self' data: https://*.sanity-cdn.com",
      "worker-src 'self' blob:",
      "frame-src 'self' https://*.sanity.io",
      "connect-src 'self' https://*.sanity.io wss://*.sanity.io https://*.sanity-cdn.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    qualities: [75, 80, 85],
    formats: ["image/avif", "image/webp"],
    // The largest source image is 1920px wide, so wider variants only waste bytes.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Instagram feed images, resized so grid tiles don't download full originals.
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
      // Client gallery uploads from Sanity Studio.
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async headers() {
    // Browsers enforce every CSP header they receive, so /studio must be excluded
    // from the site policy rather than given a second, looser one.
    return [
      { source: "/((?!studio(?:/|$)).*)", headers: siteHeaders },
      { source: "/studio", headers: studioHeaders },
      { source: "/studio/:path*", headers: studioHeaders },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      // Images (your site + Instagram CDN + Google static)
      "img-src 'self' data: blob: https://*.cdninstagram.com https://*.fbcdn.net https://maps.gstatic.com https://maps.google.com",
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
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85, 90, 100],
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;

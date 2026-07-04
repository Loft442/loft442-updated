import type { Metadata, Viewport } from "next";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import NavbarVisibility from "@/components/NavbarVisibility";
import RevealOnScroll from "@/components/RevealOnScroll";
import InstagramFloatingButton from "@/components/InstagramFloatingButton";
import JsonLd from "@/components/JsonLd";
import { inter } from "@/lib/fonts";
import {
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  localBusinessJsonLd,
} from "@/lib/seo";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Luxury Event Venue`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "LOFT 442",
    "event venue Elmont NY",
    "wedding venue Nassau County",
    "repass venue",
    "event catering",
    "private event space",
    "corporate event venue",
    "Long Island event venue",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Luxury Event Venue`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Luxury Event Venue in Elmont, NY`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Luxury Event Venue`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favico-logo3.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(inter.variable, "font-sans", geist.variable)}
    >
      <body className="antialiased">
        <JsonLd data={localBusinessJsonLd()} />
        <NavbarVisibility />
        <RevealOnScroll />
        <PageTransition>{children}</PageTransition>
        <InstagramFloatingButton />
      </body>
    </html>
  );
}

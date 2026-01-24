import type { Metadata, Viewport } from "next";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import NavbarVisibility from "@/components/NavbarVisibility";
import RevealOnScroll from "@/components/RevealOnScroll";
import InstagramFloatingButton from "@/components/InstagramFloatingButton";
import { inter, playfair } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Loft 442 | Luxury Event Venue",
  description:
    "Loft 442 is a veteran-owned event venue designed for elegant weddings, corporate events, and private celebrations.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@200..900&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <NavbarVisibility />
        <RevealOnScroll />
        <PageTransition>{children}</PageTransition>
        <InstagramFloatingButton />
      </body>
    </html>
  );
}

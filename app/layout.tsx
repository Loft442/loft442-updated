import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import RevealOnScroll from "@/components/RevealOnScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Loft 442 | Luxury Event Venue",
  description:
    "Loft 442 is a veteran-owned event venue designed for elegant weddings, corporate events, and private celebrations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Navbar />
        <RevealOnScroll />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}

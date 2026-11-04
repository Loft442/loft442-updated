import { Gilda_Display, Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Display serif for headings; Inter stays for body copy and labels.
// Gilda Display ships a single weight (400) and no italic.
export const gilda = Gilda_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

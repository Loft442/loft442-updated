import { Gilda_Display, Inter } from "next/font/google";

// Subset to weights actually used in CSS/components (light 300, regular 400,
// semibold 600). Avoids shipping the full 100–900 variable axis (~47KB+).
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "600"],
});

// Display serif for headings; Inter stays for body copy and labels.
// Gilda Display ships a single weight (400) and no italic.
export const gilda = Gilda_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

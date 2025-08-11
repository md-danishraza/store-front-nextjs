// lib/font.ts
import { Inter, Roboto, Lora } from "next/font/google";

export const primaryFont = Inter({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: ["400", "700"], // Regular & Bold
  display: "swap",
});

export const secondaryFont = Roboto({
  subsets: ["latin"],
  variable: "--font-secondary",
  weight: ["400", "700"],
  display: "swap",
});

export const paragraphFont = Lora({
  subsets: ["latin"],
  variable: "--font-paragraph",
  weight: ["400"], // Regular
  display: "swap",
});

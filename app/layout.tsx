import Script from "next/script";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { primaryFont, secondaryFont, paragraphFont } from "@/lib/fonts"
import Navbar from "@/components/navbar/Navbar";
import Container from "@/components/global/Container";
import Providers from "./Providers";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from '@clerk/nextjs';
import Footer from "@/components/footer/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "StoreFront",
  description: "Next js app store and ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider>
        <html lang="en" suppressHydrationWarning
         className={`${primaryFont.variable} ${secondaryFont.variable} ${paragraphFont.variable}`}
        >
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased font-paragraph`}
          >
            <Providers>
              <main className="flex flex-col min-h-screen w-full">
                <Navbar />

                {/* Content wrapper that grows */}
                <div className="flex-1">
                  <Container className="py-8">
                    {children}
                  </Container>
                </div>

                <Toaster />
                <Footer />
              </main>
            </Providers>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
          </body>
        </html>
       </ClerkProvider>
  );
}

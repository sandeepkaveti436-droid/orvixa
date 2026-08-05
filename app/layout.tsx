import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CookieConsent from "@/src/components/CookieConsent";

// Load Montserrat (Normal / Body Font)
const montserrat = localFont({
  src: "../public/fonts/Montserrat-Regular.ttf",
  variable: "--font-montserrat",
  display: "swap",
});

// Load The Season (Heading Font)
const theSeason = localFont({
  src: "../public/fonts/TheSeasons-Bd.otf",
  variable: "--font-the-season",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orvixa - AI Powered Work Management Platform",
  description: "Work smarter. Organize everything. Scale without limits.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${theSeason.variable}`}>
      <body className="bg-white text-slate-900 font-sans antialiased">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}

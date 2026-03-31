import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "leaflet/dist/leaflet.css";
import { BottomNav } from "@/components/shell/bottom-nav";
import { TopBar } from "@/components/shell/top-bar";
import { JsonLd } from "@/components/seo/json-ld";
import { buildWebSite, buildSoftwareApplication } from "@/lib/schema";
import { SITE_NAME, SITE_DESCRIPTION, siteUrl } from "@/lib/seo-constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} — Precision Solar Tracking for Photographers & Astronomers`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "sunrise time",
    "sunset time",
    "golden hour",
    "blue hour",
    "sun position",
    "solar tracking",
    "photography timing",
    "sun calculator",
    "celestial alignment",
    "analemma",
    "solar noon",
    "sun elevation",
    "sun azimuth",
  ],
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-surface font-body text-on-surface">
        <TopBar />
        <main className="flex-1 p-3 pb-20 md:p-5 md:pb-0">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>
        <BottomNav />
        <JsonLd data={[buildWebSite(), buildSoftwareApplication()]} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

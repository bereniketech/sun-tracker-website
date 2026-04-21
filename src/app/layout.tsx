import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from "next-themes";
import "leaflet/dist/leaflet.css";
import { BottomNav } from "@/components/shell/bottom-nav";
import { TopBar } from "@/components/shell/top-bar";
import { JsonLd } from "@/components/seo/json-ld";
import { buildOrganization, buildWebSite, buildSoftwareApplication } from "@/lib/schema";
import { SITE_NAME, SITE_DESCRIPTION, siteUrl } from "@/lib/seo-constants";
import { OfflineMonitor } from "@/components/offline-monitor";
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
    default: "Sun Tracker - Real-Time Sun Position, Sunrise & Sunset Calculator",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    "sun tracker",
    "sun tracking",
    "sun tracking app",
    "suntracker",
    "sunrise time",
    "sunset time",
    "sunrise sunset calculator",
    "golden hour",
    "golden hour calculator",
    "blue hour",
    "sun position",
    "sun position map",
    "solar tracking",
    "solar tracker",
    "photography timing",
    "sun calculator",
    "celestial alignment",
    "analemma",
    "solar noon",
    "sun elevation",
    "sun azimuth",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    title: "Sun Tracker by Helios Chrono",
    description: SITE_DESCRIPTION,
    url: siteUrl("/"),
    images: [
      {
        url: siteUrl("/globe.svg"),
        width: 512,
        height: 512,
        alt: "Sun Tracker by Helios Chrono",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sun Tracker by Helios Chrono",
    description: SITE_DESCRIPTION,
    images: [siteUrl("/globe.svg")],
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
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f59e0b" />
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-surface font-body text-on-surface">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="sun-tracker-theme">
          <OfflineMonitor />
          <TopBar />
          <main className="flex-1 p-3 pb-20 md:p-5 md:pb-0">
            <div className="mx-auto w-full max-w-[1600px]">
              {children}
            </div>
          </main>
          <BottomNav />
          <JsonLd data={[buildOrganization(), buildWebSite(), buildSoftwareApplication()]} />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}

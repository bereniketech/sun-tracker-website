import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import "leaflet/dist/leaflet.css";
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
  title: "Sun Tracker",
  description: "See where the sun rises and sets for any location, any time.",
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
        <header className="border-b bg-white/90 px-4 py-3 backdrop-blur md:px-6">
          <div className="mx-auto w-full max-w-[1600px]">
            <p className="text-lg font-semibold tracking-tight text-slate-900">Sun Tracker</p>
          </div>
        </header>

        <main className="flex-1 p-3 md:p-5">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}

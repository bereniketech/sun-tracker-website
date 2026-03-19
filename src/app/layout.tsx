import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Sun Tracker",
  description: "Interactive sun position and lighting planner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen font-sans">
        <div className="app-grid">
          <header className="col-span-full border-b bg-white/90 px-4 py-3 backdrop-blur md:px-6">
            <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4">
              <p className="text-lg font-semibold tracking-tight">Sun Tracker</p>
              <p className="text-sm text-slate-600">Task 004 Search &amp; Geolocation</p>
            </div>
          </header>

          <main className="order-2 p-4 md:order-1 md:p-6">
            <section className="mx-auto h-full w-full max-w-[1600px] rounded-2xl border bg-white p-4 shadow-sm md:p-6">
              {children}
            </section>
          </main>

          <aside className="order-1 border-b bg-slate-50/80 p-4 md:order-2 md:border-b-0 md:border-l md:p-6">
            <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col gap-3">
              <h2 className="text-base font-semibold">Map Controls</h2>
              <p className="text-sm text-slate-600">
                Search places with debounced suggestions, jump to manual coordinates,
                use your current position, or drag the pin to fine-tune the map.
              </p>
            </div>
          </aside>
        </div>
      </body>
    </html>
  );
}

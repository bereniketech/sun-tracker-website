import type { Metadata } from "next";
import { HomePageClient } from "@/components/home-page-client";
import { JsonLd } from "@/components/seo/json-ld";
import { buildWebPage, buildBreadcrumbList } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Sun Tracker Dashboard - Real-Time Sun Position Map",
  description:
    "Track the sun's position in real time on an interactive map. Find sunrise, sunset, golden hour, and blue hour times for any location worldwide. Free sun tracking app and precision solar calculator for photographers and astronomers.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPage(
            "Sun Tracker Dashboard",
            "Real-time sun position tracking with interactive map, sunrise/sunset times, golden hour and blue hour windows for any location.",
            "/",
          ),
          buildBreadcrumbList([{ name: "Home", url: "/" }]),
        ]}
      />
      <HomePageClient />
    </>
  );
}

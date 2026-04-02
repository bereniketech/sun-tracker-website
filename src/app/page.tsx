import type { Metadata } from "next";
import { HomePageClient } from "@/components/home-page-client";
import { JsonLd } from "@/components/seo/json-ld";
import { buildWebPage, buildBreadcrumbList } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Real-Time Sun Tracker, Sunrise & Golden Hour Times",
  description:
    "Track the sun in real time for any location. Get sunrise, sunset, golden hour, and blue hour times on an interactive map built for photographers, travelers, and outdoor planning.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Real-Time Sun Tracker, Sunrise & Golden Hour Times",
    description:
      "Track the sun in real time for any location. Get sunrise, sunset, golden hour, and blue hour times on an interactive map built for photographers, travelers, and outdoor planning.",
    url: "/",
  },
  twitter: {
    title: "Real-Time Sun Tracker, Sunrise & Golden Hour Times",
    description:
      "Track the sun in real time for any location. Get sunrise, sunset, golden hour, and blue hour times on an interactive map built for photographers, travelers, and outdoor planning.",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPage(
            "Real-Time Sun Tracker, Sunrise & Golden Hour Times",
            "Track the sun in real time for any location with sunrise, sunset, golden hour, and blue hour timing on an interactive map.",
            "/",
          ),
          buildBreadcrumbList([{ name: "Home", url: "/" }]),
        ]}
      />
      <HomePageClient />
    </>
  );
}

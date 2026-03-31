import type { Metadata } from "next";
import ObservatoryClient from "./observatory-client";
import { JsonLd } from "@/components/seo/json-ld";
import { buildWebPage, buildBreadcrumbList } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Live Sun Observatory — Real-Time Solar Telemetry",
  description:
    "Monitor the sun's position in real time with live solar telemetry data. View current azimuth, elevation, and solar noon timing. Real-time calibration and system status for precision solar tracking.",
  alternates: { canonical: "/observatory" },
};

export default function ObservatoryPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPage(
            "Live Sun Observatory",
            "Real-time solar telemetry dashboard showing current sun azimuth, elevation, and position data.",
            "/observatory",
          ),
          buildBreadcrumbList([
            { name: "Home", url: "/" },
            { name: "Observatory", url: "/observatory" },
          ]),
        ]}
      />
      <ObservatoryClient />
    </>
  );
}

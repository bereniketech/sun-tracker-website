import type { Metadata } from "next";
import LandmarksClient from "./landmarks-client";
import { AdUnit } from "@/components/ads/ad-unit";
import { JsonLd } from "@/components/seo/json-ld";
import { buildWebPage, buildBreadcrumbList } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Solar-Aligned Landmarks — Ancient Monuments and the Sun's Path",
  description:
    "Explore landmarks aligned with the sun's path, including ancient monuments, temples, and modern structures designed around solstice and equinox solar alignments. Discover sunrise and sunset alignments at Stonehenge, Karnak Temple, Angkor Wat, and more.",
  alternates: { canonical: "/landmarks" },
};

export default function LandmarksPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPage(
            "Solar-Aligned Landmarks",
            "A gallery of landmarks worldwide that align with the sun during solstices, equinoxes, and other astronomical events.",
            "/landmarks",
          ),
          buildBreadcrumbList([
            { name: "Home", url: "/" },
            { name: "Landmarks", url: "/landmarks" },
          ]),
        ]}
      />
      <LandmarksClient />
      <AdUnit adSlot="LANDMARKS_BOTTOM" adFormat="horizontal" className="mt-6" />
    </>
  );
}

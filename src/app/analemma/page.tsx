import type { Metadata } from "next";
import AnalemmaClient from "./analemma-client";
import { AdUnit } from "@/components/ads/ad-unit";
import { JsonLd } from "@/components/seo/json-ld";
import { buildWebPage, buildBreadcrumbList, buildHowTo } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Analemma — The Sun's Figure-8 Path Explained",
  description:
    "Explore the analemma — the figure-8 pattern the sun traces across the sky over a year. Interactive visualization showing how the sun's position shifts due to Earth's axial tilt and orbital eccentricity. Essential reference for solar photographers and astronomers.",
  alternates: { canonical: "/analemma" },
};

export default function AnalemmaPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPage(
            "Analemma — The Sun's Figure-8 Path",
            "Interactive analemma visualization showing the sun's annual figure-8 pattern caused by Earth's axial tilt (23.4°) and orbital eccentricity.",
            "/analemma",
          ),
          buildBreadcrumbList([
            { name: "Home", url: "/" },
            { name: "Analemma", url: "/analemma" },
          ]),
          buildHowTo(
            "How to Read an Analemma Chart",
            "Understanding the sun's figure-8 path across the sky over one year.",
            [
              {
                name: "Identify the vertical axis",
                text: "The vertical axis represents solar elevation — how high the sun appears above the horizon at a fixed time each day.",
              },
              {
                name: "Identify the horizontal axis",
                text: "The horizontal axis shows the sun's azimuth deviation — how far east or west the sun drifts from its average position.",
              },
              {
                name: "Locate the solstices",
                text: "The top of the figure-8 marks the summer solstice (highest elevation), and the bottom marks the winter solstice (lowest elevation).",
              },
              {
                name: "Find the equinoxes",
                text: "The crossover point of the figure-8 occurs near the equinoxes, when day and night are approximately equal in length.",
              },
              {
                name: "Use for photography planning",
                text: "Select any date on the analemma to predict exactly where the sun will be at that time of day, enabling precise shot planning months in advance.",
              },
            ],
          ),
        ]}
      />
      <AnalemmaClient />
      <AdUnit adSlot="ANALEMMA_BOTTOM" adFormat="horizontal" className="mt-6" />
    </>
  );
}

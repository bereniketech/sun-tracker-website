import type { Metadata } from "next";
import { getCityBySlug } from "@/lib/cities";

export const revalidate = 86400;

interface CityLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CityLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const city = await getCityBySlug(slug);

  if (!city) {
    return {
      title: "City Sun Times | Sun Tracker",
      description:
        "Find sunrise, sunset, golden hour, and blue hour times. Plan photography and outdoor activities with Sun Tracker.",
    };
  }

  const cityLabel = `${city.name}, ${city.country}`;

  return {
    title: `Sunrise & Sunset Times in ${cityLabel} | Sun Tracker`,
    description: `Find sunrise, sunset, golden hour, and blue hour times in ${cityLabel}. Plan your photography and activities with real-time sun position data.`,
    alternates: {
      canonical: `/city/${city.slug}`,
    },
    openGraph: {
      title: `Sunrise & Sunset Times in ${cityLabel} | Sun Tracker`,
      description: `Sunrise, sunset, golden hour, and blue hour information for ${cityLabel}.`,
      url: `/city/${city.slug}`,
      type: "article",
    },
  };
}

export default function CityLayout({ children }: CityLayoutProps) {
  return children;
}

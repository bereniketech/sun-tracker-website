import type { MetadataRoute } from "next";
import { getAllCities } from "@/lib/cities";

const DEFAULT_SITE_URL = "https://sun-tracker.example.com";

function baseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv.replace(/\/$/, "") : DEFAULT_SITE_URL;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const root = baseUrl();
  const cities = await getAllCities();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${root}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${root}/city`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${root}/city/${city.slug}`,
    lastModified: city.updated_at ? new Date(city.updated_at) : new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...cityRoutes];
}

import type { MetadataRoute } from "next";
import { getAllCities } from "@/lib/cities";
import { siteUrl } from "@/lib/seo-constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cities = await getAllCities();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: siteUrl("/city"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: siteUrl("/about"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: siteUrl("/analemma"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: siteUrl("/landmarks"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: siteUrl("/observatory"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => ({
    url: siteUrl(`/city/${city.slug}`),
    lastModified: city.updated_at ? new Date(city.updated_at) : new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...cityRoutes];
}

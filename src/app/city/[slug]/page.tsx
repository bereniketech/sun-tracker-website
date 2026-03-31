import Link from "next/link";
import { notFound } from "next/navigation";
import { SeasonalInsights } from "@/components/panels/seasonal-insights";
import { computeSunData } from "@/lib/sun";
import { getAllCities, getCityBySlug, getRelatedCities } from "@/lib/cities";
import type { MonthlySunSnapshot } from "@/types/cities";

export const revalidate = 86400;

interface CityPageProps {
  params: Promise<{ slug: string }>;
}

function formatTimeForZone(iso: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone,
      timeZoneName: "short",
    }).format(new Date(iso));
  } catch {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    }).format(new Date(iso));
  }
}

function formatDuration(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function trackerHref(lat: number, lng: number, name: string): string {
  const params = new URLSearchParams({
    lat: lat.toFixed(6),
    lng: lng.toFixed(6),
    name,
  });
  return `/?${params.toString()}`;
}

function monthlyRows(monthlyData: MonthlySunSnapshot[], timezone: string): Array<{
  month: string;
  sunrise: string;
  sunset: string;
  goldenMorning: string;
  goldenEvening: string;
  blueMorning: string;
  blueEvening: string;
}> {
  return monthlyData.map((item) => ({
    month: item.monthLabel,
    sunrise: formatTimeForZone(item.sunriseIso, timezone),
    sunset: formatTimeForZone(item.sunsetIso, timezone),
    goldenMorning: `${formatTimeForZone(item.goldenHourMorningStartIso, timezone)} - ${formatTimeForZone(item.goldenHourMorningEndIso, timezone)}`,
    goldenEvening: `${formatTimeForZone(item.goldenHourEveningStartIso, timezone)} - ${formatTimeForZone(item.goldenHourEveningEndIso, timezone)}`,
    blueMorning: `${formatTimeForZone(item.blueHourMorningStartIso, timezone)} - ${formatTimeForZone(item.blueHourMorningEndIso, timezone)}`,
    blueEvening: `${formatTimeForZone(item.blueHourEveningStartIso, timezone)} - ${formatTimeForZone(item.blueHourEveningEndIso, timezone)}`,
  }));
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const cities = await getAllCities();
  return cities.map((city) => ({ slug: city.slug }));
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const city = await getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  const todaySunData = computeSunData(city.lat, city.lng, new Date());
  const monthly = monthlyRows(city.precomputed_data, city.timezone);
  const relatedCities = await getRelatedCities(city.country, city.slug, 6);

  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Sunrise and Sunset Times in ${city.name}`,
    description: `Find sunrise, sunset, golden hour, and blue hour times in ${city.name}, ${city.country}.`,
    url: `/city/${city.slug}`,
    about: {
      "@type": "Place",
      name: `${city.name}, ${city.country}`,
      geo: {
        "@type": "GeoCoordinates",
        latitude: city.lat,
        longitude: city.lng,
      },
    },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What time is sunrise in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Sunrise time in ${city.name} changes during the year. Use this page for monthly trends and the live tracker for exact daily times.`,
        },
      },
      {
        "@type": "Question",
        name: `When is golden hour in ${city.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Golden hour typically occurs just after sunrise and before sunset. This page shows precomputed monthly ranges for ${city.name}.`,
        },
      },
    ],
  };

  return (
    <article className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-slate-500">City Sun Guide</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Sunrise and Sunset in {city.name}, {city.country}
        </h1>
        <p className="max-w-3xl text-sm text-slate-600 md:text-base">
          Monthly sunrise, sunset, golden hour, and blue hour times for {city.name}. Use this city page
          for planning, then jump into the interactive map for exact location and time control.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={trackerHref(city.lat, city.lng, city.name)}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Open in tracker
          </Link>
          <Link
            href="/city"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            Browse all cities
          </Link>
        </div>
      </header>

      <section className="grid gap-4 rounded-xl border bg-slate-50 p-4 md:grid-cols-2 md:p-6">
        <h2 className="sr-only">Today overview</h2>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Today sunrise</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {formatTimeForZone(todaySunData.sunrise.toISOString(), city.timezone)}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Today sunset</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {formatTimeForZone(todaySunData.sunset.toISOString(), city.timezone)}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Golden hour (morning)</p>
          <p className="mt-1 text-sm text-slate-800">
            {formatTimeForZone(todaySunData.goldenHour.start.toISOString(), city.timezone)} - {" "}
            {formatTimeForZone(todaySunData.goldenHour.end.toISOString(), city.timezone)}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Blue hour (evening)</p>
          <p className="mt-1 text-sm text-slate-800">
            {formatTimeForZone(todaySunData.blueHourEvening.start.toISOString(), city.timezone)} - {" "}
            {formatTimeForZone(todaySunData.blueHourEvening.end.toISOString(), city.timezone)}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 md:col-span-2">
          <p className="text-sm font-medium text-slate-500">Day length</p>
          <p className="mt-1 text-sm text-slate-800">{formatDuration(todaySunData.dayLength)}</p>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-4 md:p-6">
        <div className="mb-4 space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">Seasonal daylight chart</h2>
          <p className="text-sm text-slate-600">
            Compare sunrise, sunset, and daylight length across the year in {city.name}.
          </p>
        </div>
        <SeasonalInsights lat={city.lat} lng={city.lng} />
      </section>

      <section className="overflow-x-auto rounded-xl border bg-white">
        <h2 className="border-b px-4 py-3 text-lg font-semibold text-slate-900 md:px-6">
          Monthly sun times
        </h2>
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold md:px-6">Month</th>
              <th className="px-4 py-3 font-semibold">Sunrise</th>
              <th className="px-4 py-3 font-semibold">Sunset</th>
              <th className="px-4 py-3 font-semibold">Golden AM</th>
              <th className="px-4 py-3 font-semibold">Golden PM</th>
              <th className="px-4 py-3 font-semibold">Blue AM</th>
              <th className="px-4 py-3 font-semibold">Blue PM</th>
            </tr>
          </thead>
          <tbody>
            {monthly.map((row) => (
              <tr key={row.month} className="border-t text-slate-800">
                <td className="px-4 py-3 font-medium md:px-6">{row.month}</td>
                <td className="px-4 py-3">{row.sunrise}</td>
                <td className="px-4 py-3">{row.sunset}</td>
                <td className="px-4 py-3">{row.goldenMorning}</td>
                <td className="px-4 py-3">{row.goldenEvening}</td>
                <td className="px-4 py-3">{row.blueMorning}</td>
                <td className="px-4 py-3">{row.blueEvening}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Related cities</h2>
        {relatedCities.length === 0 ? (
          <p className="text-sm text-slate-600">No related cities found for this country yet.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {relatedCities.map((relatedCity) => (
              <li key={relatedCity.slug}>
                <Link
                  href={`/city/${relatedCity.slug}`}
                  className="block rounded-md border px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
                >
                  {relatedCity.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
    </article>
  );
}

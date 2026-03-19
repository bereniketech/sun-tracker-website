import Link from "next/link";
import { getCityIndexGroups } from "@/lib/cities";

export const revalidate = 86400;

export default async function CityIndexPage() {
  const groups = await getCityIndexGroups();

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-widest text-slate-500">City Directory</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Sunrise and Sunset Times by City
        </h1>
        <p className="max-w-3xl text-sm text-slate-600 md:text-base">
          Browse city pages grouped by country. Each page includes monthly sunrise, sunset, golden hour,
          and blue hour data plus a direct link into the interactive Sun Tracker tool.
        </p>
      </header>

      <div className="space-y-6">
        {groups.map((group) => (
          <section key={group.country} className="rounded-xl border bg-white p-4 md:p-6">
            <h2 className="text-xl font-semibold text-slate-900">{group.country}</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {group.cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/city/${city.slug}`}
                    className="block rounded-md border px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}

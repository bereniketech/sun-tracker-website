import Link from "next/link";
import { getLandmarksByCitySlugAsync } from "@/lib/landmarks";

interface CityLandmarksSectionProps {
  citySlug: string;
  cityName: string;
}

export async function CityLandmarksSection({ citySlug, cityName }: CityLandmarksSectionProps) {
  const landmarks = await getLandmarksByCitySlugAsync(citySlug);

  if (landmarks.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">
          Major landmarks in {cityName}
        </h2>
        <p className="text-sm text-slate-600">
          Explore sun alignment data for famous landmarks in {cityName}.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {landmarks.map((landmark) => (
          <div
            key={landmark.id}
            className="rounded-lg border bg-white p-4 transition hover:shadow-md"
          >
            <h3 className="font-semibold text-slate-900">{landmark.name}</h3>
            <p className="mt-1 text-xs text-slate-500">
              Axis {Math.round(landmark.orientationAzimuth)}&deg; &middot;{" "}
              {landmark.category
                ? landmark.category.charAt(0).toUpperCase() + landmark.category.slice(1)
                : "Landmark"}
            </p>
            <Link
              href={`/?lat=${landmark.lat}&lng=${landmark.lng}&name=${encodeURIComponent(landmark.name)}`}
              className="mt-2 inline-block text-sm font-medium text-amber-600 hover:text-amber-700"
            >
              Track sun alignment &rarr;
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

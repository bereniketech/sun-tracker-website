import type { SunData } from "@/types/sun";

const CARDINAL_DIRECTIONS = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
] as const;

interface SolarMetricsProps {
  sunData: SunData | null;
  locationName: string;
  coordinates: string;
}

interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
  accentClassName?: string;
}

function normalizeDegrees(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function cardinalFromDegrees(value: number): string {
  const normalized = normalizeDegrees(value);
  const index = Math.round(normalized / 22.5) % CARDINAL_DIRECTIONS.length;
  return CARDINAL_DIRECTIONS[index] ?? "N";
}

function formatMetric(value: number | null, options?: { signed?: boolean }): string {
  if (value === null) {
    return "—";
  }

  const prefix = options?.signed && value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(1)}°`;
}

function MetricCard({ label, value, detail, accentClassName }: MetricCardProps) {
  return (
    <section className="min-w-0 rounded-2xl bg-surface-container-low p-4">
      <p className="text-[0.65rem] font-label font-semibold uppercase tracking-[0.24em] text-secondary">
        {label}
      </p>
      <p className="mt-3 font-headline text-2xl font-bold text-on-surface">{value}</p>
      <p className={`mt-2 text-sm ${accentClassName ?? "text-secondary"}`}>{detail}</p>
    </section>
  );
}

export function SolarMetrics({ sunData, locationName, coordinates }: SolarMetricsProps) {
  const azimuth = sunData?.sunAzimuth ?? null;
  const elevation = sunData?.sunElevation ?? null;
  const zenith = elevation === null ? null : 90 - elevation;
  const directionLabel = azimuth === null ? "—" : cardinalFromDegrees(azimuth);

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <p className="text-xs font-label tracking-widest uppercase text-primary">
          LIVE CELESTIAL TRACKING
        </p>
        <h1 className="font-headline text-3xl font-bold text-on-surface md:text-4xl">
          {locationName}
        </h1>
        <p className="text-sm text-secondary">{coordinates}</p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          label="SOLAR ZENITH"
          value={formatMetric(zenith)}
          detail={azimuth === null ? "Awaiting solar direction" : `Offset toward ${directionLabel}`}
        />
        <MetricCard
          label="AZIMUTH"
          value={formatMetric(azimuth)}
          detail={azimuth === null ? "Awaiting solar direction" : directionLabel}
          accentClassName="text-primary"
        />
        <MetricCard
          label="ELEVATION"
          value={formatMetric(elevation, { signed: true })}
          detail={
            elevation === null
              ? "Awaiting altitude data"
              : elevation >= 0
                ? "Above the horizon"
                : "Below the horizon"
          }
        />
      </div>
    </section>
  );
}
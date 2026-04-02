import type { SunData } from "@/types/sun";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/motion";

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
    <section className="glass-card metric-card min-w-0 rounded-2xl p-4">
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
      <FadeUp>
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1c30] via-[#1a2e4a] to-[#2d1810] px-6 py-8 md:px-8 md:py-10">
          <div className="hero-sun-glow" />
          <div className="hero-sun-rays" />
          <div className="relative z-10">
            <p className="shimmer-text text-xs font-label font-semibold tracking-widest uppercase">
              REAL-TIME SUN TRACKER
            </p>
            <h1 className="mt-2 font-headline text-3xl font-bold text-white md:text-4xl">
              Track the Sun in Real Time
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/75 md:text-base">
              See sunrise, sunset, golden hour, and blue hour timing for any location with
              live solar direction and map controls.
            </p>
            <div className="mt-4 flex flex-col gap-1 text-sm text-white/65 md:flex-row md:flex-wrap md:items-center md:gap-3">
              <span className="text-[0.65rem] font-label font-semibold uppercase tracking-[0.24em] text-white/55">
                Current location
              </span>
              <span className="text-base font-semibold text-white">{locationName}</span>
              <span className="hidden text-white/35 md:inline">•</span>
              <span>{coordinates}</span>
            </div>
          </div>
        </header>
      </FadeUp>

      <StaggerContainer className="grid grid-cols-3 gap-3" initialDelay={0.2}>
        <StaggerItem>
          <MetricCard
            label="SOLAR ZENITH"
            value={formatMetric(zenith)}
            detail={azimuth === null ? "Awaiting solar direction" : `Offset toward ${directionLabel}`}
          />
        </StaggerItem>
        <StaggerItem>
          <MetricCard
            label="AZIMUTH"
            value={formatMetric(azimuth)}
            detail={azimuth === null ? "Awaiting solar direction" : directionLabel}
            accentClassName="text-primary"
          />
        </StaggerItem>
        <StaggerItem>
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
        </StaggerItem>
      </StaggerContainer>
    </section>
  );
}
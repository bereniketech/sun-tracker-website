"use client";

import { useSunTrackerStore } from "@/store/sun-tracker-store";

function normalizeDegrees(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function cardinalFromDegrees(value: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const normalized = normalizeDegrees(value);
  const index = Math.round(normalized / 45) % directions.length;
  return directions[index] ?? "N";
}

function Marker({ azimuth, color, label }: { azimuth: number; color: string; label: string }) {
  return (
    <g
      style={{
        transform: `rotate(${azimuth}deg)`,
        transformOrigin: "100px 100px",
        transition: "transform 240ms ease-out",
      }}
    >
      <title>{label}</title>
      <line x1="100" y1="100" x2="100" y2="28" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="28" r="4.5" fill={color} />
    </g>
  );
}

interface CompassLegendItemProps {
  color: string;
  label: string;
  degrees: number;
}

function CompassLegendItem({ color, label, degrees }: CompassLegendItemProps) {
  return (
    <li className="flex items-center justify-between gap-3 text-xs text-slate-700">
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </span>
      <span className="font-semibold text-slate-900">{Math.round(degrees)}° {cardinalFromDegrees(degrees)}</span>
    </li>
  );
}

export function Compass() {
  const sunData = useSunTrackerStore((state) => state.sunData);

  if (!sunData) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Compass</p>
        <p className="mt-2 text-sm text-slate-600">Select a location to render directional markers.</p>
      </div>
    );
  }

  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Compass</p>

      <div className="flex justify-center">
        <svg
          aria-label="Sun direction compass"
          viewBox="0 0 200 200"
          className="h-52 w-52 rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(148,163,184,0.4)]"
        >
          <circle cx="100" cy="100" r="76" fill="none" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="100" cy="100" r="58" fill="none" stroke="#E2E8F0" strokeWidth="1.5" />
          <line x1="100" y1="16" x2="100" y2="184" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="16" y1="100" x2="184" y2="100" stroke="#E2E8F0" strokeWidth="1" />

          <text x="100" y="22" textAnchor="middle" className="fill-slate-700 text-[11px] font-semibold">
            N
          </text>
          <text x="178" y="104" textAnchor="middle" className="fill-slate-700 text-[11px] font-semibold">
            E
          </text>
          <text x="100" y="188" textAnchor="middle" className="fill-slate-700 text-[11px] font-semibold">
            S
          </text>
          <text x="22" y="104" textAnchor="middle" className="fill-slate-700 text-[11px] font-semibold">
            W
          </text>

          <Marker azimuth={sunData.sunriseAzimuth} color="#F97316" label="Sunrise azimuth" />
          <Marker azimuth={sunData.sunsetAzimuth} color="#EF4444" label="Sunset azimuth" />
          <Marker azimuth={sunData.sunAzimuth} color="#EAB308" label="Current sun azimuth" />
          <Marker azimuth={sunData.shadowDirection} color="#64748B" label="Shadow direction" />
          <circle cx="100" cy="100" r="4" fill="#0F172A" />
        </svg>
      </div>

      <ul className="space-y-1.5">
        <CompassLegendItem color="#F97316" label="Sunrise" degrees={sunData.sunriseAzimuth} />
        <CompassLegendItem color="#EF4444" label="Sunset" degrees={sunData.sunsetAzimuth} />
        <CompassLegendItem color="#EAB308" label="Sun" degrees={sunData.sunAzimuth} />
        <CompassLegendItem color="#64748B" label="Shadow" degrees={sunData.shadowDirection} />
      </ul>
    </section>
  );
}
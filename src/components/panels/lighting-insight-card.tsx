"use client";

import type { LightingInsight, LightingLabel } from "@/lib/lighting-insight";

interface ColorScheme {
  badge: string;
  border: string;
  text: string;
  warning: string;
}

const COLOR_SCHEMES: Record<LightingLabel, ColorScheme> = {
  GOLDEN: {
    badge: "bg-amber-100",
    border: "border-amber-300",
    text: "text-amber-900",
    warning: "bg-amber-200 text-amber-800",
  },
  BLUE: {
    badge: "bg-sky-100",
    border: "border-sky-300",
    text: "text-sky-900",
    warning: "bg-sky-200 text-sky-800",
  },
  TWILIGHT: {
    badge: "bg-violet-100",
    border: "border-violet-300",
    text: "text-violet-900",
    warning: "bg-violet-200 text-violet-800",
  },
  NIGHT: {
    badge: "bg-slate-800",
    border: "border-slate-600",
    text: "text-slate-100",
    warning: "bg-slate-700 text-slate-200",
  },
  HARSH: {
    badge: "bg-red-100",
    border: "border-red-300",
    text: "text-red-900",
    warning: "bg-red-200 text-red-800",
  },
  SOFT: {
    badge: "bg-zinc-100",
    border: "border-zinc-300",
    text: "text-zinc-800",
    warning: "bg-zinc-200 text-zinc-700",
  },
};

interface LightingInsightCardProps {
  insight: LightingInsight;
}

export function LightingInsightCard({ insight }: LightingInsightCardProps) {
  const { label, headline, warningMessage, shotSuggestions } = insight;
  const colors = COLOR_SCHEMES[label];

  return (
    <div className={`rounded-lg border ${colors.border} ${colors.badge} p-3 space-y-2`}>
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full border ${colors.border} px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${colors.text}`}
        >
          {label}
        </span>
      </div>

      <p className={`text-xs font-medium ${colors.text}`}>{headline}</p>

      {warningMessage && (
        <p className={`rounded-md px-2 py-1 text-[11px] ${colors.warning}`}>
          ⚠ {warningMessage}
        </p>
      )}

      <ul className="space-y-1">
        {shotSuggestions.map((suggestion) => (
          <li key={suggestion.label} className={`text-xs ${colors.text}`}>
            <span className="font-semibold">{suggestion.label}</span>
            {suggestion.technique && (
              <span className="opacity-75"> — {suggestion.technique}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

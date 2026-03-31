"use client";

import type { LightingInsight, LightingLabel } from "@/lib/lighting-insight";

interface ColorScheme {
  badge: string;
  border: string;
  badgeText: string;
  warning: string;
}

const COLOR_SCHEMES: Record<LightingLabel, ColorScheme> = {
  GOLDEN: {
    badge: "bg-amber-50",
    border: "border-amber-200",
    badgeText: "text-amber-800",
    warning: "bg-amber-100 text-amber-800",
  },
  BLUE: {
    badge: "bg-sky-50",
    border: "border-sky-200",
    badgeText: "text-sky-800",
    warning: "bg-sky-100 text-sky-800",
  },
  TWILIGHT: {
    badge: "bg-violet-50",
    border: "border-violet-200",
    badgeText: "text-violet-800",
    warning: "bg-violet-100 text-violet-800",
  },
  NIGHT: {
    badge: "bg-surface-container-highest",
    border: "border-surface-dim",
    badgeText: "text-on-surface",
    warning: "bg-surface-container-high text-on-surface-variant",
  },
  HARSH: {
    badge: "bg-red-50",
    border: "border-red-200",
    badgeText: "text-red-800",
    warning: "bg-red-100 text-red-800",
  },
  SOFT: {
    badge: "bg-surface-container-low",
    border: "border-surface-container",
    badgeText: "text-on-surface-variant",
    warning: "bg-surface-container text-secondary",
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
          className={`rounded-full border ${colors.border} px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${colors.badgeText}`}
        >
          {label}
        </span>
      </div>

      <p className="text-xs font-medium text-on-surface">{headline}</p>

      {warningMessage && (
        <p className={`rounded-md px-2 py-1 text-[11px] ${colors.warning}`}>
          ⚠ {warningMessage}
        </p>
      )}

      <ul className="space-y-1">
        {shotSuggestions.map((suggestion) => (
          <li key={suggestion.label} className="text-xs text-on-surface">
            <span className="font-semibold">{suggestion.label}</span>
            {suggestion.technique && (
              <span className="text-secondary"> — {suggestion.technique}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

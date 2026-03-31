"use client";

import React, { useMemo, useState } from "react";

interface ChronoScrubberProps {
  value: number;
  onChange: (day: number) => void;
}

const MONTH_LABELS = [
  { day: 1, label: "JAN" },
  { day: 91, label: "APR" },
  { day: 182, label: "JUL" },
  { day: 274, label: "OCT" },
  { day: 335, label: "DEC" },
];

function getDayOfYearToDate(day: number): string {
  const date = new Date(new Date().getFullYear(), 0, day);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function ChronoScrubber({ value, onChange }: ChronoScrubberProps) {
  const [isHovering, setIsHovering] = useState(false);
  const fullDate = useMemo(() => getDayOfYearToDate(value), [value]);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-baseline justify-between gap-4">
        <div className="text-xs font-sans tracking-widest uppercase text-muted-foreground">
          Chronological Scrubber
        </div>
        <div className="text-lg font-headline text-primary">
          Day {value} of 365
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative">
        {/* Month labels */}
        <div className="mb-3 flex justify-between px-0 text-xs text-muted-foreground">
          {MONTH_LABELS.map((month) => (
            <span key={month.day} className="relative inline-block">
              {month.label}
            </span>
          ))}
        </div>

        {/* Range slider */}
        <input
          type="range"
          min="1"
          max="365"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="w-full h-1 bg-surface-variant rounded-full appearance-none cursor-pointer slider-thumb"
          style={{
            accentColor: "#9d4300",
          }}
        />

        {/* Glassmorphic tooltip */}
        {isHovering && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 rounded-xl bg-white/70 backdrop-blur-md shadow-lg text-sm font-mono text-foreground whitespace-nowrap pointer-events-none">
            {fullDate}
          </div>
        )}
      </div>

      {/* Month dividers hint */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-outline-variant to-transparent opacity-20" />
    </div>
  );
}

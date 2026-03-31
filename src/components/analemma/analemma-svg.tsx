"use client";

import React, { useMemo } from "react";
import type { AnalemmaPoint } from "@/lib/analemma";

interface AnalemmasvgProps {
  points: AnalemmaPoint[];
  selectedDay: number;
  onDaySelect: (day: number) => void;
}

const VIEWBOX_WIDTH = 400;
const VIEWBOX_HEIGHT = 500;
const PADDING = 30;
const PLOT_WIDTH = VIEWBOX_WIDTH - 2 * PADDING;
const PLOT_HEIGHT = VIEWBOX_HEIGHT - 2 * PADDING;

// Equation of Time range: -16 to +16 minutes
const EOT_MIN = -16;
const EOT_MAX = 16;

// Declination range: -23.45 to +23.45 degrees
const DECL_MIN = -23.45;
const DECL_MAX = 23.45;

function mapCoordinates(
  equationOfTime: number,
  declination: number
): { x: number; y: number } {
  // Map equation of time to x-axis (0 to PLOT_WIDTH)
  const x =
    ((equationOfTime - EOT_MIN) / (EOT_MAX - EOT_MIN)) * PLOT_WIDTH + PADDING;

  // Map declination to y-axis (inverted: top = max declination)
  const y =
    ((DECL_MAX - declination) / (DECL_MAX - DECL_MIN)) * PLOT_HEIGHT + PADDING;

  return { x, y };
}

function buildPathString(points: AnalemmaPoint[]): string {
  if (points.length === 0) return "";

  const pathSegments: string[] = [];

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const { x, y } = mapCoordinates(point.equationOfTime, point.declination);

    if (i === 0) {
      pathSegments.push(`M ${x} ${y}`);
    } else {
      pathSegments.push(`L ${x} ${y}`);
    }
  }

  return pathSegments.join(" ");
}

function getMarkerPosition(dayOfYear: number, points: AnalemmaPoint[]) {
  const point = points.find((p) => p.dayOfYear === dayOfYear);
  if (!point) return null;
  return mapCoordinates(point.equationOfTime, point.declination);
}

// Solstice and equinox days (approximate)
const SPECIAL_DAYS = [
  { day: 80, label: "MAR 20", name: "Equinox" }, // Spring Equinox
  { day: 172, label: "JUN 21", name: "Solstice" }, // Summer Solstice
  { day: 265, label: "SEP 22", name: "Equinox" }, // Autumn Equinox
  { day: 355, label: "DEC 21", name: "Solstice" }, // Winter Solstice
];

function getSpecialDayPosition(day: number, points: AnalemmaPoint[]) {
  const point = points.find((p) => p.dayOfYear === day);
  if (!point) return null;
  return mapCoordinates(point.equationOfTime, point.declination);
}

export function AnalemmasvG({
  points,
  selectedDay,
  onDaySelect,
}: AnalemmasvgProps) {
  const pathString = useMemo(() => buildPathString(points), [points]);
  const selectedPoint = useMemo(
    () => getMarkerPosition(selectedDay, points),
    [selectedDay, points]
  );

  const handleSvgClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Scale click coordinates to SVG viewBox coordinates
    const scaleX = VIEWBOX_WIDTH / rect.width;
    const scaleY = VIEWBOX_HEIGHT / rect.height;
    const svgX = x * scaleX;
    const svgY = y * scaleY;

    // Find nearest point to click
    let nearestDay = selectedDay;
    let minDistance = Infinity;

    for (const point of points) {
      const { x: px, y: py } = mapCoordinates(
        point.equationOfTime,
        point.declination
      );
      const distance = Math.sqrt(
        Math.pow(svgX - px, 2) + Math.pow(svgY - py, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestDay = point.dayOfYear;
      }
    }

    if (minDistance < 30) {
      // Only select if within 30 pixels
      onDaySelect(nearestDay);
    }
  };

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      width="100%"
      className="cursor-pointer"
      onClick={handleSvgClick}
    >
      <defs>
        <linearGradient id="analemma-grad" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#9d4300" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect
        x={PADDING}
        y={PADDING}
        width={PLOT_WIDTH}
        height={PLOT_HEIGHT}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="stroke-outline-variant opacity-30"
      />

      {/* Analemma figure-8 curve */}
      <path
        d={pathString}
        stroke="url(#analemma-grad)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Corner brackets */}
      {/* Top-left */}
      <path
        d={`M ${PADDING + 15} ${PADDING} L ${PADDING} ${PADDING} L ${PADDING} ${PADDING + 15}`}
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className="stroke-outline-variant opacity-50"
      />
      {/* Top-right */}
      <path
        d={`M ${VIEWBOX_WIDTH - PADDING - 15} ${PADDING} L ${VIEWBOX_WIDTH - PADDING} ${PADDING} L ${VIEWBOX_WIDTH - PADDING} ${PADDING + 15}`}
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className="stroke-outline-variant opacity-50"
      />
      {/* Bottom-left */}
      <path
        d={`M ${PADDING + 15} ${VIEWBOX_HEIGHT - PADDING} L ${PADDING} ${VIEWBOX_HEIGHT - PADDING} L ${PADDING} ${VIEWBOX_HEIGHT - PADDING - 15}`}
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className="stroke-outline-variant opacity-50"
      />
      {/* Bottom-right */}
      <path
        d={`M ${VIEWBOX_WIDTH - PADDING - 15} ${VIEWBOX_HEIGHT - PADDING} L ${VIEWBOX_WIDTH - PADDING} ${VIEWBOX_HEIGHT - PADDING} L ${VIEWBOX_WIDTH - PADDING} ${VIEWBOX_HEIGHT - PADDING - 15}`}
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className="stroke-outline-variant opacity-50"
      />

      {/* Solstice and equinox markers */}
      {SPECIAL_DAYS.map((special) => {
        const pos = getSpecialDayPosition(special.day, points);
        if (!pos) return null;

        return (
          <g key={special.day}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r="4"
              fill="currentColor"
              className="fill-primary opacity-75"
            />
            <text
              x={pos.x}
              y={pos.y - 12}
              textAnchor="middle"
              fontSize="10"
              className="fill-primary opacity-75 font-mono"
            >
              {special.label}
            </text>
          </g>
        );
      })}

      {/* Selected day dot */}
      {selectedPoint && (
        <circle
          cx={selectedPoint.x}
          cy={selectedPoint.y}
          r="7"
          fill="currentColor"
          className="fill-primary transition-all"
        />
      )}
    </svg>
  );
}

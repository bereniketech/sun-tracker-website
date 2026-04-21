"use client";

import { motion } from 'framer-motion';

interface CompassNeedleProps {
  heading: number | null;
  sunAzimuth: number;
}

/**
 * SVG-based compass rose with a red needle pointing north.
 * The needle rotates to match the device's heading.
 * Uses Framer Motion for smooth animation.
 */
export function CompassNeedle({ heading, sunAzimuth }: CompassNeedleProps) {
  // Default to north (0) if heading is not available
  const displayHeading = heading ?? 0;

  return (
    <div className="flex justify-center">
      <motion.svg
        aria-label="Device orientation compass"
        viewBox="0 0 200 200"
        className="h-52 w-52 rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(148,163,184,0.4)]"
        animate={{ rotate: displayHeading }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
          mass: 1,
        }}
      >
        {/* Background circles */}
        <circle cx="100" cy="100" r="76" fill="none" stroke="#CBD5E1" strokeWidth="2" />
        <circle cx="100" cy="100" r="58" fill="none" stroke="#E2E8F0" strokeWidth="1.5" />

        {/* Grid lines */}
        <line x1="100" y1="16" x2="100" y2="184" stroke="#E2E8F0" strokeWidth="1" />
        <line x1="16" y1="100" x2="184" y2="100" stroke="#E2E8F0" strokeWidth="1" />

        {/* Cardinal direction labels (fixed, not rotated) */}
        <g style={{ pointerEvents: 'none' }}>
          <text
            x="100"
            y="22"
            textAnchor="middle"
            className="fill-slate-700 text-[11px] font-semibold"
          >
            N
          </text>
          <text
            x="178"
            y="104"
            textAnchor="middle"
            className="fill-slate-700 text-[11px] font-semibold"
          >
            E
          </text>
          <text
            x="100"
            y="188"
            textAnchor="middle"
            className="fill-slate-700 text-[11px] font-semibold"
          >
            S
          </text>
          <text
            x="22"
            y="104"
            textAnchor="middle"
            className="fill-slate-700 text-[11px] font-semibold"
          >
            W
          </text>
        </g>

        {/* Red needle pointing north */}
        <g style={{ pointerEvents: 'none' }}>
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke="#EF4444"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="30" r="5" fill="#EF4444" />
        </g>

        {/* Sun position marker (yellow dot at sunAzimuth) */}
        <g
          style={{
            transform: `rotate(${sunAzimuth}deg)`,
            transformOrigin: '100px 100px',
            pointerEvents: 'none',
          }}
        >
          <circle cx="100" cy="38" r="4" fill="#EAB308" />
        </g>

        {/* Center dot */}
        <circle cx="100" cy="100" r="4" fill="#0F172A" />
      </motion.svg>
    </div>
  );
}

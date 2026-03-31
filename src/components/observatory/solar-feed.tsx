"use client";

interface SolarFeedProps {
  azimuth: number;
  altitude: number;
}

export function SolarFeed({ azimuth, altitude }: SolarFeedProps) {
  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 300 300"
        width="100%"
        className="max-w-xs"
        aria-label={`Solar feed — azimuth ${azimuth.toFixed(2)}° altitude ${altitude.toFixed(2)}°`}
      >
        <defs>
          <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#9d4300" />
          </radialGradient>
        </defs>

        {/* Background */}
        <circle cx="150" cy="150" r="148" fill="#1a1a2e" />

        {/* Corona rings — animated */}
        <circle
          cx="150"
          cy="150"
          r="120"
          fill="none"
          stroke="#f97316"
          strokeWidth="1.5"
          strokeOpacity="0.25"
          className="corona-ring"
          style={{ animationDelay: "0s" }}
        />
        <circle
          cx="150"
          cy="150"
          r="105"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          strokeOpacity="0.35"
          className="corona-ring"
          style={{ animationDelay: "0.7s" }}
        />
        <circle
          cx="150"
          cy="150"
          r="90"
          fill="none"
          stroke="#f97316"
          strokeWidth="2.5"
          strokeOpacity="0.5"
          className="corona-ring"
          style={{ animationDelay: "1.4s" }}
        />

        {/* Sun disc */}
        <circle cx="150" cy="150" r="70" fill="url(#sunGradient)" />

        {/* Azimuth label top-left */}
        <text
          x="12"
          y="20"
          fill="#f97316"
          fontSize="11"
          fontFamily="monospace"
          opacity="0.8"
        >
          AZ {azimuth.toFixed(2)}°
        </text>

        {/* Altitude label bottom-right */}
        <text
          x="288"
          y="292"
          fill="#f97316"
          fontSize="11"
          fontFamily="monospace"
          opacity="0.8"
          textAnchor="end"
        >
          ALT {altitude.toFixed(2)}°
        </text>
      </svg>
    </div>
  );
}

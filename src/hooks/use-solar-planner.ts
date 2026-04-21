'use client';

import { useState } from 'react';
import { computeOptimalPanelAngle } from '@/lib/solar';
import type { SolarResult } from '@/types/solar';

interface UseSolarPlannerOptions {
  lat: number;
  lng: number;
  panelSizeKw: number;
}

interface UseSolarPlannerState {
  result: SolarResult | null;
  loading: boolean;
  error: string | null;
  compute: () => void;
}

export function useSolarPlanner(options: UseSolarPlannerOptions): UseSolarPlannerState {
  const [result, setResult] = useState<SolarResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compute = () => {
    setLoading(true);
    setError(null);

    try {
      const computedResult = computeOptimalPanelAngle(
        options.lat,
        options.lng,
        options.panelSizeKw
      );

      setResult(computedResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compute solar angle');
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, compute };
}

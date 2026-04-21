'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSolarPlanner } from '@/hooks/use-solar-planner';
import { useSunTrackerStore } from '@/store/sun-tracker-store';
import { AlertCircle, Sun, Zap } from 'lucide-react';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function SolarPlannerPanel() {
  const location = useSunTrackerStore((state) => state.location);
  const [panelSizeKw, setPanelSizeKw] = useState(5);
  const [hasCalculated, setHasCalculated] = useState(false);

  const { result, loading, error, compute } = useSolarPlanner({
    lat: location.lat,
    lng: location.lng,
    panelSizeKw,
  });

  const handleCalculate = () => {
    compute();
    setHasCalculated(true);
  };

  const chartData = result
    ? MONTH_LABELS.map((label, index) => ({
        month: label,
        kWh: result.monthlyKwh[index],
      }))
    : [];

  return (
    <section className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Solar Panel Planner</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="panel-size" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Panel Size: {panelSizeKw} kW
            </label>
            <input
              id="panel-size"
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={panelSizeKw}
              onChange={(e) => setPanelSizeKw(parseFloat(e.target.value))}
              disabled={loading}
              className="mt-2 w-full"
              aria-label="Solar panel size in kilowatts"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>1 kW</span>
              <span>20 kW</span>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
            aria-busy={loading}
          >
            {loading ? 'Computing Optimal Angle...' : 'Calculate Optimal Angle'}
          </button>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex gap-2 dark:border-red-900 dark:bg-red-900/20">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" aria-hidden="true" />
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-3">
              <div className="rounded-lg bg-white p-3 dark:bg-slate-700">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Optimal Tilt</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{result.optimalTilt}°</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Optimal Azimuth</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{result.optimalAzimuth}°</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <Zap className="h-4 w-4" aria-hidden="true" />
                      Annual kWh Estimate
                    </p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{result.annualKwhEstimate} kWh</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-3 dark:bg-slate-700">
                <p className="mb-3 text-xs font-semibold text-slate-600 dark:text-slate-400">Monthly Output</p>
                {chartData.length > 0 && (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          border: '1px solid rgba(0,0,0,0.1)',
                          borderRadius: '6px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="kWh" fill="#2563eb" name="Monthly Output (kWh)" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          )}

          {!hasCalculated && !result && !loading && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Adjust panel size and click &quot;Calculate Optimal Angle&quot; to see recommendations for your location.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

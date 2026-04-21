import { MapPin } from "lucide-react";

interface MapErrorFallbackProps {
  resetErrorBoundary?: () => void;
}

/**
 * Error fallback UI for the map section.
 * Shows when the map component encounters a rendering error.
 */
export function MapErrorFallback({ resetErrorBoundary }: MapErrorFallbackProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
      <div className="flex justify-center mb-4">
        <MapPin className="w-12 h-12 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Map failed to load</h3>
      <p className="text-sm text-slate-600 mb-6">
        There was an issue loading the interactive map. Please try again.
      </p>
      {resetErrorBoundary && (
        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Reload map
        </button>
      )}
    </div>
  );
}

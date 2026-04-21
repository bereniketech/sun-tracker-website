import { AlertCircle } from "lucide-react";

interface PanelErrorFallbackProps {
  section: string;
  resetErrorBoundary?: () => void;
}

/**
 * Error fallback UI for panels (Sun Info, Observatory).
 * Shows when a panel component encounters a rendering error.
 */
export function PanelErrorFallback({ section, resetErrorBoundary }: PanelErrorFallbackProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900 text-sm">{section}</h4>
          <p className="text-xs text-slate-600 mt-1">
            This section encountered an error and could not be displayed.
          </p>
          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className="mt-3 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

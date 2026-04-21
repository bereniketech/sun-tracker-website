"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error page for the Next.js App Router.
 * Catches unhandled errors in layouts and pages.
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to external service if needed
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-md px-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="w-16 h-16 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">
            Something went wrong
          </h1>

          <p className="text-center text-slate-600 mb-6">
            We encountered an unexpected error. Please try again or return to the homepage.
          </p>

          {error.message && (
            <details className="mb-6 rounded-lg bg-slate-50 p-3">
              <summary className="cursor-pointer text-xs font-semibold text-slate-600">
                Error details
              </summary>
              <p className="mt-2 text-xs text-slate-600 font-mono break-words">
                {error.message}
              </p>
            </details>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={reset}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>

            <Link
              href="/"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

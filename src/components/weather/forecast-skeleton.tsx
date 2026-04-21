"use client";

export function ForecastSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex min-w-max flex-col items-center rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="h-3 w-8 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-2 h-3 w-6 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="my-2 h-6 w-6 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-2 space-y-1">
              <div className="h-3 w-12 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-10 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

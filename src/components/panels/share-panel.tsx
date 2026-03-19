"use client";

import { useState } from "react";
import { useSunTrackerStore } from "@/store/sun-tracker-store";
import { generateSunDataRows, exportAsCSV, exportAsJSON } from "@/lib/export";

const EXPORT_DAYS_OPTIONS = [7, 14, 30] as const;
type ExportDays = (typeof EXPORT_DAYS_OPTIONS)[number];

function buildShareUrl(): string {
  if (typeof window === "undefined") return "";
  return window.location.href;
}

function openTwitterShare(url: string, locationName: string): void {
  const text = `Check out sun data for ${locationName || "this location"} on Sun Tracker!`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(tweetUrl, "_blank", "noopener,noreferrer");
}

function openFacebookShare(url: string): void {
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(fbUrl, "_blank", "noopener,noreferrer");
}

export function SharePanel() {
  const location = useSunTrackerStore((state) => state.location);
  const locationName = useSunTrackerStore((state) => state.locationName);
  const dateTime = useSunTrackerStore((state) => state.dateTime);

  const [copied, setCopied] = useState(false);
  const [exportDays, setExportDays] = useState<ExportDays>(7);
  const [isOpen, setIsOpen] = useState(false);

  async function handleCopyLink(): Promise<void> {
    const url = buildShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text from a temporary input
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleTwitter(): void {
    openTwitterShare(buildShareUrl(), locationName);
  }

  function handleFacebook(): void {
    openFacebookShare(buildShareUrl());
  }

  function getRows() {
    if (!location) return [];
    const startOfDay = new Date(dateTime);
    startOfDay.setHours(0, 0, 0, 0);
    return generateSunDataRows(location.lat, location.lng, startOfDay, exportDays);
  }

  function getFilename(ext: string): string {
    const slug = (locationName || "location").replace(/\s+/g, "-").toLowerCase();
    const date = dateTime.toISOString().slice(0, 10);
    return `sun-data-${slug}-${date}-${exportDays}d.${ext}`;
  }

  function handleCSV(): void {
    exportAsCSV(getRows(), getFilename("csv"));
  }

  function handleJSON(): void {
    exportAsJSON(getRows(), getFilename("json"));
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      {/* Header / toggle */}
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-800">
          Share &amp; Export
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="space-y-3 border-t border-slate-100 px-3 pb-3 pt-2.5">
          {/* Social share */}
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Share
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                aria-label="Copy shareable link"
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
                      <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
                    </svg>
                    Copy link
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleTwitter}
                className="flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition-colors hover:bg-sky-100"
                aria-label="Share on Twitter / X"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter
              </button>

              <button
                type="button"
                onClick={handleFacebook}
                className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                aria-label="Share on Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </div>

          {/* Data export */}
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Export sun data
            </p>

            {!location ? (
              <p className="text-xs text-slate-400">Select a location to enable export.</p>
            ) : (
              <div className="space-y-2">
                {/* Range selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500">Range:</span>
                  {EXPORT_DAYS_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setExportDays(d)}
                      className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors ${
                        exportDays === d
                          ? "border-amber-400 bg-amber-100 text-amber-900"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                      aria-pressed={exportDays === d}
                    >
                      {d}d
                    </button>
                  ))}
                </div>

                {/* Export buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCSV}
                    className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                      <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                    </svg>
                    CSV
                  </button>

                  <button
                    type="button"
                    onClick={handleJSON}
                    className="flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                      <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                    </svg>
                    JSON
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

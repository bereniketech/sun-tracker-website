"use client";

import { useEducationalDismissal } from "@/hooks/use-educational-dismissal";
import { EDUCATIONAL_ENTRIES, type EducationalTermKey } from "@/lib/educational-content";

const GLOSSARY_TERMS: EducationalTermKey[] = [
  "golden-hour",
  "blue-hour",
  "solar-noon",
  "shadow-ratio",
  "azimuth",
  "elevation",
];

interface EducationalGlossaryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EducationalGlossary({ isOpen, onClose }: EducationalGlossaryProps) {
  const { resetAll } = useEducationalDismissal();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40 md:items-center md:justify-center" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="educational-glossary-title"
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-4 shadow-2xl md:max-w-3xl md:rounded-3xl md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Educational guide</p>
            <h2 id="educational-glossary-title" className="mt-1 text-xl font-semibold text-slate-950">
              Sun Photography Glossary
            </h2>
            <p className="mt-1 text-sm text-slate-600">Definitions and practical context for core sun data labels.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetAll}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              Reset dismissed
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              Close
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {GLOSSARY_TERMS.map((term) => {
            const entry = EDUCATIONAL_ENTRIES[term];

            return (
              <article key={term} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <h3 className="text-base font-semibold text-slate-900">{entry.term}</h3>
                <p className="mt-2 text-sm font-medium text-slate-700">{entry.shortDefinition}</p>
                <p className="mt-2 text-sm text-slate-700">{entry.fullExplanation}</p>
                {entry.photographyTip ? (
                  <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-2 text-sm text-amber-900">
                    <span className="font-semibold">Photography tip:</span> {entry.photographyTip}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

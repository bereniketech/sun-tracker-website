"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useEducationalDismissal } from "@/hooks/use-educational-dismissal";
import { EDUCATIONAL_ENTRIES, type EducationalTermKey } from "@/lib/educational-content";

interface EducationalTooltipProps {
  term: EducationalTermKey;
  children: ReactNode;
}

export function EducationalTooltip({ term, children }: EducationalTooltipProps) {
  const { isDismissed, dismiss } = useEducationalDismissal();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const tooltipId = useId();

  const entry = EDUCATIONAL_ENTRIES[term];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent): void => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen]);

  if (isDismissed(term)) {
    return <>{children}</>;
  }

  const handleToggle = (): void => {
    setIsOpen((open) => !open);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleToggle();
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleDismiss = (): void => {
    dismiss(term);
    setIsOpen(false);
  };

  return (
    <span ref={rootRef} className="relative inline-flex">
      <span
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-describedby={isOpen ? tooltipId : undefined}
        className="cursor-help underline decoration-dotted underline-offset-2"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        {children}
      </span>

      {isOpen ? (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute left-0 top-full z-10 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-xl"
        >
          <p className="text-sm text-slate-800">{entry.shortDefinition}</p>
          <details className="mt-2 rounded-lg bg-slate-50 p-2 text-sm text-slate-700">
            <summary className="cursor-pointer select-none font-medium text-slate-800">More details</summary>
            <p className="mt-2">{entry.fullExplanation}</p>
            {entry.photographyTip ? (
              <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-2 text-amber-900">
                <span className="font-semibold">Photography tip:</span> {entry.photographyTip}
              </p>
            ) : null}
          </details>
          <button
            type="button"
            className="mt-3 rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-700"
            onClick={handleDismiss}
          >
            Got it
          </button>
        </span>
      ) : null}
    </span>
  );
}
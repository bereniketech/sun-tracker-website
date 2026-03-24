"use client";

import { useEffect, useState, useCallback } from "react";
import type { EducationalTermKey } from "@/lib/educational-content";

export interface UseEducationalDismissalReturn {
  isDismissed: (term: EducationalTermKey) => boolean;
  dismiss: (term: EducationalTermKey) => void;
  resetAll: () => void;
}

const STORAGE_KEY = "edu-dismissed";

export function useEducationalDismissal(): UseEducationalDismissalReturn {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      setDismissed(new Set(parsed));
    } catch {
      // localStorage not available (SSR, private mode, or parse error)
      // Silently fail and start with empty set
      setDismissed(new Set());
    }
  }, []);

  // Stable reference to isDismissed check
  const isDismissed = useCallback(
    (term: EducationalTermKey): boolean => {
      return dismissed.has(term);
    },
    [dismissed]
  );

  // Stable reference to dismiss action
  const dismiss = useCallback((term: EducationalTermKey): void => {
    setDismissed((prev) => {
      const updated = new Set(prev);
      updated.add(term);

      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(updated)));
      } catch {
        // Silently fail on localStorage error
      }

      return updated;
    });
  }, []);

  // Stable reference to resetAll action
  const resetAll = useCallback((): void => {
    setDismissed(new Set());

    // Remove from localStorage
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Silently fail on localStorage error
    }
  }, []);

  return {
    isDismissed,
    dismiss,
    resetAll,
  };
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Compass } from "@/components/compass/compass";
import { LandmarkAlignmentPanel } from "@/components/panels/landmark-alignment-panel";
import { ShadowInfo } from "@/components/panels/shadow-info";
import { SunDataDisplay } from "@/components/panels/sun-data-display";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

const MOBILE_WIDTH_PX = 768;

function isMobileViewport(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.innerWidth < MOBILE_WIDTH_PX;
}

const PhotographerPanel = dynamic(
  () => import("@/components/panels/photographer-panel").then((module) => module.PhotographerPanel),
  {
    loading: () => (
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="status">
        Loading photographer tools...
      </section>
    ),
  },
);

export function InfoPanel() {
  const photographerMode = useSunTrackerStore((state) => state.photographerMode);
  const togglePhotographerMode = useSunTrackerStore((state) => state.togglePhotographerMode);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    const syncViewportState = () => {
      const mobile = isMobileViewport();
      setIsMobile(mobile);
      setIsOpen((current) => {
        if (!mobile) {
          return true;
        }

        return current;
      });
    };

    syncViewportState();
    window.addEventListener("resize", syncViewportState);

    return () => {
      window.removeEventListener("resize", syncViewportState);
    };
  }, []);

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-3" aria-label="Information panel">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-800">Sun Data</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`rounded-lg border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
              photographerMode
                ? "border-amber-400 bg-amber-100 text-amber-900"
                : "border-slate-300 text-slate-700"
            }`}
            onClick={togglePhotographerMode}
            aria-pressed={photographerMode}
          >
            Photographer Mode
          </button>

          <button
            type="button"
            className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 md:hidden"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="sun-info-panel-content"
          >
            {isOpen ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      <div id="sun-info-panel-content" className={`mt-3 space-y-3 ${isMobile && !isOpen ? "hidden" : "block"}`}>
        <PhotographerPanel />
        <LandmarkAlignmentPanel />
        {photographerMode ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-2">
            <Compass />
          </div>
        ) : (
          <Compass />
        )}
        <SunDataDisplay />
        <ShadowInfo />
      </div>
    </aside>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Compass } from "@/components/compass/compass";
import { ShadowInfo } from "@/components/panels/shadow-info";
import { SunDataDisplay } from "@/components/panels/sun-data-display";

const MOBILE_WIDTH_PX = 768;

function isMobileViewport(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.innerWidth < MOBILE_WIDTH_PX;
}

export function InfoPanel() {
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
    <aside className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-800">Info Panel</h2>
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

      <div id="sun-info-panel-content" className={`mt-3 space-y-3 ${isMobile && !isOpen ? "hidden" : "block"}`}>
        <SunDataDisplay />
        <Compass />
        <ShadowInfo />
      </div>
    </aside>
  );
}
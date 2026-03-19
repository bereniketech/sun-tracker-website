"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(
  () => import("@/components/map/leaflet-map").then((module) => module.LeafletMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-[32rem] items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500 md:h-[38rem]"
        role="status"
      >
        Loading interactive map...
      </div>
    ),
  },
);

export function InteractiveMap() {
  return <LeafletMap />;
}
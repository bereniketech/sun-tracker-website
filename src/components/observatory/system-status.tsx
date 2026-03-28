"use client";

import { Activity, Layers, Thermometer } from "lucide-react";

type StatusLevel = "NORMAL" | "ACTIVE" | "WARNING";

interface StatusChipProps {
  icon: React.ReactNode;
  name: string;
  status: StatusLevel;
  description: string;
}

function statusStyles(status: StatusLevel): string {
  switch (status) {
    case "NORMAL":
      return "bg-surface-container text-secondary";
    case "ACTIVE":
      return "bg-orange-50 text-primary border border-orange-100/50";
    case "WARNING":
      return "bg-red-50 text-error border border-red-100/50";
  }
}

function StatusChip({ icon, name, status, description }: StatusChipProps) {
  return (
    <div className={`flex items-start gap-3 rounded-xl p-3 ${statusStyles(status)}`}>
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{name}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold tracking-wider ${
              status === "NORMAL"
                ? "bg-green-100 text-green-700"
                : status === "ACTIVE"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {status}
          </span>
        </div>
        <p className="mt-0.5 text-xs opacity-70">{description}</p>
      </div>
    </div>
  );
}

interface SystemStatusProps {
  elevation: number;
}

export function SystemStatus({ elevation }: SystemStatusProps) {
  const gimbalStatus: StatusLevel =
    elevation > 20 ? "NORMAL" : elevation > 5 ? "ACTIVE" : "WARNING";
  const filterStatus: StatusLevel = elevation > 0 ? "ACTIVE" : "WARNING";
  const thermalStatus: StatusLevel = elevation > 5 ? "NORMAL" : "WARNING";

  const gimbalDesc =
    gimbalStatus === "NORMAL"
      ? "Dual-axis synchronization verified. No drift detected."
      : gimbalStatus === "ACTIVE"
        ? "Tracking active. Minor elevation compensation applied."
        : "Sun below horizon. Gimbal in standby mode.";

  const filterDesc =
    filterStatus === "ACTIVE"
      ? "ND filter engaged. Optical density 3.0 confirmed."
      : "Sun below horizon. Filter array disengaged.";

  const thermalDesc =
    thermalStatus === "NORMAL"
      ? "Operating within nominal temperature range."
      : "Low solar input. Thermal management in alert state.";

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <StatusChip
        icon={<Activity className="h-4 w-4" />}
        name="GIMBAL LOGIC"
        status={gimbalStatus}
        description={gimbalDesc}
      />
      <StatusChip
        icon={<Layers className="h-4 w-4" />}
        name="FILTER ARRAY"
        status={filterStatus}
        description={filterDesc}
      />
      <StatusChip
        icon={<Thermometer className="h-4 w-4" />}
        name="THERMAL SINK"
        status={thermalStatus}
        description={thermalDesc}
      />
    </div>
  );
}

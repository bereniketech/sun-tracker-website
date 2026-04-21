import { useEffect, useState } from "react";

export interface BatteryStatus {
  level: number;
  charging: boolean;
}

export function useBattery(): BatteryStatus | null {
  const [batteryStatus, setBatteryStatus] = useState<BatteryStatus | null>(null);

  useEffect(() => {
    if (!("getBattery" in navigator)) {
      return;
    }

    let isMounted = true;

    const initializeBattery = async () => {
      try {
        const battery = await (navigator as unknown as { getBattery: () => Promise<{ level: number; charging: boolean; addEventListener: (event: string, handler: () => void) => void; removeEventListener: (event: string, handler: () => void) => void }> }).getBattery();

        const updateBatteryStatus = () => {
          if (isMounted) {
            setBatteryStatus({
              level: battery.level,
              charging: battery.charging,
            });
          }
        };

        // Set initial status
        updateBatteryStatus();

        // Listen for changes
        battery.addEventListener("levelchange", updateBatteryStatus);
        battery.addEventListener("chargingchange", updateBatteryStatus);

        return () => {
          battery.removeEventListener("levelchange", updateBatteryStatus);
          battery.removeEventListener("chargingchange", updateBatteryStatus);
        };
      } catch {
        // Battery API failed or not available
        if (isMounted) {
          setBatteryStatus(null);
        }
      }
    };

    const cleanup = initializeBattery();

    return () => {
      isMounted = false;
      void cleanup.then((c) => c?.());
    };
  }, []);

  return batteryStatus;
}

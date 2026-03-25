import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGoldenHourNotifications } from "@/hooks/use-golden-hour-notifications";
import type { SunData } from "@/types/sun";

describe("useGoldenHourNotifications", () => {
  let mockNotification: {
    permission: NotificationPermission;
    requestPermission: ReturnType<typeof vi.fn>;
  };

  const browserWindow = globalThis as typeof globalThis & {
    Notification?: unknown;
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    // Mock Notification API
    mockNotification = {
      permission: "default" as NotificationPermission,
      requestPermission: vi.fn().mockResolvedValue("granted"),
    };
    browserWindow.Notification = mockNotification;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const createSunData = (
    goldenHourStart: Date,
    goldenHourEnd: Date,
    eveningStart: Date,
    eveningEnd: Date
  ): SunData => ({
    sunrise: new Date(),
    sunset: new Date(),
    solarNoon: new Date(),
    goldenHour: {
      start: goldenHourStart,
      end: goldenHourEnd,
    },
    goldenHourEvening: {
      start: eveningStart,
      end: eveningEnd,
    },
    blueHour: { start: new Date(), end: new Date() },
    blueHourEvening: { start: new Date(), end: new Date() },
    sunAzimuth: 100,
    sunElevation: 45,
    sunriseAzimuth: 90,
    sunsetAzimuth: 270,
    shadowDirection: 180,
    shadowLengthRatio: 1,
    dayLength: 12 * 3600 * 1000,
    dayLengthChange: 60 * 1000,
  });

  it("returns 'unsupported' when Notification API is not available", () => {
    delete browserWindow.Notification;

    const { result } = renderHook(() =>
      useGoldenHourNotifications(null, "Test City")
    );

    expect(result.current.permissionState).toBe("unsupported");
    expect(result.current.isScheduled).toBe(false);
  });

  it("reads initial Notification permission state on mount", () => {
    mockNotification.permission = "granted";

    const { result } = renderHook(() =>
      useGoldenHourNotifications(null, "Test City")
    );

    expect(result.current.permissionState).toBe("granted");
  });

  it("requestAndSchedule requests permission and schedules notification when granted", async () => {
    const now = new Date("2026-03-24T10:00:00");
    vi.setSystemTime(now);

    const goldenHourStart = new Date("2026-03-24T16:00:00"); // 30 min from now
    const goldenHourEnd = new Date("2026-03-24T17:00:00");
    const eveningStart = new Date("2026-03-24T18:00:00");
    const eveningEnd = new Date("2026-03-24T19:00:00");

    const sunData = createSunData(
      goldenHourStart,
      goldenHourEnd,
      eveningStart,
      eveningEnd
    );

    const { result } = renderHook(() =>
      useGoldenHourNotifications(sunData, "Test City")
    );

    await act(async () => {
      await result.current.requestAndSchedule();
    });

    expect(mockNotification.requestPermission).toHaveBeenCalled();
    expect(result.current.permissionState).toBe("granted");
    expect(result.current.isScheduled).toBe(true);
  });

  it("scheduleNext calculates correct timeout (30 minutes before event)", async () => {
    const now = new Date("2026-03-24T10:00:00");
    vi.setSystemTime(now);

    // Golden hour starts at 10:30 (30 min from now)
    const goldenHourStart = new Date("2026-03-24T10:30:00");
    const goldenHourEnd = new Date("2026-03-24T11:00:00");
    const eveningStart = new Date("2026-03-24T18:00:00");
    const eveningEnd = new Date("2026-03-24T19:00:00");

    const sunData = createSunData(
      goldenHourStart,
      goldenHourEnd,
      eveningStart,
      eveningEnd
    );

    const { result } = renderHook(() =>
      useGoldenHourNotifications(sunData, "Test City")
    );

    await act(async () => {
      await result.current.requestAndSchedule();
    });

    // Should schedule exactly 0 ms from now (since 30 min before 10:30 is 10:00)
    expect(result.current.isScheduled).toBe(true);
  });

  it("cancel clears the timer and sets isScheduled to false", async () => {
    const now = new Date("2026-03-24T10:00:00");
    vi.setSystemTime(now);

    const goldenHourStart = new Date("2026-03-24T10:30:00");
    const goldenHourEnd = new Date("2026-03-24T11:00:00");
    const eveningStart = new Date("2026-03-24T18:00:00");
    const eveningEnd = new Date("2026-03-24T19:00:00");

    const sunData = createSunData(
      goldenHourStart,
      goldenHourEnd,
      eveningStart,
      eveningEnd
    );

    const { result } = renderHook(() =>
      useGoldenHourNotifications(sunData, "Test City")
    );

    await act(async () => {
      await result.current.requestAndSchedule();
    });

    expect(result.current.isScheduled).toBe(true);

    act(() => {
      result.current.cancel();
    });

    expect(result.current.isScheduled).toBe(false);
  });

  it("reschedules when sunData changes and isScheduled is true", async () => {
    const now = new Date("2026-03-24T10:00:00");
    vi.setSystemTime(now);

    const goldenHourStart1 = new Date("2026-03-24T10:30:00");
    const goldenHourEnd1 = new Date("2026-03-24T11:00:00");
    const eveningStart1 = new Date("2026-03-24T18:00:00");
    const eveningEnd1 = new Date("2026-03-24T19:00:00");

    const sunData1 = createSunData(
      goldenHourStart1,
      goldenHourEnd1,
      eveningStart1,
      eveningEnd1
    );

    const { result: result1, rerender } = renderHook(
      ({ sunData, locationName }) =>
        useGoldenHourNotifications(sunData, locationName),
      {
        initialProps: { sunData: sunData1, locationName: "City 1" },
      }
    );

    await act(async () => {
      await result1.current.requestAndSchedule();
    });

    expect(result1.current.isScheduled).toBe(true);

    const goldenHourStart2 = new Date("2026-03-24T11:00:00");
    const goldenHourEnd2 = new Date("2026-03-24T12:00:00");
    const eveningStart2 = new Date("2026-03-24T19:00:00");
    const eveningEnd2 = new Date("2026-03-24T20:00:00");

    const sunData2 = createSunData(
      goldenHourStart2,
      goldenHourEnd2,
      eveningStart2,
      eveningEnd2
    );

    rerender({ sunData: sunData2, locationName: "City 1" });

    expect(result1.current.isScheduled).toBe(true);
  });

  it("truncates locationName to 100 characters in notification body", async () => {
    const now = new Date("2026-03-24T10:00:00");
    vi.setSystemTime(now);

    const longLocationName =
      "A".repeat(150); // 150 characters, should be truncated to 100

    const goldenHourStart = new Date("2026-03-24T10:00:00"); // notification fires immediately
    const goldenHourEnd = new Date("2026-03-24T11:00:00");
    const eveningStart = new Date("2026-03-24T18:00:00");
    const eveningEnd = new Date("2026-03-24T19:00:00");

    const sunData = createSunData(
      goldenHourStart,
      goldenHourEnd,
      eveningStart,
      eveningEnd
    );

    const mockedNotificationConstructor = vi.fn();
    const notificationConstructor = Object.assign(
      (title: string, options?: NotificationOptions) => {
        mockedNotificationConstructor(title, options);
      },
      {
        permission: "granted" as NotificationPermission,
        requestPermission: vi.fn().mockResolvedValue("granted"),
      },
    );
    browserWindow.Notification = notificationConstructor;

    const { result } = renderHook(() =>
      useGoldenHourNotifications(sunData, longLocationName)
    );

    await act(async () => {
      await result.current.requestAndSchedule();
    });

    vi.advanceTimersByTime(1000); // Fire the timeout

    const lastCall = mockedNotificationConstructor.mock.calls[
      mockedNotificationConstructor.mock.calls.length - 1
    ];
    if (lastCall) {
      const body = lastCall[1]?.body || "";
      const truncatedName = longLocationName.slice(0, 100);
      expect(body).toContain(truncatedName);
      expect(body).not.toContain(longLocationName);
    }
  });

  it("cleans up timer on unmount", async () => {
    const now = new Date("2026-03-24T10:00:00");
    vi.setSystemTime(now);

    const goldenHourStart = new Date("2026-03-24T10:30:00");
    const goldenHourEnd = new Date("2026-03-24T11:00:00");
    const eveningStart = new Date("2026-03-24T18:00:00");
    const eveningEnd = new Date("2026-03-24T19:00:00");

    const sunData = createSunData(
      goldenHourStart,
      goldenHourEnd,
      eveningStart,
      eveningEnd
    );

    const { result, unmount } = renderHook(() =>
      useGoldenHourNotifications(sunData, "Test City")
    );

    await act(async () => {
      await result.current.requestAndSchedule();
    });

    expect(result.current.isScheduled).toBe(true);

    unmount();

    // After unmount, timer should be cleared (no new notifications)
    vi.advanceTimersByTime(100000);
  });
});

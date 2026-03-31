import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NotificationSettings } from "@/components/panels/notification-settings";
import { useGoldenHourNotifications } from "@/hooks/use-golden-hour-notifications";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

// Mock the hook
vi.mock("@/hooks/use-golden-hour-notifications");

const SUN_DATA = {
  sunrise: new Date("2025-03-24T06:00:00"),
  sunset: new Date("2025-03-24T18:00:00"),
  solarNoon: new Date("2025-03-24T12:00:00"),
  goldenHour: {
    start: new Date("2025-03-24T06:00:00"),
    end: new Date("2025-03-24T06:30:00"),
  },
  goldenHourEvening: {
    start: new Date("2025-03-24T17:30:00"),
    end: new Date("2025-03-24T18:00:00"),
  },
  blueHour: {
    start: new Date("2025-03-24T05:30:00"),
    end: new Date("2025-03-24T06:00:00"),
  },
  blueHourEvening: {
    start: new Date("2025-03-24T18:00:00"),
    end: new Date("2025-03-24T18:30:00"),
  },
  sunAzimuth: 150,
  sunElevation: 45,
  sunriseAzimuth: 84,
  sunsetAzimuth: 276,
  shadowDirection: 330,
  shadowLengthRatio: 1,
  dayLength: 12 * 3600,
  dayLengthChange: 120,
};

const mockUseGoldenHourNotifications = useGoldenHourNotifications as ReturnType<typeof vi.fn>;

function setupStore() {
  useSunTrackerStore.setState({
    sunData: SUN_DATA,
    locationName: "Test Location",
  });
}

describe("NotificationSettings", () => {
  beforeEach(() => {
    setupStore();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns null when permissionState is unsupported", () => {
    mockUseGoldenHourNotifications.mockReturnValue({
      permissionState: "unsupported",
      isScheduled: false,
      requestAndSchedule: vi.fn(),
      cancel: vi.fn(),
    });

    const { container } = render(<NotificationSettings />);
    expect(container.firstChild).toBeNull();
  });

  it("renders permission chip with correct color for default state", () => {
    mockUseGoldenHourNotifications.mockReturnValue({
      permissionState: "default",
      isScheduled: false,
      requestAndSchedule: vi.fn(),
      cancel: vi.fn(),
    });

    render(<NotificationSettings />);
    const chip = screen.getByText(/Notifications: default/i);
    expect(chip).toHaveClass("border-zinc-300", "bg-zinc-50", "text-zinc-700");
  });

  it("renders permission chip with correct color for granted state", () => {
    mockUseGoldenHourNotifications.mockReturnValue({
      permissionState: "granted",
      isScheduled: false,
      requestAndSchedule: vi.fn(),
      cancel: vi.fn(),
    });

    render(<NotificationSettings />);
    const chip = screen.getByText(/Notifications: granted/i);
    expect(chip).toHaveClass("border-green-300", "bg-green-50", "text-green-700");
  });

  it("renders permission chip with correct color for denied state", () => {
    mockUseGoldenHourNotifications.mockReturnValue({
      permissionState: "denied",
      isScheduled: false,
      requestAndSchedule: vi.fn(),
      cancel: vi.fn(),
    });

    render(<NotificationSettings />);
    const chip = screen.getByText(/Notifications: denied/i);
    expect(chip).toHaveClass("border-red-300", "bg-red-50", "text-red-700");
  });

  it("shows denied help text when permissionState is denied", () => {
    mockUseGoldenHourNotifications.mockReturnValue({
      permissionState: "denied",
      isScheduled: false,
      requestAndSchedule: vi.fn(),
      cancel: vi.fn(),
    });

    render(<NotificationSettings />);
    expect(
      screen.getByText(/To re-enable, allow notifications in your browser settings/i),
    ).toBeInTheDocument();
  });

  it("shows 'Notify me' button when permissionState is default and not scheduled", () => {
    mockUseGoldenHourNotifications.mockReturnValue({
      permissionState: "default",
      isScheduled: false,
      requestAndSchedule: vi.fn(),
      cancel: vi.fn(),
    });

    render(<NotificationSettings />);
    expect(screen.getByText(/Notify me at golden hour/i)).toBeInTheDocument();
  });

  it("does not show 'Notify me' button when permissionState is denied", () => {
    mockUseGoldenHourNotifications.mockReturnValue({
      permissionState: "denied",
      isScheduled: false,
      requestAndSchedule: vi.fn(),
      cancel: vi.fn(),
    });

    render(<NotificationSettings />);
    expect(screen.queryByText(/Notify me at golden hour/i)).not.toBeInTheDocument();
  });

  it("does not show 'Notify me' button when already scheduled", () => {
    mockUseGoldenHourNotifications.mockReturnValue({
      permissionState: "granted",
      isScheduled: true,
      requestAndSchedule: vi.fn(),
      cancel: vi.fn(),
    });

    render(<NotificationSettings />);
    expect(screen.queryByText(/Notify me at golden hour/i)).not.toBeInTheDocument();
  });

  it("shows 'Disable reminders' button when scheduled", () => {
    mockUseGoldenHourNotifications.mockReturnValue({
      permissionState: "granted",
      isScheduled: true,
      requestAndSchedule: vi.fn(),
      cancel: vi.fn(),
    });

    render(<NotificationSettings />);
    expect(screen.getByText(/Disable reminders/i)).toBeInTheDocument();
  });

  it("shows scheduled confirmation text when isScheduled is true", () => {
    mockUseGoldenHourNotifications.mockReturnValue({
      permissionState: "granted",
      isScheduled: true,
      requestAndSchedule: vi.fn(),
      cancel: vi.fn(),
    });

    render(<NotificationSettings />);
    expect(
      screen.getByText(
        /You'll be notified 30 min before golden hour\. \(Tab must stay open\.\)/i,
      ),
    ).toBeInTheDocument();
  });

  it("calls requestAndSchedule when 'Notify me' button is clicked", async () => {
    const mockRequestAndSchedule = vi.fn().mockResolvedValue(undefined);
    mockUseGoldenHourNotifications.mockReturnValue({
      permissionState: "default",
      isScheduled: false,
      requestAndSchedule: mockRequestAndSchedule,
      cancel: vi.fn(),
    });

    render(<NotificationSettings />);
    const button = screen.getByText(/Notify me at golden hour/i);
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockRequestAndSchedule).toHaveBeenCalled();
    });
  });

  it("calls cancel when 'Disable reminders' button is clicked", () => {
    const mockCancel = vi.fn();
    mockUseGoldenHourNotifications.mockReturnValue({
      permissionState: "granted",
      isScheduled: true,
      requestAndSchedule: vi.fn(),
      cancel: mockCancel,
    });

    render(<NotificationSettings />);
    const button = screen.getByText(/Disable reminders/i);
    fireEvent.click(button);

    expect(mockCancel).toHaveBeenCalled();
  });

  it("shows loading state while request is pending", async () => {
    const mockRequestAndSchedule = vi.fn(
      () =>
        new Promise((resolve) => {
          setTimeout(resolve, 100);
        }),
    );
    mockUseGoldenHourNotifications.mockReturnValue({
      permissionState: "default",
      isScheduled: false,
      requestAndSchedule: mockRequestAndSchedule,
      cancel: vi.fn(),
    });

    render(<NotificationSettings />);
    const button = screen.getByText(/Notify me at golden hour/i);
    fireEvent.click(button);

    expect(screen.getByText(/Requesting\.\.\./i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Notify me at golden hour/i)).toBeInTheDocument();
    });
  });

  it("has aria-live polite on status area for accessibility", () => {
    mockUseGoldenHourNotifications.mockReturnValue({
      permissionState: "default",
      isScheduled: false,
      requestAndSchedule: vi.fn(),
      cancel: vi.fn(),
    });

    render(<NotificationSettings />);
    const statusDiv = screen.getByText(/Notifications: default/i).closest("[aria-live]");
    expect(statusDiv).toHaveAttribute("aria-live", "polite");
    expect(statusDiv).toHaveAttribute("aria-atomic", "true");
  });
});

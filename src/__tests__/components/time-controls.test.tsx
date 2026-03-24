import { act, fireEvent, render, screen } from "@testing-library/react";
import { AnimateButton } from "@/components/controls/animate-button";
import { DatePicker } from "@/components/controls/date-picker";
import { DaylightInfo } from "@/components/controls/daylight-info";
import { NowButton } from "@/components/controls/now-button";
import { TimeSlider } from "@/components/controls/time-slider";
import { useSunTrackerStore } from "@/store/sun-tracker-store";

describe("time/date controls", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-03-19T15:30:00.000Z"));

		useSunTrackerStore.setState({
			location: { lat: 40.7128, lng: -74.006 },
			locationName: "New York",
			dateTime: new Date("2026-03-19T12:00:00.000Z"),
			isAnimating: false,
			sunData: null,
			activeOverlays: new Set([
				"sun-position",
				"sunrise-line",
				"sunset-line",
				"shadow",
				"sun-path",
			]),
			photographerMode: false,
			isMobile: false,
		});
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it("updates store time when the slider moves", () => {
		render(<TimeSlider />);

		fireEvent.change(screen.getByLabelText("Time of day slider"), {
			target: { value: "830" },
		});

		const nextDateTime = useSunTrackerStore.getState().dateTime;
		expect(nextDateTime.getHours()).toBe(13);
		expect(nextDateTime.getMinutes()).toBe(50);
	});

	it("updates store date when date picker changes", () => {
		render(<DatePicker />);

		fireEvent.change(screen.getByLabelText("Date picker"), {
			target: { value: "2026-07-04" },
		});

		const nextDateTime = useSunTrackerStore.getState().dateTime;
		expect(nextDateTime.getFullYear()).toBe(2026);
		expect(nextDateTime.getMonth()).toBe(6);
		expect(nextDateTime.getDate()).toBe(4);
	});

	it("resets to current system time when now is clicked", () => {
		render(<NowButton />);

		fireEvent.click(screen.getByRole("button", { name: "Now" }));

		expect(useSunTrackerStore.getState().dateTime.toISOString()).toBe(
			"2026-03-19T15:30:00.000Z",
		);
		expect(useSunTrackerStore.getState().isAnimating).toBe(false);
	});

	it("animates time forward while playing", () => {
		let frameCallback: FrameRequestCallback | undefined;
		let frameId = 0;

		vi.stubGlobal(
			"requestAnimationFrame",
			vi.fn((callback: FrameRequestCallback) => {
				frameCallback = callback;
				frameId += 1;
				return frameId;
			}),
		);
		vi.stubGlobal("cancelAnimationFrame", vi.fn());

		render(<AnimateButton />);

		const beforeMs = useSunTrackerStore.getState().dateTime.getTime();

		fireEvent.click(screen.getByRole("button", { name: "Animate sun movement" }));
		expect(useSunTrackerStore.getState().isAnimating).toBe(true);

		act(() => {
			frameCallback?.(0);
			frameCallback?.(1000);
		});

		const nextDateTime = useSunTrackerStore.getState().dateTime;
		expect(nextDateTime.getTime() - beforeMs).toBe(60 * 1000);
	});

	it("shows formatted daylight duration and day-length delta", () => {
		useSunTrackerStore.setState({
			sunData: {
				sunrise: new Date("2026-03-19T11:00:00.000Z"),
				sunset: new Date("2026-03-19T23:15:00.000Z"),
				solarNoon: new Date("2026-03-19T17:00:00.000Z"),
				goldenHour: {
					start: new Date("2026-03-19T11:10:00.000Z"),
					end: new Date("2026-03-19T12:10:00.000Z"),
				},
				goldenHourEvening: {
					start: new Date("2026-03-19T22:15:00.000Z"),
					end: new Date("2026-03-19T23:15:00.000Z"),
				},
				blueHour: {
					start: new Date("2026-03-19T10:30:00.000Z"),
					end: new Date("2026-03-19T11:00:00.000Z"),
				},
				blueHourEvening: {
					start: new Date("2026-03-19T23:15:00.000Z"),
					end: new Date("2026-03-19T23:40:00.000Z"),
				},
				sunAzimuth: 165,
				sunElevation: 48,
				sunriseAzimuth: 82,
				sunsetAzimuth: 278,
				shadowDirection: 345,
				shadowLengthRatio: 0.9,
				dayLength: 12 * 3600 + 15 * 60,
				dayLengthChange: 135,
			},
		});

		render(<DaylightInfo />);

		expect(screen.getByText("Day length: 12h 15m")).toBeInTheDocument();
		expect(screen.getByText("Change vs previous day: +2m 15s")).toBeInTheDocument();
	});
});

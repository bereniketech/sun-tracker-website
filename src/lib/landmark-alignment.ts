import { computeSunData } from "@/lib/sun";
import type { AlignmentEvent, Landmark } from "@/types/sun";

const DEFAULT_TOLERANCE_DEGREES = 0.6;

function normalizeAzimuth(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function angularDifference(first: number, second: number): number {
  const rawDifference = Math.abs(normalizeAzimuth(first) - normalizeAzimuth(second));
  return rawDifference > 180 ? 360 - rawDifference : rawDifference;
}

function oppositeAzimuth(value: number): number {
  return normalizeAzimuth(value + 180);
}

function noonForDay(year: number, month: number, day: number): Date {
  return new Date(year, month, day, 12, 0, 0, 0);
}

function matchesOrientation(
  landmark: Landmark,
  sunAzimuth: number,
  toleranceDegrees: number,
): { matchedAzimuth: number; differenceDegrees: number } | null {
  const forwardDifference = angularDifference(landmark.orientationAzimuth, sunAzimuth);
  const reverseAzimuth = oppositeAzimuth(landmark.orientationAzimuth);
  const reverseDifference = angularDifference(reverseAzimuth, sunAzimuth);

  const bestMatch =
    forwardDifference <= reverseDifference
      ? {
          matchedAzimuth: normalizeAzimuth(landmark.orientationAzimuth),
          differenceDegrees: forwardDifference,
        }
      : {
          matchedAzimuth: reverseAzimuth,
          differenceDegrees: reverseDifference,
        };

  return bestMatch.differenceDegrees <= toleranceDegrees ? bestMatch : null;
}

function createEvent(
  landmark: Landmark,
  eventTime: Date,
  matchType: "sunrise" | "sunset",
  sunAzimuth: number,
  match: { matchedAzimuth: number; differenceDegrees: number },
): AlignmentEvent {
  return {
    id: `${landmark.id}-${matchType}-${eventTime.toISOString()}`,
    landmarkId: landmark.id,
    landmarkName: landmark.name,
    eventTime,
    matchType,
    matchedAzimuth: match.matchedAzimuth,
    sunAzimuth,
    differenceDegrees: match.differenceDegrees,
  };
}

export function findLandmarkAlignmentEvents(
  landmark: Landmark,
  year: number,
  toleranceDegrees = DEFAULT_TOLERANCE_DEGREES,
): AlignmentEvent[] {
  const events: AlignmentEvent[] = [];

  for (let month = 0; month < 12; month += 1) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day += 1) {
      const sunData = computeSunData(landmark.lat, landmark.lng, noonForDay(year, month, day));

      const sunriseMatch = matchesOrientation(
        landmark,
        sunData.sunriseAzimuth,
        toleranceDegrees,
      );
      if (sunriseMatch) {
        events.push(
          createEvent(
            landmark,
            sunData.sunrise,
            "sunrise",
            sunData.sunriseAzimuth,
            sunriseMatch,
          ),
        );
      }

      const sunsetMatch = matchesOrientation(
        landmark,
        sunData.sunsetAzimuth,
        toleranceDegrees,
      );
      if (sunsetMatch) {
        events.push(
          createEvent(
            landmark,
            sunData.sunset,
            "sunset",
            sunData.sunsetAzimuth,
            sunsetMatch,
          ),
        );
      }
    }
  }

  return events.sort((first, second) => first.eventTime.getTime() - second.eventTime.getTime());
}
import SunCalc from 'suncalc';
import type { SolarResult } from '@/types/solar';

const MINUTES_TO_MS = 60 * 1000;
const HOURS_TO_MS = 60 * MINUTES_TO_MS;
const TILT_STEP = 10;
const AZIMUTH_STEP = 10;
const SAMPLE_DAYS = [15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345];

interface HourlyIrradiance {
  directNormal: number;
  diffuse: number;
}

function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function normalizeDegrees(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function getSunPosition(date: Date, lat: number, lng: number): { elevation: number; azimuth: number } {
  const pos = SunCalc.getPosition(date, lat, lng);
  const elevation = radiansToDegrees(pos.altitude);
  let azimuth = radiansToDegrees(pos.azimuth) + 180;
  azimuth = normalizeDegrees(azimuth);
  return { elevation, azimuth };
}

function getExtraterrestrialIrradiance(dayOfYear: number): number {
  const B = (2 * Math.PI * (dayOfYear - 1)) / 365;
  return (
    1367 *
    (1.00011 +
      0.034221 * Math.cos(B) +
      0.00128 * Math.sin(B) +
      0.000719 * Math.cos(2 * B) +
      0.000077 * Math.sin(2 * B))
  );
}

function estimateAirMass(elevation: number): number {
  if (elevation <= 0) return 38;
  const elevationRad = degreesToRadians(elevation);
  return 1 / (Math.cos(Math.PI / 2 - elevationRad) + 0.50572 * Math.pow(96.07995 - elevation, -1.6364));
}

function estimateDirectNormal(irradiance: number, elevation: number): number {
  if (elevation <= 0) return 0;
  const airMass = estimateAirMass(elevation);
  const transmission = Math.pow(0.7, Math.pow(airMass, 0.678));
  return Math.max(0, irradiance * transmission);
}

function estimateDiffuse(irradiance: number, elevation: number, directNormal: number): number {
  if (elevation <= 0) return 0;
  const clearness = (directNormal * Math.sin(degreesToRadians(elevation)) + 0.1 * irradiance) / irradiance;
  let kd: number;
  if (clearness <= 0.3) {
    kd = 1.02 - 0.254 * clearness + 0.0123 * Math.sin(degreesToRadians(elevation));
  } else if (clearness <= 0.78) {
    kd = 1.4 - 1.749 * clearness + 0.177 * Math.sin(degreesToRadians(elevation));
  } else {
    kd = 0.486 * clearness - 0.182 * Math.sin(degreesToRadians(elevation));
  }
  return Math.max(0, Math.min(irradiance, irradiance * kd));
}

function getHourlyIrradiance(
  date: Date,
  lat: number,
  lng: number,
  dayOfYear: number
): HourlyIrradiance {
  const irradiance = getExtraterrestrialIrradiance(dayOfYear);
  const { elevation } = getSunPosition(date, lat, lng);

  const directNormal = estimateDirectNormal(irradiance, elevation);
  const diffuse = estimateDiffuse(irradiance, elevation, directNormal);

  return { directNormal, diffuse };
}

function calculatePanelIrradiance(
  tilt: number,
  azimuth: number,
  sunElevation: number,
  sunAzimuth: number,
  directNormal: number,
  diffuse: number
): number {
  if (sunElevation <= 0) return 0;

  const tiltRad = degreesToRadians(tilt);
  const azimuthRad = degreesToRadians(azimuth);
  const sunElevationRad = degreesToRadians(sunElevation);
  const sunAzimuthRad = degreesToRadians(sunAzimuth);

  const zenithAngle = Math.PI / 2 - sunElevationRad;
  const tiltedNormalZenith = Math.acos(
    Math.cos(zenithAngle) * Math.cos(tiltRad) +
      Math.sin(zenithAngle) * Math.sin(tiltRad) * Math.cos(sunAzimuthRad - azimuthRad)
  );

  const cosI = Math.cos(tiltedNormalZenith);
  const beamComponent = Math.max(0, directNormal * cosI);

  const groundReflectance = 0.2;
  const reflectedComponent =
    diffuse * groundReflectance * ((1 + Math.cos(tiltRad)) / 2);

  const isotropicComponent = diffuse * (1 - groundReflectance) * ((1 + Math.cos(tiltRad)) / 2);

  return beamComponent + reflectedComponent + isotropicComponent;
}

function calculateYearlyOutput(
  tilt: number,
  azimuth: number,
  lat: number,
  lng: number,
  panelSizeKw: number
): { annual: number; monthly: number[] } {
  const monthlyOutputs: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let yearlyTotal = 0;

  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const efficiency = 0.85;

  SAMPLE_DAYS.forEach((dayOfYear, monthIndex) => {
    const date = new Date(2023, monthIndex, 15);
    let dailyTotal = 0;

    for (let hour = 6; hour < 19; hour++) {
      const hourDate = new Date(date.getTime() + hour * HOURS_TO_MS);
      const { elevation: sunElevation, azimuth: sunAzimuth } = getSunPosition(
        hourDate,
        lat,
        lng
      );

      const { directNormal, diffuse } = getHourlyIrradiance(
        hourDate,
        lat,
        lng,
        dayOfYear
      );

      const panelIrradiance = calculatePanelIrradiance(
        tilt,
        azimuth,
        sunElevation,
        sunAzimuth,
        directNormal,
        diffuse
      );

      const panelOutput = (panelIrradiance * panelSizeKw * efficiency) / 1000;
      dailyTotal += panelOutput;
    }

    const daysInMonth = daysPerMonth[monthIndex];
    const monthTotal = dailyTotal * daysInMonth;
    monthlyOutputs[monthIndex] = monthTotal;
    yearlyTotal += monthTotal;
  });

  return {
    annual: Math.round(yearlyTotal * 100) / 100,
    monthly: monthlyOutputs.map((kwh) => Math.round(kwh * 100) / 100),
  };
}

export function computeOptimalPanelAngle(
  lat: number,
  lng: number,
  panelSizeKw: number = 5
): SolarResult {
  let maxAnnualOutput = 0;
  let bestTilt = 0;
  let bestAzimuth = 0;
  let bestMonthly: number[] = [];

  const isNorthern = lat >= 0;

  for (let tilt = 0; tilt <= 90; tilt += TILT_STEP) {
    for (let azimuth = isNorthern ? 150 : 0; azimuth <= (isNorthern ? 210 : 60); azimuth += AZIMUTH_STEP) {
      const { annual, monthly } = calculateYearlyOutput(tilt, azimuth, lat, lng, panelSizeKw);

      if (annual > maxAnnualOutput) {
        maxAnnualOutput = annual;
        bestTilt = tilt;
        bestAzimuth = azimuth;
        bestMonthly = [...monthly];
      }
    }
  }

  return {
    optimalTilt: bestTilt,
    optimalAzimuth: bestAzimuth,
    annualKwhEstimate: maxAnnualOutput,
    monthlyKwh: bestMonthly,
  };
}

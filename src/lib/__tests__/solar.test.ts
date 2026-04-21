import { describe, it, expect } from 'bun:test';
import { computeOptimalPanelAngle } from '../solar';

describe('computeOptimalPanelAngle', () => {
  it('should return a SolarResult with expected properties', () => {
    const result = computeOptimalPanelAngle(40.7128, -74.006, 5);

    expect(result).toBeDefined();
    expect(result.optimalTilt).toBeDefined();
    expect(result.optimalAzimuth).toBeDefined();
    expect(result.annualKwhEstimate).toBeDefined();
    expect(result.monthlyKwh).toBeDefined();
    expect(Array.isArray(result.monthlyKwh)).toBe(true);
    expect(result.monthlyKwh.length).toBe(12);
  }, 15000);

  it('NYC latitude should have optimal tilt', () => {
    const result = computeOptimalPanelAngle(40.7128, -74.006, 5);

    expect(result.optimalTilt).toBeGreaterThanOrEqual(0);
    expect(result.optimalTilt).toBeLessThanOrEqual(90);
  }, 15000);

  it('NYC should have azimuth in northern range (150-210)', () => {
    const result = computeOptimalPanelAngle(40.7128, -74.006, 5);

    expect(result.optimalAzimuth).toBeGreaterThanOrEqual(150);
    expect(result.optimalAzimuth).toBeLessThanOrEqual(210);
  }, 15000);

  it('should return positive annual kWh estimate', () => {
    const result = computeOptimalPanelAngle(40.7128, -74.006, 5);

    expect(result.annualKwhEstimate).toBeGreaterThan(0);
  }, 15000);

  it('monthly outputs should be positive and sum to annual total', () => {
    const result = computeOptimalPanelAngle(40.7128, -74.006, 5);
    const monthlySum = result.monthlyKwh.reduce((sum, kwh) => sum + kwh, 0);

    result.monthlyKwh.forEach((kwh) => {
      expect(kwh).toBeGreaterThanOrEqual(0);
    });

    const tolerance = result.annualKwhEstimate * 0.02;
    expect(Math.abs(monthlySum - result.annualKwhEstimate)).toBeLessThan(tolerance);
  }, 15000);

  it('larger panel size should produce more annual kWh', () => {
    const result5kw = computeOptimalPanelAngle(40.7128, -74.006, 5);
    const result10kw = computeOptimalPanelAngle(40.7128, -74.006, 10);

    expect(result10kw.annualKwhEstimate).toBeGreaterThan(result5kw.annualKwhEstimate);
  }, 30000);

  it('equatorial location should have lower or equal tilt to NYC', () => {
    const nyc = computeOptimalPanelAngle(40.7128, -74.006, 5);
    const equator = computeOptimalPanelAngle(0, 0, 5);

    expect(equator.optimalTilt).toBeLessThanOrEqual(nyc.optimalTilt);
  }, 30000);
});

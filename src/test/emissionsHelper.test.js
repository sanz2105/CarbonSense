import { describe, it, expect } from 'vitest';
import { calculateTotals, buildChartData, estimateEmissions } from '../utils/emissionsHelper';

describe('emissionsHelper', () => {
  it('calculateTotals with an empty array returns default or 0 values appropriately', () => {
    const result = calculateTotals([]);
    // The implementation falls back to default values when empty
    expect(result.todayEmissions).toBe(4.2);
    expect(result.weeklyTotal).toBe(28.4);
    expect(result.monthlyTotal).toBe(112);
    expect(result.vsGlobal).toBe(-12);
  });

  it('calculateTotals with a known fixture returns specific numeric outputs', () => {
    const today = new Date().toISOString().substring(0, 10);
    const mockActivities = [{ date: today, emissions: 10 }];
    const result = calculateTotals(mockActivities);
    expect(result.todayEmissions).toBe(10);
    expect(result.weeklyTotal).toBe(10);
    expect(result.monthlyTotal).toBe(10);
    expect(result.vsGlobal).toBe(Math.round(((10 - 38.5) / 38.5) * 100));
  });

  it('calculateTotals with activities spanning multiple days', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const mockActivities = [
      { date: today.toISOString().substring(0, 10), emissions: 5 },
      { date: yesterday.toISOString().substring(0, 10), emissions: 15 }
    ];
    
    const result = calculateTotals(mockActivities);
    expect(result.todayEmissions).toBe(5);
    expect(result.weeklyTotal).toBe(20);
    expect(result.monthlyTotal).toBe(20); // assuming both in same month for most test runs
  });

  it('buildChartData returns correct shape', () => {
    const result = buildChartData([]);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(7);
    expect(result[0]).toHaveProperty('day');
    expect(result[0]).toHaveProperty('emissions');
    expect(result[0].emissions).toBe(0);
  });

  it('estimateEmissions with a complete form object returns a positive number', () => {
    const result = estimateEmissions({
      category: 'Transport',
      transportDistance: '10',
      transportVehicle: 'Car'
    });
    expect(result).toBeGreaterThan(0);
  });

  it('estimateEmissions with missing or zero fields doesn\'t throw and returns 0', () => {
    const result = estimateEmissions({
      category: 'Transport',
      transportDistance: '',
      transportVehicle: 'Unknown'
    });
    expect(result).toBe(0);
  });
  it('calculateTotals with one activity dated exactly 7 days ago (boundary case)', () => {
    const today = new Date();
    const exactly7DaysAgo = new Date(today);
    exactly7DaysAgo.setDate(today.getDate() - 7);
    
    const result = calculateTotals([
      { date: exactly7DaysAgo.toISOString().substring(0, 10), emissions: 10 }
    ]);
    
    // It should be included in weeklyTotal if >= 7 days ago
    expect(result.weeklyTotal).toBeGreaterThan(0);
  });

  it('calculateTotals with two activities sharing the same ISO timestamp', () => {
    const today = new Date().toISOString().substring(0, 10);
    const mockActivities = [
      { date: today, emissions: 5 },
      { date: today, emissions: 15 }
    ];
    const result = calculateTotals(mockActivities);
    expect(result.todayEmissions).toBe(20);
    expect(result.weeklyTotal).toBe(20);
  });

  it('buildChartData always returns exactly 7 items regardless of input count', () => {
    const mockActivities = Array(20).fill({ date: new Date().toISOString().substring(0, 10), emissions: 1 });
    const result = buildChartData(mockActivities);
    expect(result.length).toBe(7);
  });

  it('estimateEmissions with an unrecognized category key returns 0, does not throw', () => {
    const result = estimateEmissions({
      category: 'SpaceTravel',
      otherManualCo2: '10'
    });
    expect(result).toBe(0);
  });
});

import { computeDefaultCost, computeCosts } from './cost';
import { toHours, toDays } from './time';

// TODO: handle money properly to avoid floating point issues
// maybe use https://github.com/sarahdayan/dinero.js (comes with formatting, currencies, etc)

describe('computeCosts', () => {
  it('computeCosts', () => {
    const minutes = 30;
    const distance = 10;
    const computed = computeCosts(minutes, distance);
    expect(computed.evo.total).toBeCloseTo(13.3);
    expect(computed.modo.total).toBeCloseTo(1.5 + 2 + 4);
  });
});

describe('computeDefaultCost', () => {
  describe('modo', () => {
    const tripCost = 1.5;
    const hourlyRate = 4;
    const dailyRate = 52;

    it('1 hour', () => {
      const timeCost = hourlyRate;
      const distanceCost = 4;
      expect(computeDefaultCost('modo', toHours(1), 10)).toHaveProperty(
        'total',
        tripCost + timeCost + distanceCost
      );
    });

    it('1 hour, 10 minutes (rounds to next 15 min increment)', () => {
      const timeCost = hourlyRate + hourlyRate / 4; // 15 mins = 1/4 of hour
      const distanceCost = 4;
      expect(computeDefaultCost('modo', toHours(1) + 10, 10)).toHaveProperty(
        'total',
        tripCost + timeCost + distanceCost
      );
    });

    it('16 hours, 30 minutes', () => {
      const timeCost = dailyRate; // 16 hours is enough to hit daily rate
      const distanceCost = 25 * 0.4 + 75 * 0.28;
      expect(computeDefaultCost('modo', toHours(16) + 30, 100)).toHaveProperty(
        'total',
        tripCost + timeCost + distanceCost
      );
    });

    it('2 days, 2 hours, 5 minutes', () => {
      const timeCost = 2 * dailyRate + 2 * hourlyRate + hourlyRate / 4;
      const distanceCost = 4;
      expect(computeDefaultCost('modo', toDays(2) + toHours(2) + 5, 10)).toHaveProperty(
        'total',
        tripCost + timeCost + distanceCost
      );
    });
  });

  describe('evo', () => {
    const tripCost = 1;
    const minuteRate = 0.41;
    const hourlyRate = 14.99;
    const dailyRate = 89.99;

    it('distance is irrelevant', () => {
      const distance = 1000000;
      expect(computeDefaultCost('evo', 60, distance)).toHaveProperty(
        'total',
        tripCost + hourlyRate
      );
    });

    it('1 hour', () => {
      const timeCost = hourlyRate;
      expect(computeDefaultCost('evo', toHours(1), 10)).toHaveProperty(
        'total',
        tripCost + timeCost
      );
    });

    it('1 hour, 10 minutes (does not round)', () => {
      const timeCost = hourlyRate + 10 * minuteRate;
      expect(computeDefaultCost('evo', toHours(1) + 10, 10)).toHaveProperty(
        'total',
        tripCost + timeCost
      );
    });

    it('16 hours, 30 minutes', () => {
      const timeCost = dailyRate; // 16 hours is enough to hit daily rate
      expect(computeDefaultCost('evo', toHours(16) + 30, 10)).toHaveProperty(
        'total',
        tripCost + timeCost
      );
    });

    it('2 days, 2 hours, 5 minutes', () => {
      const timeCost = 2 * dailyRate + 2 * hourlyRate + 5 * minuteRate;
      expect(computeDefaultCost('evo', toDays(2) + toHours(2) + 5, 10)).toHaveProperty(
        'total',
        tripCost + timeCost
      );
    });
  });
});

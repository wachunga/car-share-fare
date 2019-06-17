import { calcDefaultCost } from './cost';
import { toHours, toDays } from './time';

describe('calcDefaultCost', () => {
  const tripCost = 1.5;
  const hourlyRate = 4;
  const dailyRate = 52;

  it('modo 1 hour', () => {
    const timeCost = hourlyRate;
    const distanceCost = 4;
    expect(calcDefaultCost('modo', toHours(1), 10)).toEqual(tripCost + timeCost + distanceCost);
  });

  it('modo 1 hour, 10 minutes (rounds to next 15 min increment)', () => {
    const timeCost = hourlyRate + hourlyRate / 4; // 15 mins = 1/4 of hour
    const distanceCost = 4;
    expect(calcDefaultCost('modo', toHours(1) + 10, 10)).toEqual(
      tripCost + timeCost + distanceCost
    );
  });

  it('modo 16 hours, 30 minutes', () => {
    const timeCost = dailyRate; // 16 hours is enough to hit daily rate
    const distanceCost = 25 * 0.4 + 75 * 0.28;
    expect(calcDefaultCost('modo', toHours(16) + 30, 100)).toEqual(
      tripCost + timeCost + distanceCost
    );
  });

  it('modo 2 days, 2 hours, 5 minutes', () => {
    const timeCost = 2 * dailyRate + 2 * hourlyRate + hourlyRate / 4;
    const distanceCost = 4;
    expect(calcDefaultCost('modo', toDays(2) + toHours(2) + 5, 10)).toEqual(
      tripCost + timeCost + distanceCost
    );
  });
});

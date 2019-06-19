import { CarShareConfig } from 'config';
import { calculateDefaultTimeCost, toHours, toDays } from './time';

describe('calculateDefaultTimeCost', () => {
  describe('consistent rate', () => {
    const hourlyRate = 5;
    const dailyRate = 50;
    const simpleConfig: CarShareConfig = {
      key: 'test',
      packages: [
        {
          name: 'Daily Drives',
          time: [
            { start: 0, per: 60, cost: hourlyRate, maxCost: dailyRate },
            { per: 60 * 24, cost: dailyRate },
          ],
        },
      ],
    };

    it('no time', () => {
      const cost = calculateDefaultTimeCost(simpleConfig, 0);
      expect(cost).toEqual(0);
    });

    it('partial hour uses whole charge', () => {
      const tenMinutesCost = calculateDefaultTimeCost(simpleConfig, 10);
      const oneHourCost = calculateDefaultTimeCost(simpleConfig, toHours(1));
      expect(tenMinutesCost).toEqual(hourlyRate);
      expect(oneHourCost).toEqual(hourlyRate);
    });

    it('partial period rounds up', () => {
      const cost = calculateDefaultTimeCost(simpleConfig, 90);
      expect(cost).toEqual(hourlyRate * 2);
    });

    it('daily max kicks in', () => {
      const cost = calculateDefaultTimeCost(simpleConfig, toHours(12));
      // 12 hours would be 60, but daily rate is only 50
      expect(cost).toEqual(dailyRate);
    });

    it('uses daily as appropriate', () => {
      const dayPlusHourMinutes = toDays(1) + toHours(1);
      const cost = calculateDefaultTimeCost(simpleConfig, dayPlusHourMinutes);
      expect(cost).toEqual(dailyRate + hourlyRate * 1);
    });
  });
});

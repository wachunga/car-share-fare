import { PackageConfig } from 'config';
import { calculateTimeCost, toHours, toDays } from './time';

describe('calculateTimeCost', () => {
  describe('consistent rate', () => {
    const hourlyRate = 5;
    const dailyRate = 50;
    const noDistanceConfig = {
      name: 'single step',
      service: 'n/a',
    };

    const simpleConfig: PackageConfig = {
      name: 'simple',
      service: 'n/a',
      time: [
        { start: 0, per: 60, cost: hourlyRate, maxCost: dailyRate },
        { per: 60 * 24, cost: dailyRate },
      ],
    };

    it('no time', () => {
      const cost = calculateTimeCost(noDistanceConfig, 0);
      expect(cost).toEqual(0);
    });

    it('partial hour uses whole charge', () => {
      const tenMinutesCost = calculateTimeCost(simpleConfig, 10);
      const oneHourCost = calculateTimeCost(simpleConfig, toHours(1));
      expect(tenMinutesCost).toEqual(hourlyRate);
      expect(oneHourCost).toEqual(hourlyRate);
    });

    it('partial period rounds up', () => {
      const cost = calculateTimeCost(simpleConfig, 90);
      expect(cost).toEqual(hourlyRate * 2);
    });

    it('daily max kicks in', () => {
      const cost = calculateTimeCost(simpleConfig, toHours(12));
      // 12 hours would be 60, but daily rate is only 50
      expect(cost).toEqual(dailyRate);
    });

    it('uses daily as appropriate', () => {
      const dayPlusHourMinutes = toDays(1) + toHours(1);
      const cost = calculateTimeCost(simpleConfig, dayPlusHourMinutes);
      expect(cost).toEqual(dailyRate + hourlyRate * 1);
    });
  });
});

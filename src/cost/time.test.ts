import { PackageConfig } from 'config';
import { calculateTimeCost, toHours, toDays } from './time';

describe.only('calculateTimeCost', () => {
  describe('consistent rate', () => {
    const hourlyRate = 5;
    const dailyRate = 50;
    const noDistanceConfig = {
      name: 'single step',
      service: 'n/a',
      maxPassengers: 4,
      currency: 'CAD',
    };

    const simpleConfig: PackageConfig = {
      name: 'simple',
      service: 'n/a',
      maxPassengers: 4,
      currency: 'CAD',
      time: [
        { start: 0, per: 60, cost: hourlyRate, maxCost: dailyRate },
        { per: 60 * 24, cost: dailyRate },
      ],
    };

    it('no time', () => {
      const cost = calculateTimeCost(noDistanceConfig, 0);
      expect(cost).toHaveProperty('amount', 0);
    });

    it('partial hour uses whole charge', () => {
      const tenMinutesCost = calculateTimeCost(simpleConfig, 10);
      const oneHourCost = calculateTimeCost(simpleConfig, toHours(1));
      expect(tenMinutesCost).toHaveProperty('amount', hourlyRate);
      expect(oneHourCost).toHaveProperty('amount', hourlyRate);
    });

    it('partial period rounds up', () => {
      const cost = calculateTimeCost(simpleConfig, 90);
      expect(cost).toHaveProperty('amount', hourlyRate * 2);
    });

    it('daily max kicks in', () => {
      const cost = calculateTimeCost(simpleConfig, toHours(12));
      // 12 hours would be 60, but daily rate is only 50
      expect(cost).toHaveProperty('amount', dailyRate);
    });

    it('uses daily as appropriate', () => {
      const dayPlusHourMinutes = toDays(1) + toHours(1);
      const cost = calculateTimeCost(simpleConfig, dayPlusHourMinutes);
      expect(cost).toHaveProperty('amount', dailyRate + hourlyRate * 1);
    });
  });
});

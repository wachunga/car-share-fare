import { computeTripCost, computeAllTripCosts } from './cost';
import { toHours, toDays } from './time';
import { packages, findPackage, PackageConfig } from '../config';

describe('computeCosts', () => {
  const minutes = 30;
  const distance = 10;

  it('returns many packages', () => {
    const computed = computeAllTripCosts(minutes, distance);
    expect(computed.length).toBeGreaterThan(5);
  });

  it('packages are sorted by ascending total cost', () => {
    const computed = computeAllTripCosts(minutes, distance);
    computed.forEach((tripCost, i) => {
      if (i === 0) {
        return;
      }
      const previousTotal = computed[i - 1].total;
      if (tripCost.total < previousTotal) {
        const tripCosts = computed.map(tripCost => tripCost.total);
        throw new Error(`Not sorted correctly: ${tripCosts.join('\n')}`);
      }
    });
  });
});

describe('computePackageCost', () => {
  it('provides a breakdown', () => {
    const anyPackage = packages[0];
    const time = toHours(1);
    const distance = 10;
    const computed = computeTripCost(anyPackage, time, distance);
    expect(computed).toHaveProperty('package');
    const calculatedTotal =
      computed.breakdown.fees + computed.breakdown.distance + computed.breakdown.time;
    expect(calculatedTotal).toBe(computed.total);
  });

  describe('modo', () => {
    const dailyDrivesPackage = findPackage('Daily Drives') as PackageConfig;
    const tripCost = 1.5;
    const hourlyRate = 4;
    const dailyRate = 52;
    const costPerKm = 0.4;

    it('1 hour', () => {
      const time = toHours(1);
      const timeCost = hourlyRate;
      const distance = 10;
      const distanceCost = distance * costPerKm;
      expect(computeTripCost(dailyDrivesPackage, time, distance)).toHaveProperty(
        'total',
        tripCost + timeCost + distanceCost
      );
    });

    it('1 hour, 10 minutes (rounds to next 15 min increment)', () => {
      const time = toHours(1) + 10;
      const timeCost = hourlyRate + hourlyRate / 4; // 15 mins = 1/4 of hour
      const distance = 10;
      const distanceCost = distance * costPerKm;
      expect(computeTripCost(dailyDrivesPackage, time, distance)).toHaveProperty(
        'total',
        tripCost + timeCost + distanceCost
      );
    });

    it('16 hours, 30 minutes', () => {
      const time = toHours(16) + 30;
      const timeCost = dailyRate; // 16 hours is enough to hit daily rate
      const distance = 100;
      const distanceCost = 25 * costPerKm + 75 * 0.28; // subsequent km are cheaper
      expect(computeTripCost(dailyDrivesPackage, time, distance)).toHaveProperty(
        'total',
        tripCost + timeCost + distanceCost
      );
    });

    it('2 days, 2 hours, 5 minutes', () => {
      const time = toDays(2) + toHours(2) + 5;
      const timeCost = 2 * dailyRate + 2 * hourlyRate + hourlyRate / 4;
      const distance = 10;
      const distanceCost = 4;
      expect(computeTripCost(dailyDrivesPackage, time, distance)).toHaveProperty(
        'total',
        tripCost + timeCost + distanceCost
      );
    });
  });

  describe('evo', () => {
    const evoPackage = findPackage('Evo') as PackageConfig;
    const tripCost = 1;
    const minuteRate = 0.41;
    const hourlyRate = 14.99;
    const dailyRate = 89.99;
    const irrelevantDistance = 10;

    it('distance is irrelevant', () => {
      const hugeDistance = 1000000;
      expect(computeTripCost(evoPackage, 60, hugeDistance)).toHaveProperty(
        'total',
        tripCost + hourlyRate
      );
    });

    it('1 hour', () => {
      const time = toHours(1);
      const timeCost = hourlyRate;
      expect(computeTripCost(evoPackage, time, irrelevantDistance)).toHaveProperty(
        'total',
        tripCost + timeCost
      );
    });

    it('1 hour, 10 minutes (does not round)', () => {
      const time = toHours(1) + 10;
      const timeCost = hourlyRate + 10 * minuteRate;
      expect(computeTripCost(evoPackage, time, irrelevantDistance)).toHaveProperty(
        'total',
        tripCost + timeCost
      );
    });

    it('16 hours, 30 minutes', () => {
      const time = toHours(16) + 30;
      const timeCost = dailyRate; // 16 hours is enough to hit daily rate
      expect(computeTripCost(evoPackage, time, irrelevantDistance)).toHaveProperty(
        'total',
        tripCost + timeCost
      );
    });

    it('2 days, 2 hours, 5 minutes', () => {
      const time = toDays(2) + toHours(2) + 5;
      const timeCost = 2 * dailyRate + 2 * hourlyRate + 5 * minuteRate;
      expect(computeTripCost(evoPackage, time, irrelevantDistance)).toHaveProperty(
        'total',
        tripCost + timeCost
      );
    });
  });

  describe('car2go', () => {
    const smartMinutePackage = findPackage('smart - minute rate') as PackageConfig;
    const mercedesMinutePackage = findPackage('Mercedes - minute rate') as PackageConfig;
    const tripCost = 1;
    const minuteRateSmart = 0.32;
    const surchargePerExtraMinuteSmart = 0.37;
    const surchargePerExtraKm = 0.49;
    const minimalKm = 10;

    it('smart is cheapest option', () => {
      const time = 16;
      const distance = 10;
      const smartCost = computeTripCost(smartMinutePackage, time, distance);
      const mercedesCost = computeTripCost(mercedesMinutePackage, time, distance);
      expect(smartCost.total).toBeLessThan(mercedesCost.total);
    });

    it('costs extra beyond included km', () => {
      const time = 16;
      const timeCost = time * minuteRateSmart;
      const longDistance = 300; // only 200 included
      const cost = computeTripCost(smartMinutePackage, time, longDistance);
      expect(cost.total).toBeCloseTo(tripCost + timeCost + 100 * surchargePerExtraKm);
    });

    describe('minute rate', () => {
      it('16 minutes', () => {
        const time = 16;
        const timeCost = 16 * minuteRateSmart;
        expect(computeTripCost(smartMinutePackage, time, minimalKm)).toHaveProperty(
          'total',
          tripCost + timeCost
        );
      });

      it('1 hour, 10 minutes', () => {
        const time = toHours(1) + 10;
        const timeCost = 70 * minuteRateSmart;
        expect(computeTripCost(smartMinutePackage, time, minimalKm)).toHaveProperty(
          'total',
          tripCost + timeCost
        );
      });
    });

    describe('longer packages', () => {
      const smartHourPackage = findPackage('smart - 1 hour') as PackageConfig;
      const mercedesDaysPackage = findPackage('Mercedes - 3 days') as PackageConfig;

      it('1 hour, 10 minutes', () => {
        const time = toHours(1) + 10;
        const hourPackageCost = 13;
        const timeCost = hourPackageCost + surchargePerExtraMinuteSmart * 10;
        expect(computeTripCost(smartHourPackage, time, minimalKm)).toHaveProperty(
          'total',
          tripCost + timeCost
        );
      });

      it('2 days, 23 hours, 40 minutes', () => {
        const time = toDays(2) + toHours(23) + 40;
        const timeCost = 249;
        const longDistanceButStillIncludedInPackage = 590;
        expect(
          computeTripCost(mercedesDaysPackage, time, longDistanceButStillIncludedInPackage)
        ).toHaveProperty('total', tripCost + timeCost);
      });
    });
  });
});

import { computeTripCost, computeAllTripCosts } from './cost';
import { toHours, toDays } from './time';
import { findPackage, PackageConfig, getAllPackages } from '../config';
import { Money } from '../Money';

const packages = getAllPackages();

describe('computeAllTripCosts', () => {
  const minutes = 30;
  const distance = 10;

  it('returns many packages', () => {
    const computed = computeAllTripCosts(packages, minutes, distance);
    expect(computed.length).toBeGreaterThan(4);
  });

  it('packages are sorted by ascending total cost', () => {
    const computed = computeAllTripCosts(packages, minutes, distance);
    computed.forEach((tripCost, i) => {
      if (i === 0) {
        return;
      }
      const previousTotal = computed[i - 1].total;
      if (tripCost.total.lessThan(previousTotal)) {
        const tripCosts = computed.map(tripCost => tripCost.total.amount);
        throw new Error(`Not sorted correctly: ${tripCosts.join('\n')}`);
      }
    });
  });
});

describe('computeTripCost', () => {
  it('provides a breakdown', () => {
    const anyPackage = packages[0];
    const time = toHours(1);
    const distance = 10;
    const computed = computeTripCost(anyPackage, time, distance);
    expect(computed).toHaveProperty('package');

    const calculatedTotal = Money.sum([
      computed.breakdown.fees,
      computed.breakdown.distance,
      computed.breakdown.time,
    ]);
    expect(calculatedTotal.amount).toBe(computed.total.amount);
  });

  it('handles floating point math', () => {
    const myPackage: PackageConfig = {
      service: 'Test',
      currency: 'CAD',
      name: 'Floating Point',
      fees: {
        trip: 20,
      },
      time: [{ per: 60, cost: 10 }],
    };

    const time = toHours(1);
    const distance = 0;
    const computed = computeTripCost(myPackage, time, distance);
    expect(computed).toHaveProperty('total.amount', 30);
  });

  describe('modo', () => {
    const perTripFee = 1_50;

    describe('daily drives package', () => {
      const dailyDrivesPackage = findPackage('Daily Drives') as PackageConfig;
      const costPerKm = 40;
      const hourlyRate = 4_00;
      const dailyRate = 52_00;

      it('minimum cost - daily drives', () => {
        const time = 1;
        const timeCost = hourlyRate / 4; // min increment is 15 minutes
        const distance = 0;
        expect(computeTripCost(dailyDrivesPackage, time, distance)).toHaveProperty(
          'total.amount',
          perTripFee + timeCost
        );
      });

      it('1 hour', () => {
        const time = toHours(1);
        const timeCost = hourlyRate;
        const distance = 10;
        const distanceCost = distance * costPerKm;
        expect(computeTripCost(dailyDrivesPackage, time, distance)).toHaveProperty(
          'total.amount',
          perTripFee + timeCost + distanceCost
        );
      });

      it('1 hour, 10 minutes (rounds to next 15 min increment)', () => {
        const time = toHours(1) + 10;
        const timeCost = hourlyRate + hourlyRate / 4; // 15 mins = 1/4 of hour
        const distance = 10;
        const distanceCost = distance * costPerKm;
        expect(computeTripCost(dailyDrivesPackage, time, distance)).toHaveProperty(
          'total.amount',
          perTripFee + timeCost + distanceCost
        );
      });

      it('16 hours, 30 minutes', () => {
        const time = toHours(16) + 30;
        const timeCost = dailyRate; // 16 hours is enough to hit daily rate
        const distance = 100;
        const distanceCost = 25 * costPerKm + 75 * 28; // subsequent km are cheaper
        expect(computeTripCost(dailyDrivesPackage, time, distance)).toHaveProperty(
          'total.amount',
          perTripFee + timeCost + distanceCost
        );
      });

      it('2 days, 2 hours, 5 minutes', () => {
        const time = toDays(2) + toHours(2) + 5;
        const timeCost = 2 * dailyRate + 2 * hourlyRate + hourlyRate / 4;
        const distance = 10;
        const distanceCost = 4_00;
        expect(computeTripCost(dailyDrivesPackage, time, distance)).toHaveProperty(
          'total.amount',
          perTripFee + timeCost + distanceCost
        );
      });

      describe('day tripper', () => {
        const dayTripperPackage = findPackage('Day Tripper - Daily Drives') as PackageConfig;
        const dayTripperDayCost = 90_00;
        const costPerKmOverage = 28;

        const cases = [
          [3, 125, perTripFee + 50_00], // not enough to trigger DayTripper
          [10, 200, perTripFee + dayTripperDayCost],
          [12, 150, perTripFee + dayTripperDayCost],
          [24, 125, perTripFee + dayTripperDayCost],
          [25, 140, perTripFee + dayTripperDayCost + hourlyRate],
          [24, 250, perTripFee + dayTripperDayCost],
          [25, 300, perTripFee + dayTripperDayCost + hourlyRate + 50 * costPerKmOverage],

          [24, 300, perTripFee + dayTripperDayCost + 50 * costPerKmOverage],
          [36, 250, perTripFee + dayTripperDayCost + hourlyRate * 12],
          [36, 500, perTripFee + 2 * dayTripperDayCost],
          [48, 500, perTripFee + 2 * dayTripperDayCost],
          [48, 140, perTripFee + dayTripperDayCost + dailyRate], // not enough km to trigger DayTripper
          [72, 1000, perTripFee + 3 * dayTripperDayCost + 250 * costPerKmOverage],
        ];

        it.each(cases)('%i hours, %i km', (hours, distance, total) => {
          const minutes = toHours(hours);
          const computed = computeTripCost(dayTripperPackage, minutes, distance);
          expect(computed).toHaveProperty('total.amount', total);
        });
      });
    });

    describe('large and loadable package', () => {
      const loadablePackage = findPackage('Large and Loadable') as PackageConfig;
      const loadableHourlyRate = 6_00;

      it('minimum cost', () => {
        const time = 1;
        const timeCost = loadableHourlyRate / 4; // min increment is 15 minutes
        const distance = 0;
        expect(computeTripCost(loadablePackage, time, distance)).toHaveProperty(
          'total.amount',
          perTripFee + timeCost
        );
      });
    });

    describe('premium package', () => {
      const premiumPackage = findPackage('Oversize and Premium') as PackageConfig;
      const premiumHourlyRate = 9_00;

      it('minimum cost', () => {
        const time = 1;
        const timeCost = premiumHourlyRate / 4; // min increment is 15 minutes
        const distance = 0;
        expect(computeTripCost(premiumPackage, time, distance)).toHaveProperty(
          'total.amount',
          perTripFee + timeCost
        );
      });
    });
  });

  describe('evo', () => {
    const evoPackage = findPackage('Evo') as PackageConfig;
    const tripCost = 1_00;
    const minuteRate = 41;
    const hourlyRate = 14_99;
    const dailyRate = 89_99;
    const irrelevantDistance = 10;

    it('minimum cost', () => {
      const time = 1;
      const timeCost = time * minuteRate;
      const distance = 0;
      expect(computeTripCost(evoPackage, time, distance)).toHaveProperty(
        'total.amount',
        tripCost + timeCost
      );
    });

    it('distance is irrelevant', () => {
      const hugeDistance = 1_000_000;
      expect(computeTripCost(evoPackage, 60, hugeDistance)).toHaveProperty(
        'total.amount',
        tripCost + hourlyRate
      );
    });

    it('1 hour', () => {
      const time = toHours(1);
      const timeCost = hourlyRate;
      expect(computeTripCost(evoPackage, time, irrelevantDistance)).toHaveProperty(
        'total.amount',
        tripCost + timeCost
      );
    });

    it('1 hour, 10 minutes (does not round)', () => {
      const time = toHours(1) + 10;
      const timeCost = hourlyRate + 10 * minuteRate;
      expect(computeTripCost(evoPackage, time, irrelevantDistance)).toHaveProperty(
        'total.amount',
        tripCost + timeCost
      );
    });

    it('16 hours, 30 minutes', () => {
      const time = toHours(16) + 30;
      const timeCost = dailyRate; // 16 hours is enough to hit daily rate
      expect(computeTripCost(evoPackage, time, irrelevantDistance)).toHaveProperty(
        'total.amount',
        tripCost + timeCost
      );
    });

    it('2 days, 2 hours, 5 minutes', () => {
      const time = toDays(2) + toHours(2) + 5;
      const timeCost = 2 * dailyRate + 2 * hourlyRate + 5 * minuteRate;
      expect(computeTripCost(evoPackage, time, irrelevantDistance)).toHaveProperty(
        'total.amount',
        tripCost + timeCost
      );
    });
  });

  describe('lyft', () => {
    const lyftPackage = findPackage('Lyft') as PackageConfig;
    const tripCost = 7_50;
    const minuteRate = 33;
    const distanceRate = 65;

    it('minimum cost', () => {
      const time = 1;
      const timeCost = time * minuteRate;
      const distance = 1;
      const distanceCost = distance * distanceRate;
      expect(computeTripCost(lyftPackage, time, distance)).toHaveProperty(
        'total.amount',
        tripCost + timeCost + distanceCost
      );
    });

    it('short trip', () => {
      const time = 4;
      const timeCost = time * minuteRate;
      const distance = 3;
      const distanceCost = distance * distanceRate;
      expect(computeTripCost(lyftPackage, time, distance)).toHaveProperty(
        'total.amount',
        tripCost + timeCost + distanceCost
      );
    });

    it('medium trip', () => {
      const time = 14;
      const timeCost = time * minuteRate;
      const distance = 7;
      const distanceCost = distance * distanceRate;
      expect(computeTripCost(lyftPackage, time, distance)).toHaveProperty(
        'total.amount',
        tripCost + timeCost + distanceCost
      );
    });
  });
});

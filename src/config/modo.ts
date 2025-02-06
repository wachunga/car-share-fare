import { CarShareConfig, PackageConfig } from './types';
import { toDays } from '../cost/time';
import { computeTripCost } from '../cost/cost';
import { Money } from '../Money';

const currency = 'CAD';

const commonConfig: CarShareConfig = {
  service: 'Modo',
  url: 'https://www.modo.coop/plans/#tile-join-individual',
  lastUpdated: '2025-01-22',
  currency,
  fees: {
    trip: 3_00, // "co-op innovation fee" - $1 for Ev, $3 for others
    annual: 1_00, // admin fee
    share: 500_00, // one time when you join (redeemable when you leave)
  },
};

const modoPlusConfig = {
  distance: {
    unit: 'km',
    steps: [{ start: 0, cost: 35 }],
  },
};

const dayTripperPerKmCost = new Money(28, currency);

// TODO: add modo monthly packages (though they're always more expensive now)
// TODO: overnight time charge capped at 3 hours between 7pm - 9am
const packages: PackageConfig[] = [
  {
    name: 'Daily Drives - Modo Plus',
    ...commonConfig,
    ...modoPlusConfig,
    vehicle: 'Prius, Rondo, ...',
    maxPassengers: 7,
    time: [
      { start: 0, per: 15, cost: 1_25 },
      { per: 60, cost: 5_00, maxCost: 60_00 },
      { per: 60 * 24, cost: 60_00 },
    ],
  },
  {
    name: 'Large and Loadable - Modo Plus',
    ...commonConfig,
    ...modoPlusConfig,
    vehicle: 'Rogue, Tucson, Sedona, RAV4, Grand Caravan, Sienna, NEXO, Frontier, NV200',
    maxPassengers: 8,
    time: [
      { start: 0, per: 15, cost: 1_75 },
      { per: 60, cost: 7_00, maxCost: 84_00 },
      { per: 60 * 24, cost: 84_00 },
    ],
  },
  {
    name: 'Oversized - Modo Plus',
    ...commonConfig,
    ...modoPlusConfig,
    vehicle: 'BMW X1, Ram Promaster',
    maxPassengers: 5, // promaster is only 3
    time: [
      { start: 0, per: 15, cost: 2_50 },
      { per: 60, cost: 10_00, maxCost: 120_00 },
      { per: 60 * 24, cost: 120_00 },
    ],
  },
  {
    name: 'Day Tripper - Daily Drives',
    ...commonConfig,
    vehicle: 'Prius, Rondo, ...',
    maxPassengers: 7,
    custom: function modoDayTripper(minutes, distance) {
      const dayTripperCost = new Money(100_00, currency);
      const regularPackage = packages.find(
        p => p.name === 'Daily Drives - Modo Plus'
      ) as PackageConfig;

      let cost = Money.zero(currency);
      let minutesRemaining = minutes;
      let distanceRemaining = distance;
      let usingDayTripper = false;
      while (minutesRemaining > 0) {
        const minutesCapped = Math.min(minutesRemaining, toDays(1));
        const regularPackageCost = computeTripCost(
          regularPackage,
          minutesCapped,
          distanceRemaining
        );
        const regularDistanceCharge: Money = usingDayTripper
          ? dayTripperPerKmCost.multiply(distanceRemaining)
          : regularPackageCost.breakdown.distance;
        const regularCost = regularPackageCost.breakdown.time.add(regularDistanceCharge);

        if (dayTripperCost.lessThan(regularCost)) {
          cost = cost.add(dayTripperCost);
          distanceRemaining -= Math.min(distanceRemaining, 500);
          usingDayTripper = true;
        } else {
          cost = cost.add(regularCost);
          distanceRemaining = 0;
        }
        minutesRemaining -= minutesCapped;
      }
      if (distanceRemaining > 0) {
        cost = cost.add(dayTripperPerKmCost.multiply(distanceRemaining));
      }
      return cost;
    },
  },
];

export default packages;

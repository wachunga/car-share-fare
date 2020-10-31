import { CarShareConfig, PackageConfig } from './types';
import { toDays } from '../cost/time';
import { computeTripCost } from '../cost/cost';
import { Money } from '../Money';

const currency = 'CAD';

const commonConfig: CarShareConfig = {
  service: 'Modo',
  url: 'https://www.modo.coop/plans/#tile-join-individual',
  lastUpdated: '2019-08-05',
  currency,
  fees: {
    trip: 1_50, // "co-op innovation fee"
    annual: 1_00,
    share: 500_00,
  },
};

const modoPlusConfig = {
  distance: {
    unit: 'km',
    steps: [
      { start: 0, end: 25, cost: 40 },
      { start: 25, cost: 28 },
    ],
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
      { start: 0, per: 15, cost: 1_00 },
      { per: 60, cost: 4_00, maxCost: 52_00 },
      { per: 60 * 24, cost: 52_00 },
    ],
  },
  {
    name: 'Large and Loadable - Modo Plus',
    ...commonConfig,
    ...modoPlusConfig,
    vehicle: 'Rogue, Tucson, Sedona, RAV4, Grand Caravan, Sienna, NEXO, Frontier, NV200',
    maxPassengers: 8,
    time: [
      { start: 0, per: 15, cost: 1_50 },
      { per: 60, cost: 6_00, maxCost: 78_00 },
      { per: 60 * 24, cost: 78_00 },
    ],
  },
  {
    name: 'Oversize and Premium - Modo Plus',
    ...commonConfig,
    ...modoPlusConfig,
    vehicle: 'BMW X1, Ram Promaster',
    maxPassengers: 5, // promaster is only 3
    time: [
      { start: 0, per: 15, cost: 2_25 },
      { per: 60, cost: 9_00, maxCost: 117_00 },
      { per: 60 * 24, cost: 117_00 },
    ],
  },
  {
    name: 'Day Tripper - Daily Drives',
    ...commonConfig,
    vehicle: 'Prius, Rondo, ...',
    maxPassengers: 7,
    custom: function modoDayTripper(minutes, distance) {
      const dayTripperCost = new Money(90_00, currency);
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
          distanceRemaining -= Math.min(distanceRemaining, 250);
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

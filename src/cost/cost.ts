import { packages, PackageConfig } from '../config';
import { calculateTripFees } from './trip';
import { calculateTimeCost } from './time';
import { calculateDistanceCost } from './distance';
import { Money } from '../Money';

type TripCost = {
  package: string;
  service: string;
  total: Money;
  breakdown: {
    fees: Money;
    time: Money;
    distance: Money;
  };
};

/** Calculate trip cost for all available packages. */
export function computeAllTripCosts(minutes: number, distance: number): TripCost[] {
  return packages
    .map(pack => computeTripCost(pack, minutes, distance))
    .sort((costA, costB) => costA.total.amount - costB.total.amount);
}

function calculateCustomCost(
  carSharePackage: PackageConfig,
  minutes: number,
  distance: number
): Money {
  const currency = carSharePackage.currency;
  if (!carSharePackage.custom) {
    return Money.zero(currency);
  }
  return carSharePackage.custom(minutes, distance);
}

/** Calculate trip cost for the provided package. */
export function computeTripCost(
  carSharePackage: PackageConfig,
  minutes: number = 0,
  distance: number = 0
): TripCost {
  if (!carSharePackage) {
    throw new Error(`No package provided`);
  }

  const breakdown = {
    fees: calculateTripFees(carSharePackage),
    time: calculateTimeCost(carSharePackage, minutes),
    distance: calculateDistanceCost(carSharePackage, distance),
    custom: calculateCustomCost(carSharePackage, minutes, distance),
  };
  return {
    package: carSharePackage.name,
    service: carSharePackage.service,
    total: Money.sum([breakdown.fees, breakdown.time, breakdown.distance, breakdown.custom]),
    breakdown,
  };
}

import { calculateTripFees } from './trip';
import { calculateTimeCost } from './time';
import { calculateDistanceCost } from './distance';
import { Money } from '../Money';
import { PackageConfig } from '../config/types';

type TripCost = {
  package: string;
  service: string;
  status: 'valid' | 'too-many-passengers';
  total: Money;
  breakdown: {
    fees: Money;
    time: Money;
    distance: Money;
  };
};

/** Calculate trip cost for all available packages. */
export function computeAllTripCosts(
  carSharePackages: PackageConfig[],
  minutes: number,
  distance: number,
  passengers: number = 1
): TripCost[] {
  return carSharePackages
    .map(pack => computeTripCost(pack, minutes, distance, passengers))
    .sort((costA, costB) => {
      if (costA.status !== 'valid' && costB.status === 'valid') {
        return 1;
      }
      if (costA.status === 'valid' && costB.status !== 'valid') {
        return -1;
      }
      return costA.total.amount - costB.total.amount;
    });
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
  distance: number = 0,
  passengers: number = 1
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
  const status = carSharePackage.maxPassengers < passengers ? 'too-many-passengers' : 'valid';
  return {
    package: carSharePackage.name,
    service: carSharePackage.service,
    status,
    total: Money.sum([breakdown.fees, breakdown.time, breakdown.distance, breakdown.custom]),
    breakdown,
  };
}

import { packages, PackageConfig } from '../config';
import { calculateTripFees } from './trip';
import { calculateTimeCost } from './time';
import { calculateDistanceCost } from './distance';

function sum(array: number[]): number {
  return array.reduce((memo, number) => memo + number, 0);
}

type TripCost = {
  package: string;
  service: string;
  total: number;
  breakdown: {
    fees: number;
    time: number;
    distance: number;
  };
};

/** Calculate trip cost for all available packages. */
export function computeAllTripCosts(minutes: number, distance: number): TripCost[] {
  return packages
    .map(pack => computeTripCost(pack, minutes, distance))
    .sort((costA, costB) => costA.total - costB.total);
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
  };
  return {
    package: carSharePackage.name,
    service: carSharePackage.service,
    total: sum([breakdown.fees, breakdown.time, breakdown.distance]),
    breakdown,
  };
}

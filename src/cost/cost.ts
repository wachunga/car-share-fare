import { configs } from '../config';
import { calculateTripFees } from './trip';
import { calculateDefaultTimeCost } from './time';
import { calculateDistanceCost } from './distance';

function sum(array: number[]): number {
  return array.reduce((memo, number) => memo + number, 0);
}

type TripCost = {
  total: number;
  breakdown: {
    fees: number;
    time: number;
    distance: number;
  };
};
type CostComparison = { [serviceKey: string]: TripCost };

/** Calculate trip cost using all services */
export function computeCosts(minutes: number, distance: number) {
  return Object.keys(configs).reduce(
    (memo, key) => {
      memo[key] = computeDefaultCost(key, minutes, distance);
      return memo;
    },
    {} as CostComparison
  );
}

/** Calculate trip cost using the first available package */
export function computeDefaultCost(service: string, minutes: number = 0, distance: number = 0) {
  const config = configs[service];
  if (!config) {
    throw new Error(`No config found for company ${service}`);
  }

  const breakdown = {
    fees: calculateTripFees(config.fees),
    time: calculateDefaultTimeCost(config, minutes),
    distance: calculateDistanceCost(config.distance, distance),
  };
  return {
    total: sum([breakdown.fees, breakdown.time, breakdown.distance]),
    breakdown,
  };
}

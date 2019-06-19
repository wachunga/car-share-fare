import { configs } from '../config';
import { calculateTripFees } from './trip';
import { calculateDefaultTimeCost } from './time';
import { calculateDistanceCost } from './distance';

function sum(array: number[]): number {
  return array.reduce((memo, number) => memo + number, 0);
}

// TODO: return breakdowns, not sums
type CostComparison = { [serviceKey: string]: number };

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
export function computeDefaultCost(service: string, minutes: number, distance: number) {
  const config = configs[service];
  if (!config) {
    throw new Error(`No config found for company ${service}`);
  }

  const fees = calculateTripFees(config.fees);
  const timeCost = calculateDefaultTimeCost(config, minutes);
  const distanceCost = calculateDistanceCost(config.distance, distance);
  // console.log({ fees, timeCost, distanceCost });
  return sum([fees, timeCost, distanceCost]);
}

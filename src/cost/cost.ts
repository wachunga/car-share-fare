import { configs } from '../config';
import { calculateTripFees } from './trip';
import { calculateDefaultTimeCost } from './time';
import { calculateDistanceCost } from './distance';

function sum(array: number[]): number {
  return array.reduce((memo, number) => memo + number, 0);
}

/** Calculate trip cost using the first available package */
export function calcDefaultCost(company: string, minutes: number, distance: number) {
  const config = configs[company];
  if (!config) {
    throw new Error(`No config found for company ${company}`);
  }

  const fees = calculateTripFees(config.fees);
  const timeCost = calculateDefaultTimeCost(config, minutes);
  const distanceCost = calculateDistanceCost(config.distance, distance);
  // console.log({ fees, timeCost, distanceCost });
  return sum([fees, timeCost, distanceCost]);
}

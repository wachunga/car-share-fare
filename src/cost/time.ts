import { CarShareConfig } from 'config';

export function toHours(hours: number): number {
  return hours * 60;
}

export function toDays(days: number): number {
  return days * 24 * 60;
}

/** Calculate time cost using the first available package */
export function calculateDefaultTimeCost(config: CarShareConfig, minutes: number): number {
  const chosenPackage = config.packages[0];
  if (!chosenPackage.time || chosenPackage.time.length === 0) {
    return 0;
  }

  const applicableRates = chosenPackage.time
    .filter(rate => {
      const minRequired = rate.start === undefined ? rate.per : rate.start;
      return minutes >= minRequired;
    })
    .sort((a, b) => b.per - a.per); // largest granularity first

  let remainingMinutes = minutes;
  let totalCost = 0;
  for (let i = 0; i < applicableRates.length; i++) {
    if (remainingMinutes <= 0) {
      break;
    }
    const rate = applicableRates[i];

    const hasMoreRates = applicableRates[i + 1] !== undefined;
    const roundingFunction = hasMoreRates ? 'floor' : 'ceil'; // leave partial up to next rate if present
    const rateTimeUnits = Math.max(1, Math[roundingFunction](remainingMinutes / rate.per));

    const maxCost = rate.maxCost || Number.POSITIVE_INFINITY;
    let rateCost = rateTimeUnits * rate.cost;
    if (rateCost > maxCost) {
      rateCost = maxCost;
      remainingMinutes = 0; // maxed out
    } else {
      remainingMinutes -= rateTimeUnits * rate.per;
    }
    totalCost += rateCost;
  }

  return totalCost;
}

import { PackageConfig } from 'config';
import { Money } from '../Money';

export function toHours(hours: number): number {
  return hours * 60;
}

export function toDays(days: number): number {
  return days * 24 * 60;
}

/** Calculate time cost for provided package */
export function calculateTimeCost(carSharePackage: PackageConfig, minutes: number): Money {
  const currency = carSharePackage.currency;
  if (!carSharePackage.time || carSharePackage.time.length === 0) {
    return Money.zero(currency);
  }

  const applicableRates = carSharePackage.time
    .filter(rate => {
      const minRequired = rate.start === undefined ? rate.per : rate.start;
      return minutes >= minRequired;
    })
    .sort((a, b) => b.per - a.per); // largest granularity first

  let remainingMinutes = minutes;
  let totalCost = Money.zero(currency);
  for (let i = 0; i < applicableRates.length; i++) {
    if (remainingMinutes <= 0) {
      break;
    }
    const rate = applicableRates[i];

    const hasMoreRates = applicableRates[i + 1] !== undefined;
    const roundingFunction = hasMoreRates ? 'floor' : 'ceil'; // leave partial up to next rate if present
    const rateTimeUnits = Math.max(1, Math[roundingFunction](remainingMinutes / rate.per));

    const maxCost = rate.maxCost ? new Money(rate.maxCost, currency) : null;
    let rateCost = new Money(rate.cost, currency).multiply(rateTimeUnits);
    if (maxCost && rateCost.greaterThan(maxCost)) {
      rateCost = maxCost;
      remainingMinutes = 0; // maxed out
    } else {
      remainingMinutes -= rateTimeUnits * rate.per;
    }
    totalCost = totalCost.add(rateCost);
  }

  return totalCost;
}

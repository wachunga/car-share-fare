import { PackageConfig } from 'config';
import { Money } from '../Money';

export function calculateDistanceCost(carSharePackage: PackageConfig, distance: number): Money {
  const currency = carSharePackage.currency;
  if (!carSharePackage.distance) {
    return Money.zero(currency);
  }

  let totalCost = Money.zero(currency);
  let remainingDistance = distance;
  carSharePackage.distance.steps.forEach(step => {
    if (remainingDistance > 0) {
      const end = step.end || Number.POSITIVE_INFINITY;
      const stepDistance = Math.min(distance - step.start, end);
      const stepCost = new Money(step.cost, currency).multiply(stepDistance);
      totalCost = totalCost.add(stepCost);
      remainingDistance -= stepDistance;
    }
  });
  return totalCost;
}

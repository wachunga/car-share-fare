import { PackageConfig } from 'config';

export function calculateDistanceCost(carSharePackage: PackageConfig, distance: number): number {
  if (!carSharePackage.distance) {
    return 0;
  }

  let totalCost = 0;
  let remainingDistance = distance;
  carSharePackage.distance.steps.forEach(step => {
    if (remainingDistance > 0) {
      const end = step.end || Number.POSITIVE_INFINITY;
      const stepDistance = Math.min(distance - step.start, end);
      const stepCost = stepDistance * step.cost;
      totalCost += stepCost;
      remainingDistance -= stepDistance;
    }
  });
  return totalCost;
}

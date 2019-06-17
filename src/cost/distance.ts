import { DistanceConfig } from 'config';

export function calculateDistanceCost(
  config: DistanceConfig | null | undefined,
  distance: number
): number {
  if (!config) {
    return 0;
  }

  let totalCost = 0;
  let remainingDistance = distance;
  config.steps.forEach(step => {
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

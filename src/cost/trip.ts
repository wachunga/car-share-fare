import { CarShareFees } from 'config';

/** Calculate per trip fees. This does not include tax like PVRT. */
export function calculateTripFees(config?: CarShareFees): number {
  if (!config) {
    return 0;
  }
  return config.trip || 0;
}

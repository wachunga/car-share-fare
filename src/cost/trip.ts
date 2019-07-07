import { PackageConfig } from 'config';

/** Calculate per trip fees. This does not include tax like PVRT. */
export function calculateTripFees(carSharePackage: PackageConfig): number {
  if (!carSharePackage.fees) {
    return 0;
  }
  return carSharePackage.fees.trip || 0;
}

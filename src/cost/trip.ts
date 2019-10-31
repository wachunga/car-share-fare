import { PackageConfig } from 'config';
import { Money } from '../Money';

/** Calculate per trip fees. This does not include tax like PVRT. */
export function calculateTripFees(carSharePackage: PackageConfig): Money {
  const currency = carSharePackage.currency;
  if (!carSharePackage.fees) {
    return Money.zero(currency);
  }
  return new Money(carSharePackage.fees.trip || 0, currency);
}

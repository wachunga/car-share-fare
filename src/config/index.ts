import modo from './modo';
import evo from './evo';
import car2go from './car2go';
import { PackageConfig } from './types';

export * from './types';

const packages: PackageConfig[] = [...modo, ...evo, ...car2go];

export function findPackage(query: string): PackageConfig | undefined {
  return packages.find(pack => [pack.service, pack.name].join(' ').includes(query));
}

export function getAllPackages(): PackageConfig[] {
  return packages;
}

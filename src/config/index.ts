import modo from './modo';
import evo from './evo';
import { PackageConfig } from './types';

export * from './types';

const packages: PackageConfig[] = [...modo, ...evo];

export function findPackage(query: string): PackageConfig | undefined {
  return packages.find(pack => [pack.service, pack.name].join(' ').includes(query));
}

export function getAllPackages(): PackageConfig[] {
  return packages;
}

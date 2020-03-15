import evo from './evo';
import lyft from './lyft';
import modo from './modo';
import { PackageConfig } from './types';

export * from './types';

const packages: PackageConfig[] = [...evo, ...lyft, ...modo];

export function findPackage(query: string): PackageConfig | undefined {
  return packages.find(pack => [pack.service, pack.name].join(' ').includes(query));
}

export function getAllPackages(): PackageConfig[] {
  return packages;
}

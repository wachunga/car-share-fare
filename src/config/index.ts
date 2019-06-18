import { modo } from './modo';
import { evo } from './evo';
import { CarShareConfig } from './types';

export * from './types';

export const configs: { [key: string]: CarShareConfig } = {
  modo,
  evo,
};

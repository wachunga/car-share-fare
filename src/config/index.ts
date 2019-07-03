import { modo } from './modo';
import { evo } from './evo';
import { car2go } from './car2go';
import { CarShareConfig } from './types';

export * from './types';

export const configs: { [key: string]: CarShareConfig } = {
  modo,
  evo,
  car2go,
};

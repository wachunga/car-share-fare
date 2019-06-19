import { CarShareConfig } from './types';

export const evo: CarShareConfig = {
  key: 'evo',
  url: 'https://evo.ca/rates',
  lastUpdated: '2019-06-17',
  currency: 'CAD',
  fees: {
    trip: 1, // first 200 trips per calendar year
    annual: 2,
    registration: 35,
  },
  // distance: unlimited
  packages: [
    {
      name: 'Default',
      vehicle: 'Toyota Prius C',
      maxPassengers: 5,
      time: [
        { per: 1, cost: 0.41, maxCost: 14.99 },
        { per: 60, cost: 14.99, maxCost: 89.99 },
        { per: 60 * 24, cost: 89.99 },
      ],
    },
  ],
};

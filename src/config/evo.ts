import { CarShareConfig } from './types';

const commonConfig: CarShareConfig = {
  service: 'Evo',
  url: 'https://evo.ca/rates',
  lastUpdated: '2023-03-17',
  currency: 'CAD',
  fees: {
    trip: 1_25, // first 200 trips per calendar year
    annual: 2_00,
    registration: 35_00,
  },
  // distance: unlimited
};

const packages = [
  {
    name: '', // no need for name when same as service
    ...commonConfig,
    vehicle: 'Toyota Prius C',
    maxPassengers: 5,
    time: [
      { per: 1, cost: 49, maxCost: 17_99 },
      { per: 60, cost: 17_99, maxCost: 104_99 },
      { per: 60 * 24, cost: 104_99 },
    ],
  },
];

export default packages;

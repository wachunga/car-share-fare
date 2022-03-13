import { CarShareConfig } from './types';

const commonConfig: CarShareConfig = {
  service: 'Evo',
  url: 'https://evo.ca/rates',
  lastUpdated: '2021-10-01',
  currency: 'CAD',
  fees: {
    trip: 1_00, // first 200 trips per calendar year
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
      { per: 1, cost: 45, maxCost: 16_99 },
      { per: 60, cost: 16_99, maxCost: 99_99 },
      { per: 60 * 24, cost: 99_99 },
    ],
  },
];

export default packages;

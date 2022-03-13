import { CarShareConfig } from './types';

const commonConfig: CarShareConfig = {
  service: 'Lyft',
  url: 'https://www.lyft.com/pricing/YVR',
  lastUpdated: '2022-03-13',
  currency: 'CAD',
};

const packages = [
  {
    name: 'Lyft',
    ...commonConfig,
    fees: {
      trip: 5_00 + 2_50, // minimum fare + service fee
      annual: 0,
      registration: 0,
    },
    vehicle: 'Varies',
    maxPassengers: 4,
    distance: {
      unit: 'km',
      steps: [{ start: 0, cost: 65 }],
    },
    time: [{ per: 1, cost: 33 }],
  },
  {
    name: 'Lyft XL',
    ...commonConfig,
    fees: {
      trip: 8_00 + 2_75, // minimum fare + service fee
      annual: 0,
      registration: 0,
    },
    vehicle: 'Varies',
    maxPassengers: 6,
    distance: {
      unit: 'km',
      steps: [{ start: 0, cost: 1_24 }],
    },
    time: [{ per: 1, cost: 46 }],
  },
];

export default packages;

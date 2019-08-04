import { CarShareConfig, PackageConfig } from './types';
import { toHours, toDays } from '../cost/time';

const common200KmIncluded = withKmIncluded(200);
const fourHundredKmIncluded = withKmIncluded(400);
const sixHundredKmIncluded = withKmIncluded(600);

const commonConfig: CarShareConfig = {
  service: 'car2go',
  url: 'https://www.car2go.com/CA/en/vancouver/rates/',
  lastUpdated: '2019-07-02',
  currency: 'CAD',
  fees: {
    trip: 1, // "driver protection fee" - first 200 trips per calendar year
    annual: 2,
    registration: 5,
  },
};

const packages: PackageConfig[] = [
  {
    name: 'smart - minute rate',
    ...commonConfig,
    vehicle: 'smart fortwo',
    maxPassengers: 2,
    time: [{ per: 1, cost: 0.32 }],
    distance: common200KmIncluded,
  },
  {
    name: 'Mercedes - minute rate',
    ...commonConfig,
    vehicle: 'Mercedes Benz CLA/GLA',
    maxPassengers: 5,
    time: [{ per: 1, cost: 0.45 }],
    distance: common200KmIncluded,
  },

  {
    name: 'smart - 1 hour',
    ...commonConfig,
    vehicle: 'smart fortwo',
    maxPassengers: 2,
    time: [{ start: 0, per: toHours(1), cost: 13 }, { start: toHours(1), per: 1, cost: 0.37 }],
    distance: common200KmIncluded,
  },
  {
    name: 'Mercedes - 1 hour',
    ...commonConfig,
    vehicle: 'Mercedes Benz CLA/GLA',
    maxPassengers: 5,
    time: [{ start: 0, per: toHours(1), cost: 17 }, { start: toHours(1), per: 1, cost: 0.45 }],
    distance: common200KmIncluded,
  },

  {
    name: 'smart - 3 hours',
    ...commonConfig,
    vehicle: 'smart fortwo',
    maxPassengers: 2,
    time: [{ start: 0, per: toHours(3), cost: 35 }, { start: toHours(3), per: 1, cost: 0.37 }],
    distance: common200KmIncluded,
  },
  {
    name: 'Mercedes - 3 hours',
    ...commonConfig,
    vehicle: 'Mercedes Benz CLA/GLA',
    maxPassengers: 5,
    time: [{ start: 0, per: toHours(3), cost: 45 }, { start: toHours(3), per: 1, cost: 0.45 }],
    distance: common200KmIncluded,
  },

  {
    name: 'smart - 6 hours',
    ...commonConfig,
    vehicle: 'smart fortwo',
    maxPassengers: 2,
    time: [{ start: 0, per: toHours(6), cost: 49 }, { start: toHours(6), per: 1, cost: 0.37 }],
    distance: common200KmIncluded,
  },
  {
    name: 'Mercedes - 6 hours',
    ...commonConfig,
    vehicle: 'Mercedes Benz CLA/GLA',
    maxPassengers: 5,
    time: [{ start: 0, per: toHours(6), cost: 69 }, { start: toHours(6), per: 1, cost: 0.45 }],
    distance: common200KmIncluded,
  },

  {
    name: 'smart - 1 day',
    ...commonConfig,
    vehicle: 'smart fortwo',
    maxPassengers: 2,
    time: [{ start: 0, per: toDays(1), cost: 69 }, { start: toDays(1), per: 1, cost: 0.37 }],
    distance: common200KmIncluded,
  },
  {
    name: 'Mercedes - 1 day',
    ...commonConfig,
    vehicle: 'Mercedes Benz CLA/GLA',
    maxPassengers: 5,
    time: [{ start: 0, per: toDays(1), cost: 99 }, { start: toDays(1), per: 1, cost: 0.45 }],
    distance: common200KmIncluded,
  },

  {
    name: 'smart - 2 days',
    ...commonConfig,
    vehicle: 'smart fortwo',
    maxPassengers: 2,
    time: [{ start: 0, per: toDays(2), cost: 129 }, { start: toDays(2), per: 1, cost: 0.37 }],
    distance: fourHundredKmIncluded,
  },
  {
    name: 'Mercedes - 2 days',
    ...commonConfig,
    vehicle: 'Mercedes Benz CLA/GLA',
    maxPassengers: 5,
    time: [{ start: 0, per: toDays(2), cost: 179 }, { start: toDays(2), per: 1, cost: 0.45 }],
    distance: fourHundredKmIncluded,
  },

  {
    name: 'smart - 3 days',
    ...commonConfig,
    vehicle: 'smart fortwo',
    maxPassengers: 2,
    time: [{ start: 0, per: toDays(3), cost: 179 }, { start: toDays(3), per: 1, cost: 0.37 }],
    distance: sixHundredKmIncluded,
  },
  {
    name: 'Mercedes - 3 days',
    ...commonConfig,
    vehicle: 'Mercedes Benz CLA/GLA',
    maxPassengers: 5,
    time: [{ start: 0, per: toDays(3), cost: 249 }, { start: toDays(3), per: 1, cost: 0.45 }],
    distance: sixHundredKmIncluded,
  },
];

function withKmIncluded(km: number) {
  return {
    unit: 'km',
    steps: [{ start: 0, end: km, cost: 0 }, { start: km, cost: 0.49 }],
  };
}

export default packages;

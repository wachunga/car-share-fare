import { CarShareConfig } from './types';
import { toHours, toDays } from '../cost/time';

function withKmIncluded(km: number) {
    return {
        unit: 'km',
        steps: [{ start: 0, end: km, cost: 0 }, { start: km, cost: 0.45 }],
    };
}

const common200KmIncluded = withKmIncluded(200);
const fourHundredKmIncluded = withKmIncluded(400);
const sixHundredKmIncluded = withKmIncluded(600);

export const car2go: CarShareConfig = {
  key: 'car2go-yvr',
  url: 'https://www.car2go.com/CA/en/vancouver/rates/',
  lastUpdated: '2019-07-02',
  currency: 'CAD',
  fees: {
    trip: 1, // "driver protection fee" - first 200 trips per calendar year
    annual: 2,
    registration: 5,
  },
  packages: [
    {
      name: 'minute rate - smart',
      vehicle: 'smart fortwo',
      maxPassengers: 2,
      time: [{ per: 1, cost: 0.32 }],
      distance: common200KmIncluded,
    },
    {
      name: 'minute rate - mercedes',
      vehicle: 'Mercedes Benz CLA/GLA',
      maxPassengers: 5,
      time: [{ per: 1, cost: 0.45 }],
      distance: common200KmIncluded,
    },

    {
      name: '1 hour - smart',
      vehicle: 'smart fortwo',
      maxPassengers: 2,
      time: [{ start: 0, per: toHours(1), cost: 13 }, { start: toHours(1), per: 1, cost: 0.32 }],
      distance: common200KmIncluded,
    },
    {
      name: '1 hour - mercedes',
      vehicle: 'Mercedes Benz CLA/GLA',
      maxPassengers: 5,
      time: [{ start: 0, per: toHours(1), cost: 17 }, { start: toHours(1), per: 1, cost: 0.45 }],
      distance: common200KmIncluded,
    },

    {
      name: '3 hours - smart',
      vehicle: 'smart fortwo',
      maxPassengers: 2,
      time: [{ start: 0, per: toHours(3), cost: 35 }, { start: toHours(3), per: 1, cost: 0.32 }],
      distance: common200KmIncluded,
    },
    {
      name: '3 hours - mercedes',
      vehicle: 'Mercedes Benz CLA/GLA',
      maxPassengers: 5,
      time: [{ start: 0, per: toHours(3), cost: 45 }, { start: toHours(3), per: 1, cost: 0.45 }],
      distance: common200KmIncluded,
    },

    {
      name: '6 hours - smart',
      vehicle: 'smart fortwo',
      maxPassengers: 2,
      time: [{ start: 0, per: toHours(6), cost: 49 }, { start: toHours(6), per: 1, cost: 0.32 }],
      distance: common200KmIncluded,
    },
    {
      name: '6 hours - mercedes',
      vehicle: 'Mercedes Benz CLA/GLA',
      maxPassengers: 5,
      time: [{ start: 0, per: toHours(6), cost: 69 }, { start: toHours(6), per: 1, cost: 0.45 }],
      distance: common200KmIncluded,
    },

    {
      name: '1 day - smart',
      vehicle: 'smart fortwo',
      maxPassengers: 2,
      time: [{ start: 0, per: toDays(1), cost: 69 }, { start: toDays(1), per: 1, cost: 0.32 }],
      distance: common200KmIncluded,
    },
    {
      name: '1 day - mercedes',
      vehicle: 'Mercedes Benz CLA/GLA',
      maxPassengers: 5,
      time: [{ start: 0, per: toDays(1), cost: 99 }, { start: toDays(1), per: 1, cost: 0.45 }],
      distance: common200KmIncluded,
    },

    {
      name: '2 days - smart',
      vehicle: 'smart fortwo',
      maxPassengers: 2,
      time: [{ start: 0, per: toDays(2), cost: 129 }, { start: toDays(2), per: 1, cost: 0.32 }],
      distance: fourHundredKmIncluded,
    },
    {
      name: '2 days - mercedes',
      vehicle: 'Mercedes Benz CLA/GLA',
      maxPassengers: 5,
      time: [{ start: 0, per: toDays(2), cost: 179 }, { start: toDays(2), per: 1, cost: 0.45 }],
      distance: fourHundredKmIncluded,
    },

    {
      name: '3 days - smart',
      vehicle: 'smart fortwo',
      maxPassengers: 2,
      time: [{ start: 0, per: toDays(3), cost: 179 }, { start: toDays(3), per: 1, cost: 0.32 }],
      distance: sixHundredKmIncluded,
    },
    {
      name: '3 days - mercedes',
      vehicle: 'Mercedes Benz CLA/GLA',
      maxPassengers: 5,
      time: [{ start: 0, per: toDays(3), cost: 249 }, { start: toDays(3), per: 1, cost: 0.45 }],
      distance: sixHundredKmIncluded,
    },
  ],
};

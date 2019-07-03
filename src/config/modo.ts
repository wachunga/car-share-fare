import { CarShareConfig } from './types';

export const modo: CarShareConfig = {
  key: 'modo-plus', // TODO: modo monthly
  url: 'https://www.modo.coop/plans/#tile-join-individual',
  lastUpdated: '2019-06-15',
  currency: 'CAD',
  fees: {
    trip: 1.5, // "co-op innovation fee"
    annual: 1,
    share: 500,
  },
  distance: {
    unit: 'km',
    steps: [{ start: 0, end: 25, cost: 0.4 }, { start: 25, cost: 0.28 }],
  },
  packages: [
    {
      name: 'Daily Drives',
      vehicle: 'Prius, Rondo, ...',
      maxPassengers: 7,
      time: [
        { start: 0, per: 15, cost: 1 },
        { per: 60, cost: 4, maxCost: 52 },
        { per: 60 * 24, cost: 52 },
      ],
    },
    {
      name: 'Large and Loadable',
      vehicle: 'Rogue, Tucson, Sedona, RAV4, Grand Caravan, Sienna, NEXO, Frontier, NV200',
      maxPassengers: 8,
      time: [
        { start: 0, per: 15, cost: 1.5 },
        { start: 0, per: 60, cost: 6, maxCost: 78 },
        { per: 60 * 24, cost: 78 },
      ],
    },
    {
      name: 'Oversize and Premium',
      vehicle: 'BMW X1, Ram Promaster',
      maxPassengers: 5, // promaster is only 3
      time: [
        { start: 0, per: 15, cost: 2.25 },
        { start: 0, per: 60, cost: 9, maxCost: 117 },
        { per: 60 * 24, cost: 117 },
      ],
    },
  ],
};

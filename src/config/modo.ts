import { CarShareConfig, PackageConfig } from './types';

const commonConfig: CarShareConfig = {
  service: 'Modo',
  url: 'https://www.modo.coop/plans/#tile-join-individual',
  lastUpdated: '2019-07-02',
  currency: 'CAD',
  distance: {
    unit: 'km',
    steps: [{ start: 0, end: 25, cost: 0.4 }, { start: 25, cost: 0.28 }],
  },
};

const modoPlusConfig = {
  fees: {
    trip: 1.5, // "co-op innovation fee"
    annual: 1,
    share: 500,
  },
};

// TODO: add modo monthly packages (though they're always more expensive now)
// TODO: overnight time charge capped at 3 hours between 7pm - 9am
const packages: PackageConfig[] = [
  {
    name: 'Daily Drives - Modo Plus',
    ...commonConfig,
    ...modoPlusConfig,
    vehicle: 'Prius, Rondo, ...',
    maxPassengers: 7,
    time: [
      { start: 0, per: 15, cost: 1 },
      { per: 60, cost: 4, maxCost: 52 },
      { per: 60 * 24, cost: 52 },
    ],
  },
  {
    name: 'Large and Loadable - Modo Plus',
    ...commonConfig,
    ...modoPlusConfig,
    vehicle: 'Rogue, Tucson, Sedona, RAV4, Grand Caravan, Sienna, NEXO, Frontier, NV200',
    maxPassengers: 8,
    time: [
      { start: 0, per: 15, cost: 1.5 },
      { per: 60, cost: 6, maxCost: 78 },
      { per: 60 * 24, cost: 78 },
    ],
  },
  {
    name: 'Oversize and Premium - Modo Plus',
    ...commonConfig,
    ...modoPlusConfig,
    vehicle: 'BMW X1, Ram Promaster',
    maxPassengers: 5, // promaster is only 3
    time: [
      { start: 0, per: 15, cost: 2.25 },
      { per: 60, cost: 9, maxCost: 117 },
      { per: 60 * 24, cost: 117 },
    ],
  },
];

export default packages;

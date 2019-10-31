export type CarShareFees = {
  trip?: number;
  daily?: number; // fees on longer trips
  annual?: number;
  registration?: number;
  /** Refundable share amount (for co-operatives) */
  share?: number;
};

export type DistanceConfig = {
  unit: string;
  steps: DistanceSteps[];
};

type DistanceSteps = {
  start: number;
  end?: number;
  cost: number;
  // currency
};

export type PackageConfig = {
  name: string;
  vehicle?: string;
  maxPassengers?: number;
  distance?: DistanceConfig;
  time?: TimeConfig[];
  custom?: (minutes: number, distance: number) => Money;
} & CarShareConfig;

export type CarShareConfig = {
  service: string;
  url?: string;
  lastUpdated?: string;
  currency: string;
  fees?: CarShareFees;
  distance?: DistanceConfig;
};

type TimeConfig = {
  /** Minutes before this rate is applicable. */
  start?: number;
  /** Time in minutes covered by cost */
  per: number;
  /** Cost per time */
  cost: number;
  /** Capped cost (eg if daily rate kicks in) */
  maxCost?: number;
};

export type CarShareConfig = {
  key: string;
  url?: string;
  lastUpdated?: string;
  currency?: string;
  fees?: CarShareFees;
  distance?: DistanceConfig;
  packages: PackageConfig[];
};

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

type PackageConfig = {
  name: string;
  vehicle?: string;
  maxPassengers?: number;
  time?: TimeConfig[];
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

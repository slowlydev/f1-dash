export type Driver = {
  nr: string;

  broadcastName: string;
  fullName: string;
  firstName: string;
  lastName: string;
  short: string;
  country: string;

  line: number;
  position: string;

  teamName: string;
  teamColor: string;

  status: number;

  gapToLeader: string;
  gapToFront: string;
  catchingFront: boolean;

  sectors: Sector[];
  stints: Stint[];

  drs: Drs;
  laps: number;
  lapTimes: LapTimes;

  metrics: Metrics;
};

export type TimeStats = {
  value: string;
  fastest: boolean;
  pb: boolean;
};

export type Sector = {
  current: TimeStats;
  fastest: TimeStats;
  segments: number[];
};

export type LapTimes = {
  last: TimeStats;
  best: TimeStats;
};

export type Stint = {
  compound: string;
  laps: string;
  new: boolean;
};

export type Drs = {
  on: boolean;
  possible: boolean;
};

export type Metrics = {
  gear: number;
  rpm: number;
  speed: number;
};

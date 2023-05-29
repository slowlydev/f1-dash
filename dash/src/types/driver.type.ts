export type TireType = "SOFT" | "MEDIUM" | "HARD" | "WET" | "INTER";

export type LapTimeType = Date;

export type Sector = {
  last: {
    time: string;
    fastest: boolean;
    pb: boolean;
  };
  best: {
    time: string;
    fastest: boolean;
    pb: boolean;
  };
  segments: number[];
};

export type DriverType = {
  name: string;
  displayName: string;
  number: number;
  drs: {
    on: boolean;
    possible: boolean;
  };
  speed: number;
  gap: string;
  tire: TireType;
  lapTimes: LapTimeType[];
  sectors: Sector[];
};

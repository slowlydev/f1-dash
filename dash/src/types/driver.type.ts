export type MiniSectorStatusType = "PB" | "WR" | "BAD";
export type TireType = "SOFT" | "MEDIUM" | "HARD" | "WET" | "INTER";

export type LapTimeType = Date;

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
  miniSectors: MiniSectorStatusType[][];
};

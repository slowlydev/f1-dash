export type RaceControlMessage = {
  utc: string;
  lap: number;
  message: string;
  category: string;

  flag?: string;
  scope?: string;
  sector?: number;
};

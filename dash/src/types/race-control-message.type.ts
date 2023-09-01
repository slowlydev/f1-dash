export type RaceControlMessageType = {
  trackTime: string;
  utc: string;
  lap: number;
  message: string;
  category: "Other" | "Sector" | "Flag" | "Drs" | "SafetyCar" | string;

  flag?:
    | "BLACK AND WHITE"
    | "BLUE"
    | "CLEAR"
    | "YELLOW"
    | "GREEN"
    | "DOUBLE YELLOW";
  scope?: "Driver" | "Track" | "Sector";
  sector?: number;
  drsEnabled?: boolean;
};

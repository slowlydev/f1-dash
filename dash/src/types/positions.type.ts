export type DriverPositionBatch = {
  utc: string;
  positions: DriverPosition[];
};

export type DriverPosition = {
  driverNr: string;

  broadcastName: string;
  fullName: string;
  firstName: string;
  lastName: string;
  short: string;

  teamColor: string;

  status: string;

  x: number;
  y: number;
  z: number;
};

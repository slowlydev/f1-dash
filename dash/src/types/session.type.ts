export type SessionInfo = {
  name: string;
  officialName: string;
  location: string;

  countryName: string;
  countryCode: string;

  circuitName: string;
  circuitKey: number;

  startDate: string;
  endDate: string;
  offset: string;

  type: string;
  typeName: string;
  number?: number;
};

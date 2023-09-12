export type Archive = {
  year: number;
  meetings: Meeting[];
};

export type Meeting = {
  key: number;
  code: string;
  name: string;
  number: number;
  location: string;
  officialName: string;
  country: Country;
  circuit: Circuit;
  sessions: Session[];
};

type Circuit = {
  key: number;
  shortName: string;
};

type Country = {
  key: number;
  code: string;
  name: string;
};

type Session = {
  key: number;
  type: string;
  number?: number;
  name: string;
  startDate: string;
  endDate: string;
  gmtOffset: string;
  path: string;
};

export type F1Archive = {
  Year: number;
  Meetings: F1Meeting[];
}

type F1Meeting = {
  Sessions: F1Session[];
  Key: number;
  Code: string;
  Number: number;
  Location: string;
  OfficialName: string;
  Name: string;
  Country: F1Country;
  Circuit: F1Circuit;
}

type F1Circuit = {
  Key: number;
  ShortName: string;
}

type F1Country = {
  Key: number;
  Code: string;
  Name: string;
}

type F1Session = {
  Key: number;
  Type: string;
  Number?: number;
  Name: string;
  StartDate: string;
  EndDate: string;
  GmtOffset: string;
  Path: string;
}
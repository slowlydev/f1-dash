export type RaceControlMessageType = "FLAG";

export type RaceControlMessage = {
  id: string;
  message: string;
  time: string;
  type: RaceControlMessageType;
};

import { Driver } from "./driver.type";
import { ExtrapolatedClock } from "./extrapolated-clock.type";
import { LapCount } from "./lap-count.type";
import { RaceControlMessage } from "./race-control-message.type";
import { SessionData } from "./sesion-data.type";
import { SessionInfo } from "./session.type";
import { TrackStatus } from "./track-status.type";
import { Weather } from "./weather.type";

export type State = {
  extrapolatedClock?: ExtrapolatedClock;
  sessionData?: SessionData;
  trackStatus?: TrackStatus;
  lapCount?: LapCount;
  weather?: Weather;

  raceControlMessages?: RaceControlMessage[];
  drivers?: Driver[];

  session?: SessionInfo;
};

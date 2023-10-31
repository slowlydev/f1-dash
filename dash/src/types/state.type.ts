import { DriverType } from "./driver.type";
import { ExtrapolatedClock } from "./extrapolated-clock.type";
import { LapCount } from "./lap-count.type";
import { DriverPositionBatch } from "./positions.type";
import { RaceControlMessageType } from "./race-control-message.type";
import { SessionData } from "./sesion-data.type";
import { SessionInfo } from "./session.type";
import { TeamRadioType } from "./team-radio.type";
import { TrackStatus } from "./track-status.type";
import { Weather } from "./weather.type";

export type State = {
	extrapolatedClock?: ExtrapolatedClock;
	sessionData?: SessionData;
	trackStatus?: TrackStatus;
	lapCount?: LapCount;
	weather?: Weather;

	raceControlMessages?: RaceControlMessageType[];
	teamRadios?: TeamRadioType[];
	drivers?: DriverType[];

	session?: SessionInfo;
	positionBatches?: DriverPositionBatch[];
};

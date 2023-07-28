export type State = {
	extrapolatedClock?: ExtrapolatedClock;
	sessionData?: SessionData;
	trackStatus?: TrackStatus;
	lapCount?: LapCount;
	weather?: Weather;

	raceControlMessages?: RaceControlMessage[];
	teamRadios?: TeamRadio[];
	drivers?: Driver[];

	session?: SessionInfo;

	positionBatches?: DriverPositionBatch[];
};

export type ExtrapolatedClock = {
	utc: string;
	remaining: string;
	extrapolating: boolean;
};

export type LapCount = {
	current: number;
	total: number;
};

export type RaceControlMessage = {
	utc: string;
	lap: number;
	message: string;
	category: string;

	flag?: string;
	scope?: string;
	sector?: number;
	drsEnabled?: boolean;
};

export type SessionData = {
	status: StatusUpdate[];
};

export type StatusUpdate = {
	utc: string;
	trackStatus?: string;
	sessionStatus?: string;
};

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

export type Weather = {
	humidity: number;
	pressure: number;
	rainfall: number;
	wind_direction: number;
	wind_speed: number;
	air_temp: number;
	track_temp: number;
};

export type TrackStatus = {
	status: number;
	statusMessage: string;
};

// F1DriverList
// F1TimingData
// F1TimingAppData
export type Driver = {
	nr: string;

	broadcastName: string;
	fullName: string;
	firstName: string;
	lastName: string;
	short: string;
	country: string;

	line: number;
	position: string;
	positionChange: number;

	teamName: string;
	teamColor: string;

	status: "OUT" | "RETIRED" | "STOPPED" | "PIT" | "PIT OUT" | "CUTOFF" | null;
	danger: boolean;

	gapToLeader: string;
	gapToFront: string;
	catchingFront: boolean;

	sectors: Sector[];
	stints: Stint[];

	drs: Drs;
	laps: number;
	lapTimes: LapTimes;

	metrics: Metrics;
};

export type TimeStats = {
	value: string;
	fastest: boolean;
	pb: boolean;
};

export type Sector = {
	current: TimeStats;
	last: TimeStats;
	segments: number[];
};

export type LapTimes = {
	last: TimeStats;
	best: TimeStats;
};

export type Stint = {
	compound: "soft" | "medium" | "hard" | "intermediate" | "wet";
	laps: number;
	new: boolean;
};

export type Drs = {
	on: boolean;
	possible: boolean;
};

export type Metrics = {
	gear: number;
	rpm: number;
	speed: number;
};

export type DriverPositionBatch = {
	utc: string;
	positions: DriverPosition[];
};

export type DriverPosition = {
	driverNr: string;
	position: string;

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

export type TeamRadio = {
	driverNr: string;

	broadcastName: string;
	fullName: string;
	firstName: string;
	lastName: string;
	short: string;

	teamColor: string;

	utc: string;
	audioUrl: string;
};

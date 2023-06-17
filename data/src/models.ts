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
};

export type SessionData = {
	//  series: []string we ignore for now
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

	teamName: string;
	teamColor: string;

	status: number;

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
	fastest: TimeStats;
	segments: number[];
};

export type LapTimes = {
	last: TimeStats;
	best: TimeStats;
};

export type Stint = {
	compound: string;
	laps: string;
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

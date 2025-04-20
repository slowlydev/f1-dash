export type State = {
	heartbeat?: Heartbeat;
	extrapolatedClock?: ExtrapolatedClock;
	topThree?: TopThree;
	timingStats?: TimingStats;
	timingAppData?: TimingAppData;
	weatherData?: WeatherData;
	trackStatus?: TrackStatus;
	sessionStatus?: SessionStatus;
	driverList?: DriverList;
	raceControlMessages?: RaceControlMessages;
	sessionInfo?: SessionInfo;
	sessionData?: SessionData;
	lapCount?: LapCount;
	timingData?: TimingData;
	teamRadio?: TeamRadio;
	championshipPrediction?: ChampionshipPrediction;
};

export type Heartbeat = {
	utc: string;
};

export type ExtrapolatedClock = {
	utc: string;
	remaining: string;
	extrapolating: boolean;
};

export type TopThree = {
	withheld: boolean;
	lines: TopThreeDriver[];
};

export type TimingStats = {
	withheld: boolean;
	lines: {
		[key: string]: TimingStatsDriver;
	};
	sessionType: string;
	_kf: boolean;
};

export type TimingAppData = {
	lines: {
		[key: string]: TimingAppDataDriver;
	};
};

export type TimingAppDataDriver = {
	racingNumber: string;
	stints: Stint[];
	line: number;
	gridPos: string;
};

export type Stint = {
	totalLaps?: number;
	compound?: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET";
	new?: string; // TRUE | FALSE
};

export type WeatherData = {
	airTemp: string;
	humidity: string;
	pressure: string;
	rainfall: string;
	trackTemp: string;
	windDirection: string;
	windSpeed: string;
};

export type TrackStatus = {
	status: string;
	message: string;
};

export type SessionStatus = {
	status: "Started" | "Finished" | "Finalised" | "Ends";
};

export type DriverList = {
	[key: string]: Driver;
};

export type Driver = {
	racingNumber: string;
	broadcastName: string;
	fullName: string;
	tla: string;
	line: number;
	teamName: string;
	teamColour: string;
	firstName: string;
	lastName: string;
	reference: string;
	headshotUrl: string;
	countryCode: string;
};

export type RaceControlMessages = {
	messages: Message[];
};

export type Message = {
	utc: string;
	lap: number;
	message: string;
	category: "Other" | "Sector" | "Flag" | "Drs" | "SafetyCar" | string;
	flag?: "BLACK AND WHITE" | "BLUE" | "CLEAR" | "YELLOW" | "GREEN" | "DOUBLE YELLOW" | "RED" | "CHEQUERED";
	scope?: "Driver" | "Track" | "Sector";
	sector?: number;
	status?: "ENABLED" | "DISABLED";
};

export type SessionInfo = {
	meeting: Meeting;
	archiveStatus: ArchiveStatus;
	key: number;
	type: string;
	name: string;
	startDate: string;
	endDate: string;
	gmtOffset: string;
	path: string;
	number?: number;
};

export type ArchiveStatus = {
	status: string;
};

export type Meeting = {
	key: number;
	name: string;
	officialName: string;
	location: string;
	country: Country;
	circuit: Circuit;
};

export type Circuit = {
	key: number;
	shortName: string;
};

export type Country = {
	key: number;
	code: string;
	name: string;
};

export type SessionData = {
	series: Series[];
	statusSeries: StatusSeries[];
};

export type StatusSeries = {
	utc: string;
	trackStatus?: string;
	sesionStatus?: "Started" | "Finished" | "Finalised" | "Ends";
};

export type Series = {
	utc: string;
	lap: number;
};

export type LapCount = {
	currentLap: number;
	totalLaps: number;
};

export type TimingData = {
	noEntries?: number[];
	sessionPart?: number;
	cutOffTime?: string;
	cutOffPercentage?: string;

	lines: {
		[key: string]: TimingDataDriver;
	};
	withheld: boolean;
};

export type TimingDataDriver = {
	stats?: { timeDiffToFastest: string; timeDifftoPositionAhead: string }[];
	timeDiffToFastest?: string;
	timeDiffToPositionAhead?: string;
	gapToLeader: string;
	intervalToPositionAhead?: {
		value: string;
		catching: boolean;
	};
	line: number;
	position: string;
	showPosition: boolean;
	racingNumber: string;
	retired: boolean;
	inPit: boolean;
	pitOut: boolean;
	stopped: boolean;
	status: number;
	sectors: Sector[];
	speeds: Speeds;
	bestLapTime: PersonalBestLapTime;
	lastLapTime: I1;
	numberOfLaps: number; // TODO check
	knockedOut?: boolean;
	cutoff?: boolean;
};

export type Sector = {
	stopped: boolean;
	value: string;
	previousValue?: string;
	status: number;
	overallFastest: boolean;
	personalFastest: boolean;
	segments: {
		status: number;
	}[];
};

export type Speeds = {
	i1: I1;
	i2: I1;
	fl: I1;
	st: I1;
};

export type I1 = {
	value: string;
	status: number;
	overallFastest: boolean;
	personalFastest: boolean;
};

export type TimingStatsDriver = {
	line: number;
	racingNumber: string;
	personalBestLapTime: PersonalBestLapTime;
	bestSectors: PersonalBestLapTime[];
	bestSpeeds: {
		i1: PersonalBestLapTime;
		i2: PersonalBestLapTime;
		fl: PersonalBestLapTime;
		st: PersonalBestLapTime;
	};
};

export type PersonalBestLapTime = {
	value: string;
	position: number;
};

export type TopThreeDriver = {
	position: string;
	showPosition: boolean;
	racingNumber: string;
	tla: string;
	broadcastName: string;
	fullName: string;
	team: string;
	teamColour: string;
	lapTime: string;
	lapState: number;
	diffToAhead: string;
	diffToLeader: string;
	overallFastest: boolean;
	personalFastest: boolean;
};

export type TeamRadio = {
	captures: RadioCapture[];
};

export type RadioCapture = {
	utc: string;
	racingNumber: string;
	path: string;
};

export type ChampionshipPrediction = {
	drivers: {
		[key: string]: ChampionshipDriver;
	};
	teams: {
		[key: string]: ChampionshipTeam;
	};
};

export type ChampionshipDriver = {
	racingNumber: string;
	currentPosition: number;
	predictedPosition: number;
	currentPoints: number;
	predictedPoints: number;
};

export type ChampionshipTeam = {
	teamName: string;
	currentPosition: number;
	predictedPosition: number;
	currentPoints: number;
	predictedPoints: number;
};

export type Position = {
	Position: PositionItem[];
};

export type PositionItem = {
	Timestamp: string;
	Entries: Positions;
};

export type Positions = {
	// this is what we have at state
	[key: string]: PositionCar;
};

export type PositionCar = {
	Status: string;
	X: number;
	Y: number;
	Z: number;
};

export type CarData = {
	Entries: Entry[];
};

export type Entry = {
	Utc: string;
	Cars: CarsData;
};

export type CarsData = {
	// this is what we have at state
	[key: string]: {
		Channels: CarDataChannels;
	};
};

export type CarDataChannels = {
	/** 0 - RPM */
	"0": number;
	/** 2 - Speed number km/h */
	"2": number;
	/** 3 - gear number */
	"3": number;
	/** 4 - Throttle int 0-100 */
	"4": number;
	/** 5 - Brake number boolean */
	"5": number;
	/** 45 - DRS */
	"45": number;
};

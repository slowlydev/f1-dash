export type State = {
	Heartbeat?: Heartbeat;
	ExtrapolatedClock?: ExtrapolatedClock;
	TopThree?: TopThree;
	TimingStats?: TimingStats;
	TimingAppData?: TimingAppData;
	WeatherData?: WeatherData;
	TrackStatus?: TrackStatus;
	SessionStatus?: SessionStatus;
	DriverList?: DriverList;
	RaceControlMessages?: RaceControlMessages;
	SessionInfo?: SessionInfo;
	SessionData?: SessionData;
	LapCount?: LapCount;
	TimingData?: TimingData;
	TeamRadio?: TeamRadio;
	ChampionshipPrediction?: ChampionshipPrediction;
};

export type Heartbeat = {
	Utc: string;
};

export type ExtrapolatedClock = {
	Utc: string;
	Remaining: string;
	Extrapolating: boolean;
};

export type TopThree = {
	Withheld: boolean;
	Lines: TopThreeDriver[];
};

export type TimingStats = {
	Withheld: boolean;
	Lines: {
		[key: string]: TimingStatsDriver;
	};
	SessionType: string;
	_kf: boolean;
};

export type TimingAppData = {
	Lines: {
		[key: string]: TimingAppDataDriver;
	};
};

export type TimingAppDataDriver = {
	RacingNumber: string;
	Stints: Stint[];
	Line: number;
	GridPos: string;
};

export type Stint = {
	TotalLaps?: number;
	Compound?: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET";
	New?: string; // TRUE | FALSE
};

export type WeatherData = {
	AirTemp: string;
	Humidity: string;
	Pressure: string;
	Rainfall: string;
	TrackTemp: string;
	WindDirection: string;
	WindSpeed: string;
};

export type TrackStatus = {
	Status: string;
	Message: string;
};

export type SessionStatus = {
	Status: "Started" | "Finished" | "Finalised" | "Ends";
};

export type DriverList = {
	[key: string]: Driver;
};

export type Driver = {
	RacingNumber: string;
	BroadcastName: string;
	FullName: string;
	Tla: string;
	Line: number;
	TeamName: string;
	TeamColour: string;
	FirstName: string;
	LastName: string;
	Reference: string;
	HeadshotUrl: string;
	CountryCode: string;
};

export type RaceControlMessages = {
	Messages: Message[];
};

export type Message = {
	Utc: string;
	Lap: number;
	Message: string;
	Category: "Other" | "Sector" | "Flag" | "Drs" | "SafetyCar" | string;
	Flag?: "BLACK AND WHITE" | "BLUE" | "CLEAR" | "YELLOW" | "GREEN" | "DOUBLE YELLOW" | "RED" | "CHEQUERED";
	Scope?: "Driver" | "Track" | "Sector";
	Sector?: number;
	Status?: "ENABLED" | "DISABLED";
};

export type SessionInfo = {
	Meeting: Meeting;
	ArchiveStatus: ArchiveStatus;
	Key: number;
	Type: string;
	Name: string;
	StartDate: string;
	EndDate: string;
	GmtOffset: string;
	Path: string;
	Number?: number;
};

export type ArchiveStatus = {
	Status: string;
};

export type Meeting = {
	Key: number;
	Name: string;
	OfficialName: string;
	Location: string;
	Country: Country;
	Circuit: Circuit;
};

export type Circuit = {
	Key: number;
	ShortName: string;
};

export type Country = {
	Key: number;
	Code: string;
	Name: string;
};

export type SessionData = {
	Series: Series[];
	StatusSeries: StatusSeries[];
};

export type StatusSeries = {
	Utc: string;
	TrackStatus?: string;
	SesionStatus?: "Started" | "Finished" | "Finalised" | "Ends";
};

export type Series = {
	Utc: string;
	Lap: number;
};

export type LapCount = {
	CurrentLap: number;
	TotalLaps: number;
};

export type TimingData = {
	NoEntries?: number[];
	SessionPart?: number;
	CutOffTime?: string;
	CutOffPercentage?: string;

	Lines: {
		[key: string]: TimingDataDriver;
	};
	Withheld: boolean;
};

export type TimingDataDriver = {
	Stats?: { TimeDiffToFastest: string; TimeDifftoPositionAhead: string }[];
	TimeDiffToFastest?: string;
	TimeDiffToPositionAhead?: string;
	GapToLeader: string;
	IntervalToPositionAhead?: {
		Value: string;
		Catching: boolean;
	};
	Line: number;
	Position: string;
	ShowPosition: boolean;
	RacingNumber: string;
	Retired: boolean;
	InPit: boolean;
	PitOut: boolean;
	Stopped: boolean;
	Status: number;
	Sectors: Sector[];
	Speeds: Speeds;
	BestLapTime: PersonalBestLapTime;
	LastLapTime: I1;
	NumberOfLaps: number; // TODO check
	KnockedOut?: boolean;
	Cutoff?: boolean;
};

export type Sector = {
	Stopped: boolean;
	Value: string;
	PreviousValue?: string;
	Status: number;
	OverallFastest: boolean;
	PersonalFastest: boolean;
	Segments: {
		Status: number;
	}[];
};

export type Speeds = {
	I1: I1;
	I2: I1;
	Fl: I1;
	St: I1;
};

export type I1 = {
	Value: string;
	Status: number;
	OverallFastest: boolean;
	PersonalFastest: boolean;
};

export type TimingStatsDriver = {
	Line: number;
	RacingNumber: string;
	PersonalBestLapTime: PersonalBestLapTime;
	BestSectors: PersonalBestLapTime[];
	BestSpeeds: {
		I1: PersonalBestLapTime;
		I2: PersonalBestLapTime;
		Fl: PersonalBestLapTime;
		St: PersonalBestLapTime;
	};
};

export type PersonalBestLapTime = {
	Value: string;
	Position: number;
};

export type TopThreeDriver = {
	Position: string;
	ShowPosition: boolean;
	RacingNumber: string;
	Tla: string;
	BroadcastName: string;
	FullName: string;
	Team: string;
	TeamColour: string;
	LapTime: string;
	LapState: number;
	DiffToAhead: string;
	DiffToLeader: string;
	OverallFastest: boolean;
	PersonalFastest: boolean;
};

export type TeamRadio = {
	Captures: RadioCapture[];
};

export type RadioCapture = {
	Utc: string;
	RacingNumber: string;
	Path: string;
};

export type ChampionshipPrediction = {
	Drivers: {
		[key: string]: ChampionshipDriver;
	};
	Teams: {
		[key: string]: ChampionshipTeam;
	};
};

export type ChampionshipDriver = {
	RacingNumber: string;
	CurrentPosition: number;
	PredictedPosition: number;
	CurrentPoints: number;
	PredictedPoints: number;
};

export type ChampionshipTeam = {
	TeamName: string;
	CurrentPosition: number;
	PredictedPosition: number;
	CurrentPoints: number;
	PredictedPoints: number;
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

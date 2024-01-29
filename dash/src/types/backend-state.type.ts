export type ParsedRecap = {
	CarData?: BackendCarData;
	Position?: BackendPosition;
};

export type BackendState = ParsedRecap & Omit<BackendRecap, "CarData.z" | "Position.z">;

export type BackendRecap = {
	Heartbeat?: BackendHeartbeat;
	ExtrapolatedClock?: BackendExtrapolatedClock;
	TopThree?: BackendTopThree;
	TimingStats?: BackendTimingStats;
	TimingAppData?: BackendTimingAppData;
	WeatherData?: BackendWeatherData;
	TrackStatus?: BackendTrackStatus;
	DriverList?: BackendDriverList;
	RaceControlMessages?: BackendRaceControlMessages;
	SessionInfo?: BackendSessionInfo;
	SessionData?: BackendSessionData;
	LapCount?: BackendLapCount;
	TimingData?: BackendTimingData;
	TeamRadio?: BackendTeamRadio;

	WeatherDataHistory?: BackendWeatherDataHistory;
	TimingDataGapHistory?: BackendTimingDataGapHistory;
	TimingDataLaptimeHistory?: BackendTimingDataLaptimeHistory;
	TimingDataSectortimeHistory?: BackendTimingDataSectortimeHistory;

	"CarData.z"?: string;
	"Position.z"?: string;
};

export type BackendWeatherDataHistory = {
	AirTemp?: string[];
	Humidity?: string[];
	Pressure?: string[];
	Rainfall?: string[];
	TrackTemp?: string[];
	WindDirection?: string[];
	WindSpeed?: string[];
};

export type BackendTimingDataGapHistory = {
	[key: string]: string[];
};

export type BackendTimingDataLaptimeHistory = {
	[key: string]: string[];
};

export type BackendTimingDataSectortimeHistory = {
	[key: string]: {
		[key: string]: string[];
	};
};

export type BackendHeartbeat = {
	Utc: string;
	_kf: boolean;
};

export type BackendExtrapolatedClock = {
	Utc: string;
	Remaining: string;
	Extrapolating: boolean;
	_kf: boolean;
};

export type BackendTopThree = {
	Withheld: boolean;
	Lines: BackendTopThreeDriver[];
	_kf: boolean;
};

export type BackendTimingStats = {
	Withheld: boolean;
	Lines: {
		[key: string]: BackendTimingStatsDriver;
	};
	Sessiontype: string;
	_kf: boolean;
};

export type BackendTimingAppData = {
	Lines: {
		[key: string]: {
			RacingNumber: string;
			Stints: BackendStint[];
			Line: number;
			GridPos: string;
		};
	};
	_kf: boolean;
};

export type BackendStint = {
	TotalLaps?: number;
	Compound?: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET";
	New?: string; // TRUE | FALSE
};

export type BackendWeatherData = {
	AirTemp: string;
	Humidity: string;
	Pressure: string;
	Rainfall: string;
	TrackTemp: string;
	WindDirection: string;
	WindSpeed: string;
	_kf: boolean;
};

export type BackendTrackStatus = {
	Status: string;
	Message: string;
	_kf: boolean;
};

export type BackendDriverList = {
	[key: string]: BackendDriver;
};

export type BackendDriver = {
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

export type BackendRaceControlMessages = {
	Messages: BackendMessage[];
	_kf: boolean;
};

export type BackendMessage = {
	Utc: string;
	Lap: number;
	Category: string;
	Message: string;
	Flag?: string;
	Scope?: string;
	Sector?: number;
	Status?: "ENABLED" | "DISABLED";
};

export type BackendSessionInfo = {
	Meeting: BackendMeeting;
	ArchiveStatus: BackendArchiveStatus;
	Key: number;
	Type: string;
	Name: string;
	StartDate: string;
	EndDate: string;
	GmtOffset: string;
	Path: string;
	Number?: number;
	_kf: boolean;
};

export type BackendArchiveStatus = {
	Status: string;
};

export type BackendMeeting = {
	Key: number;
	Name: string;
	OfficialName: string;
	Location: string;
	Country: BackendCountry;
	Circuit: BackendCircuit;
};

export type BackendCircuit = {
	Key: number;
	ShortName: string;
};

export type BackendCountry = {
	Key: number;
	Code: string;
	Name: string;
};

export type BackendSessionData = {
	Series: BackendSeries[];
	StatusSeries: BackendStatusSeries[];
	_kf: boolean;
};

export type BackendStatusSeries = {
	Utc: string;
	TrackStatus: string;
};

export type BackendSeries = {
	Utc: string;
	Lap: number;
};

export type BackendLapCount = {
	CurrentLap: number;
	TotalLaps: number;
	_kf: boolean;
};

export type BackendTimingData = {
	NoEntries?: number[];
	SessionPart?: number;
	CutOffTime?: string;
	CutOffPercentage?: string;

	Lines: {
		[key: string]: BackendTimingDataDriver;
	};
	Withheld: boolean;
	_kf: boolean;
};

export type BackendTimingDataDriver = {
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
	Sectors: BackendSector[];
	Speeds: BackendSpeeds;
	BestLapTime: BackendPersonalBestLapTime;
	LastLapTime: BackendI1;
	NumberOfLaps: number; // TODO check
	KnockedOut?: boolean;
	Cutoff?: boolean;
};

export type BackendSector = {
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

export type BackendSpeeds = {
	I1: BackendI1;
	I2: BackendI1;
	FL: BackendI1;
	ST: BackendI1;
};

export type BackendI1 = {
	Value: string;
	Status: number;
	OverallFastest: boolean;
	PersonalFastest: boolean;
};

export type BackendTimingStatsDriver = {
	Line: number;
	RacingNumber: string;
	PersonalBestLapTime: BackendPersonalBestLapTime;
	BestSectors: BackendPersonalBestLapTime[];
	BestSpeeds: {
		I1: BackendPersonalBestLapTime;
		I2: BackendPersonalBestLapTime;
		FL: BackendPersonalBestLapTime;
		ST: BackendPersonalBestLapTime;
	};
};

export type BackendPersonalBestLapTime = {
	Value: string;
	Position: number;
};

export type BackendTopThreeDriver = {
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

export type BackendPosition = {
	Position: BackendPositionItem[];
};

export type BackendPositionItem = {
	Timestamp: string;
	Entries: {
		[key: string]: BackendPositionCar;
	};
};

export type BackendPositionCar = {
	Status: string;
	X: number;
	Y: number;
	Z: number;
};

export type BackendCarData = {
	Entries: BackendEntry[];
};

export type BackendEntry = {
	Utc: string;
	Cars: {
		[key: string]: {
			Channels: BackendCarDataChannels;
		};
	};
};

/**
 * @namespace
 * @property {number} 0 - RPM
 * @property {number} 2 - Speed number km/h
 * @property {number} 3 - gear number
 * @property {number} 4 - Throttle int 0-100
 * @property {number} 5 - Brake number boolean
 * @property {number} 45 - DRS
 */
export type BackendCarDataChannels = {
	"0": number;
	"2": number;
	"3": number;
	"4": number;
	"5": number;
	"45": number;
};

export type BackendTeamRadio = {
	Captures: BackendRadioCapture[];
	_kf: boolean;
};

export type BackendRadioCapture = {
	Utc: string;
	RacingNumber: string;
	Path: string;
};

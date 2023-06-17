export type SocketData = {
	C?: string;
	M?: SocketDataPayload[];
	G?: string;
	H?: string;
	I?: string;
	R?: F1Recap;
};

export type SocketDataPayload = {
	A: [keyof F1Recap, F1Recap[keyof F1Recap], string];
	H: string;
	M: string;
};

export type F1MessageType = keyof F1Recap;
export type F1MessageData = F1Recap[keyof F1Recap];

export type ParsedRecap = {
	CarData?: F1CarData;
	Position?: F1Position;
};

export type F1State = ParsedRecap & Omit<F1Recap, "CarData.z" | "Position.z">;

export type F1Recap = {
	Heartbeat?: F1Heartbeat;
	ExtrapolatedClock?: F1ExtrapolatedClock;
	TopThree?: F1TopThree;
	TimingStats?: F1TimingStats;
	TimingAppData?: F1TimingAppData;
	WeatherData?: F1WeatherData;
	TrackStatus?: F1TrackStatus;
	DriverList?: F1DriverList;
	RaceControlMessages?: F1RaceControlMessages;
	SessionInfo?: F1SessionInfo;
	SessionData?: F1SessionData;
	LapCount?: F1LapCount;
	TimingData?: F1TimingData;

	"CarData.z"?: string;
	"Position.z"?: string;
};

export type F1Heartbeat = {
	Utc: string;
	_kf: boolean;
};

export type F1ExtrapolatedClock = {
	Utc: string;
	Remaining: string;
	Extrapolating: boolean;
	_kf: boolean;
};

export type F1TopThree = {
	Withheld: boolean;
	Lines: F1TopThreeDriver[];
	_kf: boolean;
};

export type F1TimingStats = {
	Withheld: boolean;
	Lines: {
		[key: string]: F1TimingStatsDriver;
	};
	Sessiontype: string;
	_kf: boolean;
};

export type F1TimingAppData = {
	Lines: {
		[key: string]: {
			RacingNumber: string;
			Stints: any[];
			Line: number;
			GridPos: string;
		};
	};
	_kf: boolean;
};

export type F1WeatherData = {
	AirTemp: string;
	Humidity: string;
	Pressure: string;
	Rainfall: string;
	TrackTemp: string;
	WindDirection: string;
	WindSpeed: string;
	_kf: boolean;
};

export type F1TrackStatus = {
	Status: string;
	Message: string;
	_kf: boolean;
};

export type F1DriverList = {
	[key: string]: F1Driver;
};

export type F1Driver = {
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

export type F1RaceControlMessages = {
	Messages: F1Message[];
	_kf: boolean;
};

export type F1Message = {
	Utc: string;
	Lap: number;
	Category: string;
	Message: string;
	Flag?: string;
	Scope?: string;
	Sector?: number;
};

export type F1SessionInfo = {
	Meeting: F1Meeting;
	ArchiveStatus: F1ArchiveStatus;
	Key: number;
	type: string;
	Name: string;
	StartDate: string;
	EndDate: string;
	GmtOffset: string;
	Path: string;
	_kf: boolean;
};

export type F1ArchiveStatus = {
	Status: string;
};

export type F1Meeting = {
	Key: number;
	Name: string;
	OfficialName: string;
	Location: string;
	Country: F1Country;
	Circuit: F1Circuit;
};

export type F1Circuit = {
	Key: number;
	ShortName: string;
};

export type F1Country = {
	Key: number;
	Code: string;
	Name: string;
};

export type F1SessionData = {
	Series: F1Series[];
	StatusSeries: F1StatusSeries[];
	_kf: boolean;
};

export type F1StatusSeries = {
	Utc: string;
	TrackStatus: string;
};

export type F1Series = {
	Utc: string;
	Lap: number;
};

export type F1LapCount = {
	CurrentLap: number;
	TotalLaps: number;
	_kf: boolean;
};

export type F1TimingData = {
	Lines: {
		[key: string]: F1TimingDataDriver;
	};
	Withheld: boolean;
	_kf: boolean;
};

export type F1TimingDataDriver = {
	GapToLeader: string;
	IntervalToPositionAhead: {
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
	Sectors: F1Sector[];
	Speeds: F1Speeds;
	BestLapTime: F1PersonalBestLapTime;
	LastLapTime: F1I1;
	NumberOfLaps: number; // TODO check
};

export type F1Sector = {
	Stopped: boolean;
	Value: string;
	Status: number;
	OverallFastest: boolean;
	PersonalFastest: boolean;
	Segments: {
		Status: number;
	}[];
};

export type F1Speeds = {
	I1: F1I1;
	I2: F1I1;
	FL: F1I1;
	ST: F1I1;
};

export type F1I1 = {
	Value: string;
	Status: number;
	OverallFastest: boolean;
	PersonalFastest: boolean;
};

export type F1TimingStatsDriver = {
	Line: number;
	RacingNumber: string;
	PersonalBestLapTime: F1PersonalBestLapTime;
	BestSectors: F1PersonalBestLapTime[];
	BestSpeeds: {
		I1: F1PersonalBestLapTime;
		I2: F1PersonalBestLapTime;
		FL: F1PersonalBestLapTime;
		ST: F1PersonalBestLapTime;
	};
};

export type F1PersonalBestLapTime = {
	Value: string;
	Position: number;
};

export type F1TopThreeDriver = {
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

export type F1Position = {
	Position: F1PositionItem[];
};

export type F1PositionItem = {
	Timestamp: string;
	Entries: {
		[key: string]: F1PositionCar;
	};
};

export type F1PositionCar = {
	Status: string;
	X: number;
	Y: number;
	Z: number;
};

export type F1CarData = {
	Entries: F1Entry[];
};

export type F1Entry = {
	Utc: string;
	Cars: {
		[key: string]: {
			Channels: F1CarDataChannels;
		};
	};
};

export type F1CarDataChannels = {
	"0": number;
	"2": number;
	"3": number;
	"4": number;
	"5": number;
	"45": number;
};

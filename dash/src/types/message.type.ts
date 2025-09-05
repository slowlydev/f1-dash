import type {
	ChampionshipPrediction,
	DriverList,
	ExtrapolatedClock,
	Heartbeat,
	LapCount,
	RaceControlMessages,
	SessionData,
	SessionInfo,
	SessionStatus,
	State,
	TeamRadio,
	TimingAppData,
	TimingData,
	TimingStats,
	TopThree,
	TrackStatus,
	WeatherData,
} from "./state.type";

export type RecursivePartial<T> = {
	[P in keyof T]?: T[P] extends (infer U)[]
		? RecursivePartial<U>[]
		: T[P] extends object | undefined
			? RecursivePartial<T[P]>
			: T[P];
};

type FullState = State & {
	carDataZ?: string;
	positionZ?: string;
};

export type UpdateState = {
	heartbeat: Heartbeat;
	extrapolatedClock: ExtrapolatedClock;
	topThree: TopThree;
	timingStats: TimingStats;
	timingAppData: TimingAppData;
	weatherData: WeatherData;
	trackStatus: TrackStatus;
	sessionStatus: SessionStatus;
	driverList: DriverList;
	raceControlMessages: RaceControlMessages;
	sessionInfo: SessionInfo;
	sessionData: SessionData;
	lapCount: LapCount;
	timingData: TimingData;
	teamRadio: TeamRadio;
	championshipPrediction: ChampionshipPrediction;
	carDataZ: string;
	positionZ: string;
};

export type MessageUpdate = { [K in keyof UpdateState]: [K, RecursivePartial<UpdateState[K]>] }[keyof UpdateState][];

export type MessageInitial = FullState;

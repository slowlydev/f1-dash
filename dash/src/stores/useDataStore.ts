import { create } from "zustand";

import type {
	CarsData,
	ChampionshipPrediction,
	DriverList,
	ExtrapolatedClock,
	Heartbeat,
	LapCount,
	Positions,
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
} from "@/types/state.type";

// main store

type DataStore = {
	heartbeat: Heartbeat | null;
	extrapolatedClock: ExtrapolatedClock | null;
	topThree: TopThree | null;
	timingStats: TimingStats | null;
	timingAppData: TimingAppData | null;
	weatherData: WeatherData | null;
	trackStatus: TrackStatus | null;
	sessionStatus: SessionStatus | null;
	driverList: DriverList | null;
	raceControlMessages: RaceControlMessages | null;
	sessionInfo: SessionInfo | null;
	sessionData: SessionData | null;
	lapCount: LapCount | null;
	timingData: TimingData | null;
	teamRadio: TeamRadio | null;
	championshipPrediction: ChampionshipPrediction | null;

	set: (state: State) => void;
	update: (state: Partial<State>) => void;
};

export const useDataStore = create<DataStore>((set) => ({
	heartbeat: null,
	extrapolatedClock: null,
	topThree: null,
	timingStats: null,
	timingAppData: null,
	weatherData: null,
	trackStatus: null,
	sessionStatus: null,
	driverList: null,
	raceControlMessages: null,
	sessionInfo: null,
	sessionData: null,
	lapCount: null,
	timingData: null,
	teamRadio: null,
	championshipPrediction: null,

	set: (state: State) => {
		set(state);
	},
	update: (state: Partial<State>) => {
		set(state);
	},
}));

// car store

type CarDataStore = {
	carsData: CarsData | null;
	set: (carsData: CarsData) => void;
};

export const useCarDataStore = create<CarDataStore>((set) => ({
	carsData: null,
	set: (carsData: CarsData) => set({ carsData }),
}));

// position store

type PositionStore = {
	positions: Positions | null;
	set: (positions: Positions) => void;
};

export const usePositionStore = create<PositionStore>((set) => ({
	positions: null,
	set: (positions: Positions) => set({ positions }),
}));

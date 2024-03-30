export type History = {
	gapLeader?: LeaderGapHistory;
	gapFront?: FrontGapHistory;
	lapTime?: LapTimeHistory;
	sectors?: SectorsHistory;
	weather?: WeatherHistory;
};

export type LeaderGapHistory = {
	[key: string]: number[];
};

export type FrontGapHistory = {
	[key: string]: number[];
};

export type LapTimeHistory = {
	[key: string]: number[];
};

export type SectorsHistory = {
	[key: string]: {
		[key: string]: number[];
	};
};

export type WeatherHistory = {
	airTemp?: number[];
	humidity?: number[];
	pressure?: number[];
	rainfall?: boolean[];
	trackTemp?: number[];
	windDirection?: number[];
	windSpeed?: number[];
};

// TODO add all delayed stuff, but thats for later

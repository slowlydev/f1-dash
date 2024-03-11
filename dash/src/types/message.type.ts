import { type State } from "./state.type";

export type Message = InitialMessage | UpdateMessage;

export type InitialMessage = {
	initial: State;
};

export type UpdateMessage = {
	update: State; // note this is very partial
};

// history: HistoryType;

export type HistoryType = {
	gapLeader: {
		[key: string]: number[];
	};
	gapFront: {
		[key: string]: number[];
	};
	lapTime: {
		[key: string]: number[];
	};
	sectors: {
		[key: string]: {
			[key: string]: number[];
		};
	};
	weather: {
		airTemp: string[];
		humidity: string[];
		pressure: string[];
		rainfall: string[];
		trackTemp: string[];
		windDirection: string[];
		windSpeed: string[];
	};
};

// TODO add all delayed stuff, but thats for later

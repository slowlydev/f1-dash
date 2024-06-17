export type DriverHistory = {
	nr: number;
	gapAhead: string[];
	gapLeader: string[];
	laptime: string[];
	sectors: [string[], string[], string[]];
};

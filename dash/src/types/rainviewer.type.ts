export type Rainviewer = {
	version: string;
	generated: number;
	host: string;
	radar: Radar;
	satellite: Satellite;
};

export type Radar = {
	past: MapItem[];
	nowcast: MapItem[];
};

export type MapItem = {
	time: number;
	path: string;
};

export type Satellite = {
	infrared: MapItem[];
};

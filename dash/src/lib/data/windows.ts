export type WindowKey =
	| "rcm"
	| "track-map"
	| "lap-series"
	| "tire-pace"
	| "head-to-head"
	| "track-limits"
	| "team-radios";

export type Window = {
	key: WindowKey;
	label: string;
};

export const windows: Window[] = [
	{
		key: "rcm",
		label: "Race Control Messages",
	},
	{
		key: "track-map",
		label: "Track Map",
	},
	{
		key: "team-radios",
		label: "Team Radios",
	},
	{
		key: "track-limits",
		label: "Track Limits Tracker",
	},
	// {
	// 	key: "lap-series",
	// 	label: "🚧 Lap Series",
	// },
	// {
	// 	key: "tire-pace",
	// 	label: "🚧 Tire Pace Comparison",
	// },
	// {
	// 	key: "head-to-head",
	// 	label: "🚧 Head-to-Head",
	// },
];

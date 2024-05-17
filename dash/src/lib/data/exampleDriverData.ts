import { Driver, TimingAppDataDriver, TimingDataDriver, TimingStatsDriver } from "@/types/state.type";

export const driver: Driver = {
	broadcastName: "G RUSSELL",
	countryCode: "GBR",
	firstName: "George",
	fullName: "George RUSSELL",
	headshotUrl:
		"https://www.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/1col/image.png",
	lastName: "Russell",
	line: 13,
	racingNumber: "63",
	reference: "GEORUS01",
	teamColour: "6CD3BF",
	teamName: "Mercedes",
	tla: "RUS",
};

export const timingDriver: TimingDataDriver = {
	bestLapTime: {
		value: "1:20.031",
		position: 1,
	},
	// bestLapTimes: [{ value: "" }, {}, {}],
	cutoff: false,
	inPit: false,
	knockedOut: false,
	lastLapTime: { overallFastest: false, personalFastest: true, status: 0, value: "1:51.363" },
	line: 13,
	numberOfLaps: 1,
	pitOut: false,
	position: "13",
	racingNumber: "63",
	retired: false,
	sectors: [
		{
			overallFastest: false,
			personalFastest: true,
			previousValue: "37.888",
			segments: [{ status: 2064 }, { status: 2049 }, { status: 2049 }, { status: 2049 }, { status: 2051 }],
			status: 0,
			stopped: false,
			value: "37.888",
		},
		{
			overallFastest: false,
			personalFastest: false,
			segments: [{ status: 2049 }, { status: 2051 }, { status: 0 }, { status: 0 }, { status: 0 }, { status: 0 }],
			status: 0,
			stopped: false,
			value: "",
		},
		{
			overallFastest: false,
			personalFastest: false,
			segments: [
				{ status: 0 },
				{ status: 0 },
				{ status: 0 },
				{ status: 0 },
				{ status: 0 },
				{ status: 0 },
				{ status: 0 },
			],
			status: 0,
			stopped: false,
			value: "",
		},
	],
	showPosition: true,
	speeds: {
		fl: { overallFastest: false, personalFastest: false, status: 0, value: "" },
		i1: { overallFastest: false, personalFastest: true, status: 0, value: "192" },
		i2: { overallFastest: false, personalFastest: false, status: 0, value: "" },
		st: { overallFastest: false, personalFastest: false, status: 0, value: "" },
	},
	stats: [
		{ timeDiffToFastest: "", timeDifftoPositionAhead: "" },
		{ timeDiffToFastest: "", timeDifftoPositionAhead: "" },
		{ timeDiffToFastest: "", timeDifftoPositionAhead: "" },
	],
	status: 576,
	stopped: false,
	gapToLeader: "+1.011",
	intervalToPositionAhead: {
		catching: false,
		value: "+0.535",
	},
};

export const timingStatsDriver: TimingStatsDriver = {
	bestSectors: [
		{
			value: "",
			position: 0,
		},
		{
			value: "",
			position: 0,
		},
		{
			value: "",
			position: 0,
		},
	],
	bestSpeeds: {
		fl: {
			value: "",
			position: 0,
		},
		i1: { position: 5, value: "192" },
		i2: {
			value: "",
			position: 0,
		},
		st: {
			value: "",
			position: 0,
		},
	},
	line: 18,
	personalBestLapTime: {
		value: "",
		position: 0,
	},
	racingNumber: "63",
};

export const appTimingDriver: TimingAppDataDriver = {
	line: 13,
	racingNumber: "63",
	gridPos: "1",
	stints: [{ compound: "SOFT", totalLaps: 9, new: "true" }],
};

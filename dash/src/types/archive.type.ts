export type Archive = {
	year: number;
	meetings: Meeting[];
};

export type Meeting = {
	key: number;
	code: string;
	name: string;
	number: number;
	location: string;
	officialName: string;
	country: Country;
	circuit: Circuit;
	sessions: ArchiveSession[];
};

type Circuit = {
	key: number;
	shortName: string;
};

type Country = {
	key: number;
	code: string;
	name: string;
};

export type ArchiveSession = {
	key: number;
	type: "practice" | "qualifying" | "race";
	number?: number;
	name: string;
	startDate: string;
	endDate: string;
	gmtOffset: string;
	path: string;
	topThree: TopThreeDriver[];
};

export type TopThreeDriver = {
	nr: string;

	broadcastName: string;
	fullName: string;
	short: string;

	teamName: string;
	teamColor: string;

	position: string;

	gapToLeader: string;
	gapToFront: string;

	lap: number;
};

export type F1EventTracker = {
	raceHubId: string;
	locale: string;
	createdAt: string;
	updatedAt: string;
	fomRaceId: string;
	brandColourHexadecimal: string;
	circuitSmallImage: F1CircuitSmallImage;
	links: any[];
	seasonContext: F1SeasonContext;
	raceResults: any[];
	race: F1Race;
	seasonYearImage: string;
};

type F1Race = {
	meetingCountryName: string;
	meetingStartDate: string;
	meetingOfficialName: string;
	meetingEndDate: string;
};

type F1SeasonContext = {
	id: string;
	contentType: string;
	createdAt: string;
	updatedAt: string;
	locale: string;
	seasonYear: string;
	currentOrNextMeetingKey: string;
	state: string;
	eventState: string;
	liveEventId: string;
	liveTimingsSource: string;
	liveBlog: F1LiveBlog;
	seasonState: string;
	raceListingOverride: number;
	driverAndTeamListingOverride: number;
	timetables: F1Timetable[];
	replayBaseUrl: string;
	seasonContextUIState: number;
};

type F1Timetable = {
	state: string;
	session: string;
	gmtOffset: string;
	description: string;
	endTime: string;
	startTime: string;
};

type F1LiveBlog = {
	contentType: string;
	title: string;
	scribbleEventId: string;
};

type F1CircuitSmallImage = {
	title: string;
	path: string;
	url: string;
	public_id: string;
	raw_transformation: string;
	width: number;
	height: number;
};

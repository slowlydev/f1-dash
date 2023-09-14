export type NextMeeting = {
	key: number;
	name: string;
	location: string;
	officialName: string;
	sessions: NextMeetingSession[];
};

export type NextMeetingSession = {
	name: string;
	short: string;
	state: string;
	gmtOffset: string;
	endTime: string;
	startTime: string;
};

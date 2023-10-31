export type SessionData = {
	//  series: []string we ignore for now
	status: StatusUpdate[];
};

export type StatusUpdate = {
	utc: string;
	trackStatus?: string;
	sessionStatus?: string;
};

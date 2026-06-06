export type Round = {
	name: string;
	countryName: string;
	countryKey: null;
	start: string;
	end: string;
	sessions: Session[];
	over: boolean;
};

export type Session = {
	kind: string;
	start: string;
	end: string;
};

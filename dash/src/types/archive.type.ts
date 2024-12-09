export type Meeting = {
	key: number;
	location: string;
	officialName: string;
	name: string;
	country: {
		name: string;
	};
	sessions: {
		key: number;
		name: string;
		startDate: string;
		endDate: string;
	}[];
};

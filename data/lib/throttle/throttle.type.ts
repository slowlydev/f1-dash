type Entry = {
	exp: number;
	hits: number;
};

export type Throttle = Record<string, Record<string, Record<string, Entry>>>;

export type ThrottleOptions = {
	use: boolean;
	ttl: number;
	limit: number;
};

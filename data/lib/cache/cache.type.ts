export type Cache = {
	exp: number;
	url: string;
	jwt?: string;
	lang?: string;
	data: unknown;
	status: number;
};

export type CacheOptions = {
	use: boolean;
	ttl: number;
	limit: number;
};

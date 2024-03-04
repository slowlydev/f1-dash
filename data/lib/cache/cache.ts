import { config } from '../config/config';
import { FluxifyRequest, Route } from '../router/router.type';
import { CacheOptions } from './cache.type';

export const cacheOptions = (request: FluxifyRequest, route: Route | undefined): CacheOptions => {
	const options: CacheOptions = { use: false, ttl: config.cacheTtl, limit: config.cacheLimit };
	if (route?.schema?.cache?.ttl !== undefined) options.ttl = route.schema.cache.ttl;
	if (
		options.ttl > 0 &&
		options.limit > 0 &&
		request.method.toLowerCase() === 'get' &&
		request.headers.get('cache-control')?.toLowerCase() !== 'no-cache'
	) {
		options.use = true;
	}
	return options;
};

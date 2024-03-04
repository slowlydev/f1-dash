import { config } from '../config/config';
import { Route } from '../router/router.type';
import { ThrottleOptions } from './throttle.type';

export const throttleOptions = (route: Route | undefined): ThrottleOptions => {
	const options: ThrottleOptions = { use: false, ttl: config.throttleTtl, limit: config.throttleLimit };
	if (route?.schema?.throttle?.ttl !== undefined) options.ttl = route.schema.throttle.ttl;
	if (route?.schema?.throttle?.limit !== undefined) options.limit = route.schema.throttle.limit;
	if (options.ttl > 0 && options.limit > 0) options.use = true;
	return options;
};

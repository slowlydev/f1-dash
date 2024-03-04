import { Method, Route } from '../../router/router.type';

export const compareEndpoint = (route: Route, endpoint: string): boolean => {
	const routeFragments = route.endpoint.split('/');
	const endpointFragments = endpoint.split('/');
	if (routeFragments.length !== endpointFragments.length) {
		return false;
	}
	for (let index = 0; index < routeFragments.length; index++) {
		const routeFragment = routeFragments[index];
		const endpointFragment = endpointFragments[index];
		if (routeFragment.includes(':')) {
			if (endpointFragment === undefined || endpointFragment === '') {
				return false;
			}
		} else if (routeFragment !== endpointFragment) {
			return false;
		}
	}
	return true;
};

export const compareMethod = (route: Route, method: Method | null): boolean => {
	if (route.method === 'all') {
		return true;
	}
	return route.method === method;
};

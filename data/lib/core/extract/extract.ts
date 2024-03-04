import { MethodNotAllowed } from '../../exception/exception';
import { Method, Param, Route } from '../../router/router.type';
import { compareEndpoint } from '../compare/compare';

export const extractMethod = (method: string): Method => {
	const methods: Method[] = ['get', 'post', 'put', 'patch', 'delete', 'options'];
	if (methods.includes(method.toLowerCase() as Method)) {
		return method.toLowerCase() as Method;
	}
	throw MethodNotAllowed();
};

export const extractParam = (route: Route, endpoint: string): Param => {
	const param: Param = {};
	if (compareEndpoint(route, endpoint) && route.endpoint.includes(':')) {
		route.endpoint
			.split('/')
			.forEach(
				(frag, ind) =>
					frag.includes(':') && (param[route.endpoint.split('/')[ind].split(':')[1]] = endpoint.split('/')[ind]),
			);
	}
	return param;
};
